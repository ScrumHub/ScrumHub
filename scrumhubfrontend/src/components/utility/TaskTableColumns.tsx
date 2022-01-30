import { Badge, Button, Dropdown, Popconfirm, Popover, Space } from "antd";
import { IPeopleList, ITask, IPerson } from "../../appstate/stateInterfaces";
import "../Home.css";
import "../Main.css";
import { BranchesOutlined, DownOutlined, LoadingOutlined } from "@ant-design/icons";
import { isArrayValid, isBranchNotCreated, isInReviewOrFinished } from "./commonFunctions";
import React from "react";
import { assignPerson, startTask } from "./BacklogHandlers";
import { PBIMenuWithPeople } from "./LoadAnimations";
import { IModals } from "./commonInterfaces";

/*task columns functionalities*/

/**
 * Render name for the given Task
 */
export const taskNameCol = {
  title: "Name",
  align: "left" as const,
  dataIndex: "name",
  width: "32%",
  key: "name",
};

/**
 * Render status for the given Task as a badge
 */
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

/**
 * Render people assigned to the given Task
 */
export const taskPplCol = (peopleFilter: string[], token: string, ownerName: string, people: IPeopleList) => {
  return ({
    key: "isAssignedToPBI", title: "Assignees", width: "22%", align: "center" as const,
    filterIcon: <></>, filters: [], filteredValue: peopleFilter || null,
    onFilter: (value: any, task: ITask) => isArrayValid(peopleFilter) && isArrayValid(task.assigness) ?
      task.assigness.filter((person: IPerson) => { return (peopleFilter.includes(person.login)) }).length > 0 : '',
    render: (record: ITask) => peopleDropdown(record, token, ownerName, people),
  })
};

/**
 * Render link for creating new branch the given Task
 */
export const taskBranchCol = (token: string, ownerName: string, setIsModal: React.Dispatch<React.SetStateAction<IModals>>, 
  isModal: IModals) => {
  return ({
    title: "Start Branch", key: "branch", width: "12%", align: "center" as const,
    render: (record: ITask) => {
      let save = false;
      return (save ? <LoadingOutlined /> : isBranchNotCreated(record.status) ?
        <Popover trigger="click"
          content={<>
            <div style={{ alignSelf: "center", marginBottom: "10%", textAlign: "center" }}>Start New Branch</div>
            <Space style={{ alignItems: "flex-end" }}>
              <Popconfirm title={"Are you sure you want to start a feature branch?"} 
              onConfirm={() => { save = true; startTask(token, ownerName, false, record.id); 
              setIsModal({ ...isModal, startBranchId: -1 }); }}>
                <Button key={"hotfix"} size='small' type="primary" >Feature</Button>
              </Popconfirm>
              <Popconfirm title={"Are you sure you want to start a hotfix branch?"} 
              onConfirm={() => { save = true; startTask(token, ownerName, true, record.id); setIsModal({ ...isModal, startBranchId: -1 }); }}>
                <Button key={"hotfix"} size='small' type="primary" color="deeppink">Hotfix</Button>
              </Popconfirm>
            </Space></>}>
          <span className="link-button">{"Create "}<BranchesOutlined /></span>
        </Popover> :
        <span hidden={isInReviewOrFinished(record.status)}>Created <BranchesOutlined /></span>)
    }
  })
};

/**
 * Render github link for the given Task
 */
export const taskGhLinkCol = {
  title: "Related Link",
  dataIndex: "link",
  key: "link",
  width: "12%",
  align: "right" as const,
  render: (text: string) => <a href={text}>{"See on GitHub"}</a>,
};

/**
 * Render dropdown for un/assigning for the given Task
 */
export const peopleDropdown = (record: ITask, token: string, ownerName: string, people: IPeopleList) => {
  return (
    <Dropdown.Button style={{ cursor: "pointer" }} placement='bottomCenter' type="text"
      overlay={<PBIMenuWithPeople
        itemSelected={function (person: string): void { assignPerson(person, record.id, record.assigness, token, ownerName) }}
        visible={true} people={people} taskPeople={record.assigness} />}
      buttonsRender={() => [
        <></>, React.cloneElement(<span>
          <Badge size='small'
            status={isArrayValid(record.assigness) ? "success" : "error"} />
          {isArrayValid(record.assigness) ? (record.assigness.at(0).login as string) + " " : "Not Assigned "}
          <DownOutlined />
        </span>),]} > </Dropdown.Button>)
};