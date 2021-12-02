import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Checkbox, Divider, Radio, Table, } from 'antd';
import styled from "styled-components";
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { IAddPBI, IFilters, initAddPBI, initProductBacklogItem, IProductBacklogItem, IProductBacklogList, State } from '../appstate/stateInterfaces';
import { AuthContext } from '../App';
import { Navigate } from 'react-router';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { CheckOutlined, StopOutlined } from '@ant-design/icons';
import { store } from '../appstate/store';
import { CustomAddPopup } from './CustomAddPopup';
import { CustomEditPopup } from './CustomEditPopup';
import { CustomEstimatePopup } from './CustomEstimatePopup';
const { Meta } = Card;

const columns = [
  {
    key: "0",
    title: 'Name',
    dataIndex: 'name',
    align: 'center' as const,
    render: (text: string) => <a>{text}</a>,
    fixed: 'left' as const,
  },
  {
    key: "1",
    title: 'Expected Time',
    dataIndex: 'expectedTimeInHours',
    align: 'center' as const,
    //sortDirections: ['descend', 'ascend'],
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
            record.map((value: string, index:number) => { return (<p key={index} style={{ margin: "auto", marginTop: "5%", marginBottom: "5%" }}>{value}</p>) })
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

/* rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys: any[], selectedRows: IProductBacklogItem[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: IProductBacklogItem) => ({
    //disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};
const rowSelection = {
  onSelect: (props:any) => props.onRowSelect(columns[6].dataIndex)
};*/


/*handleAdd = () => {
  const { count, dataSource } = this.state;
  const newData: DataType = {
    key: count,
    name: `Edward King ${count}`,
    age: '32',
    address: `London, Park Lane no. ${count}`,
  };
  this.setState({
    dataSource: [...dataSource, newData],
    count: count + 1,
  });
};*/


export default function Project() {
  //const mock_data = initRepositoryList;
  const { state } = useContext(AuthContext);
  const { token } = state;
  const [filters, setFilters] = useState<IFilters>({
    pageNumber: config.defaultFilters.page,
    pageSize: config.defaultFilters.size,
    nameFilter: "",
    finished: "",
    estimated: "",
    inSprint: "",
  });
  const [selectionType, setSelectionType] = useState<'pbi' | 'tasks'>('pbi');
  const [stateF, setState] = useState({
    searchText: '',
    searchedColumn: '',
  });
  //const [selectedRowKeys, setSelectedRowKeys] = useState([] as React.Key[]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEstimateModalVisible, setIsEstimateModalVisible] = useState(false);
  const handleAddButton = () => { 
    setIsAddModalVisible(true);
  }
  const handleEditButton = () => { 
    setIsEditModalVisible(true);
  }
  const handleEstimateButton = () => { 
    setIsEstimateModalVisible(true);
  }
  const handleAddPBI = (pbi:IAddPBI) => { 
    //console.log(values);
    try {
      store.dispatch(
        Actions.addPBIThunk({
          ownerName: ownerName,
          token: token,
          pbi: pbi
        }) //filters
      );
    } catch (err) {
      console.error("Failed to add the repos: ", err);
    }
    finally{
      setIsAddModalVisible(false);
    }
  }

  const handleEstimatePBI = (pbi:IProductBacklogItem) => { 
    console.log(pbi);
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
      console.error("Failed to estimate the repos: ", err);
    }
    finally{
      setIsEstimateModalVisible(false);
    }
  }

  const handleEditPBI = (pbi:IAddPBI) => { 
    //console.log(values);
    /*try {
      store.dispatch(
        Actions.addPBIThunk({
          ownerName: ownerName,
          token: token,
          pbi: pbi
        }) //filters
      );
    } catch (err) {
      console.error("Failed to add the repos: ", err);
    }
    finally{
      setIsEditModalVisible(false);
    }*/
  }
  const handleFinish = () => {
    //console.log(selectedRowKeys);
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
  }}

  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  //const pages = useSelector((state: State) => state.pages); // eslint-disable-next-line
  const [displayLoader, setDisplayLoader] = useState(false); // eslint-disable-next-line
  const [initialRefresh, setInitialRefresh] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const refreshRequired = useSelector(
    (appState: State) => appState.productRequireRefresh as boolean
  );
  console.log("refresh" + refreshRequired);
  //const repo = useSelector(
  //  (appState: State) => appState.openRepository as IRepository
  //);
  const pbiPage = useSelector(
    (appState: State) => appState.pbiPage as IProductBacklogList
  );

  useEffect(() => {
    if (initialRefresh) {
      store.dispatch(Actions.clearPBIsList());
      setInitialRefresh(false);
    }
  }, [initialRefresh]);

  useEffect(() => {
    console.log(refreshRequired);
    if (refreshRequired && ownerName && ownerName !== "") {
      try {
        store.dispatch(
          Actions.fetchPBIsThunk({
            ownerName: ownerName,
            token: token,
            filters: {
              ...filters,
              pageNumber: config.defaultFilters.page,
              pageSize: config.defaultFilters.pbiSize
            }
          }) //filters
        );
      } catch (err) {
        console.error("Failed to add the repos: ", err);
        localStorage.setItem("ownerName", "");
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired]);


  /* const getColumnSearchProps = (dataIndex : any) => ({
  //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
  //     <div style={{ padding: 8 }}>
  //       <Input
  //         ref={node => {
  //           searchInput = node;
  //         }}
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
  //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //         style={{ marginBottom: 8, display: 'block' }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Search
  //         </Button>
  //         <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
  //           Reset
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             confirm({ closeDropdown: false });
  //             setState({
  //               searchText: selectedKeys[0],
  //               searchedColumn: dataIndex,
  //             });
  //           }}
  //         >
  //           Filter
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered: any) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  //   onFilter: (value: string, record: { [x: string]: { toString: () => string; }; }) =>
  //     record[dataIndex]
  //       ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
  //       : '',
  //   onFilterDropdownVisibleChange: (visible: any) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.select(), 100);
  //     }
  //   },
  //   render: (text: { toString: () => any; }) =>
  //     state.searchedColumn === dataIndex ? (
  //       <Highlighter
  //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
  //         searchWords={[state.searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ''}
  //       />
  //     ) : (
  //       text
  //     ),
  // });*/

  const handleSearch = (selectedKeys: any[], confirm: () => void, dataIndex: any) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setState({ searchText: '', searchedColumn: '' });
  };




  /*const selectRow = (record: IProductBacklogItem) => {
    console.log("row");
    const keys = selectRowKeys;
    const newKey = record.id as React.Key;
    console.log(keys.indexOf(newKey));
    if (keys.indexOf(newKey) >= 0) {
      keys.splice(keys.indexOf(newKey), 1);
    } else {
      keys[0] = newKey;
    }
    setSelectedRowKeys(keys);
    rowSelection.onChange(keys);
    console.log(keys);
    console.log(newKey);
  }*/
/*   const onSelectedRowKeysChange = (keys: React.Key[]) => {
    if (keys.indexOf(selectedRowKeys[0]) >= 0) {
      keys.splice(keys.indexOf(selectedRowKeys[0]), 1);
    }
    setSelectedRowKeys(keys);
    console.log(keys);
  } */
 /* const [select, setSelect] = useState({
    selectedRowKeys: [] as any[],
    loading: false,
  });

const { selectedRowKeys, loading } = select;*/
 /* const rowSelection = {
    selectedRowKeys,
    onSelect: (record:IProductBacklogItem) => {
      console.log(record);
      setSelect({
        ...select,
        selectedRowKeys: [record.id as React.Key]
      });
    }
};*/
const [prevselectedRowKeys, setPrevSelectedRowKeys] = useState([] as React.Key[]);
const [selectedPBI, setSelectedPBI] = useState({} as IProductBacklogItem);
  const handleTableChange = (pagination: IFilters, filters: IFilters, sorter: any) => {
    console.log(pagination);
    try {
      store.dispatch(
        Actions.fetchPBIsThunk({
          ownerName: ownerName,
          token: token,
          filters: {
            ...filters,
            pageNumber: pagination.current,
            pageSize: config.defaultFilters.pbiSize
          }
        }) //filters
      );
    } catch (err) {
      console.error("Failed to add the pbis: ", err);
    } finally {
      setFilters({ ...filters, pageNumber: filters.pageNumber + 1 });
    }
  };

  if (!state.isLoggedIn) {
    return <Navigate to="/login" />;
  }
  console.log(pbiPage ? pbiPage : "");
  return (
    <div>
      <Radio.Group
        onChange={({ target: { value } }) => {
          setSelectionType(value);
        }}
        value={selectionType}
      >
        <Radio value="pbi">PBI View</Radio>
        <Radio value="tasks">Tasks View</Radio>
      </Radio.Group>

      <Divider />

      <Table
        scroll={{ x: 800 }}
        rowKey={(record: IProductBacklogItem) => record.id}
        rowSelection={{
          //renderCell: () => <Checkbox key={8} style={{ marginLeft: "50%", marginRight: "50%", alignSelf: "center" }} />,
          type: "checkbox",
          hideSelectAll: true,
          selectedRowKeys: prevselectedRowKeys,
          onChange: (keys:React.Key[], selectedRows: IProductBacklogItem[]) => {
            console.log(keys);
            console.log(selectedRows);
            if (keys.indexOf(prevselectedRowKeys[0]) >= 0) {
              keys.splice(keys.indexOf(prevselectedRowKeys[0]), 1);
            }
            setSelectedPBI(selectedRows[0]);
            setPrevSelectedRowKeys(keys);
          },///onSelectedRowKeysChange(keys)},
          //onSelect: (record:IProductBacklogItem) => {if(prevselectedRowKeys.length>0){
           // setSelectedPBI(record);
          //}},
          //preserveSelectedRowKeys: true
          }}
        onChange={handleTableChange}
        /*onRow={(record) => ({
          onClick: () => {
            selectRow(record);
          },
        })}*/
        pagination={{ current: pbiPage.pageNumber, pageSize: config.defaultFilters.pbiSize, total: pbiPage.pageCount, showSizeChanger: false }}
        columns={columns}
        dataSource={(pbiPage && pbiPage.list) ? pbiPage.list : []}
      />
      <Divider />
      <span style={{ width: "100%" }}>
        <Button onClick={handleAddButton} type="primary" style={{ marginRight: 16 }}>
          Add
        </Button>
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
        {isAddModalVisible && <CustomAddPopup data={initAddPBI} visible={isAddModalVisible} 
        onCreate={function (values: any): void {handleAddPBI(values)}}
          onCancel={()=>{setIsAddModalVisible(false);} }/>}
          {isEditModalVisible && selectedPBI && <CustomEditPopup data={selectedPBI as IAddPBI} visible={isEditModalVisible} 
        onCreate={function (values: any): void {handleEditPBI(values)}}
          onCancel={()=>{setIsEditModalVisible(false);} }/>}
          {isEstimateModalVisible && selectedPBI && <CustomEstimatePopup data={selectedPBI as IProductBacklogItem} visible={isEstimateModalVisible} 
        onCreate={function (values: any): void {handleEstimatePBI(values)}}
          onCancel={()=>{setIsEstimateModalVisible(false);} }/>}
      </span>

    </div>
  );

}

const CardWrapper = styled.div`
display: grid;
place-items: center;
margin: 80px;
background: "transparent;
`;
//linear-gradient(to bottom, transparent, gray)

{/*expandable={{
          //rowExpandable: record => record.name !== 'Not Expandable',
         // childrenColumnName:"acceptanceCriteria"
        }}
      childrenColumnName="acceptanceCriteria"*/}