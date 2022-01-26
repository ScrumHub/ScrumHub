import { Badge, Button, Dropdown, Popconfirm, Popover, Progress, Space, Tag } from "antd";
import { IPeopleList, IBacklogItem, ISprint, IState, ITask, IPerson } from "../../appstate/stateInterfaces";
import * as Actions from '../../appstate/actions';
import "../Home.css";
import "../Main.css";
import { AuditOutlined, BranchesOutlined, CalendarOutlined, CheckOutlined, CloseOutlined, DownOutlined, EditOutlined, HomeOutlined, LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { dateFormat, formatSprintStatus, isArrayValid, isBranchNotCreated, isInReviewOrFinished } from "./commonFunctions";
import React, { useState } from "react";
import { assignPerson, startTask } from "./BacklogHandlers";
import { PBIMenuWithPeople, PBIMenuWithPriorities } from "./LoadAnimations";
import { store } from "../../appstate/store";
import { useSelector } from "react-redux";
import { NavigateFunction } from "react-router";
import { IFilteredInfo, IModals, ISortedInfo } from "./commonInterfaces";
import { pbiFilterVals, pbiStatusVals } from "./commonInitValues";

export const dragCmpnts = (DraggableBodyRow: any) => { return ({ body: { row: DraggableBodyRow, }, }) };
export const backlogPriorities = ["Could", "Should", "Must"];
export const backlogColors = ["green", "blue", "red"];

/*task columns functionalities*/
export const taskNameCol = {
  title: "Name",
  align: "left" as const,
  dataIndex: "name",
  width: "32%",
  key: "name",
};
export const taskStatusCol = {
  title: "Status",
  key: "finished",
  width: "22%",
  align: "center" as const,
  render: (record: ITask) => (
    <span>
      <Badge size='small' status={record.finished ? "success" : "error"} />
      {record.status.replace("In", "In ").replace("WBranch", "")}
    </span>
  ),
};

export const taskPplCol = (peopleFilter: string[], token: string, ownerName: string, people: IPeopleList) => {
  return ({
    key: "isAssignedToPBI", title: "Assignees", width: "22%", align: "center" as const,
    filterIcon: <></>, filters: [], filteredValue: peopleFilter || null,
    onFilter: (value: any, task: ITask) => isArrayValid(peopleFilter) && isArrayValid(task.assigness) ?
      task.assigness.filter((person: IPerson) => { return (peopleFilter.includes(person.login)) }).length > 0 : '',
    render: (record: ITask) => peopleDropdown(record, token, ownerName, people),
  })
};

export const taskBranchCol = (token: string, ownerName: string, setIsModal: React.Dispatch<React.SetStateAction<IModals>>, isModal: IModals) => {
  return ({
    title: "Start Branch", key: "branch", width: "12%", align: "center" as const,
    render: (record: ITask) => {
      let save = false;
      return (save ? <LoadingOutlined /> : isBranchNotCreated(record.status) ?
        <Popover trigger="click"
          content={<>
            <div style={{ alignSelf: "center", marginBottom: "10%", textAlign: "center" }}>Start New Branch</div>
            <Space style={{ alignItems: "flex-end" }}>
              <Popconfirm title={"Are you sure you want to start a feature branch?"} onConfirm={() => { save = true; startTask(token, ownerName, false, record.id); setIsModal({ ...isModal, startBranchId: -1 }); }}>
                <Button key={"hotfix"} size='small' type="primary" >Feature</Button>
              </Popconfirm>
              <Popconfirm title={"Are you sure you want to start a hotfix branch?"} onConfirm={() => { save = true; startTask(token, ownerName, true, record.id); setIsModal({ ...isModal, startBranchId: -1 }); }}>
                <Button key={"hotfix"} size='small' type="primary" color="deeppink">Hotfix</Button>
              </Popconfirm>
            </Space></>}>
          <span className="link-button">{"Create "}<BranchesOutlined /></span>
        </Popover> :
        <span hidden={isInReviewOrFinished(record.status)}>Created <BranchesOutlined /></span>)
    }
  })
};

export const taskGhLinkCol = {
  title: "Related Link",
  dataIndex: "link",
  key: "link",
  width: "12%",
  align: "right" as const,
  render: (text: string) => <a href={text}>{"See on GitHub"}</a>,
};

export const peopleDropdown = (record: ITask, token: string, ownerName: string, people: IPeopleList) => {
  return (
    <Dropdown.Button style={{ cursor: "pointer" }} placement='bottomCenter' type="text"
      overlay={<PBIMenuWithPeople itemSelected={function (person: string): void { assignPerson(person, record.id, record.assigness, token, ownerName) }} visible={true} people={people} taskPeople={record.assigness} />}
      buttonsRender={() => [
        <></>, React.cloneElement(<span>
          <Badge size='small'
            status={isArrayValid(record.assigness) ? "success" : "error"} />
          {isArrayValid(record.assigness) ? (record.assigness.at(0).login as string) + " " : "Not Assigned "}
          <DownOutlined />
        </span>),]} > </Dropdown.Button>)
};

export const taskColumns = (peopleFilter: string[], token: string, ownerName: string, people: IPeopleList, setIsModal: React.Dispatch<React.SetStateAction<IModals>>, isModal: IModals) => {
  return ([taskNameCol, taskStatusCol, taskPplCol(peopleFilter, token, ownerName, people),
    taskBranchCol(token, ownerName, setIsModal, isModal), taskGhLinkCol])
};

/*PBI columns*/

export const priorityPBItem = (item: IBacklogItem) => {
  return (item.id !== 0 ? <Tag style={{ cursor: "pointer" }} color={backlogColors[item.priority % 3]}>{backlogPriorities[item.priority % 3]}</Tag> : <Tag className='transparentItem' color={backlogColors[0]}>{backlogPriorities[0]}</Tag>);
}

export const pbiNameCol = (nameFilter, sortedInfo, setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>, isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ({
    title: 'Name', width: "33%", ellipsis: true, sorter: (a: IBacklogItem, b: IBacklogItem) => a.name.length - b.name.length,
    sortOrder: sortedInfo && sortedInfo.columnKey === 'name' && sortedInfo.order,
    filterIcon: <></>, filters: [], filteredValue: nameFilter || null,
    onFilter: (value: any, record: IBacklogItem) => isArrayValid(nameFilter) ? record.name.toLowerCase().includes(nameFilter.at(0).toLowerCase()) : '',
    align: "left" as const, key: 'name',
    render: (item: IBacklogItem) => {
      return (<div><div style={{display:"inline-block"}} className={item.id === 0 ? '' : 'link-button'}
        onClick={() => { if (item.id !== 0) { setSelectedPBI(item); setIsModal({ ...isModal, editPBI: true }); } }}>{item.name}</div></div>)
    },
  })
}

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
export const pbiToDoCol = {
  title: 'Tasks To Do', width: "12%", key: 'tasks', align: "center" as const, render: (item: IBacklogItem) => {
    const filtered = isArrayValid(item.tasks) ? item.tasks.filter((item: ITask) => !item.finished).length : 0;
    return (
      <Progress width={25} percent={100} size='small' type="dashboard" status={`${filtered === 0 ? "success" : "exception"}`}
        format={() => `${filtered}`} />)
  }
};

export const pbiStatusCol = (sortedInfo:ISortedInfo)=>{return({
  title: 'Status', align: "center" as const, width: "8%", key: 'status',
  sorter: (a: IBacklogItem, b: IBacklogItem) => Number(a.id===0?a.priority:a.finished) - Number(b.id===0?b.priority:b.finished),
  sortOrder: sortedInfo && sortedInfo.columnKey === 'status' && sortedInfo.order,
  render: (item: IBacklogItem) => item.finished ? <CheckOutlined style={{ color: "green" }}
    hidden={item.id === 0} /> : <CloseOutlined style={{ color: "red" }} hidden={item.id === 0} />

})};

export const pbiActionCol = (setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>, isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
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
          })).then((response: any) => { if (response.payload && response.payload.code === 200) { store.dispatch(Actions.updatePBILoadingKeys([props.record.id])); } change=false; })
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

export const pbiPriorityCol = (filteredInfo: IFilteredInfo, sortedInfo: ISortedInfo, pbiKeys: number[], token: string, ownerName: string) => {
  return ({
    title: 'Priority', sorter: (a: IBacklogItem, b: IBacklogItem) => a.priority - b.priority, align: "center" as const,
    width: "15%", key: 'pbiPriority', filteredValue: filteredInfo.pbiPriority || null, filters: pbiFilterVals,
    onFilter: (value: any, item: IBacklogItem) => filteredInfo && isArrayValid(filteredInfo.pbiPriority) ? filteredInfo.pbiPriority.includes(item.priority) : item.priority === value,
    sortOrder: sortedInfo && sortedInfo.columnKey === 'pbiPriority' && sortedInfo.order,
    render: (item: IBacklogItem) =>
      <PriorityDropdown loading={pbiKeys.includes(item.id)} record={item} token={token} ownerName={ownerName} />
  });
};

export const pbiStoryPointsCol = (sortedInfo: ISortedInfo, setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>, isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
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

export const pbiColumns = (nameFilter: string[], sortedInfo: ISortedInfo, filteredInfo: IFilteredInfo, setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>, isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>, pbiKeys: number[], token: string, ownerName: string) => {
  return ([
    pbiNameCol(nameFilter, sortedInfo, setSelectedPBI, isModal, setIsModal), 
    pbiProgressCol, pbiToDoCol,
    pbiPriorityCol(filteredInfo, sortedInfo, pbiKeys, token, ownerName),
    pbiStoryPointsCol(sortedInfo, setSelectedPBI, isModal, setIsModal),
    pbiStatusCol(sortedInfo), pbiActionCol(setSelectedPBI, isModal, setIsModal)])
};


/*sprint columns functionalities*/
export const sprintNrCol = (ownerName: string, navigate: NavigateFunction) => {
  return ({
    title: 'Number', width: "15%", align: "left" as const, key: 'sprintNumber',
    render: (s: ISprint) => {
      return (s.sprintNumber === 0 ?
        <div style={{ alignSelf: "flex-start" }} key={"sprintName" + s.sprintNumber} >{"Product Backlog"}</div>
        : (<div key={"sprintName" + s.sprintNumber} className='link-button'
          onClick={() => {
            localStorage.setItem("sprintID", JSON.stringify(s.sprintNumber));
            navigate(`/${(ownerName as string).split("/")[0]}/${(ownerName as string).split("/")[1]}/sprints/${s.sprintNumber}`, { replace: true });
          }}>{"Sprint " + s.sprintNumber}</div>))
    },
  })
};

export const sprintStatusRender = (record: ISprint, setSelectedSprint: React.Dispatch<React.SetStateAction<ISprint>>, isModal, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return (record.sprintNumber !== 0 ? (record.isCompleted ?
    <Tag icon={<AuditOutlined style={{ color: "white" }} />} color={record.status === "Failed" ? "#cc3837" : "#4dc980"} style={{ color: "white", cursor: "pointer", }}
      onClick={() => { setSelectedSprint(record); setIsModal({ ...isModal, completeSprint: true }); }}>
      {formatSprintStatus(record.status)} </Tag> :
    <Tag icon={<EditOutlined style={{ color: "white" }} />} style={{ cursor: "pointer" }} color="#55acee"
      onClick={() => { setSelectedSprint(record); setIsModal({ ...isModal, completeSprint: true }); }} >
      {formatSprintStatus(record.status)} </Tag>) :
    <Tag className="transparentItem"><span>
      {"Not Finished"} <EditOutlined /></span></Tag>);
}

export const sprintActCol = (setSelectedSprint: React.Dispatch<React.SetStateAction<ISprint>>, isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ({
    title: 'Action', width: "8%", align: "right" as const, key: 'action', render: (record: ISprint) => {
      return (<Button hidden={record.sprintNumber === 0} key={"action" + record.sprintNumber} size='small' type="link"
        onClick={() => { setSelectedSprint(record); setIsModal({ ...isModal, updateSprint: true }); }} >{"Update"}</Button>)
    },
  });
}

export const sprintTitleCol = { title: 'Title', width: "27%", align: "center" as const, dataIndex: 'title', key: 'sprintTitle', ellipsis: true };

export const sprintDateCol = {
  title: 'Deadline', width: "15%", align: "center" as const, dataIndex: 'finishDate', key: 'finishDate',
  render: (date: string) => <span hidden={!date}><CalendarOutlined></CalendarOutlined>
    {" " + (date ? dateFormat(date as unknown as Date) : "")}</span>
};

export const sprintStoryPtsCol = {
  title: 'Story Points', width: "15%", align: "center" as const, key: 'finishDate',
  render: (item: ISprint) => {
    return <div hidden={item.sprintNumber === 0}>
      {(item && isArrayValid(item.backlogItems) ? (item.backlogItems.map(item => item.expectedTimeInHours).reduce((prev, next) => prev + next)) : 0) + " Story Points"}
    </div>
  }
};

export const sprintStatusCol = (sortedInfo: ISortedInfo, filteredInfo: IFilteredInfo, setSelectedSprint: React.Dispatch<React.SetStateAction<ISprint>>, isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ({
    key: "isCompleted", title: "completed", width: "15%", sorter: (a: ISprint, b: ISprint) => a.sprintNumber - b.sprintNumber,
    sortOrder: sortedInfo && sortedInfo.columnKey === "isCompleted" && sortedInfo.order,
    filteredValue: filteredInfo.complete || null, filters: [{ text: "Complete", value: 1, }, { text: "Not complete", value: 0, }],
    onFilter: (value: any, item: ISprint) => filteredInfo && isArrayValid(filteredInfo.complete) && item.sprintNumber !== 0 ? filteredInfo.complete.includes(Number(item.isCompleted)) : true,
    render: (record: ISprint) => sprintStatusRender(record, setSelectedSprint, isModal, setIsModal), align: "center" as const,
  })
};

export const sprintColumns = (ownerName: string, navigate: NavigateFunction, sortedInfo: ISortedInfo, filteredInfo: IFilteredInfo, setSelectedSprint: React.Dispatch<React.SetStateAction<ISprint>>, isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ([sprintNrCol(ownerName, navigate), sprintTitleCol, sprintDateCol, sprintStoryPtsCol,
  sprintStatusCol(sortedInfo, filteredInfo, setSelectedSprint, isModal, setIsModal), sprintActCol(setSelectedSprint, isModal, setIsModal),]);
}

export const routes = (ownerName: string | null, sprintID: string, location: any) =>
  [
    {
      path: location.pathname,
      key: "location",
      breadcrumbName: "Projects / " + (location.pathname as string).slice(1).replaceAll("/", " / ")
        .replace("active-sprint", "Active Sprint").replace("sprints", "Sprints"),
      icon: <HomeOutlined />,
    }];