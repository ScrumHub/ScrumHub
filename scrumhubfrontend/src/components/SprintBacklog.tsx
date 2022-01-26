/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Badge, Button, Dropdown, message, Popconfirm, Popover, Space, Tag, Typography, } from 'antd';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { IAddBI, IFilters, IPeopleList, IBacklogItem, ISprint, ITask, IState } from '../appstate/stateInterfaces';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { BranchesOutlined, CalendarOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { store } from '../appstate/store';
import {PBITableComponent} from './BacklogPBITableComponent';
import {TaskTableComponent} from './BacklogTaskTableComponent';
import { taskNameCol, taskStatusCol, taskGhLinkCol, pbiProgressCol, pbiProgressCol2, backlogPriorities, backlogColors, peopleDropdown, pbiStatusCol } from './utility/BodyRowsAndColumns';
import { canDropTask, dateFormat, isBranchNotCreated, isInReviewOrFinished, isSprintLoaded } from './utility/commonFunctions';
import SkeletonList, { PBIMenuWithPeople } from './utility/LoadAnimations';
import { assignPerson, startTask, updateTask } from './utility/BacklogHandlers';
import { BodyRowProps, IModals, IRowIds } from './utility/commonInterfaces';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import { type } from './ProductBacklog';
import { initModalVals } from './utility/commonInitValues';
import { HTML5Backend } from 'react-dnd-html5-backend';
import moment from 'moment';
import { useLocation } from 'react-router';
import { AddTaskPopup } from './popups/AddTaskPopup';
import { CompleteSprintPopup } from './popups/CompleteSprintPopup';
import { EditPBIPopup } from './popups/EditPBIPopup';
import { EstimatePBIPopup } from './popups/EstimatePBIPopup';
import { UpdateSprintPopup } from './popups/UpdateSprintPopup';
import { date } from 'joi';

export function SprintBacklog() {
  const token = useSelector((appState: IState) => appState.loginState.token);
  const pbiKeys = useSelector((appState: IState) => appState.loadingKeys.pbiKeys as number[]);
  const [infos, setInfos] = useState({
    filteredInfo: { complete: -1, pbiPriorities: [] as number[] },
    sortedInfo: { order: '', columnKey: '', },
  });
  const [filterPBI, setFiltersPBI] = useState<IFilters>({ nameFilter: "", peopleFilter: [] });
  const people = useSelector((appState: IState) => appState.people as IPeopleList);
  const [filters, setFilters] = useState<IFilters>({
    pageNumber: config.defaultFilters.page,
    pageSize: config.defaultFilters.size,
  });
  const [isModal, setIsModal] = useState<IModals>(initModalVals);
  const loading = useSelector((appState: IState) => appState.loading);
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const sprintID = localStorage.getItem("sprintID") ? Number(localStorage.getItem("sprintID")) : -1;
  const [initialRefresh, setInitialRefresh] = useState(true);
  const sprintPage = useSelector((appState: IState) => appState.openSprint as ISprint);

  const location = useLocation();
  useEffect(() => {
    if (initialRefresh) {
      //if(sprintPage===null || people === initPeopleList || (sprintID!==-1 &&sprintID !== sprintPage.sprintNumber)){
      store.dispatch(Actions.fetchOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: sprintID }));
      store.dispatch(Actions.fetchPeopleThunk({ownerName,token}));
      //}
      setInitialRefresh(false);
    }// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRefresh,location]);
  const estimatePBI = (pbi: IBacklogItem) => {
    try {
      store.dispatch(Actions.estimatePBIThunk({ ownerName: ownerName, token: token, pbiId: selectedPBI.id, hours: pbi.expectedTimeInHours }));
    } catch (err) { console.error("Failed to estimate the pbis: ", err); }
    finally {
        setIsModal({ ...isModal, estimatePBI: false });
        setSelectedPBI({} as IBacklogItem);
        setInitialRefresh(true);
    }
  };
  const editPBI = (pbi: IAddBI) => {
    setIsModal({ ...isModal, editPBI: false });//check if all elements of acceptanceCriteria array are defined    
    pbi.acceptanceCriteria = pbi.acceptanceCriteria.filter((value: any) => { return (typeof (value) === "string"); });
    try {
      store.dispatch(Actions.editPBIThunk({ ownerName: ownerName, token: token, pbi: pbi, pbiId: selectedPBI.id, }));
    } catch (err) { console.error("Failed to edit the pbis: ", err); }
    finally {
        setSelectedPBI({} as IBacklogItem);
    }
  };
  const finishPBI = (item: IBacklogItem) => {
    setIsModal({ ...isModal, editPBI: false });
      try {
        store.dispatch(
          Actions.finishPBIThunk({
            ownerName: ownerName,
            token: token,
            pbiId: item.id
          })
        );
      } catch (err) { console.error("Failed to finish the pbis: ", err); }
      finally {
        setSelectedPBI({} as IBacklogItem);
        setInitialRefresh(true);
      }}
  const deletePBI = (item: IBacklogItem) => {
    setIsModal({ ...isModal, editPBI: false });
      store.dispatch(Actions.deletePBIThunk({ ownerName: ownerName, token: token, pbiId: item.id as number }))
        .then((response: any) => {
          if (response.payload && response.payload.code === 204) {
            store.dispatch(Actions.fetchOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: sprintID }));
            setSelectedPBI({} as IBacklogItem);
          }
        })
    } 
  const updateSprint = (sprint: ISprint) => {
    setIsModal({ ...isModal, updateSprint: false });
    const sprintNr = sprintPage.sprintNumber;
    const ids = sprint.backlogItems.map((value: IBacklogItem) => { return ((value.sprintNumber === sprintNr ? value.id.toString() : "")) }).filter((x) => x !== "");
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
        setSelectedPBI({} as IBacklogItem);
    }
  };
  const [selectedPBI, setSelectedPBI] = useState({} as IBacklogItem);
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
            updateTask(record.pbiID,item.record.pbiID, item.index,pbiKeys, token, ownerName);
            setInitialRefresh(true);
          }
          else if (item.bodyType === "ITask" && record.pbiID === -2 && record.sprintNumber === 0 && item.index !== -2 && item.record.pbiID !== -2) {
            updateTask(0, item.index,item.record.pbiID,pbiKeys, token, ownerName);
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
      render: (record: ITask) => peopleDropdown(record, token, ownerName, people),
    }, {title: "Start Branch",
    key: "branch",
    width: "12%",
    align: "right" as const,
    render: (record: ITask) => isBranchNotCreated(record.status) ?
    <Popover visible={isModal.startBranchId === record.id}
    content={<><div style={{alignSelf:"center", marginBottom:"10%", textAlign:"center"}}>Start New Branch</div><Space style={{alignItems:"flex-end"}}>
      <Popconfirm title={"Are you sure you want to start a feature branch?"} onConfirm={()=>{startTask(token, ownerName, false,record.id);setIsModal({...isModal, startBranchId:-1});}}><Button key={"hotfix"} size='small' type="primary" >Feature</Button></Popconfirm>
      <Popconfirm title={"Are you sure you want to start a hotfix branch?"} onConfirm={()=>{startTask(token, ownerName, true,record.id);setIsModal({...isModal, startBranchId:-1});}}><Button key={"hotfix"} size='small' type="primary" color="deeppink">Hotfix</Button></Popconfirm>
      </Space></>}trigger="click">
    <Button key={"action" + record.id} size='small' type="link" onClick={()=>{setIsModal({...isModal, startBranchId:record.id})}}>
    <span>{"Create "}<BranchesOutlined /></span></Button></Popover> :
        <div><span hidden={isInReviewOrFinished(record.status)}>Created <BranchesOutlined /></span></div>
    },taskGhLinkCol,];
  const TaskTableforPBI: React.FC<IBacklogItem> = (item: IBacklogItem) => { return (<TaskTableComponent peopleFilter={filterPBI.peopleFilter} item={item} taskColumns={taskColumns} taskComponents={nestedcomponents} />) };
  const pbiColumns = [
    {
      title: 'Name', width: "25%", sorter: {
        compare: (a: IBacklogItem, b: IBacklogItem) => a.priority - b.priority,
        multiple: 1,
      }, align: "left" as const, key: 'name', render: (item: IBacklogItem) => { return (<div className={item.id === 0 ? '' : 'link-button'} onClick={() => { if (item.id !== 0) { setSelectedPBI(item); setIsModal({ ...isModal, editPBI: true }); } }}>{item.name}</div>) },
    },
    pbiProgressCol, pbiProgressCol2,
    {
      title: 'Priority', sorter: { compare: (a: IBacklogItem, b: IBacklogItem) => a.priority - b.priority, multiple: 1, }, align: "center" as const, width: "20%", key: 'pbiPriority',
      filters: [{ text: backlogPriorities[0], value: 0, }, { text: backlogPriorities[1], value: 1, }, { text: backlogPriorities[2], value: 2, },], onFilter: (value: any, item: IBacklogItem) => item.priority === value,
      render: (item: IBacklogItem) => item.id !== 0 ? <Tag style={{ cursor: "pointer" }} color={backlogColors[item.priority % 3]}>{backlogPriorities[item.priority % 3]}</Tag> : <Tag style={{ color: "transparent", backgroundColor: "transparent", borderColor: "transparent" }} color={backlogColors[0]}>{backlogPriorities[0]}</Tag>
    },
    pbiStatusCol,
    {
      title: 'Story Points', sorter: {
        compare: (a: IBacklogItem, b: IBacklogItem) => a.priority - b.priority,
        multiple: 1,
      }, width: "15%", key: 'storyPoints', align: "center" as const, render: (item: IBacklogItem) => {
        return (item.id !== 0 ? <Tag style={{ cursor: "pointer" }} color={item.estimated ? (item.expectedTimeInHours > 10 ? "red" : "green") : "purple"} onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, estimatePBI: true }); }}>
          {item.estimated ? (item.expectedTimeInHours + " SP ") : "Not estimated "}{<EditOutlined />}</Tag> : <Tag style={{ color: "transparent", backgroundColor: "transparent", borderColor: "transparent" }} color={backlogColors[0]}>{"Not estimated "}{<EditOutlined />}</Tag>)
      }
    },
    {
      title: 'Action', align: "center" as const, width: "15%", key: 'actions', render: (item: IBacklogItem) => {
        return (<span >
          <Button size='small' type="link" onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, addTask: true }); }} >
            {"Add Task"}</Button></span>)
      }
    },];
  return (
    <div style={{ marginLeft: "2%", marginRight: "2%", marginTop: 0, marginBottom: "1%" }}>
      <SkeletonList width={true} loading={sprintPage == null || isSprintLoaded(sprintID, sprintPage,false)} number={2} />
      <Space>
        <Typography>{isSprintLoaded(sprintID, sprintPage,true)? sprintPage.goal : ""}</Typography>
        </Space><br/><Space>
        {isSprintLoaded(sprintID, sprintPage,true) && <span><CalendarOutlined style={{color:
          moment(sprintPage.finishDate).diff(moment().endOf('day'),'day')<8?(moment(sprintPage.finishDate).diff(moment().endOf('day'),'day')<4?"red":"darkorange"):"green"}}></CalendarOutlined>{" " + dateFormat(sprintPage.finishDate as unknown as Date)}</span>}
        <Button key="1" type="link" onClick={() => { setIsModal({ ...isModal, updateSprint: true }); }}>{isSprintLoaded(sprintID, sprintPage,true) ?  "Update Sprint":""} </Button>
      </Space>
      <DndProvider backend={HTML5Backend} key={"dnd_sprint"}>
        {sprintPage && sprintPage.backlogItems  && isSprintLoaded(sprintID, sprintPage,true) && <PBITableComponent loading={loading || initialRefresh} sortedInfo={infos.sortedInfo} TaskTableforPBI={TaskTableforPBI} nameFilter={filters.nameFilter} peopleFilter={filters.peopleFilter}
          item={sprintPage} pbiColumns={pbiColumns} nestedcomponents={nestedcomponents} />}
      </DndProvider>
      {isModal.editPBI && selectedPBI && selectedPBI.id && <EditPBIPopup data={selectedPBI as IAddBI} visible={isModal.editPBI}
      onCreate={function (values: any): void { editPBI(values) }} onDelete={() => { deletePBI(selectedPBI) }} onFinish={() => { finishPBI(selectedPBI) }}
      onCancel={() => { setIsModal({ ...isModal, editPBI: false }); setSelectedPBI({} as IBacklogItem); }} />}
    {isModal.estimatePBI && selectedPBI && selectedPBI.id && <EstimatePBIPopup data={selectedPBI as IBacklogItem} visible={isModal.estimatePBI}
      onCreate={function (values: any): void { estimatePBI(values) }} onCancel={() => { setIsModal({ ...isModal, estimatePBI: false }); setSelectedPBI({} as IBacklogItem);}} />}
    {isModal.addTask && <AddTaskPopup data={{ name: "" } as IFilters} visible={isModal.addTask}
      onCreate={function (values: any): void { addTaskToPBI(values); }} onCancel={() => { setIsModal({ ...isModal, addTask: false }); }} />}
    {isModal.updateSprint && !loading && <UpdateSprintPopup data={sprintPage} visible={isModal.updateSprint} onCreate={function (values: any): void { updateSprint(values) }}
      onCancel={() => { setIsModal({ ...isModal, updateSprint: false }); }} />}
      {isModal.completeSprint && !loading && <CompleteSprintPopup data={sprintPage} visible={isModal.completeSprint} onComplete={function (value: boolean): void {completeSprint(value) }}
      onCancel={() => { setIsModal({ ...isModal, completeSprint: false }); }} />}
    </div>
  );
}