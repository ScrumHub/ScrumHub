import { useContext, useState } from 'react';
import { Alert, Breadcrumb, Button, Dropdown, Input, PageHeader, Space, } from 'antd';
import 'antd/dist/antd.css';
import { initPeopleList, IPBIFilter, State } from '../appstate/stateInterfaces';
import { AuthContext } from '../App';
import { Navigate } from 'react-router';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { CheckOutlined, DownOutlined, StopOutlined } from '@ant-design/icons';
import { BacklogTableWithSprints } from './BacklogTable';
import { MenuWithPeople } from './utility/LoadAnimations';
const { Search } = Input;

const columns = [
  {
    key: "0",
    title: 'Name',
    colSpan: 2,
    dataIndex: 'name',
    align: 'center' as const,
    render: (text: string) => { return ({ children: text, props: { colSpan: 2 } }) },
    fixed: 'left' as const,
  },
  {
    key: "1",
    title: 'Story Points',
    dataIndex: 'expectedTimeInHours',
    render: (val: number) => val === 0 ? "" : val,
    align: 'center' as const,
  },
  {
    key: "2",
    title: 'Sprint',
    dataIndex: 'sprintNumber',
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

export default function Project() {
  const { state } = useContext(AuthContext);
  const { token } = state;
  const [filterPBI, setFiltersPBI] = useState<IPBIFilter>({ pageNumber: config.defaultFilters.page, pageSize: config.defaultFilters.size, nameFilter: "", });
  const error = useSelector(
    (appState: State) => appState.error
  );
  /*const [selectionType, setSelectionType] = useState<'pbi' | 'tasks'>('pbi');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEstimateModalVisible, setIsEstimateModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

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

  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const [initialRefresh, setInitialRefresh] = useState(true);
  const refreshRequired = useSelector((appState: State) => appState.productRequireRefresh as boolean);
  const pbiPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);

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
        console.error("Failed to add the repos: ", err);
        localStorage.setItem("ownerName", "");
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired]);

  const [prevselectedRowKeys, setPrevSelectedRowKeys] = useState([] as React.Key[]);
  const [selectedPBI, setSelectedPBI] = useState({} as IProductBacklogItem);
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
    }
  };*/
  const routes = [
    {
      path: "",
      key:0,
      breadcrumbName: window.location.href.split("/")[3],
    },
    {
      path: "Projects",
      key:1,
      breadcrumbName: "Projects",
    },
    {
      path:"path",
      key:2,
      breadcrumbName: window.location.href.split("/")[4].concat(" Project"),
    },
  ];
  function itemRender(route:any, params:any[], routes:any[], paths:any[]) {
    return (
      <span key={route.breadcrumbName+route.path}>{route.breadcrumbName}</span>)
  }
  const onSearch = (value: any) => console.log(value);

  if (!state.isLoggedIn) { return <Navigate to="/login" />; }
  return (
    <div style={{marginTop:"5vh", marginBottom:"1%"}}>
          {error.hasError &&<Alert type="error" message={error.erorMessage} banner closable/>}
          <PageHeader style={{paddingLeft:"2%", marginBottom:0, paddingBottom:0}}
    title={<div style={{fontWeight:"bold",paddingTop:0, marginTop:0}}>{"Product Backlog"}</div>}
    breadcrumb={<Breadcrumb style={{marginTop:0}} itemRender={itemRender} routes={routes} />}
  >
  </PageHeader>
  <Space direction="horizontal"
        style={{ marginLeft: "2%", marginRight: "2%", marginTop: 0, marginBottom: "1%" }}>

        <Button onClick={() => {}/*setIsModal({ ...isModal, addSprint: true })*/}>{"Create Sprint"}</Button>
        <Button onClick={() => {}/*setIsModal({ ...isModal, addPBI: true })*/}>{"Add Product Backlog Item"}</Button>
        <Search  placeholder="input backlog item name" onSearch={onSearch} enterButton />
        <Dropdown
        //filterOption={(input:string, option) =>
        // option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        //}        <Avatar icon={<UserOutlined />}/>
        //trigger={['click']}
        overlay={MenuWithPeople(initPeopleList)}>
          <span>
        <div className="ant-dropdown-link" onClick={e => e.preventDefault()}>

          People <DownOutlined />
        </div>
        </span>
      </Dropdown>
      </Space>
      <BacklogTableWithSprints/>
  
    </div>
  );
}

{/*
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
        columns={columns}
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
      */}