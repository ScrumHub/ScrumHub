import { initKeys, initLoadingKeys } from "../components/utility/commonInitValues";
import { initError, initPeopleList, initPerson, initProductBacklogList, initRepository, initRepositoryList, initSprint, initSprintList, initTaskList } from "./initStateValues";
import { IRepositoryList, State } from "./stateInterfaces";

export const initTestState: State = {
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
    loadingKeys:initLoadingKeys
  };

  export const testRepositoryList: IRepositoryList = {
    pageNumber: 1,
    pageCount: 1,
    pageSize: 10,
    realSize: 0,
    list: [initRepository],
  }