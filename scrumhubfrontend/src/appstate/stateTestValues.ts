
import { initKeys, initLoadingKeys } from "../components/utility/commonInitValues";
import { initError, initPeopleList, initPerson, initProductBacklogList, initRepository, initRepositoryList, initSprint, initSprintList, initTaskList } from "./initStateValues";
import { ILoginState, IRepositoryList, IState } from "./stateInterfaces";
import { validateUri } from "./stateUtilities";

export const testLoginState:ILoginState = {
  isLoggedIn: false,
  token: "",
  client_id: validateUri(process.env.REACT_APP_CLIENT_ID),
  redirect_uri: validateUri(process.env.REACT_APP_REDIRECT_URI),
  client_secret: validateUri(process.env.REACT_APP_CLIENT_SECRET),
  proxy_url: validateUri(process.env.REACT_APP_PROXY_URL)
}

export const initTestState : IState= {
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
  rateLimitLeft: 5000
};

  export const testRepositoryList: IRepositoryList = {
    pageNumber: 1,
    pageCount: 1,
    pageSize: 10,
    realSize: 0,
    list: [initRepository],
  }