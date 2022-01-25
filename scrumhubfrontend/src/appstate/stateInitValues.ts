import { tableKeys } from "../components/utility/commonInterfaces";
import config from "../configuration/config"
import { IAddBI, IAssignBI, IFilters, ILoginState, IBIFilter, IPeopleList, IPerson, IBacklogItem, IBacklogItemList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList, IState } from "./stateInterfaces";
import { validateUri } from "./stateUtilities";
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

export const errorObject = {
  code: 0,
  response: {
    data: null,
    Message: "Connection error",
    successful: false,
    metadata: null,
  },
};

export const initTask: ITask = {
  id: 0,
  name: "",
  finished: false,
  pbiId: 0,
  isAssignedToPBI: false,
  link: "",
  assigness: [],
  status:""
};
export const initTaskList: ITaskList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 5,
  realSize: 5,
  list: [],
};
export const initPBItem: IBacklogItem = {
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
export const init2ProductBacklogItem: IBacklogItem = {
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
export const unassignedPBI: IBacklogItem = {
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
export const initAddPBI: IAddBI = {
  name: "Item",
  priority: 0,
  acceptanceCriteria: ["criteria", "criteria2"],
};
export const initAssignPBI: IAssignBI = {
  name: "",
  id: 0,
  isInSprint: false
};
export const initPBIFilter: IBIFilter = {
  pageNumber: config.defaultFilters.page,
  pageSize: config.defaultFilters.pbiSize,
  nameFilter: "",
};
export const initSprintFilter: IFilters = {
  pageNumber: config.defaultFilters.page,
  pageSize: config.defaultFilters.sprintSize,
  nameFilter: "",
};
export const initProductBacklogList: IBacklogItemList = {
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
  backlogItems: [initPBItem],
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
};
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
  backlogItems: [initPBItem],
  sprints: [initSprint],
  description: "",
  dateOfLastActivity: null,
  typeOfLastActivity: ""
};
export const initPerson: IPerson = {
  name: "",
  login: "",
  gitHubId: 0,
  avatarLink: "",
  isCurrentUser: false
};
export const initPeopleList: IPeopleList =
{
  pageNumber: 0,
  pageCount: 0,
  pageSize: 0,
  realSize: 0,
  list: []
};
export const initRepositoryList: IRepositoryList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 0,
  list: [],
};
export const initError = {
  hasError: false,
  errorCode: 0,
  erorMessage: "",
};
export const initLoginState:ILoginState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === "undefined" ? false : JSON.parse(localStorage.getItem("isLoggedIn") as string) || false,
  token: localStorage.getItem('token') === "undefined" ? "" : JSON.parse(localStorage.getItem("token") as string) || "",
  client_id: validateUri(process.env.REACT_APP_CLIENT_ID),
  redirect_uri: validateUri(process.env.REACT_APP_REDIRECT_URI),
  client_secret: validateUri(process.env.REACT_APP_CLIENT_SECRET),
  proxy_url: validateUri(process.env.REACT_APP_PROXY_URL)
};
export const loggedOutLoginState :ILoginState = {
  isLoggedIn: false,
  token: "",
  client_id: validateUri(process.env.REACT_APP_CLIENT_ID),
  redirect_uri: validateUri(process.env.REACT_APP_REDIRECT_URI),
  client_secret: validateUri(process.env.REACT_APP_CLIENT_SECRET),
  proxy_url: validateUri(process.env.REACT_APP_PROXY_URL)
};
export const backlogSprint: ISprint = { 
  goal: "",
  finishDate: "",
  isCurrent: false,
  status: "New",
  isCompleted: false, sprintNumber: 0, 
  title: "Product Backlog", 
  backlogItems: [] };
  
export const initKeys: tableKeys = {
  sprintKeys: [0],
  pbiKeys: []
}

export const initLoadingKeys: tableKeys = {
  sprintKeys: [],
  pbiKeys: []
}

export const initState: IState = {
  loginState: initLoginState,
  loading: false,
  error: initError,
  pbiPage: initProductBacklogList,
  sprintPage: initSprintList,
  taskPage: initTaskList,
  repositories: [],
  openSprint: null,
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
  people: initPeopleList,
  currentUser: initPerson,
  activeSprintNumber: -1,
  keys: initKeys,
  loadingKeys: initLoadingKeys,
  changedRepo: ""
};
