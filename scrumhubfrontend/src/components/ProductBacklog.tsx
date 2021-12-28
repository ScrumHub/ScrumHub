import React, { useState, useRef, useContext, useEffect } from 'react';
import { Button, Tag, message, Dropdown, Badge } from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import * as Actions from '../appstate/actions';
import { IAddPBI, ICheckedProductBacklogItem, IFilters, IPeopleList, IPerson, IProductBacklogItem, IProductBacklogList, ISprint, ISprintList, ITask, State } from '../appstate/stateInterfaces';
import 'antd/dist/antd.css';
import moment from 'moment';
import './ProductBacklog.css';
import { store } from '../appstate/store';
import { AuthContext } from '../App';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router';
import { EditPBIPopup } from './popups/EditPBIPopup';
import { EstimatePBIPopup } from './popups/EstimatePBIPopup';
import { UpdateSprintPopup } from './popups/UpdateSprintPopup';
import { AddTaskPopup } from './popups/AddTaskPopup';
import { initModalVals } from './utility/commonInitValues';
import { BodyRowProps, IModals, IRowIds } from './utility/commonInterfaces';
import { dateFormat, useIsMounted, canDropPBI, canDropTask, } from './utility/commonFunctions';
import { taskStatusCol, taskGhLinkCol, taskNameCol, pbiProgressCol, backlogColors, backlogPriorities, pbiProgressCol2 } from './utility/BodyRowsAndColumns';
import TaskTableComponent from './BacklogTaskTableComponent';
import PBITableComponent from './BacklogPBITableComponent';
import { MenuWithPeopleSave } from './utility/LoadAnimations';
import { CalendarOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import SprintTableComponent from './BacklogSprintTableComponent';
import { initPBIFilter } from '../appstate/initStateValues';
import { CompleteSprintPopup } from './popups/CompleteSprint';
export const type = 'DraggableBodyRow';

export const ProductBacklog: React.FC<any> = (props: any) => {
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
  const [selectedPBI, setSelectedPBI] = useState({} as IProductBacklogItem);
  const [selectedSprint, setSelectedSprint] = useState({} as ISprint);
  const [selectedTask, setSelectedTask] = useState({} as ITask);
  const [isModal, setIsModal] = useState<IModals>(initModalVals);
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  message.config({ maxCount: 1 });

  const addTaskToPBI = (input: IFilters) => {
    setIsModal({ ...isModal, addTask: false });
    try {
      store.dispatch(Actions.addTaskThunk({ token: token, ownerName: ownerName, pbiId: selectedPBI.id, name: input.name }) //filters
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
      store.dispatch(Actions.assignTaskToPBIThunk({ token: token, ownerName: ownerName, pbiId: ids.length > 1 ? 0 : ids[0], taskId: selectedTask.id, }));
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
      store.dispatch(Actions.estimatePBIThunk({ ownerName: ownerName, token: token, pbiId: selectedPBI.id, hours: pbi.expectedTimeInHours }));
    } catch (err) { console.error("Failed to estimate the pbis: ", err); }
    finally {
      if (isMounted()) {
        setIsModal({ ...isModal, estimatePBI: false });
        setSelectedPBI({} as IProductBacklogItem);
      }
    }
  };
  const editPBI = (pbi: IAddPBI) => {
    setIsModal({ ...isModal, editPBI: false });//check if all elements of acceptanceCriteria array are defined    
    pbi.acceptanceCriteria = pbi.acceptanceCriteria.filter((value: any) => { return (typeof (value) === "string"); });
    try {
      store.dispatch(Actions.editPBIThunk({ ownerName: ownerName, token: token, pbi: pbi, pbiId: selectedPBI.id, }));
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
      store.dispatch(Actions.deletePBIThunk({ ownerName: ownerName, token: token, pbild: item.id as number }) //filters
      );
    } catch (err) { console.error("Failed to add the repos: ", err); }
    finally {
      if (isMounted()) {
        setSelectedPBI({} as IProductBacklogItem);
        message.success(item.name + " was deleted");
        setInitialRefresh(true);
      }
    }
  };
  const updateSprint = (sprint: ISprint) => {
    setIsModal({ ...isModal, updateSprint: false });
    const sprintID = selectedSprint.sprintNumber;
    const ids = sprint.backlogItems.map((value: IProductBacklogItem) => { return ((value.sprintNumber === Number(sprintID) ? value.id.toString() : "")) }).filter((x) => x !== "");
    try {
      store.dispatch(Actions.updateOneSprintThunk({
        token: token as string,
        ownerName: ownerName,
        sprintNumber: Number(sprintID),
        sprint: {
          "title": sprint.title,
          "finishDate": moment((sprint.finishDate as any)._d).format("YYYY-MM-DDTHH:mm:ss") + "Z", "goal": sprint.goal, "pbIs": ids
        }
      }));
    } catch (err) {
      console.error("Failed to update the pbis: ", err);
    }
    finally {
        setSelectedSprint({} as ISprint);
    }
  };
  const completeSprint = (value: boolean) => {
    setIsModal({ ...isModal, updateSprint: false });
    const sprintID = selectedSprint.sprintNumber;
      store.dispatch(Actions.completeOneSprintThunk({
        token: token,
        ownerName: ownerName,
        sprintNumber: Number(sprintID),
        isFailure: value
      })).then((response)=>{setSelectedSprint({} as ISprint);});
  };
  const updatePBI = (pbiId: number, oldSprintId: number, newSprintId: number) => {
    if (oldSprintId !== 0) {
      const oldSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === oldSprintId);
      const oldPbis = oldSprint?.backlogItems.map((i: IProductBacklogItem) => { return ((i.id !== pbiId ? i.id.toString() : "")) }).filter((x: string) => x !== "");
      store.dispatch(Actions.updateOneSprintThunk({
        token: token, ownerName: ownerName, sprintNumber: oldSprintId, sprint:
        {
          "goal": oldSprint?.goal as string,
          "title": oldSprint?.title,
          "pbIs": oldPbis as string[],
          "finishDate": new Date(oldSprint?.finishDate as string)
        }
      }))
        .then((response) => { if (response.payload && response.payload?.code === 200 && newSprintId === 0) { setInitialRefresh(true) } });
    }
    if (newSprintId !== 0) {
      const newSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === newSprintId);
      const newPbis = newSprint?.backlogItems.map((i: IProductBacklogItem) => { return (i.id.toString()) }).concat([pbiId.toString()]);
      store.dispatch(Actions.updateOneSprintThunk({
        token: token, ownerName: ownerName, sprintNumber: newSprintId, sprint:
        {
          "goal": newSprint?.goal as string, "pbIs": newPbis as string[], "title": newSprint?.title,
          "finishDate": new Date(newSprint?.finishDate as string)
        }
      }))
        .then((response) => { if (response.payload && response.payload?.code === 200) { setInitialRefresh(true) } });
    }
  }
  const updateTask = (pbiId: number, taskId: number) => {
    try {
      store.dispatch(Actions.assignTaskToPBIThunk({ token: token, ownerName: ownerName, pbiId: pbiId, taskId: taskId, }));
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally {
      if (isMounted()) {
        setInitialRefresh(true);
      }
    }
  }
  const assignPerson = (person: string, taskId: number, taskPeople: IPerson[]) => {
    const names = taskPeople.map((item: IPerson) => { return (item.login) });
    try {
      store.dispatch(taskPeople.length < 1 || !names.includes(person) ?
        Actions.assignPersonToTaskThunk({ token: token, ownerName: ownerName, login: person, taskId: taskId, }) :
        Actions.unassignPersonToTaskThunk({ token: token, ownerName: ownerName, login: person, taskId: taskId, }));
    } catch (err) { console.error("Failed to add the pbis: ", err); }
  }
  const DraggableBodyRow = ({ index: index_row, bodyType, record, className, style, ...restProps }: BodyRowProps) => {
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
        if (typeof (index_row) !== "undefined") {
          if (!item.record.estimated) {
            message.info("Cannot assign not estimated pbi", 5);
          }
          else if (item.bodyType === "IProductBacklogItem" && canDropPBI(item.index, item.record.sprintNumber, record.sprintNumber)) {
            updatePBI(item.index, item.record.sprintNumber, record.sprintNumber);
          }
          else if (item.bodyType === "ITask" && canDropTask(record.pbiID, item.index, item.record.pbiID)) {
            updateTask(record.pbiID, item.index);
          }
          else if (item.bodyType === "ITask" && record.pbiID === -2 && record.sprintNumber === 0 && item.index !== -2 && item.record.pbiID !== -2) {
            updateTask(0, item.index);
          }
        }
      },
    });
    const isDraggable = index_row !== 0 && bodyType !== "ISprint" && index_row !== undefined;
    const [, drag] = useDrag({
      type,
      item: { index: index_row, bodyType: bodyType, record: record as IRowIds },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: isDraggable
    });
    drop(drag(ref));
    return (
      <tr
        ref={ref as any}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{ cursor: isDraggable ? "move" : "default", ...style }}
        {...restProps}
      />
    );
  };
  const nestedcomponents = { body: { row: DraggableBodyRow, }, };
  const taskColumns = [taskNameCol, taskStatusCol,
    {
      key: "isAssignedToPBI", title: "Assignees", width: "15%",
      render: (record: ITask) => {
        return (
          <Dropdown.Button style={{ cursor: "pointer" }} placement='bottomCenter' type="text"
            overlay={<MenuWithPeopleSave itemSelected={function (person: string): void { assignPerson(person, record.id, record.assigness) }} visible={true} people={people} taskPeople={record.assigness} />}
            buttonsRender={() => [
              <></>, React.cloneElement(<span>
                <Badge size='small'
                  status={typeof record.assigness !== "undefined" && record.assigness.length > 0 ? "success" : "error"} />
                {typeof record.assigness !== "undefined" && record.assigness.length > 0
                  ? (record.assigness.at(0).login as string) + " " : "Not Assigned "}
                <DownOutlined />
              </span>),]} > </Dropdown.Button>)
      },
      align: "center" as const,
    }, taskGhLinkCol,];
  const TaskTableforPBI: React.FC<IProductBacklogItem> = (item: IProductBacklogItem) => { return (<TaskTableComponent peopleFilter={props.peopleFilter} item={item} taskColumns={taskColumns} taskComponents={nestedcomponents} />) };
  const pbiColumns = [
    {
      title: 'Name', width: "35%", sorter: {
        compare: (a: IProductBacklogItem, b: IProductBacklogItem) => a.priority - b.priority,
        multiple: 1,
      }, align: "left" as const, key: 'name', render: (item: IProductBacklogItem) => { return (<div className={item.id === 0 ? '' : 'link-button'} onClick={() => { if (item.id !== 0) { setSelectedPBI(item); setIsModal({ ...isModal, editPBI: true }); } }}>{item.name}</div>) },
    },
    pbiProgressCol, pbiProgressCol2,
    {
      title: 'Priority', sorter: {
        compare: (a: IProductBacklogItem, b: IProductBacklogItem) => a.priority - b.priority,
        multiple: 1,
      }, align: "center" as const, width: "15%", key: 'pbiPriority',
      render: (item: IProductBacklogItem) => item.id !== 0 ? <Tag style={{ cursor: "pointer" }} color={backlogColors[item.priority % 3]}>{backlogPriorities[item.priority % 3]}</Tag> : <></>
    },
    {
      title: 'Story Points', sorter: {
        compare: (a: IProductBacklogItem, b: IProductBacklogItem) => a.priority - b.priority,
        multiple: 1,
      }, width: "20%", key: 'storyPoints', align: "center" as const, render: (item: IProductBacklogItem) => {
        return (item.id !== 0 && <Tag style={{ cursor: "pointer" }} color={item.estimated ? (item.expectedTimeInHours > 10 ? "red" : "green") : "purple"} onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, estimatePBI: true }); }}>
          {item.estimated ? (item.expectedTimeInHours + " SP ") : "Not estimated "}{<EditOutlined />}</Tag>)
      }
    },
    {
      title: '', align: "right" as const, width: "15%", key: 'actions', render: (item: IProductBacklogItem) => {
        return ({
          children: <span style={{ alignItems: "flex-end" }}>
            <Button size='small' type="link" onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, addTask: true }); }} >
              {"Add Task"}</Button></span>, props: { colSpan: 1 }
        })
      }
    },];
  const PBITableforSprint: React.FC<ISprint> = (item: ISprint) => {
    return (<PBITableComponent TaskTableforPBI={TaskTableforPBI} nameFilter={props.nameFilter} peopleFilter={props.peopleFilter}
      item={item} pbiColumns={pbiColumns} nestedcomponents={nestedcomponents} />)
  };
  useEffect(() => {
    if (initialRefresh && isMounted()) {
      store.dispatch(Actions.clearPBIsList());
      store.dispatch(Actions.clearSprintList());
      localStorage.removeItem("sprintID");
      if (isMounted()) { setInitialRefresh(false); }
    }
  }, [initialRefresh, isMounted]);
  
  useEffect(() => {
    if (refreshRequired && ownerName && ownerName !== "") {
      store.dispatch(Actions.fetchPBIsThunk({
        ownerName: ownerName, token: token,
        filters: {
          ...initPBIFilter,
          inSprint: false,
          onePage: true
        }
      })).catch((error) => { console.error("Failed to fetch the pbis: ", error); return ({}); }).then(() => {
        store.dispatch(Actions.addTasksToPBIThunk({ token: token, ownerName: ownerName, pbiId: 0 }));
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired]);
  useEffect(() => {
    if (sprintRefreshRequired && ownerName && ownerName !== "") {
      store.dispatch(Actions.fetchSprintsThunk({ token: token, ownerName: ownerName as string, filters: { ...initPBIFilter, onePage: true } }));
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintRefreshRequired]);

  const sprintColumns = [
    {
      title: 'Title', width: "15%", align: "left" as const, key: 'sprintNumber',
      render: (s: ISprint) => {
        return (s.sprintNumber === 0 ? <div key={"sprintName" + s.sprintNumber} style={{ display: "inline-block" }} >{s.title}</div> : (<div key={"sprintName" + s.sprintNumber} className='link-button' style={{ display: "inline-block" }} onClick={() => {
          localStorage.setItem("sprintID", JSON.stringify(s.sprintNumber));
          navigate(`/${(ownerName as string).split("/")[0]}/${(ownerName as string).split("/")[1]}/Sprints/${s.sprintNumber}`, { replace: true });
        }}>{s.title}</div>))
      },
    },
    {
      title: 'Deadline', width: "15%", align: "left" as const, dataIndex: 'finishDate', key: 'finishDate',
      render: (date: string) =>date ?  <span><CalendarOutlined></CalendarOutlined>{" "+dateFormat(date as unknown as Date)}</span> : ""
    },
    {
      title: 'Goal', width: "50%", align: "center" as const, dataIndex: 'goal', key: 'sprintTitle',
    },
    {
      key: "isCompleted", title: "completed", width: "15%",
      render: (record: ISprint) => {
        return (record.sprintNumber !==0 &&(record.isCompleted?<Tag color={record.status === "Failed" ?"red":"green"}><span>
        {record.status.replace("Not","Not ").replace("In", "In ")}</span></Tag>: <Tag style={{cursor:"pointer"}} onClick={()=>{setSelectedSprint(record); setIsModal({ ...isModal, completeSprint: true });}} color="geekblue"><span>
          {record.status.replace("Not","Not ").replace("In", "In ")} <EditOutlined/></span></Tag>))},
      align: "center" as const,
    },
    {
      title: 'Action', width: "10%", align: "right" as const, key: 'action', render: (record: ISprint) => {
        return (record.sprintNumber !== 0 ? <Button key={"action" + record.sprintNumber} size='small' type="link" onClick={() => { setSelectedSprint(record); setIsModal({ ...isModal, updateSprint: true }); }} >
          {"Update"}</Button> : <></>)
      },
    }];
    console.log(loading);
    console.log(selectedSprint);
  return (<div className='backlogScroll'>
    <SprintTableComponent nameFilter={props.nameFilter} key={0} keys={0} peopleFilter={props.peopleFilter} loading={refreshRequired || initialRefresh} data={[{
      goal: "",finishDate: "",isCurrent: false,status: "",isCompleted: false, sprintNumber: 0,title: "Product Backlog", backlogItems: pbiPage.list
    } as ISprint] as ISprint[]}
      components={nestedcomponents} columns={sprintColumns} PBITableforSprint={PBITableforSprint} />
    {(sprintPage.list.length > 1 ? sprintPage.list.slice().sort((a:ISprint, b:ISprint) => b.sprintNumber - a.sprintNumber):sprintPage.list).map((sprint, key) => {
      return (<SprintTableComponent key={sprint.sprintNumber} keys={sprint.sprintNumber} nameFilter={props.nameFilter} peopleFilter={props.peopleFilter} loading={sprintRefreshRequired || initialRefresh}
        data={[sprint] as ISprint[]} components={nestedcomponents} columns={sprintColumns} PBITableforSprint={PBITableforSprint} />)
    })}
    {isModal.editPBI && selectedPBI && selectedPBI.id && <EditPBIPopup data={selectedPBI as IAddPBI} visible={isModal.editPBI}
      onCreate={function (values: any): void { editPBI(values) }} onDelete={() => { deletePBI(selectedPBI) }}
      onCancel={() => { setIsModal({ ...isModal, editPBI: false }); }} />}
    {isModal.estimatePBI && selectedPBI && selectedPBI.id && <EstimatePBIPopup data={selectedPBI as IProductBacklogItem} visible={isModal.estimatePBI}
      onCreate={function (values: any): void { estimatePBI(values) }} onCancel={() => { setIsModal({ ...isModal, estimatePBI: false }); }} />}
    {isModal.addTask && <AddTaskPopup data={{ name: "" } as IFilters} visible={isModal.addTask}
      onCreate={function (values: any): void { addTaskToPBI(values); }} onCancel={() => { setIsModal({ ...isModal, addTask: false }); }} />}
    {isModal.updateSprint && !loading && <UpdateSprintPopup data={selectedSprint} visible={isModal.updateSprint} onCreate={function (values: any): void { updateSprint(values) }}
      onCancel={() => { setIsModal({ ...isModal, updateSprint: false }); }} />}
      {isModal.completeSprint && !loading && <CompleteSprintPopup data={selectedSprint} visible={isModal.completeSprint} onComplete={function (value: boolean): void {completeSprint(value) }}
      onCancel={() => { setIsModal({ ...isModal, completeSprint: false }); }} />}
  </div>
  );
};
