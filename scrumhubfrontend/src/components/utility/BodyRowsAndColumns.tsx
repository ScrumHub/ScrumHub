import { Badge, Button, Dropdown, Progress, Tag } from "antd";
import { IPeopleList, IProductBacklogItem, ISprint, IState, ITask } from "../../appstate/stateInterfaces";
import * as Actions from '../../appstate/actions';
import "../Home.css";
import "../Main.css";
import { CalendarOutlined, CheckOutlined, CloseOutlined, DownOutlined, EditOutlined, HomeOutlined, SyncOutlined } from "@ant-design/icons";
import { dateFormat, isArrayValid } from "./commonFunctions";
import React from "react";
import { assignPerson } from "./BacklogHandlers";
import { PBIMenuWithPeople, PBIMenuWithPriorities } from "./LoadAnimations";
import { store } from "../../appstate/store";
import { useSelector } from "react-redux";
import { NavigateFunction } from "react-router";
import { IModals } from "./commonInterfaces";

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
      {record.status.replace("In", "In ").replace("WBranch","")}
    </span>
  ),
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

export const priorityPBItem = (item: IProductBacklogItem) => {
  return (item.id !== 0 ? <Tag style={{ cursor: "pointer" }} color={backlogColors[item.priority % 3]}>{backlogPriorities[item.priority % 3]}</Tag> : <Tag className='transparentItem' color={backlogColors[0]}>{backlogPriorities[0]}</Tag>);
}


/*pbi columns functionalities*/
export const pbiNameCol=(nameFilter, sortedInfo, setSelectedPBI: React.Dispatch<React.SetStateAction<IProductBacklogItem>>, isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>)=>    {return({
  title: 'Name', width: "25%", sorter: (a: IProductBacklogItem, b: IProductBacklogItem) => a.name.length - b.name.length, sortOrder: sortedInfo && sortedInfo.columnKey === 'name' && sortedInfo.order,
  filterIcon: <></>, filters: [], filteredValue: nameFilter || null, onFilter: (value: any, record: IProductBacklogItem) => isArrayValid(nameFilter) ? record.name.toLowerCase().includes(nameFilter.at(0).toLowerCase()) : '',
  align: "left" as const, key: 'name', render: (item: IProductBacklogItem) => { return (<div className={item.id === 0 ? '' : 'link-button'} onClick={() => { if (item.id !== 0) { setSelectedPBI(item); setIsModal({ ...isModal, editPBI: true }); } }}>{item.name}</div>) },
})
}

export const pbiProgressCol = {
  title: 'Progress', width: "20%", key: 'progressBar', align: "center" as const, render: (item: IProductBacklogItem) => {
    return (<span><Progress width={25} size='small' type="line" showInfo={false} percent={item.tasks && item.tasks.length > 0 ? 100 * (item.tasks.filter((item: ITask) => item.finished).length / item.tasks.length) : 100}
    ></Progress></span>
    )
  }
};
export const pbiProgressCol2 = {
  title: 'Tasks To Do', width: "15%", key: 'tasks', align: "center" as const, render: (item: IProductBacklogItem) => {
    const filtered = isArrayValid(item.tasks) ? item.tasks.filter((item: ITask) => !item.finished).length : 0;
    return (
      <Progress width={25} percent={100} size='small' type="dashboard" status={`${filtered === 0 ? "success" : "exception"}`}
        format={() => `${filtered}`} />)
  }
};

export const pbiProgressTagCol = {
  title: 'Tasks Done', width: "20%", key: 'tag', align: "center" as const, render: (item: IProductBacklogItem) => {
    return (<Tag style={{ cursor: "pointer" }} color={item.estimated ? (item.expectedTimeInHours > 10 ? "red" : "green") : "purple"}>
      {(item.tasks && item.tasks.length > 0 ? (item.tasks.filter((item: ITask) => item.finished).length + "/" + item.tasks.length) : "0/0") + " Tasks Done"}</Tag>)
  }
};

export const pbiStatusCol ={
  title: 'Status', align: "center" as const, width: "10%", key: 'status', render: (item: IProductBacklogItem) => 
  item.finished? <CheckOutlined style={{color:"green"}} hidden={item.id===0}/>:<CloseOutlined style={{color:"red"}} hidden={item.id===0}/>

}

export function PriorityDropdown(props: { loading: boolean; token: string; ownerName: string; record: IProductBacklogItem; }) {
  const keys = useSelector((appState: IState) => appState.loadingKeys.pbiKeys);
  return (
    <Dropdown.Button trigger={["click"]} style={{ cursor: "pointer" }} placement='bottomCenter' type="text"
      overlay={<PBIMenuWithPriorities itemSelected={function (priority: number): void {
        if (priority !== props.record.priority) {
          if (!keys.includes(props.record.id)) { store.dispatch(Actions.updatePBILoadingKeys([props.record.id])); }
          store.dispatch(Actions.editPBIThunk({
            ownerName: props.ownerName, token: props.token, pbi: { ...props.record, priority: priority },
            pbiId: props.record.id,
          })).then((response: any) => { if (response.payload && response.payload.code === 200) { store.dispatch(Actions.updatePBILoadingKeys([props.record.id])); } })
        }
      }} visible={true} priority={props.record.priority} />}
      buttonsRender={() => [
        <></>, props.loading ? <Tag icon={<SyncOutlined spin />} color="processing">
          SYNCING
        </Tag> :
          props.record.id !== 0 ? <Tag style={{ cursor: "pointer" }} color={backlogColors[props.record.priority % 3]}>{
            <span>{backlogPriorities[props.record.priority % 3]}{" "}<EditOutlined /></span>}</Tag>
            : <Tag className="transparentItem">{backlogPriorities[0]}</Tag>
        ,]} > </Dropdown.Button>)
};


/*sprint columns functionalities*/
export const sprintNrCol = (ownerName: string, navigate: NavigateFunction) => {
  return ({
    title: 'Number', width: "15%", align: "left" as const, key: 'sprintNumber',
    render: (s: ISprint) => {
      return (s.sprintNumber === 0 ? <div style={{ alignSelf: "flex-start" }} key={"sprintName" + s.sprintNumber} >{"Product Backlog"}</div> : (<div key={"sprintName" + s.sprintNumber} className='link-button' onClick={() => {
        localStorage.setItem("sprintID", JSON.stringify(s.sprintNumber));
        navigate(`/${(ownerName as string).split("/")[0]}/${(ownerName as string).split("/")[1]}/sprints/${s.sprintNumber}`, { replace: true });
      }}>{"Sprint " + s.sprintNumber}</div>))
    },
  })
};

export const sprintStatusCol = (record: ISprint, setSelectedSprint: React.Dispatch<React.SetStateAction<ISprint>>, isModal, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return (record.sprintNumber !== 0 && (record.isCompleted ? <Tag color={record.status === "Failed" ? "red" : "green"}><span>
    {record.status.replace("Not", "Not ").replace("In", "In ")}</span></Tag> : <Tag style={{ cursor: "pointer" }} onClick={() => { setSelectedSprint(record); setIsModal({ ...isModal, completeSprint: true }); }} color="geekblue"><span>
      {record.status.replace("Not", "Not ").replace("In", "In ")} <EditOutlined /></span></Tag>));
}

export const sprintActCol = (setSelectedSprint: React.Dispatch<React.SetStateAction<ISprint>>, isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ({
    title: 'Action', width: "10%", align: "right" as const, key: 'action', render: (record: ISprint) => {
      return (<Button hidden={record.sprintNumber === 0} key={"action" + record.sprintNumber} size='small' type="link" onClick={() => { setSelectedSprint(record); setIsModal({ ...isModal, updateSprint: true }); }} >{"Update"}</Button>)
    },
  });
}

export const sprintTitleCol = {
  title: 'Title', width: "30%", align: "center" as const, dataIndex: 'title', key: 'sprintTitle', ellipsis: true
};

export const sprintDateCol = {
  title: 'Deadline', width: "15%", align: "center" as const, dataIndex: 'finishDate', key: 'finishDate',
  render: (date: string) => <span hidden={!date}><CalendarOutlined></CalendarOutlined>{" " + (date ? dateFormat(date as unknown as Date) : "")}</span>
};

export const sprintStoryPtsCol = {
  title: 'Story Points', width: "15%", align: "center" as const, key: 'finishDate',
  render: (item: ISprint) => {
    return (<Tag hidden={item.sprintNumber === 0} style={{ cursor: "pointer" }} color={"purple"} >
      {item && isArrayValid(item.backlogItems) ? (item.backlogItems.map(item => item.expectedTimeInHours).reduce((prev, next) => prev + next) + " Story Points ") : "Not estimated "}</Tag>)
  }
}

export const routes = (ownerName: string | null, sprintID: string, location: any) =>
  [
    {
      path: location.pathname,
      key: "location",
      breadcrumbName: "Projects / " + (location.pathname as string).slice(1).replaceAll("/", " / ").replace("active-sprint", "Active Sprint").replace("sprints", "Sprints"),
      icon: <HomeOutlined />,
    }];