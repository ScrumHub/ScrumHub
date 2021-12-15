import React, { useState, useRef, useContext, useEffect } from 'react';
import { Badge, Button, Space, Table, Input, PageHeader, Divider, Progress, Typography, Tag, Popconfirm } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as Actions from '../appstate/actions';
import { IAddPBI, IAssignPBI, ICheckedAssignPBI, ICheckedProductBacklogItem, IFilters, initAddPBI, initSprint, IPBIFilter, IPeople, IProductBacklogItem, IProductBacklogList, ISprint, ISprintList, ITask, IUpdateIdSprint, IUpdateSprint, State } from '../appstate/stateInterfaces';
import 'antd/dist/antd.css';
import './Dragtable.css';
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

const { Search } = Input;


export const type = 'DraggableBodyRow';
export const fixedType = 'NonDraggableBodyRow';

export interface BodyRowProps {
  index: any;
  moveRow: any;
  className: any;
  style: any;
  restProps: {
    [x: string]: any;
  };
}

const NonDraggableBodyRow = ({ index: index_row, moveRow, className, style, ...restProps }: BodyRowProps) => {
  const ref = useRef();
  //console.log(ref);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const index = monitor.getItem() || {} as number;
      if (index === index_row) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: index as number < index_row ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      //console.log(item);
      if (item.index && typeof (item.index) != "undefined") {
        //console.log("move backlog item");
        //moveRow(item.index, index_row);
      }
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index: index_row },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(ref);
  return (
    <tr
      ref={ref as any}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ marginTop: "20px", marginBottom: "20px", ...style }}
      {...restProps}
    />
  );
};



const DraggableBodyRowNested = ({ index: index_row, moveRow, className, style, ...restProps }: BodyRowProps) => {
  const ref = useRef();
  //console.log(ref);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const index = monitor.getItem() || {} as number;
      if (index === index_row) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: index as number < index_row ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      //console.log(item);
      if (item.index && typeof (item.index) != "undefined") {
        //console.log("move backlog item");
        //moveRow(item.index, index_row);
      }
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
      style={{ cursor: 'move', marginTop: "20px", marginBottom: "20px", ...style }}
      {...restProps}
    />
  );
};

export const BacklogTableWithSprints: React.FC = () => {
  const { state } = useContext(AuthContext);
  const sprintPage = useSelector(
    (state: State) => state.sprintPage as ISprintList
  );
  const [IDs, setIDs] = useState<IFilters>({ oldSprintId: -1, newSprintId: -1, pbiId: -1, dropped: false });
  //console.log(sprintPage);
  const { token } = state;
  const loading = useSelector((appState: State) => appState.loading as boolean);
  const [filterPBI, setFiltersPBI] = useState<IPBIFilter>({
    pageNumber: config.defaultFilters.page,
    pageSize: config.defaultFilters.size, nameFilter: "",
  });
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const [initialRefresh, setInitialRefresh] = useState(true);
  const refreshRequired = useSelector((appState: State) => appState.productRequireRefresh as boolean);
  const sprintRefreshRequired = useSelector((appState: State) => appState.sprintRequireRefresh as boolean);
  const pbiPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
  const [selectedPBI, setSelectedPBI] = useState({} as IProductBacklogItem);
  const [selectedSprint, setSelectedSprint] = useState({} as ISprint);
  const [selectedTask, setSelectedTask] = useState({} as ITask);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isAssignTaskModalVisible, setIsAssignTaskModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isAddPBIModalVisible, setIsAddPBIModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEstimateModalVisible, setIsEstimateModalVisible] = useState(false);
  const [fetchSprints, setFetchSprints] = useState(false);
  const [fetchSprintsPBI, setFetchSprintsPBI] = useState(false);
  const [fetchPBIs, setFetchPBIs] = useState(false);
  const [fetched, setFetched] = useState(false);
  const backlogPriorities = ["Could", "Should", "Must"];
  const backlogColors = ["green", "blue", "red"];
  const navigate = useNavigate();
  const error = useSelector(
    (appState: State) => appState.error
  );
  
  const handleAddTask = (input: IFilters) => {
    setIsAddTaskModalVisible(false); //check if all elements of acceptanceCriteria array are defined
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
    finally{
      setSelectedPBI({} as IProductBacklogItem);
      setInitialRefresh(true);
    }
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
          taskId:selectedTask.id,
          currId:selectedTask.pbiId
        }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally{
      setSelectedTask({} as ITask);
      setInitialRefresh(true);
    }
  }

  const DraggableBodyRow = ({ index: index_row, moveRow, className, style, ...restProps }: BodyRowProps) => {
    const ref = useRef();
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: monitor => {
        const index = monitor.getItem() || {} as number;
        if (index === index_row) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: index as number < index_row ? ' drop-over-downward' : ' drop-over-upward',
        };
      },
      drop: (item: any) => {
        //console.log(IDs);
        setIDs({ ...IDs, dropped: true });
        //if (item.index && typeof (item.index) != "undefined") {
        //console.log("move backlog item");
        //moveRow(item.index, index_row);
        //}
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
      { title: 'Name', align: 'left' as const, fixed: "left" as const, dataIndex: 'name', key: 'name' },
      {
        title: 'Finished',
        key: 'finished',
        dataIndex: 'finished',
        align: 'center' as const,
        render: (val: boolean) => (
          <span>
            <Badge status={val ? "success" : "error"} />
            {val ? "Finished" : "In Progress"}
          </span>
        ),
      },
      {
        key: "isAssignedToPBI",
        title: 'Assigned',
        render: (record: ITask) => (
          <span>
            <Badge status={(typeof(record.assigness)!=="undefined" && record.assigness.length > 0)  ? "success" : "error"} />
            {(typeof(record.assigness)!=="undefined" && record.assigness.length > 0) ? 
            record.assigness.at(0).login as string : "Not Assigned"}
          </span>
        ),
        align: 'center' as const,

      },
      {
        title: 'Related Link',
        dataIndex: 'link',
        key: 'link',
        align: 'right' as const,
        render: (text: string) => <a href={text}>{"See on GitHub"}</a>
      },
      {
        title: 'Action', colSpan: 1, align: "right" as const, key: 'operation', render: (record:ITask) => {
          return (<Button type="link" onClick={()=>{setSelectedTask(record); setIsAssignTaskModalVisible(true)}} >
            {"Move PBI"}
          </Button>)
        }
      }
        ,
        {
          title: 'Assign', colSpan: 1, align: "right" as const, key: 'operation', render: (record:ITask) => {
            return (<Button type="link" onClick={()=>{setSelectedTask(record); setIsAssignTaskModalVisible(true)}} >
              {"Assign"}
            </Button>)
          }
      }
    ];
    const sprintsComponents = {
      body: {
        row: DraggableBodyRowNested,
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
          }}/*({
          index,
          moveRowNested,
        }) as any}*/
        />
      </DndProvider>
    )
  };

  const PBITableforSprint: React.FC<ISprint> = (item: any) => {

    const taskColumns = [
      { title: 'Name', fixed: "left" as const, colSpan: 2, dataIndex: 'name', key: 'name', render:  (text: string) => {return ({ children: text,props: { colSpan: 2 }})},
    },
      {
        title: 'Priority', align: "center" as const, colSpan: 2,  key: 'priority',
        render: (item: IProductBacklogItem) =>  item.id !==0 && item.priority < 3 ? 
          <Tag color={backlogColors[item.priority]}>{backlogPriorities[item.priority]}</Tag>
          :<></>

      },
      {
        title: 'Progress', colSpan: 1, key: 'operation', align: "center" as const, render: (item: IProductBacklogItem) => {
          return (<span><Progress  width={30} type="circle" percent={item.tasks && item.tasks.length > 0 ?
            (item.tasks.filter((item: ITask) => item.finished).length)
            : 100} format={percent => `${item.tasks && item.tasks.length > 0 ?percent:0}/${item.tasks && item.tasks.length > 0 ?item.tasks.length as number:0}`}></Progress></span>)
        }
      },
      {
        title: 'Action', align: "right" as const, colSpan: 1, key: 'delete', render: (item: IProductBacklogItem) => {
          return (item.id !==0 &&<span>
            <Popconfirm
              title="Are you sure you want to delete this?"
              onConfirm={()=>{setSelectedPBI(item);handleDelete(item);}}
              okText="Yes"
              cancelText="No"
            ><Button type="link">
              {"Delete"}</Button>
            </Popconfirm></span>)
        }
      },
      {
        title: 'Action', align: "right" as const, colSpan: 2, key: 'right', render: (item: IProductBacklogItem) => {
          return ({children:<span>
            {item.id !==0 && <Button type="link" onClick={() => { setSelectedPBI(item); setIsEstimateModalVisible(true); }} >
            {"Estimate"}
          </Button>}
          {item.id !==0 &&<Button type="link" onClick={() => { setSelectedPBI(item); setIsEditModalVisible(true); }} >
              {"Edit"}
            </Button>}
            <Button type="link" onClick={() => { setSelectedPBI(item); setIsAddTaskModalVisible(true); }} >
            {"Add Task"}
          </Button>
            </span>,props: { colSpan: 2 }})
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
          dataSource={item.backlogItems}
          pagination={false}
          onRow={(record) => {
            return {
              
              onDrag: () => {
                if (record.id !== IDs.pbiId) { setIDs({ ...IDs, pbiId: record.id, oldSprintId: IDs.pbiId !== 0 ? item.sprintNumber : -1 }); }
              },
              onMouseEnter: () => {
                let tmp = IDs.oldSprintId === record.sprintNumber && IDs.dropped;
                let temp = IDs.pbiId > 0 && IDs.oldSprintId !== record.sprintNumber && IDs.newSprintId !== item.sprintNumber;
                // if(temp){
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
              ...filterPBI,
              pageNumber: config.defaultFilters.page,
              pageSize: config.defaultFilters.pbiSize,
              inSprint: false
            }
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the pbis: ", err);
      }
      finally {
        setFetchPBIs(true);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired]);
console.log(pbiPage);
  useEffect(() => {
    if (fetchPBIs && ownerName && ownerName !== "" && pbiPage && pbiPage.pageCount !== null) {
      setFetchPBIs(false);
      try {
        store.dispatch(
          Actions.fetchPBIsThunk({
            ownerName: ownerName,
            token: token,
            filters: {
              ...filterPBI,
              pageNumber: config.defaultFilters.page,
              pageSize: config.defaultFilters.pbiSize * (pbiPage.pageCount < 0 || isNaN(pbiPage.pageCount)? 1: pbiPage.pageCount),
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
    if (sprintRefreshRequired && ownerName && ownerName !== "") {
      try {
        store.dispatch(
          Actions.fetchSprintsThunk({
            token: token,
            ownerName: ownerName as string,
            filters: {
              pageSize: config.defaultFilters.sprintSize,
              pageNumber: config.defaultFilters.page,
            },
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
              pageSize: config.defaultFilters.sprintSize * sprintPage.pageCount,
              pageNumber: config.defaultFilters.page,
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
      // console.log("fetch sprint tasks");
      setFetchSprintsPBI(false);
      sprintPage.list.map((sprint: ISprint) => {
        sprint.backlogItems.map((item: IProductBacklogItem) => {
          // console.log(item.id);
          store.dispatch(
            Actions.addTasksToSprintThunk({
              token: token,
              ownerName: ownerName,
              pbiId: item.id
            }) //filters
          );
          return ({});
        })
        return ({});
      })
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSprintsPBI, sprintRefreshRequired]);

  useEffect(() => {
    if (!refreshRequired && fetched && typeof(pbiPage)!== "undefined" && typeof(pbiPage.list)!== "undefined") {
      setFetched(false);
      // console.log("fetching tasks");
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
      })
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetched, refreshRequired]);

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
      setInitialRefresh(true);
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
      setInitialRefresh(true);
    }
  }
/*
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
    }
  }*/

  const handleDelete = (item:IProductBacklogItem) => {
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
  }

  const handleUpdatePBI = (pbi: IUpdateSprint) => {
    setIsUpdateModalVisible(false);
    const sprintID = selectedSprint.sprintNumber;
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
      setSelectedSprint({} as ISprint);
      setInitialRefresh(true);
    }
  }

  const validate = (IDs: IFilters) => {
    if (IDs.dropped && IDs.oldSprintId === -1) {
      setIDs({ ...IDs, oldSprintId: -1, newSprintId: -1, pbiId: -1, dropped: false });
      return (false);
    }
    return (IDs.oldSprintId !== -1 && IDs.newSprintId !== -1 && IDs.pbiId !== -1 && IDs.newSprintId !== IDs.oldSprintId)
  }
  useEffect(() => {
    if (!loading && !refreshRequired && !sprintRefreshRequired && validate(IDs)) {
      try {
        const ids = IDs;
        setIDs({ oldSprintId: -1, newSprintId: -1, pbiId: -1 });
        //g("fetch");
        //fetch unassigned tasks
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
      finally {
        setInitialRefresh(true);
      }
      //fetch other tasks
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IDs]);

  const [isError, setIsError] = useState(false);

  const handleSprintAdd = (pbi: ISprint) => {
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
      setIsAddModalVisible(false);
      setIsError(true);
    }
  };
  useEffect(() => {
    if (error.hasError && !loading && isError) {
      setIsAddModalVisible(true);
      setIsError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
 
  const sprintColumns = [
    {
      title: 'Name', colSpan: 1, dataIndex: 'sprintNumber', key: 'sprintNumber',
      render: (sprintNumber: number) => {
        return (sprintNumber === 0 ? "Product Backlog" : (<Button type="link" onClick={()=>{localStorage.setItem("sprintID", JSON.stringify(sprintNumber));
        navigate(`/${(ownerName as string).split("/")[0]}/${(ownerName as string).split("/")[1]}/sprints/${sprintNumber}`, { replace: true });}}>{"Sprint " + sprintNumber}</Button>))
      },
    },
    {
      title: 'Action', colSpan: 1, align: "right" as const, key: 'operation', render: (record:ISprint) => {
        return (record.sprintNumber !== 0 &&<Button type="link" onClick={() => {setSelectedSprint(record); setIsUpdateModalVisible(true);}} >
          {"Update"}
        </Button>)
      }
      ,
    }
  ];
  const onSearch = (value: any) => { };//console.log(value);

  const fixedComponents = {
    body: {
      row: NonDraggableBodyRow,
    },
  };
  //console.log(loading+"/"+refreshRequired+"/"+ sprintRefreshRequired +"/"+  initialRefresh);
  //console.log(fetchPBIs+"/"+fetchSprints+"/"+ fetchSprintsPBI +"/"+  fetched);
  //console.log(IDs);
  if (!state.isLoggedIn) { return <Navigate to="/login" />; }
  return (
    <>
      <Space direction="horizontal"
        style={{ marginLeft: "2%", marginRight: "2%" }}>
        <Search placeholder="input search text" onSearch={onSearch} enterButton />
        <Button onClick={() => setIsAddModalVisible(true)}>{"Create Sprint"}</Button>
        <Button onClick={() => setIsAddPBIModalVisible(true)}>{"Add Product Backlog Item"}</Button>

      </Space>
      {sprintPage && sprintPage.list && pbiPage && pbiPage.list &&
        //<DndProvider backend={HTML5Backend}>
        <Table
          //components={fixedComponents}
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
        //</></DndProvider>
      }
      {isAddModalVisible && !loading && <CustomAddSprintPopup error={error.erorMessage} data={initSprint} pbiData={pbiPage.list as IProductBacklogItem[]} visible={isAddModalVisible}
        onCreate={function (values: any): void { handleSprintAdd(values) }}
        onCancel={() => { setIsAddModalVisible(false); }} />}
        {isAddPBIModalVisible && <CustomAddPopup data={initAddPBI} visible={isAddPBIModalVisible}
              onCreate={function (values: any): void { handleAddPBI(values) }}
              onCancel={() => { setIsAddPBIModalVisible(false); }} />}
      {isEditModalVisible && selectedPBI && selectedPBI.id && <CustomEditPopup data={selectedPBI as IAddPBI} visible={isEditModalVisible}
        onCreate={function (values: any): void { handleEditPBI(values) }}
        onCancel={() => { setIsEditModalVisible(false); }} />}
      {isEstimateModalVisible && selectedPBI && selectedPBI.id && <CustomEstimatePopup data={selectedPBI as IProductBacklogItem} visible={isEstimateModalVisible}
        onCreate={function (values: any): void { handleEstimatePBI(values) }}
        onCancel={() => { setIsEstimateModalVisible(false); }} />}
        {isAddTaskModalVisible && <CustomAddTaskPopup data={{ name: "" } as IFilters} visible={isAddTaskModalVisible}
            onCreate={function (values: any): void { handleAddTask(values) }}
            onCancel={() => { setIsAddTaskModalVisible(false); }} />}
        {isUpdateModalVisible && !loading && <CustomUpdateSprintPopup data={selectedSprint} pbiData={pbiPage.list as IProductBacklogItem[]} visible={isUpdateModalVisible}
          onCreate={function (values: any): void { handleUpdatePBI(values) }}
          onCancel={() => { setIsUpdateModalVisible(false); }} />}   
          {isAssignTaskModalVisible && pbiPage && <CustomAssignTaskPopup error={error.erorMessage} pbiData={pbiPage.list as IAssignPBI[] as ICheckedAssignPBI[]} visible={isAssignTaskModalVisible}
            onCreate={function (values: any): void { handleAssignTask(values) }}
            onCancel={() => { setIsAssignTaskModalVisible(false); }} />}
            </>
  );
};