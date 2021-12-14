import React, { useContext, useEffect, useState } from 'react';
import { Badge, Button, Divider, Table, } from 'antd';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { IAssignPBI, ICheckedAssignPBI, ICheckedProductBacklogItem, IFilters, IPBIFilter, IProductBacklogItem, IProductBacklogList, ITask, State } from '../appstate/stateInterfaces';
import { AuthContext } from '../App';
import { Navigate } from 'react-router';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { store } from '../appstate/store';
import { CustomAddTaskPopup } from './popups/CustomAddTaskPopup';
import { CustomAssignTaskPopup } from './popups/CustomAssignTaskPopup';

export default function TaskView() {
  const { state } = useContext(AuthContext);
  const { token } = state;
  const error = useSelector((appState: State) => appState.error);
  const loading = useSelector((appState: State) => appState.loading as boolean);
  const [filterPBI, setFiltersPBI] = useState<IPBIFilter>({ pageNumber: config.defaultFilters.page, pageSize: config.defaultFilters.size, nameFilter: "", });
  const [isAssignTaskModalVisible, setIsAssignTaskModalVisible] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const namedPBIS = useSelector((appState: State) => appState.namedPBI as IAssignPBI[]);
  const [taskIdToAdd, setTaskIdToAdd] = useState(0);
  const [pbiIdToAdd, setPbIdToAdd] = useState(0);
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const [initialRefresh, setInitialRefresh] = useState(true);
  const refreshRequired = useSelector((appState: State) => appState.productRequireRefresh as boolean);
  const pbiPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
  const [fetched, setFetched] = useState(false);



  const handleAddTask = (input: IFilters) => {
    setIsAddTaskModalVisible(false); //check if all elements of acceptanceCriteria array are defined
    try {
      store.dispatch(
        Actions.addTaskThunk({
          token: token,
          ownerName: ownerName,
          pbiId: pbiIdToAdd,
          name: input.name
        }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
  }

  const handleAssignTask = (input: any) => {
    const ids = input.backlogItems.map((value: ICheckedProductBacklogItem) => 
    {  return((value.checked ? value.id.toString():"")) }).filter((x: string) => x !== "")
    setIsAssignTaskModalVisible(false); //check if all elements of acceptanceCriteria array are defined
    try {
      store.dispatch(
        Actions.assignTaskThunk({
          token: token,
          ownerName: ownerName,
          pbiId: ids.length > 1 ? 0: ids[0],
          taskId:taskIdToAdd,
          currId: pbiIdToAdd
        }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
  }

  useEffect(() => {
    if (initialRefresh) {
      store.dispatch(Actions.clearPBIsList());
      setInitialRefresh(false);
    }
  }, [initialRefresh]);

  useEffect(() => {
    if (refreshRequired && ownerName && ownerName !== "") {
      try {
        store.dispatch(
          Actions.fetchPBIsThunk({
            ownerName: ownerName,
            token: token,
            filters: {
              ...filterPBI,
              pageNumber: config.defaultFilters.page,
              pageSize: config.defaultFilters.pbiSize
            }
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the pbis: ", err);
        localStorage.setItem("ownerName", "");
      }
      finally {
          setFetched(true);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired]);

  const handleTableChange = (pagination: IFilters) => {
    try {
      store.dispatch(
        Actions.fetchPBIsThunk({
          ownerName: ownerName,
          token: token,
          filters: {
            ...filterPBI,
            pageNumber: pagination.current,
            pageSize: config.defaultFilters.pbiSize
          }
        }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally {
      setFiltersPBI({ ...filterPBI, pageNumber: pagination.current });
        setFetched(true);
    }
  };

  useEffect(() => {
    if (!refreshRequired && fetched && !loading) {
      setFetched(false);
      console.log("fetching tasks");
      //fetch unassigned tasks
        store.dispatch(
          Actions.addTasksToPBIThunk({
            token: token,
            ownerName: ownerName,
            pbiId: 0
          }) //filters
        );
      //fetch other tasks
      pbiPage.list.map((item: IProductBacklogItem) => {
          store.dispatch(
            Actions.addTasksToPBIThunk({
              token: token,
              ownerName: ownerName,
              pbiId: item.id
            }) //filters
          );
        return({});
      })
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetched, refreshRequired]);

  const handleUpdate= () => {
    try {
      store.dispatch(
        Actions.getPBINamesThunk({
          ownerName: ownerName as string,
          token: token,
          filters: {
            pageNumber: config.defaultFilters.page,
            pageSize: config.defaultFilters.pbiSize*pbiPage.pageCount,
          }
        }) //filters
      );
    } catch (err) {
      console.error("Failed to fetch the pbis: ", err);
    }
  }

  const expandedRowRender = (record: IProductBacklogItem) => {
    const nestedColumns = [
      { title: 'Name', align: 'left' as const, fixed: "left" as const, dataIndex: 'name', key: 'name' },
      {
        title: 'Finished',
        key: 'finished',
        dataIndex: 'finished',
        align: 'center' as const,
        render: (val: boolean) => (
          <span>
            <Badge status={val ? "success" : "error"} />
            {val ? "Finished" : "Not Finished"}
          </span>
        ),
      },
      {
        key: "isAssignedToPBI",
        title: 'Assigned',
        dataIndex: 'isAssignedToPBI',
        render: (val: boolean) => (
          <span>
            <Badge status={val ? "success" : "error"} />
            {val ? "Assigned" : "Not Assigned"}
          </span>
        ),
        align: 'center' as const,

      },
      {
        title: 'Related Link',
        dataIndex: 'link',
        key: 'link',
        align: 'center' as const,
        render: (text: string) => <a href={text}>{"See on GitHub"}</a>
      },
      {
        title: 'Action', colSpan: 1, align: "center" as const, key: 'operation', render: (record:ITask) =>{
         return( <Button type="link" onClick={()=>{setTaskIdToAdd(record.id); setPbIdToAdd(record.pbiId); handleUpdate();setIsAssignTaskModalVisible(true)}} >
            <a>Assign</a>
          </Button>)}
        ,
      }
    ];

    return (
      <Table
        loading={refreshRequired || initialRefresh}
        scroll={{ x: 800 }}
        rowKey={(record: ITask) => record.id}
        columns={nestedColumns}
        dataSource={record.tasks}
        pagination={false}
      />
    )
  };
 
  const taskColumns = [
    { title: 'Name', fixed: "left" as const, colSpan: 2, dataIndex: 'name', key: 'name' },
    {
      title: 'Action', colSpan: 1, align: "right" as const, key: 'operation', render: (record: IProductBacklogItem) => {
        return (<Button type="link" onClick={() => { setPbIdToAdd(record.id); setIsAddTaskModalVisible(true); }} >
          <a>Add</a>
        </Button>)
      }
      ,
    }
  ];

  if (!state.isLoggedIn) { return <Navigate to="/login" />; }
  return (<>
          <Table
            loading={loading}
            scroll={{ x: 800 }}
            showHeader={false}
            columns={taskColumns}
            rowKey={(record: IProductBacklogItem) => record.id}
            expandable={{ expandedRowRender: expandedRowRender, defaultExpandAllRows: false }}
            dataSource={(pbiPage && pbiPage.list) ? pbiPage.list : []}
            onChange={handleTableChange}
            pagination={{ current: pbiPage.pageNumber, pageSize: config.defaultFilters.pbiSize, total: pbiPage.pageCount, showSizeChanger: false }}
          />
          <Divider />
          {isAddTaskModalVisible && <CustomAddTaskPopup data={{ name: "" } as IFilters} visible={isAddTaskModalVisible}
            onCreate={function (values: any): void { handleAddTask(values) }}
            onCancel={() => { setIsAddTaskModalVisible(false); }} />}
            {isAssignTaskModalVisible && pbiPage && <CustomAssignTaskPopup error={error.erorMessage} pbiData={namedPBIS as ICheckedAssignPBI[]} visible={isAssignTaskModalVisible}
            onCreate={function (values: any): void { handleAssignTask(values) }}
            onCancel={() => { setIsAssignTaskModalVisible(false); }} />}
            </>
  );
}