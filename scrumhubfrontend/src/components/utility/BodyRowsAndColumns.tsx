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
  width:"37%",
  key: "name",
};
export const taskStatusCol = {
  title: "Status",
  key: "finished",
  dataIndex: "finished",
  width:"28%",
  align: "center" as const,
  render: (val: boolean) => (
    <span>
      <Badge size='small' status={val ? "success" : "error"} />
      {val ? "Finished" : "In Progress"}
    </span>
  ),
};
export const taskGhLinkCol = {
  title: "Related Link",
  dataIndex: "link",
  key: "link",
  width:"15%",
  align: "right" as const,
  render: (text: string) => <a style={{paddingRight:"4%"}}href={text}>{"See on GitHub"}</a>,
};

export const pbiPriorityCol = {
  title: 'Priority', align: "center" as const, colSpan: 1, key: 'priority',
  render: (item: IProductBacklogItem) => item.id !== 0 ?
    <Tag color={backlogColors[item.priority%3]}>{backlogPriorities[item.priority%3]}</Tag>
    : <></>

};
export const pbiProgressCol ={
  title: 'Progress', sorter: {
    compare: (a: IProductBacklogItem, b: IProductBacklogItem) => a.priority - b.priority,
    multiple: 1,
  },width:"20%", key: 'progressBar', align: "center" as const, render: (item: IProductBacklogItem) => {
    return (<span><Progress  width={25} size='small' type="line" showInfo={false} percent={item.tasks && item.tasks.length > 0 ? 100*(item.tasks.filter((item: ITask) => item.finished).length / item.tasks.length):100}
     /*format={percent => `${item.tasks?item.tasks.filter((item: ITask) => item.finished).length:0}`}*/ ></Progress></span>
    )
  }
};
export const pbiProgressCol2 ={
  title: 'Tasks To Do', sorter: {
    compare: (a: IProductBacklogItem, b: IProductBacklogItem) => a.priority - b.priority,
    multiple: 1,
  },width:"15%", key: 'tasks', align: "center" as const, render: (item: IProductBacklogItem) => {
    return (
    <Progress width={25} percent={100}  size='small' type="dashboard" status={`${item.tasks && item.tasks.length > 0 ? (item.tasks.filter((item: ITask) => item.finished).length / item.tasks.length) !== 0 ? "success" : "exception" : "success"}`}
     format={() => `${item.tasks ? item.tasks.length:0}`} />)
  }
};

export const pbiProgressTagCol ={
  title: 'Tasks Done', width:"20%", key: 'tag', align: "center" as const, render: (item: IProductBacklogItem) => {
    return (<Tag style={{cursor:"pointer"}} color={item.estimated ?(item.expectedTimeInHours>10?"red":"green"):"purple"}>
    {(item.tasks && item.tasks.length > 0 ?(item.tasks.filter((item: ITask) => item.finished).length+"/"+item.tasks.length):"0/0")+" Tasks Done"}</Tag>)
  }
};

export const routes = (ownerName: string|null, sprintID: string, location:any) => 
[
  {
    path: location.pathname,
    key: "location",
    breadcrumbName: "Projects / "+(location.pathname as string).slice(1).replaceAll("/", " / "),
    icon: <HomeOutlined/>,    
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