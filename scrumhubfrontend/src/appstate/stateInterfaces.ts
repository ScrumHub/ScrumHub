import { string } from "joi";
import config from "../configuration/config"

export type Error = {
  hasError: boolean;
  errorCode: number;
  erorMessage: string;
};
export interface IFilters {
  [name: string]: any;
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
}

export interface ITask {
  id: number;
  name: string;
  finished: boolean;
  pbiId: number;
  isAssignedToPBI: boolean;
  link: string;
  assigness: IPeople[];
}

export const initTask: ITask = {
  id: 0,
  name: "",
  finished: false,
  pbiId: 0,
  isAssignedToPBI: false,
  link: "",
  assigness: [],
};

// export const initTask2: ITask = {
//   id: 1,
//   name: "",
//   finished: false,
//   pbiId:1,
//   isAssignedToPBI:false,
//   link:"",
// };

export interface ITaskNamed {
  id: number;
  name: string;
  finished: boolean;
  pbiId: number;
  pbiName: string;
  isAssignedtoPBI: boolean;
  link: string;
}

export const initTaskNamed: ITaskNamed = {
  id: 0,
  name: "",
  finished: false,
  pbiId: 0,
  pbiName: "",
  isAssignedtoPBI: false,
  link: "",
};

export interface ITaskList {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  realSize: number;
  list: ITask[];
}

export const initTaskList: ITaskList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 5,
  realSize: 5,
  list: [],
};


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

export const backlogPriorities = ["Could", "Should", "Must"];
export const backlogColors = ["green", "blue", "red"];


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

export const initProductBacklogItem: IProductBacklogItem = {
  id: 0,
  name: "Item",
  finished: false,
  expectedTimeInHours: 2,
  estimated: true,
  sprintNumber: 0,
  isInSprint: false,
  timeSpentInHours: 0,
  priority: 0,
  acceptanceCriteria: ["criteria", "criteria2"],
  tasks: [initTask],
};
export const init2ProductBacklogItem: IProductBacklogItem = {
  id: 1,
  name: "Second",
  finished: false,
  expectedTimeInHours: 2,
  estimated: true,
  sprintNumber: 0,
  isInSprint: false,
  timeSpentInHours: 0,
  priority: 0,
  acceptanceCriteria: ["criteria", "criteria2"],
  tasks: [],
};

export const unassignedPBI: IProductBacklogItem = {
  id: 0,
  name: "Unassigned Tasks",
  finished: false,
  expectedTimeInHours: 2,
  estimated: true,
  sprintNumber: 0,
  isInSprint: false,
  timeSpentInHours: 0,
  priority: 0,
  acceptanceCriteria: [""],
  tasks: [],
};

export interface IAddPBI {
  name: string;
  priority: number;
  acceptanceCriteria: string[];
}

export const initAddPBI: IAddPBI = {
  name: "Item",
  priority: 0,
  acceptanceCriteria: ["criteria", "criteria2"],
};

export interface IAssignPBI {
  name: string;
  id: number;
}

export interface ICheckedAssignPBI extends IAssignPBI {
  name: string;
  id: number;
  checked: boolean;
}

export const initAssignPBI: IAssignPBI = {
  name: "",
  id: 0,
};

export interface IPBIFilter {
  pageNumber: number;
  pageSize: number;
  nameFilter?: string;
  finished?: boolean;
  estimated?: boolean;
  inSprint?: boolean;
}

export const initPBIFilter: IPBIFilter = {
  pageNumber: config.defaultFilters.page,
  pageSize: config.defaultFilters.pbiSize,

};


export interface IProductBacklogList {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  realSize: number;
  list: IProductBacklogItem[];
}

export const initProductBacklogList: IProductBacklogList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 10,
  list: [],
};

export interface ISprint extends IUpdateSprint {
  sprintNumber: number;
}

export const initSprint: ISprint = {
  sprintNumber: 1,
  goal: "",
  backlogItems: [initProductBacklogItem],
}

export const initSprint2: ISprint = {
  sprintNumber: 2,
  goal: "",
  backlogItems: [],
}

export interface IUpdateSprint {
  goal: string;
  backlogItems: IProductBacklogItem[]
}

export interface IUpdateIdSprint {
  "goal": string;
  "pbIs": string[]
}

export const initUpdateSprint: IUpdateSprint = {
  goal: "Goal 1",
  backlogItems: [initProductBacklogItem],
}

export interface ISprintList {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 10,
  list: ISprint[];
}

export const initSprintList: ISprintList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 10,
  list: [],
};

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

export const initRepository: IRepository = {
  name: "Repo",
  gitHubId: 0,
  hasAdminRights: true,
  alreadyInScrumHub: true,
  backlogItems: [initProductBacklogItem],
  sprints: [initSprint],
  description: "",
  dateOfLastActivity: null,
  typeOfLastActivity: ""
}

export interface IPeople {
  name: string;
  login: string;
  gitHubId: number;
  avatarLink:string;
  isCurrentUser:boolean;
}

export const initPeople: IPeople = {
  "name": "string",
  "login": "string",
  "gitHubId": 0,
  "avatarLink": "string",
  "isCurrentUser": true
}


export interface IPeopleList {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  realSize: number;
  list: IPeople[];
}

export const initPeopleList: IPeopleList =
{
  "pageNumber": 0,
  "pageCount": 0,
  "pageSize": 0,
  "realSize": 0,
  "list": [
    {
      "name": "string",
      "login": "string",
      "gitHubId": 0,
      "avatarLink": "string",
      "isCurrentUser": true
    }
  ]
}

export interface IRepositoryList {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  realSize: number;
  list: IRepository[];
}

export const initRepositoryList: IRepositoryList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 0,
  list: [],
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
  people: IPeople[];
};

export const initError = {
  hasError: false,
  errorCode: 0,
  erorMessage: "",

}

export const initState: State = {
  loading: false,
  error: initError,
  pbiPage: initProductBacklogList,
  sprintPage: initSprintList,
  taskPage: initTaskList,
  redirect: null,
  pages: 1,
  repositories: [],
  openSprint: null,
  openRepository: null,
  reposLastPage: false,
  reposRequireRefresh: false,
  productLastPage: false,
  productRequireRefresh: false,
  sprintLastPage: false,
  sprintRequireRefresh: false,
  taskLastPage: false,
  taskRequireRefresh: false,
  tasks: [],
  namedPBI: [],
  repoId: -1,
  ownerName: "",
  people: []
};