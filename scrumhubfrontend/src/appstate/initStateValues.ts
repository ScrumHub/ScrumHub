import moment from "moment";
import config from "../configuration/config"
import { IAddPBI, IAssignPBI, IFilters, IPBIFilter, IPeopleList, IPerson, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList, ITaskNamed, IUpdateIdSprint, State } from "./stateInterfaces";

export const initTask: ITask = {
  id: 0,
  name: "",
  finished: false,
  pbiId: 0,
  isAssignedToPBI: false,
  link: "",
  assigness: [],
};


export const initTaskNamed: ITaskNamed = {
  id: 0,
  name: "",
  finished: false,
  pbiId: 0,
  pbiName: "",
  isAssignedtoPBI: false,
  link: "",
};


export const initTaskList: ITaskList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 5,
  realSize: 5,
  list: [],
};



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
  name: "Tasks To Assign",
  finished: false,
  expectedTimeInHours: 2,
  estimated: true,
  sprintNumber: 0,
  isInSprint: false,
  timeSpentInHours: 0,
  priority: -1,
  acceptanceCriteria: [""],
  tasks: [],
};

export const initAddPBI: IAddPBI = {
  name: "Item",
  priority: 0,
  acceptanceCriteria: ["criteria", "criteria2"],
};


export const initAssignPBI: IAssignPBI = {
  name: "",
  id: 0,
  isInSprint: false
};


export const initPBIFilter: IPBIFilter = {
  pageNumber: config.defaultFilters.page,
  pageSize: config.defaultFilters.pbiSize,
  nameFilter: "",
};


export const initSprintFilter: IFilters = {
  pageNumber: config.defaultFilters.page,
  pageSize: config.defaultFilters.sprintSize,
  nameFilter: "",
};



export const initProductBacklogList: IProductBacklogList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 10,
  list: [],
};


export const initSprint: ISprint = {
  sprintNumber: 1,
  title: "",
  goal: "",
  backlogItems: [initProductBacklogItem],
  finishDate: "",
  isCurrent: false,
  status: "New",
  isCompleted: false,
}

export const initSprint2: ISprint = {
  sprintNumber: 2,
  goal: "",
  backlogItems: [],
  finishDate: "",
  isCurrent: false,
  status: "New",
  isCompleted: false,
  title: ""
}


export const initUpdateSprint: IUpdateIdSprint = {
  goal: "Goal 1",
  pbIs: [],
  finishDate: moment(),
  title: ""
}

export const initSprintList: ISprintList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 10,
  list: [],
};

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

export const initPeople: IPerson = {
  name: "string",
  login: "string",
  gitHubId: 0,
  avatarLink: "string",
  isCurrentUser: true
}


export const initPeopleList: IPeopleList =
{
  pageNumber: 0,
  pageCount: 0,
  pageSize: 0,
  realSize: 0,
  list: []
}
export const initRepositoryList: IRepositoryList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 0,
  list: [],
}

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
  people: initPeopleList,
  currentUser: null,
  activeSprintNumber: -1
};
export const backlogSprint: ISprint = { 
  goal: "",
  finishDate: "",
  isCurrent: false,
  status: "New",
  isCompleted: false, sprintNumber: 0, 
  title: "Product Backlog", 
  backlogItems: [] }
