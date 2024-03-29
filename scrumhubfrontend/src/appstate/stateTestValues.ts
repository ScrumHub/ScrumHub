import config from "../configuration/config";
import { validateUri } from "./reducerUtilities";
import { initError, initPeopleList, initPerson, initBI, initBacklogItemList, initRepository, initRepositoryList, initSprint, initSprintsList, initTaskList, initTask, initKeys, initLoadingKeys } from "./stateInitValues";
import { ILoginState, IBacklogItemList, IRepositoryList, ISprintList, IState, ITaskList } from "./stateInterfaces";

export const testLoginState: ILoginState = {
  isLoggedIn: false,
  token: "",
  client_id: validateUri(process.env.REACT_APP_CLIENT_ID),
  redirect_uri: validateUri(process.env.REACT_APP_REDIRECT_URI),
  client_secret: validateUri(process.env.REACT_APP_CLIENT_SECRET),
  proxy_url: validateUri(process.env.REACT_APP_PROXY_URL)
}

export const initTestState: IState = {
  loading: false,
  error: initError,
  pbiPage: initBacklogItemList,
  sprintPage: initSprintsList,
  taskPage: initTaskList,
  repositories: initRepositoryList,
  openSprint: initSprint,
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
  loginState: testLoginState,
  changedRepo: ""
};

export const testRepositoryList: IRepositoryList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 0,
  list: [initRepository],
}

export const testBItemList: IBacklogItemList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 0,
  list: [initBI],
}

export const testSprintList: ISprintList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 0,
  list: [initSprint],
}

export const testTaskList: ITaskList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 0,
  list: [initTask],
}

export const tstConf = {
  ownerName: "ownerName",
  url: `${config.backend.ip}:${config.backend.port}/api`,
  pbiId: 0,
  sprintNr: 0,
  hours: 2,
  editedPBI: {
    "name": initBI.name,
    "priority": initBI.priority,
    "acceptanceCriteria": initBI.acceptanceCriteria
  },
  name: "taskName",
  taskId: 0,
  login: "userLogin",
  isAssign: true,
  hotfix: true
}

export const testConnectionError = {
  "code": 0,
  "response": {
    "data": null,
    "Message": "Connection error",
    "metadata": null,
    "successful": false,
  },
}
export const testFilters = { pageSize: config.defaultFilters.page, pageNumber: config.defaultFilters.size }

export const testFetchReposVals = {
  filters: testFilters,
  token: config.token,
}

export const initTestUseState = {
  "action": "POP",
  "location": { "hash": "", "key": "default", "pathname": "/", "search": "", "state": null }
}

export const updatedTestState: IState = {
  loading: false,
  error: initError,
  pbiPage: testBItemList,
  sprintPage: testSprintList,
  taskPage: testTaskList,
  repositories: testRepositoryList,
  openSprint: initSprint,
  reposLastPage: false,
  reposRequireRefresh: false,
  productLastPage: false,
  productRequireRefresh: false,
  sprintLastPage: false,
  sprintRequireRefresh: false,
  taskLastPage: false,
  taskRequireRefresh: false,
  tasks: [initTask],
  namedPBI: [],
  repoId: -1,
  people: initPeopleList,
  currentUser: initPerson,
  activeSprintNumber: -1,
  keys: {
    sprintKeys: [0,1],
    pbiKeys: [0,1]
  },
  loadingKeys: initLoadingKeys,
  loginState: testLoginState,
  changedRepo: ""
};