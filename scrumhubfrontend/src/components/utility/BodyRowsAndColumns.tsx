import { Badge, Progress, Tag } from "antd";
import { IProductBacklogItem, ITask } from "../../appstate/stateInterfaces";
import "../Home.css";
import { HomeOutlined } from "@ant-design/icons";

export const backlogPriorities = ["Could", "Should", "Must"];
export const backlogColors = ["green", "blue", "red"];

//tassk columns
export const taskNameCol = {
  title: "Name",
  align: "left" as const,
  dataIndex: "name",
  width:"60%",
  key: "name",
};
export const taskStatusCol = {
  title: "Status",
  key: "finished",
  dataIndex: "finished",
  width:"15%",
  align: "center" as const,
  render: (val: boolean) => (
    <span>
      <Badge size='small' status={val ? "success" : "error"} />
      {val ? "Finished" : "In Progress"}
    </span>
  ),
};
export const taskAssigneeCol =
{
  key: "isAssignedToPBI",
  title: "Assigned",
  width:"20%",
  render: (record: ITask) => (
    <span>
      <Badge size='small'
        status={
          typeof record.assigness !== "undefined" &&
            record.assigness.length > 0
            ? "success"
            : "error"
        }
      />
      {typeof record.assigness !== "undefined" && record.assigness.length > 0
        ? (record.assigness.at(0).login as string)
        : "Not Assigned"}
    </span>
  ),
  align: "center" as const,
};
export const taskGhLinkCol = {
  title: "Related Link",
  dataIndex: "link",
  key: "link",
  width:"10%",
  align: "right" as const,
  render: (text: string) => <a href={text}>{"See on GitHub"}</a>,
};

export const pbiPriorityCol = {
  title: 'Priority', align: "center" as const, colSpan: 1, key: 'priority',
  render: (item: IProductBacklogItem) => item.id !== 0 ?
    <Tag color={backlogColors[item.priority%3]}>{backlogPriorities[item.priority%3]}</Tag>
    : <></>

};
export const pbiProgressCol ={
  title: 'Progress', width:"20%", key: 'operation', align: "center" as const, render: (item: IProductBacklogItem) => {
    return (item.id===0?<span></span>:<span><Progress  width={25} size='small' type="line" showInfo={false} percent={item.tasks && item.tasks.length > 0 ? (item.tasks.filter((item: ITask) => item.finished).length / item.tasks.length):100}
     /*format={percent => `${item.tasks?item.tasks.filter((item: ITask) => item.finished).length:0}`}*/ ></Progress></span>
    )
  }
};
export const pbiProgressCol2 ={
  title: 'Tasks To Do', width:"15%", key: 'tasks', align: "center" as const, render: (item: IProductBacklogItem) => {
    return (
    <Progress width={25} percent={100}  size='small' type="dashboard" status={`${item.tasks && item.tasks.length > 0 ? (item.tasks.filter((item: ITask) => item.finished).length / item.tasks.length) !== 0 ? "success" : "exception" : "success"}`}
     format={() => `${item.tasks ? item.tasks.length:0}`} />)
  }
};

export const pbiProgressTagCol ={
  title: 'Tasks Done', width:"20%", key: 'operation', align: "center" as const, render: (item: IProductBacklogItem) => {
    return (<Tag style={{cursor:"pointer"}} color={item.estimated ?(item.expectedTimeInHours>10?"red":"green"):"purple"}>
    {(item.tasks && item.tasks.length > 0 ?(item.tasks.filter((item: ITask) => item.finished).length+"/"+item.tasks.length):"0/0")+" Tasks Done"}</Tag>)
  }
};

export const routes = (ownerName: string|null, sprintID: string, location:any) => 
[
  {path: "/",
  key: 0,
  breadcrumbName: "Projects",
  icon: <HomeOutlined/>,},
  {
    path: location.pathname,
    key: 1,
    breadcrumbName: (location.pathname as string).slice(1).replaceAll("/", " / "),
  }];


/*(ownerName && ownerName!==null ?
  (sprintID && sprintID!=="0" ?:[
      {path: "/",
      key: 0,
      breadcrumbName: "Projects",
      icon: <HomeOutlined/>},
    {
      path: location.pathname,
      key: 1,
      breadcrumbName: "?"+ownerName.replaceAll("/", " / "),
    },]):[{path: "/",
    key: 0,
    breadcrumbName: "Projects",
    icon: <HomeOutlined/>},]*/