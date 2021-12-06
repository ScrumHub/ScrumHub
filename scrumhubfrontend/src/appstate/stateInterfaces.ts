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
  message: string;
  metadata: any;
  successful: boolean;
}

export interface IProductBacklogItem {
  id: number;
  name: string;
  finished: boolean;
  expectedTimeInHours: number;
  estimated: boolean;
  sprintNumber: number|null;
  isInSprint: boolean;
  timeSpentInHours: number;
  priority: number;
  acceptanceCriteria: string[];
  tasks: any
}

export interface IAddPBI {
  name: string;
  priority: number;
  acceptanceCriteria: string[];
}

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

export const initAddPBI: IAddPBI = {
  name: "Item",
  priority: 0,
  acceptanceCriteria: ["criteria", "criteria2"],
};

export interface IProductBacklogList {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
  realSize: number;
  list: IProductBacklogItem[];
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
  tasks: [],
};

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
  goal: "Goal 1",
  backlogItems: [initProductBacklogItem],
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
  pbiPage : IProductBacklogList;
  repositories: IRepositoryList | any;
  openRepository: IRepository | null;
  reposLastPage: boolean;
  reposRequireRefresh: boolean;
  productLastPage: boolean;
  productRequireRefresh: boolean;
  sprintLastPage: boolean;
  sprintRequireRefresh: boolean;
  sprintPage: ISprintList;
  openSprint:ISprint|null;
  repoId: number;
  ownerName: string;
};

export const initState: State = {
  loading: false,
  error: {
    hasError: false,
    errorCode: 0,
    erorMessage: "",
  },
  pbiPage:initProductBacklogList,
  sprintPage:initSprintList,
  redirect: null,
  pages: 1,
  repositories: [],
  openSprint:null,
  openRepository: null,
  reposLastPage: false,
  reposRequireRefresh: false,
  productLastPage: false,
  productRequireRefresh: false,
  sprintLastPage: false,
  sprintRequireRefresh: false,
  repoId:-1,
  ownerName:""
};