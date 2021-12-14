import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { CheckOutlined, DownOutlined, StopOutlined } from '@ant-design/icons';
import { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { IProductBacklogList, IProductBacklogItem, State, IPBIFilter, ITask } from '../appstate/stateInterfaces';
import { store } from '../appstate/store';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { AuthContext } from '../App';
import config from '../configuration/config';

const menu = (
    <Menu>
        <Menu.Item>Action 1</Menu.Item>
        <Menu.Item>Action 2</Menu.Item>
    </Menu>
);

export function ExpandableTable() {
    const { state } = useContext(AuthContext);
    const { token } = state;
    const [filterPBI, setFiltersPBI] = useState<IPBIFilter>({ pageNumber: config.defaultFilters.page, pageSize: config.defaultFilters.size, nameFilter: "", });
    const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
    const [initialRefresh, setInitialRefresh] = useState(true);
    const refreshRequired = useSelector((appState: State) => appState.productRequireRefresh as boolean);
    const pbiPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
    const [fetched, setFetched] = useState(false);

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
            finally{
                setFetched(true);
            }
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshRequired]);
   
    //useEffect(() => {
        if (fetched && !refreshRequired) {
            setFetched(false);
            pbiPage.list.map((item:IProductBacklogItem)=>{
            try {
                store.dispatch(
                    Actions.addTasksToPBIThunk({
                        token: token,
                        ownerName: ownerName,
                        pbiId: item.id
                    }) //filters
                );
            } catch (err) {
                console.error("Failed to add tasks to pbis: ", err);
                localStorage.setItem("ownerName", "");
            }
        })
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    //}, [fetched]);*/

    
    
    const tasks = useSelector((appState: State) => appState.tasks as ITask[]);

    const expandedRowRender = (record:IProductBacklogItem, index: any, indent: any, expanded: any) => {
        const nestedColumns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
                title: 'Finished',
                key: 'finished',
                render: (val:boolean) => (
                    <span>
                        <Badge status={val?"success":"error"} />
                        Finished
                    </span>
                ),
            },
            {
                key: "isAssignedtoPBI",
                title: 'Assigned',
                dataIndex: 'isAssignedtoPBI',
                render: (finishValue: boolean) => finishValue ? "Assigned" : "Unassigned",
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
                title: 'Action',
                dataIndex: 'operation',
                key: 'operation',
                render: () => (
                    <Space size="middle">
                        <a>Pause</a>
                        <a>Stop</a>
                        <Dropdown overlay={menu}>
                            <a>
                                More <DownOutlined />
                            </a>
                        </Dropdown>
                    </Space>
                ),
            },
        ];

        return (
            <Table
                rowKey={(record:ITask) => record.id}
                columns={nestedColumns}
                dataSource={record.tasks}
                pagination={false}
            />
        )
    };

    const taskColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Action', key: 'operation', render: () => <a>Publish</a> },
    ];

   

    return (
        <Table
            className="components-table-demo-nested"
            columns={taskColumns}
            rowKey={(record: IProductBacklogItem) => record.id}
            expandable={{ expandedRowRender:expandedRowRender, defaultExpandAllRows: false }}
            dataSource={(pbiPage && pbiPage.list) ? pbiPage.list : []}
        />
    );
}