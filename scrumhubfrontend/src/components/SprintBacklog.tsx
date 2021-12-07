import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider, PageHeader, Radio, Table, Typography, } from 'antd';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { IAddPBI, IFilters, IProductBacklogItem, IProductBacklogList, ISprint, IUpdateIdSprint, IUpdateSprint, State } from '../appstate/stateInterfaces';
import { AuthContext } from '../App';
import { Navigate } from 'react-router';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { CheckOutlined, StopOutlined } from '@ant-design/icons';
import { store } from '../appstate/store';
import { CustomEditPopup } from './popups/CustomEditPopup';
import { CustomEstimatePopup } from './popups/CustomEstimatePopup';
import "./SprintBacklog.css";
import { CustomUpdateSprintPopup } from './popups/CustomUpdateSprintPopup';

const columns = [
  {
    key: "0",
    title: 'Name',
    colSpan:1,
    dataIndex: 'name',
    align: 'center' as const,
    render:  (text: string) => {return ({ children: text,props: { colSpan: 1 }})},
    fixed: 'left' as const,
  },
  {
    key: "1",
    title: 'Story Points',
    dataIndex: 'expectedTimeInHours',
    align: 'center' as const,
  },
  {
    key: "3",
    title: 'Real Time',
    dataIndex: 'realTime',
    align: 'center' as const,
  },
  {
    key: "4",
    title: 'Priority',
    dataIndex: 'priority',
    align: 'center' as const,
  },
  {
    key: "5",
    colSpan: 2,
    title: 'Acceptance Criteria',
    dataIndex: 'acceptanceCriteria',
    align: 'center' as const,
    render: (record: string[]) => {
      return ({
        children:
          <div style={{ verticalAlign: "center", alignItems: "center", textAlign: "center" }}>{
            record.map((value: string, index: number) => { return (<p key={index} style={{ margin: "auto", marginTop: "5%", marginBottom: "5%" }}>{value}</p>) })
          }
          </div>,
        props: { colSpan: 2 }
      })
    }
  },
  {
    key: "6",
    title: 'Finished',
    dataIndex: 'finished',
    render: (finishValue: boolean) => finishValue ? <CheckOutlined /> : <StopOutlined />,
    align: 'center' as const,
  }

];


export default function SprintBacklog() {
  const { state } = useContext(AuthContext);
  const { token } = state;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterPBI, setFiltersPBI] = useState<IFilters>({
    pageNumber: config.defaultFilters.page,
    pageSize: config.defaultFilters.size,
  });
  const loading = useSelector((appState: State) => appState.loading);
  const tempPBIPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
  const [selectionType, setSelectionType] = useState<'pbi' | 'tasks'>('pbi');
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEstimateModalVisible, setIsEstimateModalVisible] = useState(false);
  const handleEditButton = () => {
    setIsEditModalVisible(true);
  }
  const handleEstimateButton = () => {
    setIsEstimateModalVisible(true);
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
    } catch (err) {
      console.error("Failed to estimate the pbis: ", err);
    }
    finally {
      setSelectedPBI({} as IProductBacklogItem);
      setPrevSelectedRowKeys([] as React.Key[]);
      setIsEstimateModalVisible(false);
      setInitialRefresh(true);
    }
  }
  const handleUpdatePBI = (pbi: IUpdateSprint) => {
    setIsUpdateModalVisible(false);
     const ids = pbi.backlogItems.map((value: IProductBacklogItem) => 
    {  return((value.sprintNumber === Number(sprintID) ? value.id.toString():"")) }).filter((x) => x !== "");
    try {
      store.dispatch(
        Actions.updateOneSprintThunk({
          token: token as string,
          ownerName: ownerName,
          sprintNumber: Number(sprintID),
          sprint: {"goal":pbi.goal,"pbIs":ids} as IUpdateIdSprint
        }) //filters
      );
    } catch (err) {
      console.error("Failed to update the pbis: ", err);
    }
    finally {
      setSelectedPBI({} as IProductBacklogItem);
      setPrevSelectedRowKeys([] as React.Key[]);
      setInitialRefresh(true);
    }
  }
  const handleEditPBI = (pbi: IAddPBI) => {
    setIsEditModalVisible(false);
    //check if all elements of acceptanceCriteria array are defined
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
    } catch (err) {
      console.error("Failed to add the repos: ", err);
    }
    finally{
      setSelectedPBI({} as IProductBacklogItem);
      setPrevSelectedRowKeys([] as React.Key[]);
      setInitialRefresh(true);
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
    } catch (err) {
      console.error("Failed to add the repos: ", err);
    }
    finally{
      setSelectedPBI({} as IProductBacklogItem);
      setPrevSelectedRowKeys([] as React.Key[]);
      setInitialRefresh(true);
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
    } catch (err) {
      console.error("Failed to add the repos: ", err);
    }
    finally{
      setSelectedPBI({} as IProductBacklogItem);
      setPrevSelectedRowKeys([] as React.Key[]);
      setInitialRefresh(true);
    }
  }
  const handleUpdate= () => {
    try {
      store.dispatch(
        Actions.fetchPBIsThunk({
          ownerName: ownerName,
          token: token,
          filters: {
            pageNumber: filterPBI.pageNumber,
            pageSize: config.defaultFilters.pbiSize,
            estimated: true
          }
        }) //filters
      );
    } catch (err) {
      console.error("Failed to add the repos: ", err);
    }
  }

  const fetchMore=() => {
    if(tempPBIPage.pageCount > 1){
    try {
      store.dispatch(
        Actions.fetchPBIsThunk({
          ownerName: ownerName,
          token: token,
          filters: {
            pageNumber: 1,
            pageSize: config.defaultFilters.pbiSize*tempPBIPage.pageCount,
            estimated: true
          }
        }) //filters
      );
    } catch (err) {
      console.error("Failed to add the repos: ", err);
    }
  }
  }

  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const sprintID = localStorage.getItem("sprintID") ? localStorage.getItem("sprintID") as string : "";
  const [initialRefresh, setInitialRefresh] = useState(true);
  const refreshRequired = useSelector((appState: State) => appState.sprintRequireRefresh as boolean);
  const sprintPage = useSelector((appState: State) => appState.openSprint as ISprint);
  

  useEffect(() => {
    if (initialRefresh) {
      store.dispatch(Actions.clearSprint());
      setInitialRefresh(false);
    }
  }, [initialRefresh]);

  useEffect(() => {
    if (refreshRequired && ownerName && ownerName !== "" && sprintID && sprintID !== "") {
      try {
        store.dispatch(
          Actions.fetchOneSprintThunk({
            token: token,
            ownerName: ownerName,
            sprintNumber: Number(sprintID)
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch sprint: ", err);
        localStorage.setItem("ownerName", "");
        localStorage.setItem("sprintID", "");
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired]);

  const [prevselectedRowKeys, setPrevSelectedRowKeys] = useState([] as React.Key[]);
  const [selectedPBI, setSelectedPBI] = useState({} as IProductBacklogItem);
  if (!state.isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <PageHeader
        ghost={false}
        title={"Sprint " + (sprintPage !== null ? sprintPage.sprintNumber : "")}
        subTitle={sprintPage !== null ? sprintPage.goal : ""}
        extra={[
          <Button key="1" type="link" onClick={()=>{handleUpdate();fetchMore();setIsUpdateModalVisible(true);}}> Update </Button>,
        ]}
        style={{ marginBottom: "4vh" }}
      >
      </PageHeader>
      <Divider />
      <Radio.Group
        style={{ marginBottom: "4vh" }}
        onChange={({ target: { value } }) => {
          setSelectionType(value);
        }}
        value={selectionType}
      >
        <Radio value="pbi">PBI View</Radio>
        <Radio value="tasks">Tasks View</Radio>
      </Radio.Group>

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
        summary={(pageData: readonly IProductBacklogItem[]) => {
          let totalHours = 0;

          pageData.forEach(({ expectedTimeInHours }) => {
            totalHours += expectedTimeInHours;
          });
          return (
            <>
            <Table.Summary fixed="bottom">
              <Table.Summary.Row>
              <Table.Summary.Cell className="summary" index={0} colSpan={1}></Table.Summary.Cell>
                <Table.Summary.Cell className="summary" align="center" index={1} colSpan={1}>{"Total Story Points"}</Table.Summary.Cell>
                <Table.Summary.Cell  align="center" index={2} colSpan={1}>
                  <Typography style={{ color: "deeppink"}} >{totalHours}</Typography>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} colSpan={5}></Table.Summary.Cell>
              </Table.Summary.Row>
              </Table.Summary>
            </>
          );
        }}
        pagination={{ pageSize: config.defaultFilters.pbiSize, total: (sprintPage && sprintPage.backlogItems) ? sprintPage.backlogItems.length : 0, showSizeChanger: false }}
        columns={columns}
        dataSource={(sprintPage && sprintPage.backlogItems) ? sprintPage.backlogItems : []}
      />
      <Divider />
      <span style={{ width: "100%", margin: "auto", display: "inline-block", justifyContent: "center" }}>
        <Button disabled={prevselectedRowKeys.length < 1} onClick={handleDelete} type="primary" style={{ marginRight: 16 }}>
          Delete
        </Button>
        <Button disabled={prevselectedRowKeys.length < 1} onClick={handleEditButton} type="primary" style={{ marginRight: 16 }}>
          Edit
        </Button>
        <Button disabled={!selectedPBI || prevselectedRowKeys.length < 1 || (prevselectedRowKeys.length > 0 && selectedPBI.finished)} onClick={handleFinish} type="primary" style={{ marginRight: 16 }}>
          Finish
        </Button>
        <Button disabled={prevselectedRowKeys.length < 1} onClick={handleEstimateButton} type="primary" style={{ marginRight: 16 }}>
          Estimate
        </Button>
        {isEditModalVisible && selectedPBI && <CustomEditPopup data={selectedPBI as IAddPBI} visible={isEditModalVisible}
          onCreate={function (values: any): void { handleEditPBI(values) }}
          onCancel={() => { setIsEditModalVisible(false); }} />}
        {isEstimateModalVisible && selectedPBI && <CustomEstimatePopup data={selectedPBI as IProductBacklogItem} visible={isEstimateModalVisible}
          onCreate={function (values: any): void { handleEstimatePBI(values) }}
          onCancel={() => { setIsEstimateModalVisible(false); }} />}
          {isUpdateModalVisible && !loading && <CustomUpdateSprintPopup data={sprintPage as IUpdateSprint} pbiData={tempPBIPage.list as IProductBacklogItem[]} visible={isUpdateModalVisible}
          onCreate={function (values: any): void { handleUpdatePBI(values) }}
          onCancel={() => { setIsUpdateModalVisible(false); }} />}
      </span>
    </div>
  );
}
