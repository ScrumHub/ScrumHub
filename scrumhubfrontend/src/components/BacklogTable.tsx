import React, { useState, useRef, useContext, useEffect } from 'react';
import { Badge, Button, Space, Table, Input, PageHeader, Divider, Progress, Typography, Tag, Popconfirm } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as Actions from '../appstate/actions';
import { IAddPBI, IAssignPBI, ICheckedAssignPBI, ICheckedProductBacklogItem, IFilters, initAddPBI, initPBIFilter, initSprint, IPBIFilter, IPeople, IProductBacklogItem, IProductBacklogList, ISprint, ISprintList, ITask, IUpdateIdSprint, IUpdateSprint, State } from '../appstate/stateInterfaces';
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
import { initFetchVals, initIDs, initModalVals } from './utility/commonInitValues';
import { BodyRowProps } from './utility/commonInterfaces';
import { validate } from './utility/validators';
import { taskAssigneeCol, taskFinishCol, taskGhLinkCol, taskNameCol, pbiNameCol, pbiPriorityCol, pbiProgressCol, pbiStoryPtsCol } from './utility/BodyRowsAndColumns';
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
  const error = useSelector((appState: State) => appState.error);
  const refreshRequired = useSelector((appState: State) => appState.productRequireRefresh as boolean);
  const sprintRefreshRequired = useSelector((appState: State) => appState.sprintRequireRefresh as boolean);
  const [initialRefresh, setInitialRefresh] = useState(true);
  const [filterPBI, setFiltersPBI] = useState<IPBIFilter>(initPBIFilter);
  const [IDs, setIDs] = useState<IFilters>(initIDs);
  const [selectedPBI, setSelectedPBI] = useState({} as IProductBacklogItem);
  const [selectedSprint, setSelectedSprint] = useState({} as ISprint);
  const [selectedTask, setSelectedTask] = useState({} as ITask);
  const [isModal, setIsModal] = useState<IFilters>(initModalVals);
  const [isFetched, setIsFetched] = useState<IFilters>(initFetchVals);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const addTaskToPBI = (input: IFilters) => {
    setIsModal({...isModal,isAddTaskModalVisible:false}); 
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
      setSelectedPBI({} as IProductBacklogItem);
      setInitialRefresh(true);
    }
  };
  const assignTask = (input: any) => {
    const ids = input.backlogItems.map((value: ICheckedProductBacklogItem) => { return ((value.checked ? value.id.toString() : "")) }).filter((x: string) => x !== "");
    setIsModal({...isModal,isAssignTaskModalVisible:false}); 
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
      setSelectedTask({} as ITask);
      setInitialRefresh(true);
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
      setIsModal({...isModal,isEstimateModalVisible:false});
      setSelectedPBI({} as IProductBacklogItem);
      setInitialRefresh(true);
    }
  };
  const addPBI = (pbi: IAddPBI) => {
    setIsModal({...isModal,isAddPBIModalVisible:false}); //check if all elements of acceptanceCriteria array are defined
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
      setInitialRefresh(true);
    }
  };
  const editPBI = (pbi: IAddPBI) => {
    setIsModal({...isModal,isEditModalVisible:false});//check if all elements of acceptanceCriteria array are defined    
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
      setInitialRefresh(true);
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
      setSelectedPBI({} as IProductBacklogItem);
      setInitialRefresh(true);
    }
  };
  const updateSprint = (pbi: IUpdateSprint) => {
    setIsModal({...isModal,isUpdateModalVisible:false});
    const sprintID = selectedSprint.sprintNumber;
    const ids = pbi.backlogItems.map((value: IProductBacklogItem) => { return ((value.sprintNumber === Number(sprintID) ? value.id.toString() : "")) }).filter((x) => x !== "");
    try {
      store.dispatch(
        Actions.updateOneSprintThunk({
          token: token as string,
          ownerName: ownerName,
          sprintNumber: Number(sprintID),
          sprint: { "goal": pbi.goal, "pbIs": ids } as IUpdateIdSprint
        }) //filters
      );
    } catch (err) {
      console.error("Failed to update the pbis: ", err);
    }
    finally {
      setSelectedSprint({} as ISprint);
      setInitialRefresh(true);
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
      setIsModal({...isModal,isAddModalVisible:false});
      setIsError(true);
    }
  };
  const DraggableBodyRow = ({ index: index_row, moveRow, className, style, ...restProps }: BodyRowProps) => {
    const ref = useRef();
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: monitor => {
        const index = monitor.getItem() || {} as number;
        if (index === index_row) {return {}; }
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
        title: 'Action', dataIndex:"",align: "right" as const, key: 'operation', render: (record: ITask) => {
          return (<Button type="link" onClick={() => { setSelectedTask(record); setIsModal({...isModal,isAssignTaskModalVisible:true}); }} >
            {"Move PBI"}
          </Button>)
        }
      } /* ,  {
         title: 'Assign', colSpan: 1, align: "right" as const, key: 'operation', render: (record:ITask) => {
           return (<Button type="link" onClick={()=>{setSelectedTask(record); setIsAssignPeopleModalVisible(true)}} >
             {"Assign"}
           </Button>)
         }
     }*/
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
              {item.id !== 0 && <Button type="link" onClick={() => { setSelectedPBI(item); setIsModal({...isModal,isEstimateModalVisible:true}); }} >
                {"Estimate"}
              </Button>}
              {item.id !== 0 && <Button type="link" onClick={() => { setSelectedPBI(item); setIsModal({...isModal,isEditModalVisible:true}); }} >
                {"Edit"}
              </Button>}
              <Button type="link" onClick={() => { setSelectedPBI(item); setIsModal({...isModal,isAddTaskModalVisible:true}); }} >
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
              onMouseEnter: () => {
                let tmp = IDs.oldSprintId === record.sprintNumber && IDs.dropped;
                let temp = IDs.pbiId > 0 && IDs.oldSprintId !== record.sprintNumber && IDs.newSprintId !== item.sprintNumber;
                setIDs({ ...IDs, oldSprintId: tmp ? -1 : IDs.oldSprintId, dropped: tmp, newSprintId: temp ? item.sprintNumber : IDs.newSprintId });
              },
            };

          }}
        />
      </DndProvider>
    )
  };

  useEffect(() => {
    if (initialRefresh) {
      store.dispatch(Actions.clearPBIsList());
      store.dispatch(Actions.clearSprintList());
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
              ...initPBIFilter,
              inSprint: false
            }
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the pbis: ", err);
      }
      finally {
        setIsFetched({...isFetched,fetchPBIs:true});
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired]);
  console.log(pbiPage);
  useEffect(() => {
    if (isFetched.fetchPBIs && ownerName && ownerName !== "" && pbiPage && pbiPage.pageCount !== null) {
      setIsFetched({...isFetched,fetchPBIs:false});
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
        setIsFetched({...isFetched,fetched:true});
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pbiPage]);
  useEffect(() => {
    if (!refreshRequired && isFetched.fetched && typeof (pbiPage) !== "undefined" && typeof (pbiPage.list) !== "undefined") {
      setIsFetched({...isFetched,fetched:false});
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
      })
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched.fetched, refreshRequired]);

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
        setIsFetched({...isFetched,fetchSprints:true});
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintRefreshRequired]);
  useEffect(() => {
    //console.log(sprintPage);
    if (isFetched.fetchSprints && ownerName && ownerName !== "" && sprintPage && sprintPage.pageCount !== null) {
      setIsFetched({...isFetched,fetchSprints:false});
      try {
        store.dispatch(
          Actions.fetchSprintsThunk({
            token: token,
            ownerName: ownerName as string,
            filters: {...initPBIFilter,
              pageSize: config.defaultFilters.sprintSize * sprintPage.pageCount,
            },
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the sprints: ", err);
      }
      finally {
        setIsFetched({...isFetched,fetchSprintsPBI:true});
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintPage]);
  useEffect(() => {
    if (!sprintRefreshRequired && isFetched.fetchSprintsPBI) {
      try{
      // console.log("fetch sprint tasks");
      setIsFetched({...isFetched,fetchSprintsPBI:false});
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
    catch(error){console.error("couldnt add tasks to sprints");}
    finally{
      
    }
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched.fetchSprintsPBI, sprintRefreshRequired]);

  useEffect(() => {
    if (IDs.dropped && IDs.oldSprintId === -1) {
      setIDs(initIDs);
    }
    else if (!loading && !refreshRequired && !sprintRefreshRequired && validate(IDs)) {
      try {
        const ids = IDs;
        setIDs({ oldSprintId: -1, newSprintId: -1, pbiId: -1 });
        if (ids.oldSprintId !== 0) {
          const oldSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === ids.oldSprintId);
          const oldPbis = oldSprint?.backlogItems.map((i: IProductBacklogItem) => { return ((i.id !== ids.pbiId ? i.id.toString() : "")) }).filter((x: string) => x !== "");
          store.dispatch(
            Actions.updateOneSprintThunk({
              token: token,
              ownerName: ownerName,
              sprintNumber: ids.oldSprintId,
              sprint: { ...oldSprint, pbIs: oldPbis as string[], goal: oldSprint?.goal as string }
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
              sprint: { ...newSprint, pbIs: newPbis as string[], goal: newSprint?.goal as string }
            }) //filters
          );
        }
      }
      catch {
        console.error(error.erorMessage);
      }
      finally {
        setInitialRefresh(true);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IDs]);

  useEffect(() => {
    if (error.hasError && !loading && isError) {
      setIsModal({...isModal,isAddModalVisible:true});
      setIsError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const sprintColumns = [
    {
      title: 'Name', colSpan: 1, dataIndex: 'sprintNumber', key: 'sprintNumber',
      render: (sprintNumber: number) => {
        return (sprintNumber === 0 ? "Product Backlog" : (<Button type="link" onClick={() => {
          localStorage.setItem("sprintID", JSON.stringify(sprintNumber));
          navigate(`/${(ownerName as string).split("/")[0]}/${(ownerName as string).split("/")[1]}/sprints/${sprintNumber}`, { replace: true });
        }}>{"Sprint " + sprintNumber}</Button>))
      },
    },
    {
      title: 'Action', colSpan: 1, align: "right" as const, key: 'operation', render: (record: ISprint) => {
        return (record.sprintNumber !== 0 && <Button type="link" onClick={() => { setSelectedSprint(record); setIsModal({...isModal,isUpdateModalVisible:true}); }} >
          {"Update"}
        </Button>)
      },
    }
  ];

  const onSearch = (value: string) => { setFiltersPBI({ ...filterPBI, nameFilter: value }); filterPBI.nameFilter !== "" ? setInitialRefresh(true):<></>; };
  if (!state.isLoggedIn) { return <Navigate to="/login" />; }
  return (
    <>
      <Space direction="horizontal"
        style={{ marginLeft: "2%", marginRight: "2%" }}>
        <Search placeholder="input search text" onSearch={onSearch} enterButton />
        <Button onClick={() => setIsModal({...isModal,isAddModalVisible:true})}>{"Create Sprint"}</Button>
        <Button onClick={() => setIsModal({...isModal,isAddPBIModalVisible:true})}>{"Add Product Backlog Item"}</Button>
      </Space>
      {sprintPage && sprintPage.list && pbiPage && pbiPage.list &&
        <Table
          style={{ borderSpacing: "separate", marginLeft: "2%", marginRight: "2%", marginTop: "2%" }}
          scroll={{ x: 800 }}
          size="small"
          loading={loading || refreshRequired || sprintRefreshRequired || initialRefresh || isFetched.fetchPBIs || isFetched.fetchSprints || isFetched.fetchSprintsPBI || isFetched.fetched}
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
      {isModal.isAddModalVisible && !loading && !isFetched.fetchPBIs && <CustomAddSprintPopup error={error.erorMessage} data={initSprint} pbiData={pbiPage.list as IProductBacklogItem[]} visible={isModal.AddModalVisible}
        onCreate={function (values: any): void { addSprint(values) }}
        onCancel={() => { setIsModal({...isModal,isAddModalVisible:false}); }} />}
      {isModal.isAddPBIModalVisible && <CustomAddPopup data={initAddPBI} visible={isModal.AddPBIModalVisible}
        onCreate={function (values: any): void { addPBI(values) }}
        onCancel={() => { setIsModal({...isModal,isAddPBIModalVisible:false}); }} />}
      {isModal.EditModalVisible && selectedPBI && selectedPBI.id && <CustomEditPopup data={selectedPBI as IAddPBI} visible={isModal.EditModalVisible}
        onCreate={function (values: any): void { editPBI(values) }}
        onCancel={() => { setIsModal({...isModal,isEditModalVisible:false}); }} />}
      {isModal.EstimateModalVisible && selectedPBI && selectedPBI.id && <CustomEstimatePopup data={selectedPBI as IProductBacklogItem} visible={isModal.EstimateModalVisible}
        onCreate={function (values: any): void { estimatePBI(values) }}
        onCancel={() => { setIsModal({...isModal,isEstimateModalVisible:false}); }} />}
      {isModal.AddTaskModalVisible && <CustomAddTaskPopup data={{ name: "" } as IFilters} visible={isModal.AddTaskModalVisible}
        onCreate={function (values: any): void { addTaskToPBI(values);}}//,isModal,setIsModal,setInitialRefresh, setSelectedPBI,token,ownerName, selectedPBI) }}
        onCancel={() => { setIsModal({...isModal,isAddTaskModalVisible:false}); }} />}
      {isModal.UpdateModalVisible && !loading && <CustomUpdateSprintPopup data={selectedSprint} pbiData={pbiPage.list as IProductBacklogItem[]} visible={isModal.UpdateModalVisible}
        onCreate={function (values: any): void { updateSprint(values) }}
        onCancel={() => { setIsModal({...isModal,isUpdateModalVisible:false}); }} />}
      {isModal.AssignTaskModalVisible && pbiPage && <CustomAssignTaskPopup error={error.erorMessage} pbiData={pbiPage.list as IAssignPBI[] as ICheckedAssignPBI[]} visible={isModal.AssignTaskModalVisible}
        onCreate={function (values: any): void { assignTask(values) }}
        onCancel={() => { setIsModal({...isModal,isAssignTaskModalVisible:false}); }} />}
    </>
  );
};