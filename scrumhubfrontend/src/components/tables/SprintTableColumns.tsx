import { Button, Tag } from "antd";
import { ISprint } from "../../appstate/stateInterfaces";
import "../Home.css";
import "../Main.css";
import { AuditOutlined, CalendarOutlined, EditOutlined } from "@ant-design/icons";
import { dateFormat, formatSprintStatus, isArrayValid } from "../utility/commonFunctions";
import React from "react";
import { NavigateFunction } from "react-router";
import { IFilteredInfo, IModals, ISortedInfo } from "../utility/commonInterfaces";
import { sprintStatusVals } from "../utility/commonInitValues";

/*sprint columns functionalities*/

/**
 * Render Sprint number column, for the given Sprint
 */
export const sprintNrCol = (ownerName: string, navigate: NavigateFunction) => {
  return ({
    title: 'Number', width: "15%", align: "left" as const, key: 'sprintNumber',
    render: (s: ISprint) => {
      return (s.sprintNumber === 0 ?
        <div style={{ alignSelf: "flex-start" }} key={"sprintName" + s.sprintNumber} >{"Product Backlog"}</div>
        : (<div key={"sprintName" + s.sprintNumber} className='link-button'
          onClick={() => {
            localStorage.setItem("sprintID", JSON.stringify(s.sprintNumber));
            navigate(`/${(ownerName as string).split("/")[0]}/${(ownerName as string).split("/")[1]}/sprints/${s.sprintNumber}`,
              { replace: true });
          }}>{"Sprint " + s.sprintNumber}</div>))
    },
  })
};

/** Render sprint name for the given {@linkcode ISprint} sprint*/
export const sprintTitleCol = {
  title: 'Title', width: "27%", align: "center" as const, dataIndex: 'title',
  key: 'sprintTitle', ellipsis: true
};

/**
 * Render sprint status as a tag for the given Sprint
 */
export const sprintStatusRender = (record: ISprint, setSelectedSprint: React.Dispatch<React.SetStateAction<ISprint>>,
  isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return (
    record.sprintNumber !== 0 ?
      (record.isCompleted ?
        <Tag icon={<AuditOutlined style={{ color: "white" }} />} color={record.status === "Failed" ? "#cc3837" : "#4dc980"}
          style={{ color: "white", cursor: "pointer", }}
          onClick={() => { setSelectedSprint(record); setIsModal({ ...isModal, completeSprint: true }); }}>
          {formatSprintStatus(record.status)}
        </Tag> :
        <Tag icon={<EditOutlined style={{ color: "white" }} />} style={{ cursor: "pointer" }} color="#55acee"
          onClick={() => { setSelectedSprint(record); setIsModal({ ...isModal, completeSprint: true }); }} >
          {formatSprintStatus(record.status)}
        </Tag>) :
      <Tag className="transparentItem">
        <span>
          {"Not Finished"} <EditOutlined />
        </span>
      </Tag>);
}

/**
 * Render update link for the given Sprint
 */
export const sprintActCol = (setSelectedSprint: React.Dispatch<React.SetStateAction<ISprint>>, isModal: IModals, setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ({
    title: 'Action', width: "8%", align: "right" as const, key: 'action',
    render: (record: ISprint) => {
      return (<Button hidden={record.sprintNumber === 0} key={"action" + record.sprintNumber} size='small' type="link"
        onClick={() => { setSelectedSprint(record); setIsModal({ ...isModal, updateSprint: true }); }} >
        {"Update"}
      </Button>)
    },
  });
}


/**
 * Render sprint deadline for the given Sprint
 */
export const sprintDateCol = {
  title: 'Deadline', width: "15%", align: "center" as const, dataIndex: 'finishDate', key: 'finishDate',
  render: (date: string) =>
    <span hidden={!date}>
      <CalendarOutlined />{" " + (date ? dateFormat(date as string) : "")}
    </span>
};


/**
 * Calculate and render total Story Points value for the given Sprint
 */
export const sprintStoryPtsCol = {
  title: 'Story Points', width: "15%", align: "center" as const, key: 'finishDate',
  render: (item: ISprint) => {
    return <div hidden={item.sprintNumber === 0}>
      {(item && isArrayValid(item.backlogItems) ?
        (item.backlogItems.map(item => item.expectedTimeInHours).reduce((prev, next) => prev + next)) : 0) + " Story Points"}
    </div>
  }
};


/**
 * Return sprint status column for the given Sprint
 */
export const sprintStatusCol = (sortedInfo: ISortedInfo, filteredInfo: IFilteredInfo,
  setSelectedSprint: React.Dispatch<React.SetStateAction<ISprint>>, isModal: IModals,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ({
    key: "isCompleted", title: "completed", width: "15%", sorter: (a: ISprint, b: ISprint) => a.sprintNumber - b.sprintNumber,
    sortOrder: sortedInfo && sortedInfo.columnKey === "isCompleted" && sortedInfo.order,
    filteredValue: filteredInfo.complete || null, filters: sprintStatusVals,
    onFilter: (value: any, item: ISprint) => filteredInfo && isArrayValid(filteredInfo.complete) && item.sprintNumber !== 0 ?
      filteredInfo.complete.includes(Number(item.isCompleted)) : true,
    render: (record: ISprint) => sprintStatusRender(record, setSelectedSprint, isModal, setIsModal), align: "center" as const,
  })
};