import React, { useState, useRef, useContext, useEffect } from 'react';
import { Button, Space, Table, Input, Popconfirm, Select, Dropdown, Menu } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as Actions from '../appstate/actions';
import { IAddPBI, IAssignPBI, ICheckedAssignPBI, ICheckedProductBacklogItem, IFilters, initAddPBI, initPBIFilter, initSprint, IPBIFilter, IPeopleList, IPerson, IProductBacklogItem, IProductBacklogList, ISprint, ISprintList, ITask, IUpdateIdSprint, State } from '../appstate/stateInterfaces';
import 'antd/dist/antd.css';
import './BacklogTable.css';
import { store } from '../appstate/store';
import { AuthContext } from '../App';
import { useSelector } from 'react-redux';
import config from '../configuration/config';
import { Navigate, useNavigate } from 'react-router';
import { CustomAddSprintPopup } from './popups/CustomAddSprintPopup';
import { CustomEditPopup } from './popups/CustomEditPopup';
import { CustomEstimatePopup } from './popups/CustomEstimatePopup';
import { CustomAddPopup } from './popups/CustomAddPopup';
import { CustomUpdateSprintPopup } from './popups/CustomUpdateSprintPopup';
import { CustomAddTaskPopup } from './popups/CustomAddTaskPopup';
import { CustomAssignTaskPopup } from './popups/CustomAssignTaskPopup';
import { initIDs, initModalVals } from './utility/commonInitValues';
import { BodyRowProps, IModals } from './utility/commonInterfaces';
import { useIsMounted, validate } from './utility/commonFunctions';
import { taskAssigneeCol, taskFinishCol, taskGhLinkCol, taskNameCol, pbiNameCol, pbiPriorityCol, pbiProgressCol, pbiStoryPtsCol } from './utility/BodyRowsAndColumns';
import { Option } from 'antd/lib/mentions';
import MenuItem from 'antd/lib/menu/MenuItem';
//import { addTaskToPBI } from './utility/BacklogHandlers';

const { Search } = Input;
export const type = 'DraggableBodyRow';


export const BacklogTableWithSprints: React.FC = () => {
  const { state } = useContext(AuthContext);
  const { token } = state;
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const sprintPage = useSelector((state: State) => state.sprintPage as ISprintList);
  const loading = useSelector((appState: State) => appState.loading as boolean);
  const pbiPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
  const people = useSelector((appState: State) => appState.people as IPeopleList);
  const error = useSelector((appState: State) => appState.error);
  const refreshRequired = useSelector((appState: State) => appState.productRequireRefresh as boolean);
  const sprintRefreshRequired = useSelector((appState: State) => appState.sprintRequireRefresh as boolean);
  const [initialRefresh, setInitialRefresh] = useState(true);
  const [filterPBI, setFiltersPBI] = useState<IPBIFilter>(initPBIFilter);
  const [IDs, setIDs] = useState<IFilters>(initIDs);
  const [selectedPBI, setSelectedPBI] = useState({} as IProductBacklogItem);
  const [selectedSprint, setSelectedSprint] = useState({} as ISprint);
  const [selectedTask, setSelectedTask] = useState({} as ITask);
  const [isModal, setIsModal] = useState<IModals>(initModalVals);
  const [fetchSprints, setFetchSprints] = useState(false);
  const [fetchSprintsPBI, setFetchSprintsPBI] = useState(false);
  const [fetchPBIs, setFetchPBIs] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [isError, setIsError] = useState(false);
  const isMounted = useIsMounted();
  const navigate = useNavigate();

  const addTaskToPBI = (input: IFilters) => {
    setIsModal({ ...isModal, addTask: false });
    try {
      store.dispatch(
        Actions.addTaskThunk({
          token: token,
          ownerName: ownerName,
          pbiId: selectedPBI.id,
          name: input.name
        }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally {
      if (isMounted()) {
        setSelectedPBI({} as IProductBacklogItem);
        setInitialRefresh(true);
      }
    }
  };
  const assignTask = (input: any) => {
    const ids = input.backlogItems.map((value: ICheckedProductBacklogItem) => { return ((value.checked ? value.id.toString() : "")) }).filter((x: string) => x !== "");
    setIsModal({ ...isModal, assgnTask: false });
    try {
      store.dispatch(
        Actions.assignTaskThunk({
          token: token,
          ownerName: ownerName,
          pbiId: ids.length > 1 ? 0 : ids[0],
          taskId: selectedTask.id,
          currId: selectedTask.pbiId
        }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally {
      if (isMounted()) {
        setSelectedTask({} as ITask);
        setInitialRefresh(true);
      }
    }
  };
  const estimatePBI = (pbi: IProductBacklogItem) => {
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
      if (isMounted()) {
        setIsModal({ ...isModal, estimatePBI: false });
        setSelectedPBI({} as IProductBacklogItem);
        setInitialRefresh(true);
      }
    }
  };
  const addPBI = (pbi: IAddPBI) => {
    setIsModal({ ...isModal, addPBI: false }); //check if all elements of acceptanceCriteria array are defined
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
      if (isMounted()) {
        setSelectedPBI({} as IProductBacklogItem);
        setInitialRefresh(true);
      }
    }
  };
  const editPBI = (pbi: IAddPBI) => {
    setIsModal({ ...isModal, editPBI: false });//check if all elements of acceptanceCriteria array are defined    
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
      if (isMounted()) {
        setSelectedPBI({} as IProductBacklogItem);
        setInitialRefresh(true);
      }
    }
  };
  /*const handleFinish = () => {
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
      }}*/

  const deletePBI = (item: IProductBacklogItem) => {
    try {
      store.dispatch(
        Actions.deletePBIThunk({
          ownerName: ownerName,
          token: token,
          pbild: item.id as number
        }) //filters
      );
    } catch (err) { console.error("Failed to add the repos: ", err); }
    finally {
      if (isMounted()) {
        setSelectedPBI({} as IProductBacklogItem);
        setInitialRefresh(true);
      }
    }
  };
  const updateSprint = (pbi: ISprint) => {
    setIsModal({ ...isModal, updateSprint: false });
    const sprintID = selectedSprint.sprintNumber;
    const ids = pbi.backlogItems.map((value: IProductBacklogItem) => { return ((value.sprintNumber === Number(sprintID) ? value.id.toString() : "")) }).filter((x) => x !== "");
    try {
      store.dispatch(
        Actions.updateOneSprintThunk({
          token: token as string,
          ownerName: ownerName,
          sprintNumber: Number(sprintID),
          sprint: { "goal": pbi.goal, "pbiIDs": ids } as IUpdateIdSprint
        }) //filters
      );
    } catch (err) {
      console.error("Failed to update the pbis: ", err);
    }
    finally {
      if (isMounted()) {
        setSelectedSprint({} as ISprint);
        setInitialRefresh(true);
      }
    }
  };
  const addSprint = (pbi: ISprint) => {
    const ids = pbi.backlogItems.map((value: IProductBacklogItem) => { return ((value.isInSprint ? value.id.toString() : "")) }).filter((x: string) => x !== "");
    try {
      store.dispatch(
        Actions.addSprintThunk({
          token: token as string,
          ownerName: ownerName as string,
          sprint: { "number": pbi.sprintNumber, "goal": pbi.goal, "pbIs": ids }
        }) //filters
      );
    } catch (err) {
      console.error("Failed to add the sprint: ", err);
    } finally {
      if (isMounted()) {
        setIsModal({ ...isModal, addSprint: false });
        setIsError(true);
      }
    }
  };
  const DraggableBodyRow = ({ index: index_row, moveRow, className, style, ...restProps }: BodyRowProps) => {
    const ref = useRef();
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: monitor => {
        const index = monitor.getItem() || {} as number;
        if (index === index_row) { return {}; }
        return {
          isOver: monitor.isOver(),
          dropClassName: index as number < index_row ? ' drop-over-downward' : ' drop-over-upward',
        };
      },
      drop: (item: any) => {
        setIDs({ ...IDs, dropped: true });
      },
    });
    const [, drag] = useDrag({
      type,
      item: { index: index_row },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    });
    drop(drag(ref));
    return (
      <tr
        ref={ref as any}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{ cursor: "move", marginTop: "20px", marginBottom: "20px", ...style }}
        {...restProps}
      />
    );
  };
  const TaskTableforPBI: React.FC<IProductBacklogItem> = (item: IProductBacklogItem) => {
    const sprintsColumns = [
      taskNameCol,
      taskFinishCol,
      taskAssigneeCol,
      taskGhLinkCol,
      {
        title: 'Action', dataIndex: "", align: "right" as const, key: 'operation', render: (record: ITask) => {
          return (<Button type="link" onClick={() => { setSelectedTask(record); setIsModal({ ...isModal, assgnTask: true }); }} >
            {"Move PBI"}
          </Button>)
        }
      }, {
        title: 'Assign', colSpan: 1, align: "right" as const, key: 'operation', render: (record: ITask) => {
          return (<Select
            showSearch
            placeholder="Select a person"
            onChange={() => { }}
            onSearch={() => { }}
          //filterOption={(input:string, option) =>
          // option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          //}
          >
          
            {people.list.map((item: IPerson) => {
              return (
                <Option key={item.login}>
                  {item.login as string}
                </Option>);})
                }
          </Select>)
        }
      }
    ];
    const sprintsComponents = {
      body: {
        row: DraggableBodyRow,
      },
    };
    return (
      <DndProvider backend={HTML5Backend} key={item.sprintNumber}>
        <Table
          size="small"
          showHeader={false}
          scroll={{ x: 800 }}
          rowKey={(record: ITask) => record.id}
          columns={sprintsColumns}
          components={sprintsComponents}
          dataSource={item.tasks}
          pagination={false}
          onRow={(record) => {
            return {
              onMouseEnter: () => {
                if (IDs.pbiId > 0 && IDs.oldSprintId !== item.sprintNumber) { setIDs({ ...IDs, newSprintId: item.sprintNumber, drop: true }) }
              },
            };
          }}
        />
      </DndProvider>
    )
  };
  const PBITableforSprint: React.FC<ISprint> = (item: any) => {

    const taskColumns = [
      pbiNameCol,
      pbiPriorityCol,
      pbiProgressCol,
      pbiStoryPtsCol,
      {
        title: 'Delete', align: "right" as const, colSpan: 1, key: 'delete', render: (item: IProductBacklogItem) => {
          return (item.id !== 0 && <span>
            <Popconfirm
              title="Are you sure you want to delete this?"
              onConfirm={() => { setSelectedPBI(item); deletePBI(item); }}
              okText="Yes"
              cancelText="No"
            ><Button type="link">
                {"Delete"}</Button>
            </Popconfirm></span>)
        }
      },
      {
        title: 'Action', align: "right" as const, colSpan: 2, key: 'actions', render: (item: IProductBacklogItem) => {
          return ({
            children: <span>
              {item.id !== 0 && <Button type="link" onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, estimatePBI: true }); }} >
                {"Estimate"}
              </Button>}
              {item.id !== 0 && <Button type="link" onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, editPBI: true }); }} >
                {"Edit"}
              </Button>}
              <Button type="link" onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, addTask: true }); }} >
                {"Add Task"}
              </Button>
            </span>, props: { colSpan: 2 }
          })
        }
      },
    ];
    const nestedcomponents = {
      body: {
        row: DraggableBodyRow,
      },
    };

    return (
      <DndProvider backend={HTML5Backend} key={item.sprintNumber}>
        <Table
          size="small"
          showHeader={false}
          scroll={{ x: 800 }}
          columns={taskColumns}
          rowKey={(record: IProductBacklogItem) => record.id}
          expandable={{
            expandedRowRender: TaskTableforPBI,
            defaultExpandAllRows: false, rowExpandable: record => record.tasks && record.tasks.length > 0,
          }}
          components={nestedcomponents}
          dataSource={item.backlogItems}//:item.backlogItems.filter((item:IProductBacklogItem)=>{item.name.startsWith(filterPBI.nameFilter as string)})}
          pagination={false}
          onRow={(record) => {
            return {
              onDrag: () => {
                if (record.id !== IDs.pbiId) { setIDs({ ...IDs, pbiId: record.id, oldSprintId: IDs.pbiId !== 0 ? item.sprintNumber : -1 }); }
              },
              //onDragEnter: () => {
              //  console.log(record.name)
              //},
              onDragEnter: () => {
                let tmp = IDs.oldSprintId === record.sprintNumber && IDs.dropped;
                let temp = IDs.pbiId > 0 && IDs.oldSprintId !== record.sprintNumber && IDs.newSprintId !== record.sprintNumber;
                if(isMounted()){
                if(tmp){
                  setIDs({ ...IDs, oldSprintId: -1, dropped: true});
                }
                //else{
               //   setIDs({ ...IDs, dropped:false });
                //}
                if(temp)
                {
                  setIDs({ ...IDs,  newSprintId: record.sprintNumber });
                }
              }
                
              },
            };

          }}
        />
      </DndProvider>
    )
  };


  useEffect(() => {
    //console.log(isMounted()+"/"+initialRefresh);
    if (initialRefresh && isMounted()) {
      store.dispatch(Actions.clearPBIsList());
      store.dispatch(Actions.clearSprintList());
      if (isMounted()) {
        setInitialRefresh(false);
      }
    }
  }, [initialRefresh, isMounted]);

  useEffect(() => {
    if (refreshRequired && ownerName && ownerName !== "") {
      try {
        store.dispatch(
          Actions.fetchPBIsThunk({
            ownerName: ownerName,
            token: token,
            filters: {
              ...initPBIFilter,
              inSprint: false
            }
          })
        );
        store.dispatch(
          Actions.fetchPeopleThunk({
            ownerName: ownerName,
            token: token,
          })
        );
      } catch (err) {
        console.error("Failed to fetch the pbis: ", err);
      }
      finally {
        setFetchPBIs(true);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired]);
  //console.log(pbiPage);
  useEffect(() => {
    if (fetchPBIs && ownerName && ownerName !== "" && pbiPage && pbiPage.pageCount !== null) {
      setFetchPBIs(false);
      try {
        store.dispatch(
          Actions.fetchPBIsThunk({
            ownerName: ownerName,
            token: token,
            filters: {
              ...initPBIFilter,
              pageSize: config.defaultFilters.pbiSize * (pbiPage.pageCount < 0 || isNaN(pbiPage.pageCount) ? 1 : pbiPage.pageCount),
              inSprint: false
            }
          })
          //filters
        );
      } catch (err) {
        console.error("Failed to fetch the pbis: ", err);
      }
      finally {
        setFetched(true);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pbiPage]);
  useEffect(() => {
    if (!refreshRequired && fetched && typeof (pbiPage) !== "undefined" && typeof (pbiPage.list) !== "undefined") {
      setFetched(false);
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
        return ({})
      })
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetched, refreshRequired]);

  useEffect(() => {
    if (sprintRefreshRequired && ownerName && ownerName !== "") {
      try {
        store.dispatch(
          Actions.fetchSprintsThunk({
            token: token,
            ownerName: ownerName as string,
            filters: initPBIFilter,
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the sprints: ", err);
      }
      finally {
        //console.log("count"+sprintPage.pageCount);
        setFetchSprints(true);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintRefreshRequired]);
  useEffect(() => {
    //console.log(sprintPage);
    if (fetchSprints && ownerName && ownerName !== "" && sprintPage && sprintPage.pageCount !== null) {
      setFetchSprints(false);
      try {
        store.dispatch(
          Actions.fetchSprintsThunk({
            token: token,
            ownerName: ownerName as string,
            filters: {
              ...initPBIFilter,
              pageSize: config.defaultFilters.sprintSize * sprintPage.pageCount,
            },
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the sprints: ", err);
      }
      finally {
        setFetchSprintsPBI(true);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintPage]);
  useEffect(() => {
    if (!sprintRefreshRequired && fetchSprintsPBI) {
      try {
        // console.log("fetch sprint tasks");
        setFetchSprintsPBI(false);
        sprintPage.list.map((sprint: ISprint) => {
          sprint.backlogItems.map((item: IProductBacklogItem) => {
            // console.log(item.id);
            store.dispatch(
              Actions.addTasksToSprintThunk({
                token: token,
                ownerName: ownerName,
                pbiId: item.id,
              }) //filters
            );
            return ({});
          })
          return ({});
        })
      }
      catch (error) { console.error("couldnt add tasks to sprints"); }
      finally {

      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSprintsPBI, sprintRefreshRequired]);

  useEffect(() => {
    if (IDs.dropped && IDs.oldSprintId === -1) {
      setIDs(initIDs);
    }
    else if (!loading && !refreshRequired && !sprintRefreshRequired && validate(IDs)) {
      try {
        const ids = IDs;
        if (ids.oldSprintId !== 0) {
          const oldSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === ids.oldSprintId);
          const oldPbis = oldSprint?.backlogItems.map((i: IProductBacklogItem) => { return ((i.id !== ids.pbiId ? i.id.toString() : "")) }).filter((x: string) => x !== "");
          store.dispatch(
            Actions.updateOneSprintThunk({
              token: token,
              ownerName: ownerName,
              sprintNumber: ids.oldSprintId,
              sprint: { ...oldSprint, pbiIDs: oldPbis as string[], goal: oldSprint?.goal as string }
            }) //filters
          );
        }
        if (ids.newSprintId !== 0) {
          const newSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === ids.newSprintId);
          const newPbis = newSprint?.backlogItems.map((i: IProductBacklogItem) => { return (i.id.toString()) }).concat([ids.pbiId.toString()]);
          store.dispatch(
            Actions.updateOneSprintThunk({
              token: token,
              ownerName: ownerName,
              sprintNumber: ids.newSprintId,
              sprint: { ...newSprint, pbiIDs: newPbis as string[], goal: newSprint?.goal as string }
            }) //filters
          );
        }
      }
      catch {
        console.error(error.erorMessage);
      }
      finally {
        if (isMounted()) {
          setIDs(initIDs);
          setInitialRefresh(true);
        }
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IDs]);

  useEffect(() => {
    if (error.hasError && !loading && isError) {
      setIsModal({ ...isModal, addSprint: true });
      setIsError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  const sprintColumns = [
    {
      title: 'Name', colSpan: 1, dataIndex: 'sprintNumber', key: 'sprintNumber',
      render: (sprintNumber: number) => {
        return (sprintNumber === 0 ? "Product Backlog" : (<div className='link-button' onClick={() => {
          localStorage.setItem("sprintID", JSON.stringify(sprintNumber));
          navigate(`/${(ownerName as string).split("/")[0]}/${(ownerName as string).split("/")[1]}/sprints/${sprintNumber}`, { replace: true });
        }}>{"Sprint " + sprintNumber}</div>))
      },
    },
    {
      title: 'Action', colSpan: 1, align: "right" as const, key: 'operation', render: (record: ISprint) => {
        return (record.sprintNumber !== 0 && <Button type="link" onClick={() => { setSelectedSprint(record); setIsModal({ ...isModal, updateSprint: true }); }} >
          {"Update"}
        </Button>)
      },
    }
  ];
  const menu = (
    <Menu>{people.list.map((item: IPerson) => {
      return (
        <MenuItem key={item.login}>
          {item.login as string}
        </MenuItem>);})
        }</Menu>
  );
  const onSearch = (value: string) => { setFiltersPBI({ ...filterPBI, nameFilter: value }); filterPBI.nameFilter !== "" ? setInitialRefresh(true) : <></>; };
  if (!state.isLoggedIn) { return <Navigate to="/login" />; }
  return (
    <>
      <Space direction="horizontal"
        style={{ marginLeft: "2%", marginRight: "2%" }}>

        {/*<Dropdown
        overlay={menu}
          //filterOption={(input:string, option) =>
          // option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          //}
          >
          
            
        </Dropdown>*/}
        <Button onClick={() => setIsModal({ ...isModal, addSprint: true })}>{"Create Sprint"}</Button>
        <Button onClick={() => setIsModal({ ...isModal, addPBI: true })}>{"Add Product Backlog Item"}</Button>
        <Search placeholder="input search text" onSearch={onSearch} enterButton />
      </Space>
      {sprintPage && sprintPage.list && pbiPage && pbiPage.list && people && people.list.length > 0 &&
        <Table
          style={{ borderSpacing: "separate", marginLeft: "2%", marginRight: "2%", marginTop: "2%" }}
          scroll={{ x: 800 }}
          size="small"
          loading={loading || refreshRequired || sprintRefreshRequired || initialRefresh || fetchPBIs || fetchSprints || fetchSprintsPBI || fetched}
          showHeader={false}
          pagination={false}
          dataSource={([{ sprintNumber: 0, goal: "Product Backlog", backlogItems: pbiPage.list } as ISprint] as ISprint[]).concat(sprintPage.list)}
          columns={sprintColumns}
          rowKey={(record: ISprint) => record.sprintNumber}
          expandable={{
            expandedRowRender: PBITableforSprint, defaultExpandAllRows: false,
            rowExpandable: record => record.backlogItems && record.backlogItems.length > 0, defaultExpandedRowKeys: [0, 1]
          }}
          onRow={(record) => {
            return {
              //onClick: () => {console.log("clicked");console.log(record.sprintNumber);},
              //onClickCapture: () => {console.log("captured");console.log(record.sprintNumber);},
              //onMouseDown: () => {console.log("sprintId");console.log(record.sprintNumber);},
              //onMouseUp: () => {console.log("up");console.log(record.sprintNumber);},
              onMouseEnter: () => {
                let tmp = IDs.oldSprintId === record.sprintNumber && IDs.dropped;
                ; setIDs({
                  ...IDs, oldSprintId: tmp ? -1 : IDs.oldSprintId, dropped: tmp, newSprintId: IDs.pbiId > 0
                    && IDs.oldSprintId !== record.sprintNumber ? record.sprintNumber : -1
                })
              },
              onMouseLeave: () => { setIDs({ ...IDs, newSprintId: -1, pbiId: -1, oldSprintId: -1 }) },
            };
          }}
        />
      }
      {isModal.addSprint && !loading && !fetchPBIs && <CustomAddSprintPopup error={error.erorMessage} data={initSprint} pbiData={pbiPage.list as IProductBacklogItem[]} visible={isModal.addSprint}
        onCreate={function (values: any): void { addSprint(values) }}
        onCancel={() => { setIsModal({ ...isModal, addSprint: false }); }} />}
      {isModal.addPBI && <CustomAddPopup data={initAddPBI} visible={isModal.addPBI}
        onCreate={function (values: any): void { addPBI(values) }}
        onCancel={() => { setIsModal({ ...isModal, addPBI: false }); }} />}
      {isModal.editPBI && selectedPBI && selectedPBI.id && <CustomEditPopup data={selectedPBI as IAddPBI} visible={isModal.editPBI}
        onCreate={function (values: any): void { editPBI(values) }}
        onCancel={() => { setIsModal({ ...isModal, editPBI: false }); }} />}
      {isModal.estimatePBI && selectedPBI && selectedPBI.id && <CustomEstimatePopup data={selectedPBI as IProductBacklogItem} visible={isModal.estimatePBI}
        onCreate={function (values: any): void { estimatePBI(values) }}
        onCancel={() => { setIsModal({ ...isModal, estimatePBI: false }); }} />}
      {isModal.addTask && <CustomAddTaskPopup data={{ name: "" } as IFilters} visible={isModal.addTask}
        onCreate={function (values: any): void { addTaskToPBI(values); }}//,isModal,setIsModal,setInitialRefresh, setSelectedPBI,token,ownerName, selectedPBI) }}
        onCancel={() => { setIsModal({ ...isModal, addTask: false }); }} />}
      {isModal.updateSprint && !loading && <CustomUpdateSprintPopup data={selectedSprint} pbiData={pbiPage.list as IProductBacklogItem[]} visible={isModal.updateSprint}
        onCreate={function (values: any): void { updateSprint(values) }}
        onCancel={() => { setIsModal({ ...isModal, updateSprint: false }); }} />}
      {isModal.assgnPpl && pbiPage && <CustomAssignTaskPopup error={error.erorMessage} pbiData={pbiPage.list as IAssignPBI[] as ICheckedAssignPBI[]} visible={isModal.assgnPpl}
        onCreate={function (values: any): void { assignTask(values) }}
        onCancel={() => { setIsModal({ ...isModal, assgnTask: false }); }} />}
    </>
  );
};