/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { Button, Tag, message, Popover, Space, Popconfirm } from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import * as Actions from '../appstate/actions';
import { IAddBI, IFilters, IPeopleList, IPerson, IBacklogItem, IBacklogItemList, ISprint, ISprintList, ITask, IState } from '../appstate/stateInterfaces';
import 'antd/dist/antd.css';
import moment from 'moment';
import './ProductBacklog.css';
import { store } from '../appstate/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { initModalVals, pbiFilterVals } from './utility/commonInitValues';
import { BodyRowProps, IModals, IRowIds } from './utility/commonInterfaces';
import { canDropPBI, canDropTask, isArrayValid, isBranchNotCreated, isInReviewOrFinished, } from './utility/commonFunctions';
import { taskStatusCol, taskGhLinkCol, taskNameCol, pbiProgressCol, backlogColors, pbiProgressCol2, peopleDropdown, PriorityDropdown, sprintNrCol, sprintTitleCol, sprintDateCol, sprintStoryPtsCol, sprintActCol, pbiNameCol, pbiStatusCol, sprintStatusCol, pbiActionCol } from './utility/BodyRowsAndColumns';
import { PBITableComponent } from './BacklogPBITableComponent';
import { BranchesOutlined, EditOutlined } from '@ant-design/icons';
import { SprintTableComponent } from './BacklogSprintTableComponent';
import { initPBIFilter } from '../appstate/stateInitValues';
import { startTask, updatePBI, updateTask, fetchPBIsAndUnassigned } from './utility/BacklogHandlers';
import { AddTaskPopup } from './popups/AddTaskPopup';
import { CompleteSprintPopup } from './popups/CompleteSprintPopup';
import { EditPBIPopup } from './popups/EditPBIPopup';
import { EstimatePBIPopup } from './popups/EstimatePBIPopup';
import { UpdateSprintPopup } from './popups/UpdateSprintPopup';
import { TaskTableComponent } from './BacklogTaskTableComponent';
export const type = 'DraggableBodyRow';

export const ProductBacklog: React.FC<any> = React.memo((props: any) => {
  const token = useSelector((appState: IState) => appState.loginState.token);
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const sprintPage = useSelector((state: IState) => state.sprintPage as ISprintList);
  const loading = useSelector((appState: IState) => appState.loading as boolean);
  const pbiPage = useSelector((appState: IState) => appState.pbiPage as IBacklogItemList);
  const people = useSelector((appState: IState) => appState.people as IPeopleList);
  const refreshRequired = useSelector((appState: IState) => appState.productRequireRefresh as boolean);
  const sprintRefreshRequired = useSelector((appState: IState) => appState.sprintRequireRefresh as boolean);
  const [initialRefresh, setInitialRefresh] = useState(true);
  const [selectedPBI, setSelectedPBI] = useState({} as IBacklogItem);
  const [selectedSprint, setSelectedSprint] = useState({} as ISprint);
  const [isModal, setIsModal] = useState<IModals>(initModalVals);
  const navigate = useNavigate();
  message.config({ maxCount: 1 });
  console.log(initialRefresh);
  useEffect(() => {
    if (initialRefresh) {
      if (!localStorage.getItem("sprintID")) {
        store.dispatch(Actions.clearPBIsList());
        store.dispatch(Actions.clearSprintList());
      }
      localStorage.removeItem("sprintID");
      setInitialRefresh(false);
    }
  }, [initialRefresh]);
  useEffect(() => { fetchPBIsAndUnassigned(refreshRequired, ownerName, token); }, [refreshRequired]);
  useEffect(() => {
    if (sprintRefreshRequired && ownerName && ownerName !== "") {
      store.dispatch(Actions.fetchSprintsThunk({ token: token, ownerName: ownerName as string, filters: { ...initPBIFilter, onePage: true } }));
    }
  }, [sprintRefreshRequired]);
  const addTaskToPBI = (input: IFilters) => {
    setIsModal({ ...isModal, addTask: false });
    try {
      store.dispatch(Actions.addTaskThunk({ token: token, ownerName: ownerName, pbiId: selectedPBI.id, name: input.name }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally { setSelectedPBI({} as IBacklogItem); }
  };
  const estimatePBI = (pbi: IBacklogItem) => {
    try {
      store.dispatch(Actions.estimatePBIThunk({ ownerName: ownerName, token: token, pbiId: selectedPBI.id, hours: pbi.expectedTimeInHours }));
    } catch (err) { console.error("Failed to estimate the pbis: ", err); }
    finally {
      setIsModal({ ...isModal, estimatePBI: false });
      setSelectedPBI({} as IBacklogItem);
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
      //setInitialRefresh(true);
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
    }
  }
  const deletePBI = (item: IBacklogItem) => {
    setIsModal({ ...isModal, editPBI: false });
    store.dispatch(Actions.deletePBIThunk({ ownerName: ownerName, token: token, pbiId: item.id as number }))
      .then((response: any) => {
        if (response.payload && response.payload.code === 204) {
          if (item.isInSprint) { store.dispatch(Actions.clearSprintList()) }
          else {
            store.dispatch(Actions.clearPBIsList());
          } setSelectedPBI({} as IBacklogItem);
        }
      })
  }
  const updateSprint = (sprint: ISprint) => {
    setIsModal({ ...isModal, updateSprint: false });
    const sprintID = selectedSprint.sprintNumber;
    const ids = sprint.backlogItems.map((value: IBacklogItem) => { return ((value.sprintNumber === Number(sprintID) ? value.id.toString() : "")) }).filter((x) => x !== "");
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
    setIsModal({ ...isModal, completeSprint: false });
    const sprintID = selectedSprint.sprintNumber;
    store.dispatch(Actions.completeOneSprintThunk({
      token: token,
      ownerName: ownerName,
      sprintNumber: Number(sprintID),
      isFailure: value
    })).then((response: any) => { setSelectedSprint({} as ISprint); });
  };
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
            updatePBI(item.index, item.record.sprintNumber, record.sprintNumber, sprintPage, token, ownerName);
          }
          else if (item.bodyType === "ITask" && canDropTask(record.pbiID, item.index, item.record.pbiID)) {
            updateTask(record.pbiID, item.index, item.record.pbiID, pbiKeys, token, ownerName);
          }
          else if (item.bodyType === "ITask" && record.pbiID === -2 && record.sprintNumber === 0 && item.index !== -2 && item.record.pbiID !== -2) {
            updateTask(0, item.index, item.record.pbiID, pbiKeys, token, ownerName);
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
      filterIcon: <></>, filters: [], filteredValue: props.peopleFilter || null, onFilter: (value: any, task: ITask) => isArrayValid(props.peopleFilter) && isArrayValid(task.assigness) ?
        task.assigness.filter((person: IPerson) => { return (props.peopleFilter.includes(person.login)) }).length > 0 : '',
      render: (record: ITask) => peopleDropdown(record, token, ownerName, people),
    }, {
      title: "Start Branch", key: "branch", width: "12%", align: "right" as const,
      render: (record: ITask) => isBranchNotCreated(record.status) ?
        <Popover visible={isModal.startBranchId === record.id}
          content={<><div style={{ alignSelf: "center", marginBottom: "10%", textAlign: "center" }}>Start New Branch</div><Space style={{ alignItems: "flex-end" }}>
            <Popconfirm title={"Are you sure you want to start a feature branch?"} onConfirm={() => { startTask(token, ownerName, false, record.id); setIsModal({ ...isModal, startBranchId: -1 }); }}><Button key={"hotfix"} size='small' type="primary" >Feature</Button></Popconfirm>
            <Popconfirm title={"Are you sure you want to start a hotfix branch?"} onConfirm={() => { startTask(token, ownerName, true, record.id); setIsModal({ ...isModal, startBranchId: -1 }); }}><Button key={"hotfix"} size='small' type="primary" color="deeppink">Hotfix</Button></Popconfirm>
          </Space></>} trigger="click">
          <Button key={"action" + record.id} size='small' type="link" onClick={() => { setIsModal({ ...isModal, startBranchId: record.id }) }}>
            <span>{"Create "}<BranchesOutlined /></span></Button></Popover> :
        <div><span hidden={isInReviewOrFinished(record.status)}>Created <BranchesOutlined /></span></div>
    },
    taskGhLinkCol,];
  const TaskTableforPBI: React.FC<IBacklogItem> = (item: IBacklogItem) => {
    return (<TaskTableComponent peopleFilter={props.peopleFilter} item={item} taskColumns={taskColumns} taskComponents={nestedcomponents} />)
  };
  const pbiKeys = useSelector((appState: IState) => appState.loadingKeys.pbiKeys as number[]);
  const pbiColumns = [
    pbiNameCol(props.nameFilter, props.sortedInfo, setSelectedPBI, isModal, setIsModal), pbiProgressCol, pbiProgressCol2,
    {
      title: 'Priority', sorter: (a: IBacklogItem, b: IBacklogItem) => a.priority - b.priority, align: "center" as const, width: "15%", key: 'pbiPriority',
      filteredValue: props.filteredInfo.pbiPriority || null, filters: pbiFilterVals, onFilter: (value: any, item: IBacklogItem) => props.filteredInfo && isArrayValid(props.filteredInfo.pbiPriority) ? props.filteredInfo.pbiPriority.includes(item.priority) : item.priority === value,
      sortOrder: props.sortedInfo && props.sortedInfo.columnKey === 'pbiPriority' && props.sortedInfo.order,
      render: (item: IBacklogItem) => <PriorityDropdown loading={pbiKeys.includes(item.id)} record={item} token={token} ownerName={ownerName} />
    },
    {
      title: 'Story Points', sortOrder: props.sortedInfo && props.sortedInfo.columnKey === 'storyPoints' && props.sortedInfo.order, sorter: (a: IBacklogItem, b: IBacklogItem) => a.expectedTimeInHours - b.expectedTimeInHours, width: "10%", key: 'storyPoints', align: "center" as const, render: (item: IBacklogItem) => {
        return (item.id !== 0 ? <Tag style={{ cursor: "pointer" }} color={item.estimated ? (item.expectedTimeInHours > 10 ? "red" : "green") : "purple"} onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, estimatePBI: true }); }}>
          {item.estimated ? (item.expectedTimeInHours + " SP ") : "Not estimated "}{<EditOutlined />}</Tag> : <Tag className='transparentItem' color={backlogColors[0]}>{"Not estimated "}{<EditOutlined />}</Tag>)
      }
    },
    pbiStatusCol,pbiActionCol(setSelectedPBI,isModal,setIsModal)];
  const PBITableforSprint: React.FC<ISprint> = (item: ISprint) => {
    return (<PBITableComponent sortedInfo={props.sortedInfo} filteredInfo={props.filteredInfo} sortSelected={function (items: any): void { props.sortSelected(items) }} itemSelected={function (items: number[]): void { props.itemSelected(items) }}
      TaskTableforPBI={TaskTableforPBI} nameFilter={props.nameFilter} peopleFilter={props.peopleFilter} item={item} pbiColumns={pbiColumns} nestedcomponents={nestedcomponents} />)
  };
  const sprintColumns = [sprintNrCol(ownerName, navigate), sprintTitleCol, sprintDateCol, sprintStoryPtsCol,
    sprintStatusCol(props.sortedInfo,props.filteredInfo, setSelectedSprint, isModal, setIsModal), sprintActCol(setSelectedSprint, isModal, setIsModal),];
console.log(selectedSprint);
  return (<div className='baccklogScroll' >
    <SprintTableComponent sortedInfo={props.sortedInfo ? props.sortedInfo.order : ""} nameFilter={props.nameFilter} keys={0} peopleFilter={props.peopleFilter} loading={refreshRequired || initialRefresh} data={[{
      goal: "", finishDate: "", isCurrent: false, status: "", isCompleted: false, sprintNumber: 0, title: "", backlogItems: pbiPage.list
    } as ISprint] as ISprint[]}
      components={nestedcomponents} columns={sprintColumns} PBITableforSprint={PBITableforSprint} />
    {(<SprintTableComponent sortedInfo={props.sortedInfo ? props.sortedInfo.order : ""} nameFilter={props.nameFilter} keys={1} peopleFilter={props.peopleFilter} loading={sprintRefreshRequired || initialRefresh}
      data={sprintPage.list as ISprint[]} components={nestedcomponents} columns={sprintColumns} PBITableforSprint={PBITableforSprint} />)
    }
    {isModal.editPBI && selectedPBI && selectedPBI.id && <EditPBIPopup data={selectedPBI as IAddBI} visible={isModal.editPBI}
      onCreate={function (values: any): void { editPBI(values) }} onDelete={() => { deletePBI(selectedPBI) }} onFinish={() => { finishPBI(selectedPBI) }}
      onCancel={() => { setIsModal({ ...isModal, editPBI: false }); setSelectedPBI({} as IBacklogItem); }} />}
    {isModal.estimatePBI && selectedPBI && selectedPBI.id && <EstimatePBIPopup data={selectedPBI as IBacklogItem} visible={isModal.estimatePBI}
      onCreate={function (values: any): void { estimatePBI(values) }} onCancel={() => { setIsModal({ ...isModal, estimatePBI: false });setSelectedPBI({} as IBacklogItem); }} />}
    {isModal.addTask && <AddTaskPopup data={{ name: "" } as IFilters} visible={isModal.addTask}
      onCreate={function (values: any): void { addTaskToPBI(values); }} onCancel={() => { setIsModal({ ...isModal, addTask: false }); }} />}
    {isModal.updateSprint && !loading && <UpdateSprintPopup data={selectedSprint} visible={isModal.updateSprint} onCreate={function (values: any): void { updateSprint(values) }}
      onCancel={() => { setIsModal({ ...isModal, updateSprint: false });setSelectedSprint({} as ISprint); }} />}
    {isModal.completeSprint && !loading && <CompleteSprintPopup data={selectedSprint} visible={isModal.completeSprint} onComplete={function (value: boolean): void { completeSprint(value) }}
      onCancel={() => { setIsModal({ ...isModal, completeSprint: false });setSelectedSprint({} as ISprint); }} />}
  </div>
  );
});