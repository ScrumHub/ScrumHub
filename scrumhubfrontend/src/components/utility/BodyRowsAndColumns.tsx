import { Badge, Dropdown, Progress, Tag } from "antd";
import { IPeopleList, IPerson, IProductBacklogItem, ITask } from "../../appstate/stateInterfaces";
import "../Home.css";
import "../Main.css";
import { DownOutlined, HomeOutlined } from "@ant-design/icons";
import { isArrayValid } from "./commonFunctions";
import React from "react";
import { assignPerson } from "./BacklogHandlers";
import { MenuWithPeopleSave } from "./LoadAnimations";

export const backlogPriorities = ["Could", "Should", "Must"];
export const backlogColors = ["green", "blue", "red"];

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
      {record.status.replace("In", "In ")}
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

export const peopleDropdown =(record:ITask, token:string, ownerName:string, people:IPeopleList)=>{return (
  <Dropdown.Button style={{ cursor: "pointer" }} placement='bottomCenter' type="text"
    overlay={<MenuWithPeopleSave itemSelected={function (person: string): void { assignPerson(person, record.id, record.assigness, token, ownerName) }} visible={true} people={people} taskPeople={record.assigness} />}
    buttonsRender={() => [
      <></>, React.cloneElement(<span>
        <Badge size='small'
          status={typeof record.assigness !== "undefined" && record.assigness.length > 0 ? "success" : "error"} />
        {typeof record.assigness !== "undefined" && record.assigness.length > 0
          ? (record.assigness.at(0).login as string) + " " : "Not Assigned "}
        <DownOutlined />
      </span>),]} > </Dropdown.Button>)};

export const priorityPBItem =(item:IProductBacklogItem)=>{
  return( item.id !== 0 ? <Tag style={{ cursor: "pointer" }} color={backlogColors[item.priority % 3]}>{backlogPriorities[item.priority % 3]}</Tag> : <Tag className='transparentItem' color={backlogColors[0]}>{backlogPriorities[0]}</Tag>);
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
    const filtered = isArrayValid(item.tasks) ? item.tasks.filter((item: ITask) => !item.finished).length :0;
    return (
      <Progress width={25} percent={100} size='small' type="dashboard" status={`${filtered === 0 ? "success":"exception"}`}
        format={() => `${filtered}`} />)
  }
};

export const pbiProgressTagCol = {
  title: 'Tasks Done', width: "20%", key: 'tag', align: "center" as const, render: (item: IProductBacklogItem) => {
    return (<Tag style={{ cursor: "pointer" }} color={item.estimated ? (item.expectedTimeInHours > 10 ? "red" : "green") : "purple"}>
      {(item.tasks && item.tasks.length > 0 ? (item.tasks.filter((item: ITask) => item.finished).length + "/" + item.tasks.length) : "0/0") + " Tasks Done"}</Tag>)
  }
};

export const routes = (ownerName: string | null, sprintID: string, location: any) =>
  [
    {
      path: location.pathname,
      key: "location",
      breadcrumbName: "Projects / " + (location.pathname as string).slice(1).replaceAll("/", " / ").replace("active-sprint","Active Sprint").replace("sprints","Sprints"),
      icon: <HomeOutlined />,
    }];