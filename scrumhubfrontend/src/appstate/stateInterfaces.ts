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

export interface ITaskList extends IFetchedList {
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
export interface IPBIFilter {
  pageNumber: number;
  pageSize: number;
  nameFilter?: string;
  finished?: boolean;
  estimated?: boolean;
  inSprint?: boolean;
}

export interface IFetchedList {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  realSize: number;
}

export interface IProductBacklogList extends IFetchedList{
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

export interface ISprintList extends IFetchedList{
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

export interface IPeopleList extends IFetchedList{
  list: IPerson[];
}

export type BodyRowTypes = ISprint | IProductBacklogItem | ITask;
export interface IRepositoryList extends IFetchedList{
  list: IRepository[];
}
export interface ILoginState {
  isLoggedIn: boolean,
  token: string,
  client_id: string,
  redirect_uri: string,
  client_secret: string,
  proxy_url:string
}
export interface IState {
  loginState:ILoginState;
  loading: boolean;
  error: Error;
  pbiPage: IProductBacklogList;
  repositories: IRepositoryList | any;
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
  tasks: ITask[];
  openSprint: ISprint | null;
  repoId: number;
  namedPBI: IAssignPBI[];
  people: IPeopleList;
  activeSprintNumber:number;
  currentUser: IPerson;
  keys:tableKeys;
  loadingKeys:tableKeys;
  changedRepo:string;
};