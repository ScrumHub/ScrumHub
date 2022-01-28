import { Button, Dropdown, Progress, Tag } from "antd";
import { IBacklogItem, IState, ITask } from "../../appstate/stateInterfaces";
import * as Actions from '../../appstate/actions';
import "../Home.css";
import "../Main.css";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { isArrayValid } from "./commonFunctions";
import React from "react";
import { PBIMenuWithPriorities } from "./LoadAnimations";
import { store } from "../../appstate/store";
import { useSelector } from "react-redux";
import { IFilteredInfo, IModals, ISortedInfo } from "./commonInterfaces";
import { pbiFilterVals } from "./commonInitValues";
import { backlogColors, backlogPriorities } from "./TableUtilities";

/**
 * Renders priority tag for the given Backlog Item
 */
export const priorityPBItem = (item: IBacklogItem) => {
  return (item.id !== 0 ? <Tag style={{ cursor: "pointer" }} color={backlogColors[item.priority % 3]}>{backlogPriorities[item.priority % 3]}</Tag> : <Tag className='transparentItem' color={backlogColors[0]}>{backlogPriorities[0]}</Tag>);
}

/**
 * Renders name for the given Backlog Item
 */
export const pbiNameCol = (nameFilter, sortedInfo, setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>, isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ({
    title: 'Name', width: "33%", ellipsis: true, sorter: (a: IBacklogItem, b: IBacklogItem) => a.name.length - b.name.length,
    sortOrder: sortedInfo && sortedInfo.columnKey === 'name' && sortedInfo.order,
    filterIcon: <></>, filters: [], filteredValue: nameFilter || null,
    onFilter: (value: any, record: IBacklogItem) => isArrayValid(nameFilter) ? record.name.toLowerCase().includes(nameFilter.at(0).toLowerCase()) : '',
    align: "left" as const, key: 'name',
    render: (item: IBacklogItem) => {
      return (<div><div style={{ display: "inline-block" }} className={item.id === 0 ? '' : 'link-button'}
        onClick={() => { if (item.id !== 0) { setSelectedPBI(item); setIsModal({ ...isModal, editPBI: true }); } }}>{item.name}</div></div>)
    },
  })
}

/**
 * Renders progress bar for the given Backlog Item, represents the percent of tasks that are finished
 */
export const pbiProgressCol = {
  title: 'Progress', width: "20%", key: 'progressBar', align: "center" as const, render: (item: IBacklogItem) => {
    return (
      <span>
        <Progress width={25} size='small' type="line" showInfo={false}
          percent={item.tasks && item.tasks.length > 0 ? 100 * (item.tasks.filter((item: ITask) => item.finished).length / item.tasks.length) : 100}>
        </Progress>
      </span>
    )
  }
};

/**
 * Renders number of unfinished tasks for the given Backlog Item
 */
export const pbiToDoCol = {
  title: 'Tasks To Do', width: "12%", key: 'tasks', align: "center" as const, render: (item: IBacklogItem) => {
    const filtered = isArrayValid(item.tasks) ? item.tasks.filter((item: ITask) => !item.finished).length : 0;
    return (
      <Progress width={25} percent={100} size='small' type="dashboard" status={`${filtered === 0 ? "success" : "exception"}`}
        format={() => `${filtered}`} />)
  }
};

/**
 * Renders status the given Backlog Item
 */
export const pbiStatusCol = (sortedInfo: ISortedInfo) => {
  return ({
    title: 'Status', align: "center" as const, width: "8%", key: 'status',
    sorter: (a: IBacklogItem, b: IBacklogItem) => Number(a.id === 0 ? a.priority : a.finished) - Number(b.id === 0 ? b.priority : b.finished),
    sortOrder: sortedInfo && sortedInfo.columnKey === 'status' && sortedInfo.order,
    render: (item: IBacklogItem) =>
      <Progress className={item.id === 0 ? 'transparentItem' : ''} style={{ alignItems: "center", verticalAlign: "super" }}
        width={15} size='small' type="circle" percent={100} status={`${item.finished ? "success" : "exception"}`} />

  })
};

/**
 * Renders button for adding new task to the given Backlog Item
 */
export const pbiActionCol = (setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>, isModal: IModals,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ({
    title: '', align: "right" as const, width: "10%", key: 'actions',
    render: (item: IBacklogItem) => {
      return (
        <span>
          <Button size='small' type="link" onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, addTask: true }); }} >
            {"Add Task"}
          </Button>
        </span>)
    }
  });
}

/**
 * Renders dropdown menu for choosing priority for the given Backlog Item
 */
export function PriorityDropdown(props: { loading: boolean; token: string; ownerName: string; record: IBacklogItem; }) {
  const keys = useSelector((appState: IState) => appState.loadingKeys.pbiKeys);
  let change = true;
  return (
    <Dropdown.Button trigger={["click"]} style={{ cursor: "pointer" }} placement='bottomCenter' type="text"
      overlay={<PBIMenuWithPriorities itemSelected={function (priority: number): void {
        if (priority !== props.record.priority) {
          if (!keys.includes(props.record.id)) { store.dispatch(Actions.updatePBILoadingKeys([props.record.id])); }
          store.dispatch(Actions.editPBIThunk({
            ownerName: props.ownerName, token: props.token, pbi: { ...props.record, priority: priority },
            pbiId: props.record.id,
          }))
            .then((response: any) => {
              if (response.payload && response.payload.code === 200) {
                store.dispatch(Actions.updatePBILoadingKeys([props.record.id]));
              } change = false;
            })
        }
      }} visible={true} priority={props.record.priority} />}
      buttonsRender={() => [
        <></>, props.loading && change ?
          <Tag icon={<SyncOutlined spin />} color="processing"> SYNCING</Tag> :
          props.record.id !== 0 ?
            <Tag style={{ cursor: "pointer" }} color={backlogColors[props.record.priority % 3]}>
              {<span>{backlogPriorities[props.record.priority % 3]}{" "}<EditOutlined /></span>}
            </Tag>
            : <Tag className="transparentItem">{backlogPriorities[0]}</Tag>]}>
    </Dropdown.Button>)
};

/**
 * Renders priority for the given Backlog Item
 */
export const pbiPriorityCol = (filteredInfo: IFilteredInfo, sortedInfo: ISortedInfo, pbiKeys: number[],
  token: string, ownerName: string) => {
  return ({
    title: 'Priority', sorter: (a: IBacklogItem, b: IBacklogItem) => a.priority - b.priority, align: "center" as const,
    width: "15%", key: 'pbiPriority', filteredValue: filteredInfo.pbiPriority || null, filters: pbiFilterVals,
    onFilter: (value: any, item: IBacklogItem) => filteredInfo && isArrayValid(filteredInfo.pbiPriority) ?
      filteredInfo.pbiPriority.includes(item.priority) : item.priority === value,
    sortOrder: sortedInfo && sortedInfo.columnKey === 'pbiPriority' && sortedInfo.order,
    render: (item: IBacklogItem) =>
      <PriorityDropdown loading={pbiKeys.includes(item.id)} record={item} token={token} ownerName={ownerName} />
  });
};

/**
 * Renders Story Points value for the given Backlog Item
 */
export const pbiStoryPointsCol = (sortedInfo: ISortedInfo, setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>, 
  isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ({
    title: 'Story Points', sortOrder: sortedInfo && sortedInfo.columnKey === 'storyPoints' && sortedInfo.order,
    sorter: (a: IBacklogItem, b: IBacklogItem) => a.expectedTimeInHours - b.expectedTimeInHours, width: "12%", key: 'storyPoints',
    align: "center" as const,
    render: (item: IBacklogItem) => {
      return (item.id !== 0 ?
        <Tag style={{ cursor: "pointer" }} color={item.estimated ? (item.expectedTimeInHours > 6 ? "red" : "green") : "purple"}
          onClick={() => { setSelectedPBI(item); setIsModal({ ...isModal, estimatePBI: true }); }}>
          {item.estimated ? (item.expectedTimeInHours + " SP ") : "Not estimated "}{<EditOutlined />}
        </Tag>
        : <Tag className='transparentItem' color={backlogColors[0]}>
          {"Not estimated "}{<EditOutlined />}
        </Tag>)
    }
  });
};

