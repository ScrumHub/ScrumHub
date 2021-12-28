import * as Actions from "./actions";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { RequestResponse } from "./response";
import config from "../configuration/config";
import { IAssignPBI, IError, IMessCodeError, initError, initState, IPeopleList, IPerson, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList, State, unassignedPBI } from "./stateInterfaces";
var _ = require('lodash');

export const reducer = createReducer(initState, {
  [Actions.clearError.type]: (state: State) => {
    let newState = _.cloneDeep(state as State);
    newState.error = {
      hasError: false,
      errorCode: 0,
      erorMessage: "",
    };
    return newState as State;
},
[Actions.clearReposList.type]: (state: State) => {
  let newState = _.cloneDeep(state);
  newState.repositories = [];
  newState.reposRequireRefresh = true;
  newState.reposLastPage = false;
  return newState;
},
[Actions.clearState.type]: (state: State) => {
  let newState = _.cloneDeep(state);
  newState = initState;
  return newState;
},
[Actions.clearProject.type]: (state: State) => {
  let newState = _.cloneDeep(state) as State;
  newState = {...initState,repositories: newState.repositories, currentUser:newState.currentUser};
  return newState;
},
[Actions.clearPBIsList.type]: (state: State) => {
  let newState = _.cloneDeep(state);
  if(newState.openRepository){
  newState.openRepository.backlogItems = [];}
  newState.pbiPage.list = [];
  newState.productRequireRefresh = true;
  newState.reposLastPage = false;
  newState.pages = 1;
  return newState;
},
[Actions.clearSprintList.type]: (state: State) => {
  let newState = _.cloneDeep(state);
  newState.sprintPage.list = [];
  newState.sprintRequireRefresh = true;
  newState.sprintLastPage = false;
  newState.pages = 1;
  return newState;
},
[Actions.clearSprint.type]: (state: State) => {
  let newState = _.cloneDeep(state);
  newState.openSprint=null;
  newState.sprintRequireRefresh = true;
  newState.sprintLastPage = false;
  newState.pages = 1;
  return newState;
},//REPOS
[Actions.fetchRepositoriesThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchRepositoriesThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IRepositoryList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  // if page filter not specified - set to default
  const pageNumber = _.get(
    payload,
    ["meta", "arg", "filters", "pageNumber"],
    config.defaultFilters.page
  );
  // if size filter not specified - set pageSize to default
  const pageSize = _.get(
    payload,
    ["meta", "arg", "filters", "pageSize"],
    config.defaultFilters.size
  );
  const repos = payload.payload.response as IRepositoryList;
  if (newState.repositories == null || pageNumber === 1) {
    newState.repositories = (repos.list).slice(0, (pageNumber + 1) * pageSize);
  }else{
    newState.repositories = newState.repositories
      .concat(repos.list)
      .slice(0, (pageNumber + 1) * pageSize);
  } 
    
  // if response is shorter than default size - it means end is reached.
  newState.reposLastPage = repos.list.length < pageSize;
  newState.reposRequireRefresh = false;
  return newState;
},
[Actions.fetchRepositoriesThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.addRepositoryThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.addRepositoryThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IRepository, number>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  const repo = payload.payload.response as IRepository;
  //console.log(repo);
  newState.repositories[newState.repositories.findIndex((el:IRepository) => el.gitHubId === repo.gitHubId)] = repo;
  return newState;
},
[Actions.addRepositoryThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},//PBIS
[Actions.finishPBIThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.finishPBIThunk.fulfilled.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.pbiPage = [];
  newState.productRequireRefresh = true;
  newState.pages = 1;
  return newState;
},
[Actions.finishPBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.addPBIThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.addPBIThunk.fulfilled.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.pbiPage = [];
  //newState.productRequireRefresh = true;
  newState.error = initError;
  newState.pages = 1;
  return newState;
},
[Actions.addPBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.deletePBIThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.deletePBIThunk.fulfilled.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.pbiPage = [];
  //newState.productRequireRefresh = true;
  newState.error = initError;
  newState.pages = 1;
  return newState;
},
[Actions.deletePBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.fetchPBIsThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchPBIsThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.ownerName = localStorage.getItem("ownerName");
  newState.openRepository = newState.repositories.find((e : IRepository) => e.name === newState.ownerName) as IRepository;
  newState.error = initError;
  newState.pbiPage = payload.payload.response as IProductBacklogList;
  //newState.pbiPage = newState.pbiPage.pageCount < 0 ? 1 : newState.pbiPage.pageCount;
  newState.productRequireRefresh = false;
  return newState;
},
[Actions.fetchPBIsThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.fetchPeopleThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchPeopleThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IPeopleList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.people = payload.payload.response as IPeopleList;
  newState.currentUser = newState.people.list.find((e : IPerson) => e.isCurrentUser) as IPerson;
  newState.error = initError;
  //newState.productRequireRefresh = false;
  return newState;
},
[Actions.fetchPeopleThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.getPBINamesThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.getPBINamesThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.error = initError;
  newState.namedPBI = (payload.payload.response as IProductBacklogList).list as IAssignPBI[];
  return newState;
},
[Actions.getPBINamesThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.estimatePBIThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.estimatePBIThunk.fulfilled.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.pbiPage = [];
  //newState.productRequireRefresh = true;
  newState.error = initError;
  newState.pages = 1;
  newState.error = initError;
  return newState;
},
[Actions.estimatePBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.editPBIThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.editPBIThunk.fulfilled.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.pbiPage = [];
  newState.productRequireRefresh = true;
  newState.error = initError;
  newState.pages = 1;
  return newState;
},
[Actions.editPBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},//SPRINTS
[Actions.fetchSprintsThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchSprintsThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ISprintList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  // if page filter not specified - set to default
  const pageNumber = _.get(
    payload,
    ["meta", "arg", "filters", "pageNumber"],
    config.defaultFilters.page
  );
  // if size filter not specified - set pageSize to default
  const pageSize = _.get(
    payload,
    ["meta", "arg", "filters", "pageSize"],
    config.defaultFilters.size
  );
  const sprints = payload.payload.response as ISprintList;
  //console.log(sprints);
  if (newState.sprintPage !== null && pageNumber !== 1) {
    newState.sprintPage.pageSize = sprints.pageSize;
    newState.sprintPage.pageNumber = sprints.pageNumber;
    newState.sprintPage.pageCount = sprints.pageCount<0 ?1:sprints.pageCount;
    newState.sprintPage.realSize = sprints.realSize;
    newState.sprintPage.list = newState.sprintPage.list
      .concat(sprints.list)
      .slice(0, (pageNumber + 1) * pageSize);
  } else {
    newState.sprintPage = sprints;
  }
  // if response is shorter than default size - it means end is reached.
  newState.sprintLastPage = sprints.list.length < pageSize;
  newState.sprintRequireRefresh = false;
  newState.error = initError;
  return newState;
},
[Actions.fetchSprintsThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.fetchOneSprintThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchOneSprintThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ISprint, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.openSprint = payload.payload.response as ISprint;
  newState.loading = false;
  newState.sprintRequireRefresh = false;
  newState.error = initError;
  return newState;
},
[Actions.fetchOneSprintThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.updateOneSprintThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.updateOneSprintThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ISprint, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.openSprint = payload.payload.response as ISprint;
  console.log(newState.openSprint);
  newState.loading = false;
  newState.sprintRequireRefresh = false;
  newState.error = initError;
  return newState;
},
[Actions.updateOneSprintThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IMessCodeError).Message : "",
  };
  return newState;
},
[Actions.addSprintThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.addSprintThunk.fulfilled.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.sprintRequireRefresh = true;
  newState.error = initError;
  return newState;
},
[Actions.addSprintThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (payload.payload.response as IError).Message : "",
  };
  return newState;
},
//TASKS
[Actions.fetchTasksThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchTasksThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITaskList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  // if page filter not specified - set to default
  const pageNumber = _.get(
    payload,
    ["meta", "arg", "filters", "pageNumber"],
    config.defaultFilters.page
  );
  // if size filter not specified - set pageSize to default
  const pageSize = _.get(
    payload,
    ["meta", "arg", "filters", "pageSize"],
    config.defaultFilters.size
  );
  const tasks = payload.payload.response as ITaskList;
  if (newState.taskPage !== null && pageNumber !== 1) {
    newState.taskPage.pageSize = tasks.pageSize;
    newState.taskPage.pageNumber = tasks.pageNumber;
    newState.taskPage.pageCount = tasks.pageCount;
    newState.taskPage.realSize = tasks.pageCount;
    newState.taskPage.list = newState.taskPage.list
      .concat(tasks.list)
      .slice(0, (pageNumber + 1) * pageSize);
  } else {
    newState.taskPage = tasks;
  }
  // if response is shorter than default size - it means end is reached.
  newState.taskLastPage = tasks.list.length < pageSize;
  newState.taskRequireRefresh = false;
  newState.error = initError;
  return newState;
},
[Actions.fetchTasksThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.fetchPBITasksThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchPBITasksThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITaskList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  // if page filter not specified - set to default
  // if size filter not specified - set pageSize to default
  const tasks = payload.payload.response as ITaskList;
  if (newState.tasks !== null && tasks.list) {
    newState.tasks = tasks.list;
  }
  // if response is shorter than default size - it means end is reached.
  //newState.taskLastPage = tasks.length < pageSize;
  newState.taskRequireRefresh = false;
  newState.error = initError;
  return newState;
},
[Actions.fetchPBITasksThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.addTasksToPBIThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.addTasksToPBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITaskList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  const tasks = payload.payload.response as ITaskList;
  const pbisList = [unassignedPBI] as IProductBacklogItem[];
  if (tasks && tasks.list.length>0) {
    if(newState.pbiPage && newState.pbiPage.list && (newState.pbiPage.list.length<1 || newState.pbiPage.list[0].id !==0)){
      newState.pbiPage.list = pbisList.concat(newState.pbiPage.list);//empty pbi that holds unassigned tasks
    }
    newState.pbiPage.list = newState.pbiPage.list.map((item:IProductBacklogItem)=>{
      if(item.id === 0 && !tasks.list[0].isAssignedToPBI){
        return {...item, tasks:tasks.list};
      }
      if(item.id === tasks.list[0].pbiId){
        return {...item, tasks:tasks.list};
      }
      return item;
    })
  }
  // if response is shorter than default size - it means end is reached.
  //newState.taskLastPage = tasks.length < pageSize;
  newState.productRequireRefresh = false;
  newState.error = initError;
  return newState;
},
[Actions.addTasksToPBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.addTasksToSprintThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.addTasksToSprintThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITaskList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  const tasks = payload.payload.response as ITaskList;
  //console.log(tasks);
  //console.log(newState.sprintPage);
  if (newState.sprintPage && newState.sprintPage.list.length >0 && tasks && tasks.list.length>0) {

    newState.sprintPage.list = newState.sprintPage.list.map((sprint:ISprint)=>{
      sprint.backlogItems = sprint.backlogItems.map((item:IProductBacklogItem)=>{
      if(item.id === tasks.list[0].pbiId){
        ///const temp = tasks.list as ITask[];
        //console.log(temp.length>1 ?temp[1].assigness:"");
        return {...item, tasks:tasks.list};
      }
      return item;
      })
      return sprint;
    })
  }
  // if response is shorter than default size - it means end is reached.
  //newState.taskLastPage = tasks.length < pageSize;
  newState.productRequireRefresh = false;
  newState.error = initError;
  return newState;
},
[Actions.addTasksToSprintThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.addTaskThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.addTaskThunk.fulfilled.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.productRequireRefresh = true;
  newState.error = initError;
  return newState;
},
[Actions.addTaskThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.assignTaskToPBIThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.assignTaskToPBIThunk.fulfilled.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.error = initError;
  //newState.productRequireRefresh = true;
  return newState;
},
[Actions.assignTaskToPBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.assignPersonToTaskThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.assignPersonToTaskThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITask, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.error = initError;
  const task = payload.payload.response as ITask; 
  if (newState.pbiPage && newState.pbiPage.list.length >0 &&newState.pbiPage.list.filter((item:IProductBacklogItem)=>item.id===task.pbiId).length>0 ) {
    newState.pbiPage.list = newState.pbiPage.list.map((item:IProductBacklogItem)=>{ 
      if(item.id === task.pbiId && item.tasks){
        item.tasks =  item.tasks.map((t:ITask)=>{
          if(item.id === task.pbiId){
            return task;
          }
          return t;
          });
        }
          return item;
        });
  }
    else if(newState.sprintPage && newState.sprintPage.list.length >0 ) {
      newState.sprintPage.list = newState.sprintPage.list.map((sprint:ISprint)=>{
        sprint.backlogItems = sprint.backlogItems.map((item:IProductBacklogItem)=>{
          if(item.id === task.pbiId && item.tasks && item.tasks.length>0){
          item.tasks =  item.tasks.map((t:ITask)=>{
            if(t.id === task.id){
              return task;
            }
            return t;
            });
          }
            return item;
          });
          return sprint;
        });
      }

  
  //newState.productRequireRefresh = true;
  return newState;
},
[Actions.assignPersonToTaskThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
[Actions.unassignPersonToTaskThunk.pending.toString()]: (
  state: State) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.unassignPersonToTaskThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITask, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.error = initError;
  const task = payload.payload.response as ITask; 
  if (newState.pbiPage && newState.pbiPage.list.length >0 &&newState.pbiPage.list.filter((item:IProductBacklogItem)=>item.id===task.pbiId).length>0 ) {
    newState.pbiPage.list = newState.pbiPage.list.map((item:IProductBacklogItem)=>{ 
      if(item.id === task.pbiId && item.tasks){
        item.tasks =  item.tasks.map((t:ITask)=>{
          if(t.id === task.id){
            return task;
          }
          return t;
          });
        }
          return item;
        });
  }
    else if(newState.sprintPage && newState.sprintPage.list.length >0 ) {
      newState.sprintPage.list = newState.sprintPage.list.map((sprint:ISprint)=>{
        sprint.backlogItems = sprint.backlogItems.map((item:IProductBacklogItem)=>{
          if(item.id === task.pbiId && item.tasks){
          item.tasks =  item.tasks.map((t:ITask)=>{
            if(t.id === task.id){
              return task;
            }
            return t;
            });
          }
            return item;
          });
          return sprint;
        });
      }

  
  //newState.productRequireRefresh = true;
  return newState;
},
[Actions.unassignPersonToTaskThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  let errorResponse = payload.payload;
  newState.loading = false;
  newState.error = {
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  };
  return newState;
},
});