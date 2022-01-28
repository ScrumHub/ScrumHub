import { HomeOutlined } from '@ant-design/icons';
import { NavigateFunction } from 'react-router';
import { IPeopleList, IBacklogItem, ISprint } from '../../appstate/stateInterfaces';
import "../Home.css";
import "../Main.css";
import { IModals, ISortedInfo, IFilteredInfo } from './commonInterfaces';
import { pbiNameCol, pbiProgressCol, pbiToDoCol, pbiPriorityCol, pbiStoryPointsCol, pbiStatusCol, pbiActionCol } from './PBITableColumns';
import { sprintNrCol, sprintTitleCol, sprintDateCol, sprintStoryPtsCol, sprintStatusCol, sprintActCol } from './SprintTableColumns';
import { taskNameCol, taskStatusCol, taskPplCol, taskBranchCol, taskGhLinkCol } from './TaskTableColumns';

export const dragCmpnts = (DraggableBodyRow: any) => { return ({ body: { row: DraggableBodyRow, }, }) };
export const backlogPriorities = ["Could", "Should", "Must"];
export const backlogColors = ["green", "blue", "red"];

/**
 * Returns columns for Task Table
 */
export const taskColumns = (peopleFilter: string[], token: string, ownerName: string, people: IPeopleList,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>, isModal: IModals) => {
  return ([taskNameCol, taskStatusCol, taskPplCol(peopleFilter, token, ownerName, people),
    taskBranchCol(token, ownerName, setIsModal, isModal), taskGhLinkCol])
};

/**
 * Returns columns for Backlog Item Table
 */
export const pbiColumns = (nameFilter: string[], sortedInfo: ISortedInfo, filteredInfo: IFilteredInfo,
  setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>, isModal: IModals,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>, pbiKeys: number[], token: string, ownerName: string) => {
  return ([
    pbiNameCol(nameFilter, sortedInfo, setSelectedPBI, isModal, setIsModal),
    pbiProgressCol, pbiToDoCol,
    pbiPriorityCol(filteredInfo, sortedInfo, pbiKeys, token, ownerName),
    pbiStoryPointsCol(sortedInfo, setSelectedPBI, isModal, setIsModal),
    pbiStatusCol(sortedInfo), pbiActionCol(setSelectedPBI, isModal, setIsModal)])
};

/**
 * Returns columns for Sprint/Product Backlog Table
 */
export const sprintColumns = (ownerName: string, navigate: NavigateFunction, sortedInfo: ISortedInfo, filteredInfo: IFilteredInfo,
  setSelectedSprint: React.Dispatch<React.SetStateAction<ISprint>>, isModal: IModals,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ([sprintNrCol(ownerName, navigate), sprintTitleCol, sprintDateCol, sprintStoryPtsCol,
  sprintStatusCol(sortedInfo, filteredInfo, setSelectedSprint, isModal, setIsModal),
  sprintActCol(setSelectedSprint, isModal, setIsModal),]);
}

/**
 * Returns routes for the given location
 */
export const routes = (ownerName: string | null, sprintID: string, location: any) =>
  [
    {
      path: location.pathname,
      key: "location",
      breadcrumbName: "Projects / " + (location.pathname as string).slice(1).replaceAll("/", " / ")
        .replace("active-sprint", "Active Sprint").replace("sprints", "Sprints"),
      icon: <HomeOutlined />,
    }];