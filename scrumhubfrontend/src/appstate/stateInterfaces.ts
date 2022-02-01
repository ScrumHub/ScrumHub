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

export interface IBacklogItem {
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

export interface IAddBI {
  name: string;
  priority: number;
  acceptanceCriteria: string[];
}
export interface IAssignBI {
  name: string;
  id: number;
  isInSprint:boolean;
}
export interface IBIFilter {
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

export interface IBacklogItemList extends IFetchedList{
  list: IBacklogItem[];
}

export interface ISprint {
  sprintNumber: number;
  title:string;
  goal: string;
  backlogItems: IBacklogItem[];
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
  backlogItems: IBacklogItem[] | any;
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

export type BodyRowTypes = ISprint | IBacklogItem | ITask;
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
  pbiPage: IBacklogItemList;
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
  namedPBI: IAssignBI[];
  people: IPeopleList;
  activeSprintNumber:number;
  currentUser: IPerson;
  keys:tableKeys;
  loadingKeys:tableKeys;
  changedRepo:string;
};