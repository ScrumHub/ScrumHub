/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Space, Typography, } from 'antd';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { IAddBI, IFilters, IPeopleList, IBacklogItem, ISprint, ITask, IState } from '../appstate/stateInterfaces';
import { useSelector } from 'react-redux';
import { CalendarOutlined } from '@ant-design/icons';
import { store } from '../appstate/store';
import { PBITableComponent } from './tables/PBITable';
import { TaskTableComponent } from './tables/TaskTable';
import { canDropTask, dateFormat, isArrayValid, isItemDefined, isSprintLoaded, useStateAndRefLoading, useTasksRef } from './utility/commonFunctions';
import SkeletonList from './utility/LoadAnimations';
import { addPBIToRepo, addTaskToPBI, fetchBacklog, updateTask } from './utility/BacklogHandlers';
import { BodyRowProps, IModals, IRowIds } from './utility/commonInterfaces';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import { initFilterSortInfo, initModalVals } from './utility/commonInitValues';
import { HTML5Backend } from 'react-dnd-html5-backend';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router';
import { AddTaskPopup } from './popups/AddTaskPopup';
import { CompleteSprintPopup } from './popups/CompleteSprintPopup';
import { EditPBIPopup } from './popups/EditPBIPopup';
import { EstimatePBIPopup } from './popups/EstimatePBIPopup';
import { UpdateSprintPopup } from './popups/UpdateSprintPopup';
import _ from 'lodash';
import { requestFetchRateLimit, requestFetchAllRepoTasks } from '../appstate/fetching';
import { type } from './ProductBacklog';
import { pbiColumns, pbiSprintColumns, taskColumns } from './tables/TableUtilities';
import { AddPBIPopup } from './popups/AddPBIPopup';

/**
 * @returns Sprint Backlog View
 */
export function SprintBacklog() {
  const token = useSelector((appState: IState) => appState.loginState.token);
  const tasks = useTasksRef(useSelector((appState: IState) => appState.tasks as ITask[]));
  const pbiKeys = useSelector((appState: IState) => appState.loadingKeys.pbiKeys as number[]);
  const { loading, loadingRef } = useStateAndRefLoading(useSelector((appState: IState) => appState.loading as boolean));
  const [infos, setInfos] = useState(initFilterSortInfo);
  const [filterPBI, setFiltersPBI] = useState<IFilters>({ nameFilter: "", peopleFilter: [] });
  const people = useSelector((appState: IState) => appState.people as IPeopleList);
  const [isModal, setIsModal] = useState<IModals>(initModalVals);
  const navigate = useNavigate();
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const sprintID = localStorage.getItem("sprintID") ? Number(localStorage.getItem("sprintID")) : -1;
  const [initialRefresh, setInitialRefresh] = useState(true);
  const sprintPage = useSelector((appState: IState) => appState.openSprint as ISprint);
  const pbiPage = useSelector((appState: IState) => appState.pbiPage);
  const sprints = useSelector((appState: IState) => appState.pbiPage);

  const location = useLocation();
  useEffect(() => {
    if (initialRefresh) {
      store.dispatch(Actions.fetchOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: sprintID }));
      store.dispatch(Actions.fetchPeopleThunk({ ownerName, token }));
      if(!isArrayValid(sprints.list) || !isArrayValid(pbiPage.list)|| !isArrayValid(tasks.current)){
        fetchBacklog(true,ownerName, token);
        store.dispatch(Actions.fetchRepoTasksThunk({ token: token, ownerName: ownerName }));
      }
      setInitialRefresh(false);
    }// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRefresh, location]);
  let ratio = 0;
  useEffect(() => {
    const timer = setInterval(
      async () => {
        ++ratio;
        const usedRequestRate = await requestFetchRateLimit(token).then((response: any) => { return (isItemDefined(response.data) && isItemDefined(response.data.rate) && isItemDefined(response.data.rate.used) ? response.data.rate.used as number : 5000); });
        if (!loadingRef.current && isItemDefined(usedRequestRate) && typeof (usedRequestRate) === "number" && (usedRequestRate < 3000 || (usedRequestRate >= 3000 && ratio % 3 === 0))) {
          const res = await requestFetchAllRepoTasks(token, ownerName).then((response: any) => { return (response && response.status === 200 ? response.data : null); });
          if (isItemDefined(res) && isItemDefined(res.list) && !_.isEqual(res.list, tasks.current)) {
            store.dispatch(Actions.updateAllTasks(res.list));
          }
        }
      }, 6000);
    return () => clearInterval(timer);// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const estimatePBI = (pbi: IBacklogItem) => {
    try {
      store.dispatch(Actions.estimatePBIThunk({ ownerName: ownerName, token: token, pbiId: selectedPBI.id, hours: pbi.expectedTimeInHours }));
    } catch (err) { console.error("Failed to estimate the pbis: ", err); }
    finally {
      setIsModal({ ...isModal, estimatePBI: false });
      setSelectedPBI({} as IBacklogItem);
      //setInitialRefresh(true);
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
      //setInitialRefresh(true);
    }
  }
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
  const TaskTableforPBI: React.FC<IBacklogItem> = (item: IBacklogItem) => {
    return (<TaskTableComponent peopleFilter={filterPBI.peopleFilter} item={item}
      taskColumns={taskColumns(filterPBI.peopleFilter, token, ownerName, people, setIsModal, isModal)} taskComponents={nestedcomponents} />)
  };
  return (
    <div style={{ marginLeft: "2%", marginRight: "2%", marginTop: 0, marginBottom: "1%" }}>
      <SkeletonList width={true} loading={sprintPage == null || isSprintLoaded(sprintID, sprintPage, false)} number={2} />
      <Space>
        <Typography>
          {isSprintLoaded(sprintID, sprintPage, true) ? sprintPage.goal : ""}
        </Typography>
      </Space>
      <br />
      <Space>
        {isSprintLoaded(sprintID, sprintPage, true) && <span><CalendarOutlined style={{
          color: moment(sprintPage.finishDate).diff(moment().endOf('day'), 'day') < 8 ?
            (moment(sprintPage.finishDate).diff(moment().endOf('day'), 'day') < 4 ? "red" : "darkorange") : "green"
        }}>
        </CalendarOutlined>
          {" " + dateFormat(sprintPage.finishDate as unknown as Date)}
        </span>}
        <Button key="updateSprint" type="link" onClick={() => { setIsModal({ ...isModal, updateSprint: true }); }}>
          {isSprintLoaded(sprintID, sprintPage, true) ? "Update Sprint" : ""}
        </Button>
      </Space>
      <DndProvider backend={HTML5Backend} key={"dnd_sprint"}>
        {sprintPage && sprintPage.backlogItems && isSprintLoaded(sprintID, sprintPage, true) &&
          <PBITableComponent loading={loading || initialRefresh} sortedInfo={infos.sortedInfo} TaskTableforPBI={TaskTableforPBI}
            nameFilter={filterPBI.nameFilter} peopleFilter={filterPBI.peopleFilter} item={sprintPage}
            pbiColumns={pbiSprintColumns(infos.sortedInfo,pbiKeys, token, ownerName, setSelectedPBI, isModal, setIsModal)} nestedcomponents={nestedcomponents} />}
      </DndProvider>
      {isModal.editPBI && selectedPBI && selectedPBI.id &&
        <EditPBIPopup data={selectedPBI} visible={isModal.editPBI}
          onCreate={function (values: any): void { editPBI(values) }} onDelete={() => { deletePBI(selectedPBI) }}
          onFinish={() => { finishPBI(selectedPBI) }}
          onCancel={() => { setIsModal({ ...isModal, editPBI: false }); setSelectedPBI({} as IBacklogItem); }} />}
      {isModal.estimatePBI && selectedPBI && selectedPBI.id &&
        <EstimatePBIPopup data={selectedPBI as IBacklogItem} visible={isModal.estimatePBI}
          onCreate={function (values: any): void { estimatePBI(values) }}
          onCancel={() => { setIsModal({ ...isModal, estimatePBI: false }); setSelectedPBI({} as IBacklogItem); }} />}
      {isModal.addTask &&
        <AddTaskPopup data={{ name: "" } as IFilters} visible={isModal.addTask}
          onCreate={function (values: any): void {
            addTaskToPBI(values, token, ownerName, selectedPBI.id, setIsModal, isModal, setSelectedPBI);
          }}
          onCancel={() => { setIsModal({ ...isModal, addTask: false }); }} />}
      {isModal.updateSprint &&
        <UpdateSprintPopup data={sprintPage} visible={isModal.updateSprint}
          onCreate={function (values: any): void { updateSprint(values) }}
          onCancel={() => { setIsModal({ ...isModal, updateSprint: false }); }} />}
      {isModal.completeSprint &&
        <CompleteSprintPopup data={sprintPage} visible={isModal.completeSprint}
          onComplete={function (value: boolean): void { completeSprint(value) }}
          onCancel={() => { setIsModal({ ...isModal, completeSprint: false }); }} />}
    </div>
  );
}

