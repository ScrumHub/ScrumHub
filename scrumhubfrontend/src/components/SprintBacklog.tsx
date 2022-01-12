import React, { useContext, useEffect, useRef, useState } from 'react';
import { Badge, Button, Dropdown, message, Popconfirm, Popover, Space, Tag, Typography, } from 'antd';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { IAddPBI, IFilters, IPeopleList, IProductBacklogItem, IProductBacklogList, ISprint, ITask, State } from '../appstate/stateInterfaces';
import { AuthContext } from '../App';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { BranchesOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { store } from '../appstate/store';
import "./SprintProject.css";
import PBITableComponent from './BacklogPBITableComponent';
import TaskTableComponent from './BacklogTaskTableComponent';
import { taskNameCol, taskStatusCol, taskGhLinkCol, pbiProgressCol, pbiProgressCol2, backlogPriorities, backlogColors } from './utility/BodyRowsAndColumns';
import { canDropTask, isStatusValid } from './utility/commonFunctions';
import SkeletonList, { MenuWithPeopleSave } from './utility/LoadAnimations';
import { assignPerson, startTask, updateTask } from './utility/BacklogHandlers';
import { BodyRowProps, IModals, IRowIds } from './utility/commonInterfaces';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import { type } from './ProductBacklog';
import { initModalVals } from './utility/commonInitValues';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AddTaskPopup } from './popups/AddTaskPopup';
import { CompleteSprintPopup } from './popups/CompleteSprint';
import { EditPBIPopup } from './popups/EditPBIPopup';
import { EstimatePBIPopup } from './popups/EstimatePBIPopup';
import { UpdateSprintPopup } from './popups/UpdateSprintPopup';
import moment from 'moment';
import { useLocation } from 'react-router';

export function SprintBacklog() {
  const { state } = useContext(AuthContext);
  const { token } = state;
  const [infos, setInfos] = useState({
    filteredInfo: { complete: -1, pbiPriorities: [] as number[] },
    sortedInfo: { order: '', columnKey: '', },
  });
  const [filterPBI, setFiltersPBI] = useState<IFilters>({ nameFilter: "", peopleFilter: [] });
  const people = useSelector((appState: State) => appState.people as IPeopleList);
  const [filters, setFilters] = useState<IFilters>({
    pageNumber: config.defaultFilters.page,
    pageSize: config.defaultFilters.size,
  });
  const [isModal, setIsModal] = useState<IModals>(initModalVals);
  const tempPBIPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
  const loading = useSelector((appState: State) => appState.loading);
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const sprintID = localStorage.getItem("sprintID") ? Number(localStorage.getItem("sprintID")) : -1;
  const [initialRefresh, setInitialRefresh] = useState(true);
  const sprintPage = useSelector((appState: State) => appState.openSprint as ISprint);

  const location = useLocation();
  useEffect(() => {
    if (initialRefresh) {
      //if(sprintPage===null || people === initPeopleList || (sprintID!==-1 &&sprintID !== sprintPage.sprintNumber)){
      store.dispatch(Actions.fetchOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: sprintID }));
      store.dispatch(Actions.fetchPeopleThunk({ownerName,token}));
      //}
      setInitialRefresh(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRefresh,location]);
  const estimatePBI = (pbi: IProductBacklogItem) => {
    try {
      store.dispatch(Actions.estimatePBIThunk({ ownerName: ownerName, token: token, pbiId: selectedPBI.id, hours: pbi.expectedTimeInHours }));
    } catch (err) { console.error("Failed to estimate the pbis: ", err); }
    finally {
        setIsModal({ ...isModal, estimatePBI: false });
        setSelectedPBI({} as IProductBacklogItem);
        setInitialRefresh(true);
    }
  };
  const editPBI = (pbi: IAddPBI) => {
    setIsModal({ ...isModal, editPBI: false });//check if all elements of acceptanceCriteria array are defined    
    pbi.acceptanceCriteria = pbi.acceptanceCriteria.filter((value: any) => { return (typeof (value) === "string"); });
    try {
      store.dispatch(Actions.editPBIThunk({ ownerName: ownerName, token: token, pbi: pbi, pbiId: selectedPBI.id, }));
    } catch (err) { console.error("Failed to edit the pbis: ", err); }
    finally {
        setSelectedPBI({} as IProductBacklogItem);
    }
  };
  const finishPBI = (item: IProductBacklogItem) => {
    setIsModal({ ...isModal, editPBI: false });
      try {
        store.dispatch(
          Actions.finishPBIThunk({
            ownerName: ownerName,
            token: token,
            pbiId: item.id
          }) //filters
        );
      } catch (err) { console.error("Failed to finish the pbis: ", err); }
      finally {
        setSelectedPBI({} as IProductBacklogItem);
        setInitialRefresh(true);
      }}
  const deletePBI = (item: IProductBacklogItem) => {
    setIsModal({ ...isModal, editPBI: false });
      store.dispatch(Actions.deletePBIThunk({ ownerName: ownerName, token: token, pbiId: item.id as number }))
        .then((response: any) => {
          if (response.payload && response.payload.code === 204) {
            store.dispatch(Actions.fetchOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: sprintID }));
            setSelectedPBI({} as IProductBacklogItem);
          }
        })
    } 
  const updateSprint = (sprint: ISprint) => {
    setIsModal({ ...isModal, updateSprint: false });
    const sprintNr = sprintPage.sprintNumber;
    const ids = sprint.backlogItems.map((value: IProductBacklogItem) => { return ((value.sprintNumber === sprintNr ? value.id.toString() : "")) }).filter((x) => x !== "");
    try {
      store.dispatch(Actions.updateOneSprintThunk({
        token: token as string,
        ownerName: ownerName,
        sprintNumber: sprintNr,
        sprint: {
          "title": sprint.title,
          "finishDate": moment((sprint.finishDate as any)._d).format("YYYY-MM-DDTHH:mm:ss") + "Z", "goal": sprint.goal, "pbIs": ids
        }
      }));
    } catch (err) {
      console.error("Failed to update the pbis: ", err);
    }
  };
  const completeSprint = (value: boolean) => {
    setIsModal({ ...isModal, completeSprint: false });
    const sprintNr = sprintPage.sprintNumber;
      store.dispatch(Actions.completeOneSprintThunk({
        token: token,
        ownerName: ownerName,
        sprintNumber: sprintNr,
        isFailure: value
      }));
      setInitialRefresh(true);
  };
  const addTaskToPBI = (input: IFilters) => {
    setIsModal({ ...isModal, addTask: false });
    try {
      store.dispatch(Actions.addTaskThunk({ token: token, ownerName: ownerName, pbiId: selectedPBI.id, name: input.name }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally {
        setSelectedPBI({} as IProductBacklogItem);
    }
  };
  const [selectedPBI, setSelectedPBI] = useState({} as IProductBacklogItem);
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
          else if (item.bodyType === "ITask" && canDropTask(record.pbiID, item.index, item.record.pbiID)) {
            updateTask(record.pbiID, item.index, token, ownerName);
            setInitialRefresh(true);
          }
          else if (item.bodyType === "ITask" && record.pbiID === -2 && record.sprintNumber === 0 && item.index !== -2 && item.record.pbiID !== -2) {
            updateTask(0, item.index, token, ownerName);
            setInitialRefresh(true);
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
      key: "isAssignedToPBI", title: "Assignees", width: "22%", align: "center" as const,
      render: (record: ITask) => {
        return (
          <Dropdown.Button style={{ cursor: "pointer" }} placement='bottomCenter' type="text"
            overlay={<MenuWithPeopleSave itemSelected={function (person: string): void { assignPerson(person, record.id, record.assigness, token, ownerName);}} visible={true} people={people} taskPeople={record.assigness} />}
            buttonsRender={() => [
              <></>, React.cloneElement(<span>
                <Badge size='small'
                  status={typeof record.assigness !== "undefined" && record.assigness.length > 0 ? "success" : "error"} />
                {typeof record.assigness !== "undefined" && record.assigness.length > 0
                  ? (record.assigness.at(0).login as string) + " " : "Not Assigned "}
                <DownOutlined />
              </span>),]} > </Dropdown.Button>)
      },
    }, {title: "Start Branch",
    key: "branch",
    width: "12%",
    align: "right" as const,
    render: (record: ITask) => isStatusValid(record.status) ?
    <Popover visible={isModal.startBranchId === record.id}
    content={<><div style={{alignSelf:"center", marginBottom:"10%", textAlign:"center"}}>Start New Branch</div><Space style={{alignItems:"flex-end"}}>
      <Popconfirm title={"Are you sure you want to start a feature branch?"} onConfirm={()=>{startTask(token, ownerName, false,record.id);setIsModal({...isModal, startBranchId:-1});}}><Button key={"hotfix"} size='small' type="primary" >Feature</Button></Popconfirm>
      <Popconfirm title={"Are you sure you want to start a hotfix branch?"} onConfirm={()=>{startTask(token, ownerName, true,record.id);setIsModal({...isModal, startBranchId:-1});}}><Button key={"hotfix"} size='small' type="primary" color="deeppink">Hotfix</Button></Popconfirm>
      </Space></>}trigger="click">
    <Button key={"action" + record.id} size='small' type="link" onClick={()=>{setIsModal({...isModal, startBranchId:record.id})}}>
    <span>{"Start "}<BranchesOutlined/></span></Button></Popover>:
    <div><span><BranchesOutlined/> Created</span></div>
    },taskGhLinkCol,];
  const TaskTableforPBI: React.FC<IProductBacklogItem> = (item: IProductBacklogItem) => { return (<TaskTableComponent peopleFilter={filterPBI.peopleFilter} item={item} taskColumns={taskColumns} taskComponents={nestedcomponents} />) };
  const pbiColumns = [
    {
      title: 'Name', width: "25%", sorter: {
        compare: (a: IProductBacklogItem, b: IProductBacklogItem) => a.priority - b.priority,
        multiple: 1,
      }, align: "left" as const, key: 'name', render: (item: IProductBacklogItem) => { return (<div className={item.id === 0 ? '' : 'link-button'} onClick={() => { if (item.id !== 0) { setSelectedPBI(item); setIsModal({ ...isModal, editPBI: true }); } }}>{item.name}</div>) },
    },
    pbiProgressCol, pbiProgressCol2,
    {
      title: 'Priority', sorter: { compare: (a: IProductBacklogItem, b: IProductBacklogItem) => a.priority - b.priority, multiple: 1, }, align: "center" as const, width: "20%", key: 'pbiPriority',
      filters: [{ text: backlogPriorities[0], value: 0, }, { text: backlogPriorities[1], value: 1, }, { text: backlogPriorities[2], value: 2, },], onFilter: (value: any, item: IProductBacklogItem) => item.priority === value,
      render: (item: IProductBacklogItem) => item.id !== 0 ? <Tag style={{ cursor: "pointer" }} color={backlogColors[item.priority % 3]}>{backlogPriorities[item.priority % 3]}</Tag> : <Tag style={{ color: "transparent", backgroundColor: "transparent", borderColor: "transparent" }} color={backlogColors[0]}>{backlogPriorities[0]}</Tag>
    },
    {
      title: 'Story Points', sorter: {
        compare: (a: IProductBacklogItem, b: IProductBacklogItem) => a.priority - b.priority,
        multiple: 1,
      }, width: "15%", key: 'storyPoints', align: "center" as const, render: (item: IProductBacklogItem) => {
        return (item.id !== 0 ? <Tag style={{ cursor: "pointer" }} color={item.estimated ? (item.expectedTimeInHours > 10 ? "red" : "green") : "purple"} onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, estimatePBI: true }); }}>
          {item.estimated ? (item.expectedTimeInHours + " SP ") : "Not estimated "}{<EditOutlined />}</Tag> : <Tag style={{ color: "transparent", backgroundColor: "transparent", borderColor: "transparent" }} color={backlogColors[0]}>{"Not estimated "}{<EditOutlined />}</Tag>)
      }
    },
    {
      title: 'Action', align: "center" as const, width: "15%", key: 'actions', render: (item: IProductBacklogItem) => {
        return (<span >
          <Button size='small' type="link" onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, addTask: true }); }} >
            {"Add Task"}</Button></span>)
      }
    },];
  return (
    <div style={{ marginLeft: "2%", marginRight: "2%", marginTop: 0, marginBottom: "1%" }}>
      <SkeletonList width={true} loading={sprintPage == null || (sprintID!==-1 && sprintPage && sprintID !== sprintPage.sprintNumber)} number={2} />
      <Space>
        <Typography>{sprintPage !== null  && sprintID === sprintPage.sprintNumber? sprintPage.goal : ""}</Typography>
        <Button key="1" type="link" onClick={() => { setIsModal({ ...isModal, updateSprint: true }); }}>{sprintPage !== null&& sprintID === sprintPage.sprintNumber ?  "Update Sprint":""} </Button>
      </Space>
      <DndProvider backend={HTML5Backend} key={"dnd_sprint"}>
        {sprintPage && sprintPage.backlogItems  && (sprintID !==-1 && sprintPage && sprintID === sprintPage.sprintNumber) && <PBITableComponent loading={loading || initialRefresh} sortedInfo={infos.sortedInfo} TaskTableforPBI={TaskTableforPBI} nameFilter={filters.nameFilter} peopleFilter={filters.peopleFilter}
          item={sprintPage} pbiColumns={pbiColumns} nestedcomponents={nestedcomponents} />}
      </DndProvider>
      {isModal.editPBI && selectedPBI && selectedPBI.id && <EditPBIPopup data={selectedPBI as IAddPBI} visible={isModal.editPBI}
      onCreate={function (values: any): void { editPBI(values) }} onDelete={() => { deletePBI(selectedPBI) }} onFinish={() => { finishPBI(selectedPBI) }}
      onCancel={() => { setIsModal({ ...isModal, editPBI: false }); }} />}
    {isModal.estimatePBI && selectedPBI && selectedPBI.id && <EstimatePBIPopup data={selectedPBI as IProductBacklogItem} visible={isModal.estimatePBI}
      onCreate={function (values: any): void { estimatePBI(values) }} onCancel={() => { setIsModal({ ...isModal, estimatePBI: false }); }} />}
    {isModal.addTask && <AddTaskPopup data={{ name: "" } as IFilters} visible={isModal.addTask}
      onCreate={function (values: any): void { addTaskToPBI(values); }} onCancel={() => { setIsModal({ ...isModal, addTask: false }); }} />}
    {isModal.updateSprint && !loading && <UpdateSprintPopup data={sprintPage} visible={isModal.updateSprint} onCreate={function (values: any): void { updateSprint(values) }}
      onCancel={() => { setIsModal({ ...isModal, updateSprint: false }); }} />}
      {isModal.completeSprint && !loading && <CompleteSprintPopup data={sprintPage} visible={isModal.completeSprint} onComplete={function (value: boolean): void {completeSprint(value) }}
      onCancel={() => { setIsModal({ ...isModal, completeSprint: false }); }} />}
    </div>
  );
}
