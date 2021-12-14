import React, { useContext, useEffect, useState } from 'react';
import { Badge, Button, Divider, Radio, Table, } from 'antd';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { IAddPBI, IAssignPBI, ICheckedAssignPBI, ICheckedProductBacklogItem, IFilters, initAddPBI, IPBIFilter, IProductBacklogItem, IProductBacklogList, ITask, State } from '../appstate/stateInterfaces';
import { AuthContext } from '../App';
import { Navigate } from 'react-router';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { store } from '../appstate/store';
import { CustomAddPopup } from './popups/CustomAddPopup';
import { CustomEditPopup } from './popups/CustomEditPopup';
import { CustomEstimatePopup } from './popups/CustomEstimatePopup';
import { CustomFilterPopup } from './popups/CustomFilterPopup';
import { pbiColumns } from './tableColumns';
import { CustomAddTaskPopup } from './popups/CustomAddTaskPopup';
import { CustomAssignTaskPopup } from './popups/CustomAssignTaskPopup';

export default function Project() {
  const { state } = useContext(AuthContext);
  const { token } = state;
  const error = useSelector((appState: State) => appState.error);
  const loading = useSelector((appState: State) => appState.loading as boolean);
  const [filterPBI, setFiltersPBI] = useState<IPBIFilter>({ pageNumber: config.defaultFilters.page, pageSize: config.defaultFilters.size, nameFilter: "", });
  const [selectionType, setSelectionType] = useState<'pbi' | 'tasks'>('pbi');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isAssignTaskModalVisible, setIsAssignTaskModalVisible] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEstimateModalVisible, setIsEstimateModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [prevselectedRowKeys, setPrevSelectedRowKeys] = useState([] as React.Key[]);
  const [selectedPBI, setSelectedPBI] = useState({} as IProductBacklogItem);
  const namedPBIS = useSelector((appState: State) => appState.namedPBI as IAssignPBI[]);
  const [taskIdToAdd, setTaskIdToAdd] = useState(0);
  const [pbiIdToAdd, setPbIdToAdd] = useState(0);
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const [initialRefresh, setInitialRefresh] = useState(true);
  const refreshRequired = useSelector((appState: State) => appState.productRequireRefresh as boolean);
  const pbiPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
  const [fetched, setFetched] = useState(false);

  const handleClearFiltersButton = () => {
    setFiltersPBI({ pageNumber: config.defaultFilters.page, pageSize: config.defaultFilters.size, nameFilter: "", });
    setInitialRefresh(true);
  }
  const handleFilterPBI = (pbi: IPBIFilter) => {
    setIsFilterModalVisible(false);
    setFiltersPBI(pbi);
    try {
      store.dispatch(
        Actions.fetchPBIsThunk({
          ownerName: ownerName,
          token: token,
          filters: {
            ...pbi,
            pageNumber: filterPBI.pageNumber,
            pageSize: config.defaultFilters.pbiSize
          }
        }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally {
      setSelectedPBI({} as IProductBacklogItem);
      setPrevSelectedRowKeys([] as React.Key[]);
    }
  }

  const handleAddPBI = (pbi: IAddPBI) => {
    setIsAddModalVisible(false); //check if all elements of acceptanceCriteria array are defined
    pbi.acceptanceCriteria = pbi.acceptanceCriteria.filter((value: any) => { return (typeof (value) === "string"); });
    try {
      store.dispatch(
        Actions.addPBIThunk({
          ownerName: ownerName,
          token: token,
          pbi: pbi
        }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally {
      setSelectedPBI({} as IProductBacklogItem);
      setPrevSelectedRowKeys([] as React.Key[]);
    }
  }

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

  const handleEstimatePBI = (pbi: IProductBacklogItem) => {
    try {
      store.dispatch(
        Actions.estimatePBIThunk({
          ownerName: ownerName,
          token: token,
          pbiId: selectedPBI.id,
          hours: pbi.expectedTimeInHours
        }) //filters
      );
    } catch (err) { console.error("Failed to estimate the pbis: ", err); }
    finally {
      setIsEstimateModalVisible(false);
      setSelectedPBI({} as IProductBacklogItem);
      setPrevSelectedRowKeys([] as React.Key[]);
    }
  }

  const handleEditPBI = (pbi: IAddPBI) => {
    setIsEditModalVisible(false);//check if all elements of acceptanceCriteria array are defined    
    pbi.acceptanceCriteria = pbi.acceptanceCriteria.filter((value: any) => { return (typeof (value) === "string"); });
    try {
      store.dispatch(
        Actions.editPBIThunk({
          ownerName: ownerName,
          token: token,
          pbi: pbi,
          pbiId: selectedPBI.id,
        }) //filters
      );
    } catch (err) { console.error("Failed to edit the pbis: ", err); }
    finally {
      setSelectedPBI({} as IProductBacklogItem);
      setPrevSelectedRowKeys([] as React.Key[]);
    }
  }

  const handleFinish = () => {
    try {
      store.dispatch(
        Actions.finishPBIThunk({
          ownerName: ownerName,
          token: token,
          pbild: prevselectedRowKeys[0] as number
        }) //filters
      );
    } catch (err) { console.error("Failed to finish the pbis: ", err); }
    finally {
      setSelectedPBI({} as IProductBacklogItem);
      setPrevSelectedRowKeys([] as React.Key[]);
    }
  }

  const handleDelete = () => {
    try {
      store.dispatch(
        Actions.deletePBIThunk({
          ownerName: ownerName,
          token: token,
          pbild: prevselectedRowKeys[0] as number
        }) //filters
      );
    } catch (err) { console.error("Failed to add the repos: ", err); }
    finally {
      setSelectedPBI({} as IProductBacklogItem);
      setPrevSelectedRowKeys([] as React.Key[]);
    }
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
        if (selectionType === "tasks") {
          setFetched(true);
        }
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
      if (selectionType === "tasks") {
        setFetched(true);
      }
    }
  };

  useEffect(() => {
    if (!refreshRequired && fetched && !loading) {
      setFetched(false);
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

  const expandedRowRender = (record: IProductBacklogItem, index: any, indent: any, expanded: any) => {
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
  return (
    <div>
      <Radio.Group onChange={({ target: { value } }) => { setSelectionType(value); setInitialRefresh(true); }} value={selectionType}>
      <Radio value="pbi">Product Backlog Items</Radio>
        <Radio value="tasks">Tasks</Radio>
      </Radio.Group>
      <Divider />
      {selectionType === "pbi" &&
        <>
          <Table
            loading={refreshRequired || initialRefresh}
            scroll={{ x: 800 }}
            rowKey={(record: IProductBacklogItem) => record.id}
            rowSelection={{
              type: "checkbox",
              hideSelectAll: true,
              selectedRowKeys: prevselectedRowKeys,
              onChange: (keys: React.Key[], selectedRows: IProductBacklogItem[]) => {
                if (keys.indexOf(prevselectedRowKeys[0]) >= 0) {
                  keys.splice(keys.indexOf(prevselectedRowKeys[0]), 1);
                }
                setSelectedPBI(selectedRows[0]);
                setPrevSelectedRowKeys(keys);
              },
            }}
            onChange={handleTableChange}
            pagination={{ current: pbiPage.pageNumber, pageSize: config.defaultFilters.pbiSize, total: pbiPage.pageCount, showSizeChanger: false }}
            columns={pbiColumns}
            dataSource={(pbiPage && pbiPage.list) ? pbiPage.list : []}
          />
          <Divider />
          <span style={{ width: "100%" }}>
            <Button onClick={() => setIsAddModalVisible(true)} type="primary" style={{ marginRight: 16 }}> Add</Button>
            <Button disabled={prevselectedRowKeys.length < 1} onClick={handleDelete} type="primary" style={{ marginRight: 16 }}> Delete</Button>
            <Button disabled={prevselectedRowKeys.length < 1} onClick={() => setIsEditModalVisible(true)} type="primary" style={{ marginRight: 16 }}>Edit</Button>
            <Button disabled={!selectedPBI || prevselectedRowKeys.length < 1 || (prevselectedRowKeys.length > 0 && selectedPBI.finished)} onClick={handleFinish} type="primary" style={{ marginRight: 16 }}>Finish</Button>
            <Button disabled={prevselectedRowKeys.length < 1} onClick={() => setIsEstimateModalVisible(true)} type="primary" style={{ marginRight: 16 }}>Estimate</Button>
            <Button onClick={() => setIsFilterModalVisible(true)} type="primary" style={{ marginRight: 16 }}>Filter</Button>
            <Button onClick={handleClearFiltersButton} type="primary" style={{ marginRight: 16 }}>Clear filters</Button>
            {isAddModalVisible && <CustomAddPopup data={initAddPBI} visible={isAddModalVisible}
              onCreate={function (values: any): void { handleAddPBI(values) }}
              onCancel={() => { setIsAddModalVisible(false); }} />}
            {isEditModalVisible && selectedPBI && <CustomEditPopup data={selectedPBI as IAddPBI} visible={isEditModalVisible}
              onCreate={function (values: any): void { handleEditPBI(values) }}
              onCancel={() => { setIsEditModalVisible(false); }} />}
            {isEstimateModalVisible && selectedPBI && <CustomEstimatePopup data={selectedPBI as IProductBacklogItem} visible={isEstimateModalVisible}
              onCreate={function (values: any): void { handleEstimatePBI(values) }}
              onCancel={() => { setIsEstimateModalVisible(false); }} />}
            {isFilterModalVisible && filterPBI && <CustomFilterPopup data={filterPBI as IPBIFilter} visible={isFilterModalVisible}
              onCreate={function (values: any): void { handleFilterPBI(values) }}
              onCancel={() => { setIsFilterModalVisible(false); }} />}
          </span>
        </>
      }
      {selectionType === "tasks" && !loading && !refreshRequired &&
        <>
          <Table
            loading={refreshRequired || initialRefresh}
            scroll={{ x: 800 }}
            showHeader={false}
            className="components-table-demo-nested"
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

        </>}
    </div>
  );
}