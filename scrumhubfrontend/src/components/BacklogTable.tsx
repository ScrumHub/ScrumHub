import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { Button, Space, Table, Input, Popconfirm, Select, Dropdown, InputNumber, Menu, Avatar, Statistic, Card, Progress, Tag } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as Actions from '../appstate/actions';
import { BodyRowTypes, IAddPBI, IAssignPBI, ICheckedAssignPBI, ICheckedProductBacklogItem, IFilters, initAddPBI, initPBIFilter, initPeopleList, initSprint, IPBIFilter, IPeopleList, IPerson, IProductBacklogItem, IProductBacklogList, ISprint, ISprintList, ITask, IUpdateIdSprint, State } from '../appstate/stateInterfaces';
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
import { initIDs, initModalVals, initRowIds } from './utility/commonInitValues';
import { BodyRowProps, IModals, IRowIds } from './utility/commonInterfaces';
import { useIsMounted, validate, validatePBIDrag, validateTaskDrag, } from './utility/commonFunctions';
import { taskAssigneeCol, taskFinishCol, taskGhLinkCol, taskNameCol, pbiPriorityCol, pbiProgressCol } from './utility/BodyRowsAndColumns';
import { Option } from 'antd/lib/mentions';
import TaskTableComponent from './TaskTableComponent';
import PBITableComponent from './PBITableComponent';
import MenuItem from 'antd/lib/menu/MenuItem';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { MenuWithPeople } from './utility/LoadAnimations';
import { PokerCard } from './PokerCard';
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
          sprint: { "goal": pbi.goal, "pbIs": ids } as IUpdateIdSprint
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
  const moveRow = useCallback(
    (dragIndex: any, hoverIndex: any) => {
      //console.log(dragIndex);
      //console.log(hoverIndex);
      /*const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );*/
    },
    [sprintPage.list, pbiPage]
  );

  const updatePBI = (pbiId: number, oldSprintId: number, newSprintId: number) => {
    try {
      if (oldSprintId !== 0) {
        const oldSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === oldSprintId);
        const oldPbis = oldSprint?.backlogItems.map((i: IProductBacklogItem) => { return ((i.id !== pbiId ? i.id.toString() : "")) }).filter((x: string) => x !== "");
        store.dispatch(
          Actions.updateOneSprintThunk({
            token: token,
            ownerName: ownerName,
            sprintNumber: oldSprintId,
            sprint: { pbIs: oldPbis as string[], goal: oldSprint?.goal as string }
          }) //filters
        );
      }
      if (newSprintId !== 0) {
        const newSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === newSprintId);
        const newPbis = newSprint?.backlogItems.map((i: IProductBacklogItem) => { return (i.id.toString()) }).concat([pbiId.toString()]);
        store.dispatch(
          Actions.updateOneSprintThunk({
            token: token,
            ownerName: ownerName,
            sprintNumber: newSprintId,
            sprint: { pbIs: newPbis as string[], goal: newSprint?.goal as string }
          }) //filters
        );
      }
    }
    catch {
      console.error(error.erorMessage);
    }
    finally {
      if (isMounted()) {
        setInitialRefresh(true);
      }
    }
  }

  const updateTask = (pbiId: number, taskId: number) => {
    try {
      store.dispatch(
        Actions.assignTaskThunk({
          token: token,
          ownerName: ownerName,
          pbiId: pbiId,
          taskId: taskId,
        }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally {
      if (isMounted()) {
        setInitialRefresh(true);
      }
    }
  }

  const DraggableBodyRow = ({ index: index_row, bodyType, record, className, style, ...restProps }: BodyRowProps) => {
    const ref = useRef();
    //console.log(record);
    //["data-row-key"]);
    //console.log(typeof(restProps));
    //data-row-key
    //console.log(typeof(index_row)!=="undefined"?index_row:"");
    //console.log(typeof(restProps)!==undefined?restProps:"");
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
        if (typeof (index_row) !== "undefined" && isMounted()) {
          //console.log(restProps);
          if (item.bodyType === "IProductBacklogItem" && validatePBIDrag(item.index, item.record.sprintNumber, record.sprintNumber)) {
            updatePBI(item.index, item.record.sprintNumber, record.sprintNumber);
          }
          else if (item.bodyType === "ITask" && validateTaskDrag(record.pbiID, item.index)) {
            updateTask(record.pbiID, item.index);
          }
          console.log(record);
          console.log(item);
          const r = record;
          //console.log(r);
          //console.log(item);
          //console.log(index_row);

          //updateRow(r, item, index_row, bodyType);
        }
        //moveRow(item.index, index_row);
        //setIDs({ ...IDs, dropped: true });
      },
    });
    const [, drag] = useDrag({
      type,
      item: { index: index_row, bodyType: bodyType, record: record as IRowIds },
      collect: monitor => ({
        isDragging: monitor.isDragging(),

      }),
      canDrag: index_row !== 0 && bodyType !== "ISprint" && index_row !== undefined
    });
    //if(index_row !== 0 && bodyType !== "ISprint") {drop(drag(ref))};
    drop(drag(ref));
    return (
      <tr
        ref={ref as any}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{ cursor: index_row !== 0 && bodyType !== "ISprint" && index_row !== undefined ?"move":"default", borderRadius: "0 10px 10px 0", ...style }}
        {...restProps}
      />
    );
  };

  const nestedcomponents = {
    body: {
      row: DraggableBodyRow,
    },
  };
  const taskColumns = [
    taskNameCol,
    taskFinishCol,
    taskAssigneeCol,
    taskGhLinkCol,
    {
      title: 'Action', dataIndex: "", align: "right" as const, key: 'operation', render: (record: ITask) => {
        return (<Button size='small' type="link" onClick={() => { setSelectedTask(record); setIsModal({ ...isModal, assgnTask: true }); }} >
          {"Move PBI"}
        </Button>)
      }
    },
    {
      title: 'Assign', colSpan: 1, align: "right" as const, key: 'operation', render: (record: ITask) => {
        return (<Select
          size='small'
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
              </Option>);
          })
          }
        </Select>)
      }
    }
  ];
  const TaskTableforPBI: React.FC<IProductBacklogItem> = (item: IProductBacklogItem) => {
    return (
      <TaskTableComponent item={item} taskColumns={taskColumns} taskComponents={nestedcomponents} />
    )
  };
  const pbiColumns = [
    {title: 'Name',  align: "left" as const,fixed:"left" as const, colSpan: 2,  key: 'name', render: (item: IProductBacklogItem) => { return ({ children: 
    <div className={item.id===0 ?'':'link-button'} onClick={() => { if(item.id!==0){setSelectedPBI(item); setIsModal({ ...isModal, editPBI: true });} }} style={{ display: "inline-block"}}>{item.name}</div>, props: { colSpan: 2  } }) },},
    pbiPriorityCol,
    {
      title: 'Story Points', colSpan: 1, key: 'operation', align: "center" as const, render: (item: IProductBacklogItem) => {
        return (item.id !== 0 &&<Tag style={{cursor:"default"}} color={item.expectedTimeInHours>10?"red":"green"} onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, estimatePBI: true }); }}>
          {item.expectedTimeInHours+" Story Point"+(item.expectedTimeInHours!==1?"s":"")}
        {/*<Progress size='small' width={30} type="circle" percent={100} status={item.expectedTimeInHours>10?'exception':'normal'} format={()=>item.expectedTimeInHours}>{/*<Statistic  title={"Story Points"} value={item.expectedTimeInHours}></Statistic></Progress>*/}
        </Tag>
       )
      }
    },
    pbiProgressCol,
    /*{
      title: 'Delete', align: "center" as const, colSpan: 1, key: 'delete', render: (item: IProductBacklogItem) => {
        return (item.id !== 0 && <span>
          <Popconfirm
            title="Are you sure you want to delete this?"
            onConfirm={() => { setSelectedPBI(item); deletePBI(item); }}
            okText="Yes"
            cancelText="No"
          ><Button size='small' type="link">
              {"Delete"}</Button>
          </Popconfirm></span>)
      }
    },*/
    {
      title: 'Action', align: "right" as const, colSpan: 1, key: 'actions', render: (item: IProductBacklogItem) => {
        return ({
          children: <span style={{ alignItems: "flex-end" }}>
            {/*item.id !== 0 && <Button size='small' type="link" onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, estimatePBI: true }); }} >
              {"Estimate"}
        </Button>*/}
            {/*item.id !== 0 && <Button size='small' type="link" onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, editPBI: true }); }} >
              {"Edit"}
      </Button>*/}
            <Button size='small' type="link" onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, addTask: true }); }} >
              {"Add Task"}
            </Button>
          </span>, props: { colSpan: 1 }
        })
      }
    },
  ];
  const PBITableforSprint: React.FC<ISprint> = (item: ISprint) => {
    return (
      <PBITableComponent TaskTableforPBI={TaskTableforPBI} item={item} pbiColumns={pbiColumns} nestedcomponents={nestedcomponents} />
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
              sprint: { pbIs: oldPbis as string[], goal: oldSprint?.goal as string }
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
              sprint: { pbIs: newPbis as string[], goal: newSprint?.goal as string },
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
        return (sprintNumber === 0 ? <div style={{ display: "inline-block" }} >{"Product Backlog"}</div> : (<div className='link-button' style={{ display: "inline-block" }} onClick={() => {
          console.log("clicked");
          localStorage.setItem("sprintID", JSON.stringify(sprintNumber));
          navigate(`/${(ownerName as string).split("/")[0]}/${(ownerName as string).split("/")[1]}/sprints/${sprintNumber}`, { replace: true });
        }}>{"Sprint " + sprintNumber}</div>))
      },
    },
    {
      title: 'Action', colSpan: 1, align: "right" as const, key: 'operation', render: (record: ISprint) => {
        return (record.sprintNumber !== 0 && <Button size='small' type="link" onClick={() => { setSelectedSprint(record); setIsModal({ ...isModal, updateSprint: true }); }} >
          {"Update"}
        </Button>)
      },
    }
  ];

  const updateRow = (record: any, item: any, index_row: any, bodyType: string) => {
    console.log("sprint");
  };

  const onSearch = (value: string) => { setFiltersPBI({ ...filterPBI, nameFilter: value }); filterPBI.nameFilter !== "" ? setInitialRefresh(true) : <></>; };
  if (!state.isLoggedIn) { return <Navigate to="/login" />; }

  return (
    <>

      {/*sprintPage && sprintPage.list && pbiPage && pbiPage.list && people && people.list.length > 0 &&
      <DndProvider backend={HTML5Backend} key={"sprint"}>
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
        </DndProvider>
        
        */}
      {pbiPage && pbiPage.list && people && people.list.length > 0 &&
        <DndProvider backend={HTML5Backend} key={"sprint"}>
          <Table
            style={{ borderSpacing: "separate", marginLeft: "2%", marginRight: "2%", marginTop: "1px", marginBottom: "3px", height: "auto" }}
            scroll={{ x: 800 }}
            size="small"
            loading={loading}
            showHeader={false}
            pagination={false}
            components={nestedcomponents}
            dataSource={([{ sprintNumber: 0, goal: "Product Backlog", backlogItems: pbiPage.list } as ISprint] as ISprint[])}
            columns={sprintColumns}
            rowKey={(record: ISprint) => record.sprintNumber}
            expandable={{
              expandedRowRender: PBITableforSprint, defaultExpandAllRows: false,
              rowExpandable: record => record.backlogItems && record.backlogItems.length > 0, defaultExpandedRowKeys: [0, 1]
            }}
            /*onRow={(record) => {
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
            }}*/
            onRow={(row, id) => {
              const index = row.sprintNumber; const record = { ...initRowIds, sprintNumber: row.sprintNumber }; const bodyType = "ISprint"; return ({
                index,
                record,
                bodyType
              }) as any;
            }}
          />
        </DndProvider>

      }
      {sprintPage && sprintPage.list && people && people.list.length > 0 &&
        sprintPage.list.map((sprint) => {
          return (
            <DndProvider backend={HTML5Backend} key={"sprint" + sprint.sprintNumber}>
              <Table
                style={{ borderSpacing: "separate", marginLeft: "2%", marginRight: "2%", marginBottom: "3px", height: "auto" }}
                scroll={{ x: 800 }}
                size="small"
                loading={loading || sprintRefreshRequired || initialRefresh || fetchSprints || fetchSprintsPBI}
                showHeader={false}
                pagination={false}
                dataSource={[sprint]}
                columns={sprintColumns}
                components={nestedcomponents}
                rowKey={(record: ISprint) => record.sprintNumber}
                expandable={{
                  expandedRowRender: PBITableforSprint, defaultExpandAllRows: false,
                  rowExpandable: record => record.backlogItems && record.backlogItems.length > 0, defaultExpandedRowKeys: [0, 1]
                }}
                /*onRow={(record) => {
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
                }}*/
                onRow={(row, id) => {
                  const index = row.sprintNumber; const record = { ...initRowIds, sprintNumber: row.sprintNumber }; const bodyType = "ISprint"; return ({
                    index,
                    record,
                    bodyType
                  }) as any;
                }}
              />
            </DndProvider>)
        })

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
      {isModal.assgnTask && pbiPage && <CustomAssignTaskPopup error={error.erorMessage} pbiData={pbiPage.list as IAssignPBI[] as ICheckedAssignPBI[]} visible={isModal.assgnTask}
        onCreate={function (values: any): void { assignTask(values) }}
        onCancel={() => { setIsModal({ ...isModal, assgnTask: false }); }} />}
    </>
  );
};

