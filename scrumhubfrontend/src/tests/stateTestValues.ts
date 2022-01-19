
import { initKeys, initLoadingKeys } from "../components/utility/commonInitValues";
import config from "../configuration/config";
import { initError, initPeopleList, initPerson, initPBItem, initProductBacklogList, initRepository, initRepositoryList, initSprint, initSprintList, initTaskList, initTask } from "../appstate/initStateValues";
import { ILoginState, IProductBacklogList, IRepositoryList, ISprint, ISprintList, IState, ITaskList } from "../appstate/stateInterfaces";
import { validateUri } from "../appstate/stateUtilities";

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
  pbiPage: initProductBacklogList,
  sprintPage: initSprintList,
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
};

export const testRepositoryList: IRepositoryList  = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 0,
  list: [initRepository],
}

export const testPBIList: IProductBacklogList = {
  pageNumber: 1,
  pageCount: 1,
  pageSize: 10,
  realSize: 0,
  list: [initPBItem],
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
  ownerName:"ownerName",
  url: `${config.backend.ip}:${config.backend.port}/api`,
  pbiId:0,
  sprintNr:0,
  hours:2,
  editedPBI:{
    "name": initPBItem.name,
    "priority": initPBItem.priority,
    "acceptanceCriteria": initPBItem.acceptanceCriteria
  },
  name:"taskName",
  taskId:0,
  login:"userLogin",
  isAssign:true,
  hotfix:true
}

export const testConnectionError = {
  "code": 0,
  "response": {
    "data": null,
    "message": "Connection error",
    "metadata": null,
    "successful": false,
  },
}
export const testFilters = { pageSize: config.defaultFilters.page, pageNumber: config.defaultFilters.size }

export const testFetchReposVals={
  filters: testFilters,
  token: config.token,
}