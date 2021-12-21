import { Badge, InputNumber, Progress, Statistic, Tag } from "antd";
import { any } from "joi";
import { useEffect, useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import { render } from "react-dom";
import { IProductBacklogItem, ITask } from "../../appstate/stateInterfaces";
import { type } from "../BacklogTable";
import { BodyRowProps } from "./commonInterfaces";
import "../Home.css";

//rows
export const NonDraggableBodyRow = ({
  index:index_row,
  className,
  style,
  ...restProps
}: BodyRowProps) => {
  const ref = useRef();
  //console.log(ref);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const index = monitor.getItem() || ({} as number);
      if (index === index_row) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          (index as number) < index_row
            ? " drop-over-downward"
            : " drop-over-upward",
      };
    },
    drop: (item: any) => {
      //console.log(item);
      if (item.index && typeof item.index != "undefined") {
        //console.log("move backlog item");
        //moveRow(item.index, index_row);
      }
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index: index_row },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(ref);
  return (
    <tr
      ref={ref as any}
      className={`${className}${isOver ? dropClassName : ""}`}
      style={{ marginTop: "20px", marginBottom: "20px", ...style }}
      {...restProps}
    />
  );
};

export const DraggableBodyRowNested = ({
  index:index_row,
  className,
  style,
  ...restProps
}: BodyRowProps) => {
  const ref = useRef();
  //console.log(ref);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const index = monitor.getItem() || ({} as number);
      if (index === index_row) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          (index as number) < index_row
            ? " drop-over-downward"
            : " drop-over-upward",
      };
    },
    drop: (item: any) => {
      //console.log(item);
      if (item.index && typeof item.index != "undefined") {
        //console.log("move backlog item");
        //moveRow(item.index, index_row);
      }
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index: index_row },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref as any}
      className={`${className}${isOver ? dropClassName : ""}`}
      style={{
        cursor: "move",
        marginTop: "20px",
        marginBottom: "20px",
        ...style,
      }}
      {...restProps}
    />
  );
};

export const backlogPriorities = ["Could", "Should", "Must"];
export const backlogColors = ["green", "blue", "red"];

//tassk columns
export const taskNameCol = {
  title: "Name",
  align: "left" as const,
  dataIndex: "name",
  key: "name",
};
export const taskFinishCol = {
  title: "Finished",
  key: "finished",
  dataIndex: "finished",
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
  align: "right" as const,
  render: (text: string) => <a href={text}>{"See on GitHub"}</a>,
};

//sprint columns
//export const pbiNameCol = {title: 'Name',  align: "left" as const, colSpan: 2, dataIndex: 'name', key: 'name', render: (text: string) => { return ({ children: text, props: { colSpan: 2 } }) },};
export const pbiPriorityCol = {
  title: 'Priority', align: "center" as const, colSpan: 1, key: 'priority',
  render: (item: IProductBacklogItem) => item.id !== 0 ?
    <Tag color={backlogColors[item.priority%3]}>{backlogPriorities[item.priority%3]}</Tag>
    : <></>

};
export const pbiProgressCol ={
  title: 'Tasks Done', colSpan: 1, key: 'operation', align: "center" as const, render: (item: IProductBacklogItem) => {
    return (<span><Progress size='small' width={30} type="circle" status={`${item.tasks && item.tasks.length > 0 ? (item.tasks.filter((item: ITask) => item.finished).length / item.tasks.length) !== 0 ? "normal" : "exception" : "normal"}`} percent={item.tasks && item.tasks.length > 0 ?
      (item.tasks.filter((item: ITask) => item.finished).length / item.tasks.length)
      : 100} format={percent => `${item.tasks && item.tasks.length > 0 ? item.tasks.filter((item: ITask) => item.finished).length : 0}/${item.tasks && item.tasks.length > 0 ? item.tasks.length as number : 0}`}></Progress></span>)
  }
};