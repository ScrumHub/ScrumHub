import { EditOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import Search from 'antd/lib/input/Search';
import { NavigateFunction } from 'react-router';
import { IPeopleList, IBacklogItem, ISprint } from '../../appstate/stateInterfaces';
import "../Home.css";
import "../Main.css";
import { isArrayValid } from '../utility/commonFunctions';
import { backlogColors, pbiFilterVals } from '../utility/commonInitValues';
import { IModals, ISortedInfo, IFilteredInfo } from '../utility/commonInterfaces';
import { pbiNameCol, pbiProgressCol, pbiToDoCol, pbiPriorityCol, pbiStoryPointsCol, pbiStatusCol, pbiActionCol, PriorityDropdown } from './PBITableColumns';
import { sprintNrCol, sprintTitleCol, sprintDateCol, sprintStoryPtsCol, sprintStatusCol, sprintActCol } from './SprintTableColumns';
import { taskNameCol, taskStatusCol, taskPplCol, taskBranchCol, taskGhLinkCol, taskPplSprintCol, taskNameSprintCol } from './TaskTableColumns';

export const dragCmpnts = (DraggableBodyRow: any) => { return ({ body: { row: DraggableBodyRow, }, }) };


/**
 * Renders name, status, assignees, createBranch, GitHub link columns
 * @returns columns for Task Table
 */
export const taskColumns = (peopleFilter: string[], token: string, ownerName: string, people: IPeopleList,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>, isModal: IModals) => {
  return ([taskNameCol, taskStatusCol, taskPplCol(peopleFilter, token, ownerName, people),
    taskBranchCol(token, ownerName, setIsModal, isModal), taskGhLinkCol])
};

/**
 * Renders Name, Progress, toDo, Story Points, Status, addTask columns
 * @returns columns for Backlog Item Table
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
 * Renders Number, Title, Goal, Deadline, Story Points, Status, Update columns
 * @returns  columns for Sprint/Product Backlog Table
 */
export const sprintColumns = (ownerName: string, navigate: NavigateFunction, sortedInfo: ISortedInfo, filteredInfo: IFilteredInfo,
  setSelectedSprint: React.Dispatch<React.SetStateAction<ISprint>>, isModal: IModals,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
  return ([sprintNrCol(ownerName, navigate), sprintTitleCol, sprintDateCol, sprintStoryPtsCol,
  sprintStatusCol(sortedInfo, filteredInfo, setSelectedSprint, isModal, setIsModal),
  sprintActCol(setSelectedSprint, isModal, setIsModal),]);
}

/**
 * Renders breadcrumb for the given location
 @returns @param routes for the given location
 */
export const routes = (ownerName: string | null, sprintID: string, location: any) =>
  [
    {
      path: location.pathname,
      key: "location",
      breadcrumbName: ("Projects / " + (location.pathname as string).slice(1).replaceAll("/", " / ").replace("sprints", "Sprints").split("active-sprint")[0]).concat
      (location.pathname.includes("active")?"Active Sprint":""),
      icon: <HomeOutlined />,
    }];

/**
 * Renders Name, Progress, toDo, Story Points, Status, addTask columns
 * @returns columns for Backlog Item Table in Sprint Backlog View
 */
   export  const pbiSprintColumns = (onSearch,sortedInfo,nameFilter, pbiKeys:number[],token: string, ownerName: string,setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>, isModal: IModals,
      setIsModal: React.Dispatch<React.SetStateAction<IModals>>) => {
      return ([
      {
        title: 'Name', width: "33%", ellipsis: true,
        filterIcon: <SearchOutlined/>, filterDropdown:()=>
        <Search autoComplete='on' placeholder="Input Backlog Item name" onSearch={onSearch} enterButton />,
        filters: [], filteredValue: nameFilter || null,
        onFilter: (value: any, record: IBacklogItem) => isArrayValid(nameFilter) ? record.name.toLowerCase().includes(nameFilter.at(0).toLowerCase()) : '',
        sorter: {
          compare: (a: IBacklogItem, b: IBacklogItem) => a.name > b.name,
          multiple: 1,
        }, align: "left" as const, key: 'name', render: (item: IBacklogItem) => {
          return (<div><div style={{ display: "inline-block" }} className={item.id === 0 ? '' : 'link-button'}
            onClick={() => { if (item.id !== 0) { setSelectedPBI(item); setIsModal({ ...isModal, editPBI: true }); } }}>{item.name}</div></div>)
        },
      },
      pbiProgressCol, pbiToDoCol,
      {
        title: 'Priority', sorter: { compare: (a: IBacklogItem, b: IBacklogItem) => a.priority - b.priority, multiple: 1, }, align: "center" as const, width: "15%", key: 'pbiPriority',
        filters: pbiFilterVals, onFilter: (value: any, item: IBacklogItem) => item.priority === value,
        render: (item: IBacklogItem) =>
      <PriorityDropdown loading={pbiKeys.includes(item.id)} record={item} token={token} ownerName={ownerName} />
      },
      {
        title: 'Story Points', sorter: {
          compare: (a: IBacklogItem, b: IBacklogItem) => a.priority - b.priority,
          multiple: 1,
        }, width: "12%", key: 'storyPoints', align: "center" as const, 
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
      },
      pbiStatusCol(sortedInfo),
      pbiActionCol(setSelectedPBI, isModal, setIsModal)])};

/**
 * Renders name, status, assignees, createBranch, GitHub link columns
 * @returns columns for Task Table in Sprint Backlog View
 */
export const taskSprintColumns = (item:IBacklogItem, peopleFilter: string[], token: string, ownerName: string, people: IPeopleList,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>, isModal: IModals) => {
  return ([taskNameSprintCol(item), taskStatusCol, taskPplSprintCol(peopleFilter, token, ownerName, people),
    taskBranchCol(token, ownerName, setIsModal, isModal), taskGhLinkCol])
};