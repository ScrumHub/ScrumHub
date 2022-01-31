/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import * as Actions from '../appstate/actions';
import { IFilters, IPeopleList, IBacklogItem, IBacklogItemList, ISprint, ISprintList, ITask, IState } from '../appstate/stateInterfaces';
import 'antd/dist/antd.css';
import moment from 'moment';
import './ProductBacklog.css';
import { store } from '../appstate/store';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { initModalVals } from './utility/commonInitValues';
import { BodyRowProps, IModals, IProductBacklogProps, IRowIds } from './utility/commonInterfaces';
import { canDropPBI, canDropTask, getOwnerNameLocation, isItemDefined, useStateAndRefLoading, useTasksRef, } from './utility/commonFunctions';
import { taskColumns, dragCmpnts, pbiColumns, sprintColumns } from './tables/TableUtilities';
import { PBITableComponent } from './tables/PBITable';
import { SprintTableComponent } from './tables/SprintTable';
import { initPBIFilter, initProductBacklog } from '../appstate/stateInitValues';
import { updatePBI, updateTask, fetchPBIsAndUnassigned, addTaskToPBI, estimatePBItemInRepo, editPBItemInRepo, finishPBItemInRepo, deletePBItemInRepo } from './utility/BacklogHandlers';
import { AddTaskPopup } from './popups/AddTaskPopup';
import { CompleteSprintPopup } from './popups/CompleteSprintPopup';
import { EditPBIPopup } from './popups/EditPBIPopup';
import { EstimatePBIPopup } from './popups/EstimatePBIPopup';
import { UpdateSprintPopup } from './popups/UpdateSprintPopup';
import { TaskTableComponent } from './tables/TaskTable';
import _ from 'lodash';
import { requestFetchAllRepoTasks, requestFetchRateLimit } from '../appstate/fetching';
export const type = 'DraggableBodyRow';

/**
 * Returns Rendered Tables representing Sprint and Product Backlogs
 * 
 * {@linkcode IProductBacklogProps} props Arguments of ProductBacklog functional component
 */
export const ProductBacklog: React.FC<IProductBacklogProps> = React.memo((props: IProductBacklogProps) => {
  const token = useSelector((appState: IState) => appState.loginState.token);
  const location = useLocation();
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : getOwnerNameLocation(location.pathname);
  const sprintPage = useSelector((state: IState) => state.sprintPage as ISprintList);
  const { loading, loadingRef } = useStateAndRefLoading(useSelector((appState: IState) => appState.loading as boolean));
  const pbiPage = useSelector((appState: IState) => appState.pbiPage as IBacklogItemList);
  const people = useSelector((appState: IState) => appState.people as IPeopleList);
  const tasks = useTasksRef(useSelector((appState: IState) => appState.tasks as ITask[]));
  const pbiKeys = useSelector((appState: IState) => appState.loadingKeys.pbiKeys as number[]);
  const refreshRequired = useSelector((appState: IState) => appState.productRequireRefresh as boolean);
  const sprintRefreshRequired = useSelector((appState: IState) => appState.sprintRequireRefresh as boolean);
  const [initialRefresh, setInitialRefresh] = useState(true);
  const [selectedPBI, setSelectedPBI] = useState({} as IBacklogItem);
  const [selectedSprint, setSelectedSprint] = useState({} as ISprint);
  const [isModal, setIsModal] = useState<IModals>(initModalVals);
  const navigate = useNavigate();
  message.config({ maxCount: 1 });
  useEffect(() => {
    if (initialRefresh) {
      if (!localStorage.getItem("sprintID")) {
        store.dispatch(Actions.clearPBIsList());
        store.dispatch(Actions.clearSprintList());
        store.dispatch(Actions.fetchRepoTasksThunk({ token: token, ownerName: ownerName }))
      .then((response:any)=>{setInitialRefresh(false);});
      }else{
        localStorage.removeItem("sprintID");
        setInitialRefresh(false);
      }
    }
  }, [initialRefresh]);
  useEffect(() => { fetchPBIsAndUnassigned(refreshRequired, ownerName, token); }, [refreshRequired]);
  useEffect(() => {
    if (sprintRefreshRequired && ownerName && ownerName !== "") {
      store.dispatch(Actions.fetchSprintsThunk({ token: token, ownerName: ownerName as string, filters: { ...initPBIFilter, onePage: true } }));
    }
  }, [sprintRefreshRequired]);
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
    return () => clearInterval(timer);
  }, []);

  
  const updateSprint = (sprint: ISprint) => {
    const sprintID = selectedSprint.sprintNumber;
    const ids = sprint.backlogItems.map((value: IBacklogItem) => { return ((value.sprintNumber === Number(sprintID) ? value.id.toString() : "")) }).filter((x) => x !== "");
      store.dispatch(Actions.updateOneSprintThunk({
        token: token as string, ownerName: ownerName, sprintNumber: Number(sprintID),
        sprint: {
          "title": sprint.title, "finishDate": moment((sprint.finishDate as any)._d).format("YYYY-MM-DDTHH:mm:ss") + "Z",
          "goal": sprint.goal, "pbIs": ids
        }
      })).then((response:any)=>{
        if(response.payload && response.payload.code ===200){
          setIsModal({ ...isModal, updateSprint: false });
          setSelectedSprint({} as ISprint);
        }
      })
  };
  const completeSprint = (value: boolean) => {
    store.dispatch(Actions.completeOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: Number(selectedSprint.sprintNumber), isFailure: value }))
      .then((response: any) => { if(response.payload && response.payload.code === 200){
        setIsModal({ ...isModal, completeSprint: false });
        setSelectedSprint({} as ISprint);
      } });
  };
  const DraggableBodyRow = ({ index: index_row, bodyType, record, className, style, ...restProps }: BodyRowProps) => {
    const ref = useRef();
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: monitor => {
        const index = monitor.getItem() || {} as number;
        if (index === index_row) { return {}; }
        return { isOver: monitor.isOver(), dropClassName: index as number < index_row ? ' drop-over-downward' : ' drop-over-upward', };
      },
      drop: (item: any) => {
        if (typeof (index_row) !== "undefined") {
          if (!item.record.estimated) { message.info("Cannot assign not estimated pbi", 5) }
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
      type, item: { index: index_row, bodyType: bodyType, record: record as IRowIds },
      collect: monitor => ({ isDragging: monitor.isDragging(), }),
      canDrag: isDraggable
    });
    drop(drag(ref));
    return (<tr ref={ref as any} className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: isDraggable ? "move" : "default", ...style }} {...restProps} />
    );
  };

  const TaskTableforPBI: React.FC<IBacklogItem> = (item: IBacklogItem) => {
    return (<TaskTableComponent peopleFilter={props.peopleFilter} item={item} showHeader={false}
      taskColumns={taskColumns(props.peopleFilter, token, ownerName, people, setIsModal, isModal)}
      taskComponents={dragCmpnts(DraggableBodyRow)} />)
  };
  const PBITableforSprint: React.FC<ISprint> = (item: ISprint) => {
    return (<PBITableComponent sortedInfo={props.sortedInfo} filteredInfo={props.filteredInfo} sortSelected={function (items: any): void { props.sortSelected(items) }}
      itemSelected={function (items: number[]): void { props.itemSelected(items) }} TaskTableforPBI={TaskTableforPBI}
      nameFilter={props.nameFilter} peopleFilter={props.peopleFilter} item={item}
      pbiColumns={pbiColumns(props.nameFilter, props.sortedInfo, props.filteredInfo, setSelectedPBI, isModal, setIsModal, pbiKeys, token, ownerName)}
      nestedcomponents={dragCmpnts(DraggableBodyRow)} />)
  };
  return (<div className='baccklogScroll' >
    <SprintTableComponent filteredInfo={props.filteredInfo} sortedInfo={props.sortedInfo ? props.sortedInfo.order : ""}
      nameFilter={props.nameFilter} keys={0} peopleFilter={props.peopleFilter} loading={refreshRequired || initialRefresh}
      data={[{ ...initProductBacklog, backlogItems: pbiPage.list } as ISprint] as ISprint[]} components={dragCmpnts(DraggableBodyRow)}
      columns={sprintColumns(ownerName, navigate, props.sortedInfo, props.filteredInfo, setSelectedSprint, isModal, setIsModal)}
      PBITableforSprint={PBITableforSprint} />
    <SprintTableComponent filteredInfo={props.filteredInfo} sortedInfo={props.sortedInfo ? props.sortedInfo.order : ""}
      nameFilter={props.nameFilter} keys={1} peopleFilter={props.peopleFilter} loading={sprintRefreshRequired || initialRefresh}
      data={sprintPage.list as ISprint[]} components={dragCmpnts(DraggableBodyRow)}
      columns={sprintColumns(ownerName, navigate, props.sortedInfo, props.filteredInfo, setSelectedSprint, isModal, setIsModal)}
      PBITableforSprint={PBITableforSprint} />
    {isModal.editPBI && <EditPBIPopup data={selectedPBI} visible={isModal.editPBI}
      onCreate={function (values: any): void { editPBItemInRepo(values, ownerName,token,selectedPBI.id,setIsModal, isModal, setSelectedPBI) }} 
      onDelete={() => { deletePBItemInRepo(selectedPBI, ownerName,token,setIsModal, isModal, setSelectedPBI) }}
      onFinish={() => { finishPBItemInRepo(selectedPBI, ownerName,token,setIsModal, isModal, setSelectedPBI) }}
      onCancel={() => { setIsModal({ ...isModal, editPBI: false }); setSelectedPBI({} as IBacklogItem); }} />}
    {isModal.estimatePBI && <EstimatePBIPopup data={selectedPBI as IBacklogItem} visible={isModal.estimatePBI}
      onCreate={function (values: any): void { estimatePBItemInRepo(values, ownerName,token,selectedPBI.id,setIsModal, isModal, setSelectedPBI) }}
      onCancel={() => { setIsModal({ ...isModal, estimatePBI: false }); setSelectedPBI({} as IBacklogItem); }} />}
    <AddTaskPopup data={{ name: "" } as IFilters} visible={isModal.addTask}
      onCreate={function (values: any): void { addTaskToPBI(values, token, ownerName, selectedPBI.id, setIsModal, isModal, setSelectedPBI); }}
      onCancel={() => { setIsModal({ ...isModal, addTask: false }); }} />
    {isModal.updateSprint && <UpdateSprintPopup data={selectedSprint} visible={isModal.updateSprint}
      onCreate={function (values: any): void { updateSprint(values) }}
      onCancel={() => { setIsModal({ ...isModal, updateSprint: false }); setSelectedSprint({} as ISprint); }} />}
    {isModal.completeSprint && <CompleteSprintPopup data={selectedSprint} visible={isModal.completeSprint}
      onComplete={function (value: boolean): void { completeSprint(value) }}
      onCancel={() => { setIsModal({ ...isModal, completeSprint: false }); setSelectedSprint({} as ISprint); }} />}
  </div>
  );
});