import  { Moment } from "moment";
import { tableKeys } from "../components/utility/commonInterfaces";

export type Error = {
  hasError: boolean;
  errorCode: number;
  erorMessage: string;
};
export interface IFilters {
  [name: string]: any|any[];
}
export interface IFiltersAndToken {
  filters: IFilters;
  token: string;
}

export interface IError {
  data: any;
  Message: string;
  metadata: any;
  successful: boolean;
  title?:string;
}

export interface IMessCodeError {
  Message: string;
  code:number;
}

export interface ITask {
  assigness: IPerson[]|any[];
  id: number;
  name: string;
  finished: boolean;
  pbiId: number;
  isAssignedToPBI: boolean;
  link: string;
  status:string;
}


export interface ITaskNamed {
  id: number;
  name: string;
  finished: boolean;
  pbiId: number;
  pbiName: string;
  isAssignedtoPBI: boolean;
  link: string;
}

export interface ITaskList {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  realSize: number;
  list: ITask[];
}

export interface IProductBacklogItem {
  id: number;
  name: string;
  finished: boolean;
  expectedTimeInHours: number;
  estimated: boolean;
  sprintNumber: number | null;
  isInSprint: boolean;
  timeSpentInHours: number;
  priority: number;
  acceptanceCriteria: string[];
  tasks: ITask[]
}

export interface ICheckedProductBacklogItem {
  checked: boolean;
  id: number;
  name: string;
  finished: boolean;
  expectedTimeInHours: number;
  estimated: boolean;
  sprintNumber: number | null;
  isInSprint: boolean;
  timeSpentInHours: number;
  priority: number;
  acceptanceCriteria: string[];
  tasks: ITask[]
}
export interface IAddPBI {
  name: string;
  priority: number;
  acceptanceCriteria: string[];
}
export interface IAssignPBI {
  name: string;
  id: number;
  isInSprint:boolean;
}

export interface ICheckedAssignPBI extends IAssignPBI {
  name: string;
  id: number;
  
  checked: boolean;
}
export interface IPBIFilter {
  pageNumber: number;
  pageSize: number;
  nameFilter?: string;
  finished?: boolean;
  estimated?: boolean;
  inSprint?: boolean;
}

export interface IProductBacklogList {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  realSize: number;
  list: IProductBacklogItem[];
}

export interface ISprint {
  sprintNumber: number;
  title:string;
  goal: string;
  backlogItems: IProductBacklogItem[];
  finishDate: string|Date;
  isCurrent: boolean;
  status: string;
  isCompleted: boolean;
}
export interface IUpdateIdSprint {
  goal: string;
  pbIs: string[];
  finishDate: string|Date|Moment;
  title:string;
}


export interface ISprintList {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 10,
  list: ISprint[];
}


export interface IRepository {
  name: string;
  description: string;
  dateOfLastActivity: Date | string | null;
  typeOfLastActivity: string;
  gitHubId: number;
  hasAdminRights: boolean;
  alreadyInScrumHub: boolean;
  backlogItems: IProductBacklogItem[] | any;
  sprints: ISprint[] | any;
}

export interface IPerson {
  avatarLink:string;
  gitHubId: number;
  isCurrentUser:boolean;
  login: string;
  name: string|null;
}



export interface IPeopleList {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  realSize: number;
  list: IPerson[];
}

export type BodyRowTypes = ISprint | IProductBacklogItem | ITask;
export interface IRepositoryList {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  realSize: number;
  list: IRepository[];
}

export type State = {
  loading: boolean;
  error: Error;
  redirect: string | null;
  pages: number;
  pbiPage: IProductBacklogList;
  repositories: IRepositoryList | any;
  openRepository: IRepository | null;
  reposLastPage: boolean;
  reposRequireRefresh: boolean;
  productLastPage: boolean;
  productRequireRefresh: boolean;
  sprintLastPage: boolean;
  sprintRequireRefresh: boolean;
  sprintPage: ISprintList;
  taskLastPage: boolean;
  taskRequireRefresh: boolean;
  taskPage: ITaskList;
  tasks: ITask[] | ITaskNamed[];
  openSprint: ISprint | null;
  repoId: number;
  ownerName: string;
  namedPBI: IAssignPBI[];
  people: IPeopleList;
  activeSprintNumber:number;
  currentUser: IPerson;
  keys:tableKeys;
};
