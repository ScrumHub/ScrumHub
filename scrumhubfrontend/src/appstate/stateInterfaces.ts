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

export type State = {
  loading: boolean;
  error: Error;
  redirect: string | null;
  pages: number;
  pbiPage : IProductBacklogList;
  repositories: IRepositoryList | any;
  openRepository: IRepository | any;
  reposLastPage: boolean;
  reposRequireRefresh: boolean;
  productLastPage: boolean;
  productRequireRefresh: boolean;
  sprintLastPage: boolean;
  sprintRequireRefresh: boolean;
  repoId: number;
  ownerName: string;
};
export interface IProductBacklogItem {
  id: number;
  name: string;
  finished: boolean;
  expectedTimeInHours: number;
  estimated: boolean;
  sprintNumber: number;
  isInSprint: boolean;
  timeSpentInHours: number;
  priority: number;
  acceptanceCriteria: string[];
  tasks: any
}

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
  list: [initProductBacklogItem],
};


export interface ISprint {
  sprintNumber: number;
  goal: string;
  backlogItems: IProductBacklogItem[] | any
}

export const initSprint: ISprint = {
  sprintNumber: 1,
  goal: "Goal 1",
  backlogItems: [initProductBacklogItem],
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

export const initState: State = {
  loading: false,
  error: {
    hasError: false,
    errorCode: 0,
    erorMessage: "",
  },
  pbiPage:initProductBacklogList,
  redirect: null,
  pages: 1,
  repositories: [],
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