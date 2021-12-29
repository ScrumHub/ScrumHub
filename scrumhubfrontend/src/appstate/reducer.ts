import * as Actions from "./actions";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { RequestResponse } from "./response";
import config from "../configuration/config";
import { IAssignPBI, IError, IMessCodeError,  IPeopleList, IPerson, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList, State } from "./stateInterfaces";
import { initState, initError, unassignedPBI, initProductBacklogList } from "./initStateValues";
import { isArrayValid } from "../components/utility/commonFunctions";
import { getError } from "./stateUtilities";
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
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchRepositoriesThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IRepositoryList, number>>
) => {
  let newState = _.cloneDeep(state);
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
  newState.loading = false;
  return newState;
},
[Actions.fetchRepositoriesThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
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
  const repo = payload.payload.response as IRepository;
  newState.repositories[newState.repositories.findIndex((el:IRepository) => el.gitHubId === repo.gitHubId)] = repo;
  newState.loading = false;
  return newState;
},
[Actions.addRepositoryThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},//PBIS
[Actions.finishPBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.finishPBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>) => {
  let newState = _.cloneDeep(state);
  const pbi = payload.payload.response as IProductBacklogItem;
  if(pbi.isInSprint)
  {
    const index = newState.sprintPage.list.findIndex((sprint:ISprint)=>sprint.sprintNumber===pbi.sprintNumber);
    if(index !== -1){
    const pbiIndex = newState.sprintPage.list[index].backlogItems.findIndex((pb:IProductBacklogItem)=>pb.id===pbi.id);
    newState.sprintPage.list[index].backlogItems[pbiIndex] = pbi;
    }
  }
  else{
    const index = newState.pbiPage.list.findIndex((pb:IProductBacklogItem)=>pb.id===pbi.id);
    newState.pbiPage.list[index] = pbi;
  }
  newState.error = initError;  
  newState.loading = false;
  return newState;
},
[Actions.finishPBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.addPBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.addPBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  const pbi = payload.payload.response as IProductBacklogItem;
  if(newState.pbiPage && isArrayValid(newState.pbiPage.list))
  {
    newState.pbiPage.list = newState.pbiPage.list.concat([pbi]);
  }
  else{
    newState.pbiPage.list = [pbi];
  }
  newState.error = initError;
  newState.loading = false;
  return newState;
},
[Actions.addPBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.deletePBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.deletePBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<any, any>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  return newState;
},
[Actions.deletePBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.fetchPBIsThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchPBIsThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.ownerName = localStorage.getItem("ownerName");
  newState.openRepository = newState.repositories.find((e : IRepository) => e.name === newState.ownerName) as IRepository;
  newState.error = initError;
  newState.pbiPage = payload.payload.response as IProductBacklogList;
  newState.productRequireRefresh = false;
  newState.loading = false;
  return newState;
},
[Actions.fetchPBIsThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.fetchPeopleThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchPeopleThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IPeopleList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.people = payload.payload.response as IPeopleList; 
  newState.error = initError;
  newState.loading = false;
  return newState;
},
[Actions.fetchPeopleThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.getCurrentUserThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.getCurrentUserThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IPerson, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.currentUser = payload.payload.response as IPerson;
  newState.error = initError;
  newState.loading = false;
  return newState;
},
[Actions.getCurrentUserThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.getPBINamesThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.getPBINamesThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogList, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = initError;
  newState.namedPBI = (payload.payload.response as IProductBacklogList).list as IAssignPBI[];
  newState.loading = false;
  return newState;
},
[Actions.getPBINamesThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.estimatePBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.estimatePBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>) => {
  let newState = _.cloneDeep(state);
  const pbi = payload.payload.response as IProductBacklogItem;
  if(pbi.isInSprint)
  {
    const index = newState.sprintPage.list.findIndex((sprint:ISprint)=>sprint.sprintNumber===pbi.sprintNumber);
    if(index !== -1){
    const pbiIndex = newState.sprintPage.list[index].backlogItems.findIndex((pb:IProductBacklogItem)=>pb.id===pbi.id);
    newState.sprintPage.list[index].backlogItems[pbiIndex] = pbi;
    }
  }
  else{
    const index = newState.pbiPage.list.findIndex((pb:IProductBacklogItem)=>pb.id===pbi.id);
    newState.pbiPage.list[index] = pbi;
  }
  newState.error = initError;
  newState.loading = false;
  return newState;
},
[Actions.estimatePBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.editPBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.editPBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>) => {
  let newState = _.cloneDeep(state);
  const pbi = payload.payload.response as IProductBacklogItem;
  if(pbi.isInSprint)
  {
    const index = newState.sprintPage.list.findIndex((sprint:ISprint)=>sprint.sprintNumber===pbi.sprintNumber);
    if(index !== -1){
    const pbiIndex = newState.sprintPage.list[index].backlogItems.findIndex((pb:IProductBacklogItem)=>pb.id===pbi.id);
    newState.sprintPage.list[index].backlogItems[pbiIndex] = pbi;
    }
  }
  else{
    const index = newState.pbiPage.list.findIndex((pb:IProductBacklogItem)=>pb.id===pbi.id);
    newState.pbiPage.list[index] = pbi;
  }
  newState.error = initError;
  newState.loading = false;
  return newState;
},
[Actions.editPBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},//SPRINTS
[Actions.fetchSprintsThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchSprintsThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ISprintList, number>>
) => {
  let newState = _.cloneDeep(state);
  const pageSize = _.get(
    payload,
    ["meta", "arg", "filters", "pageSize"],
    config.defaultFilters.size
  );
  const sprints = payload.payload.response as ISprintList;
  newState.sprintPage = sprints;
  const index = sprints && isArrayValid(sprints.list) ? sprints.list.findIndex((sprint:ISprint)=>sprint.isCurrent):-1;
  if(index !== -1) {newState.activeSprintNumber = sprints.list[index].sprintNumber};
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
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.fetchOneSprintThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
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
  if(newState.openSprint.isCurrent) {newState.activeSprintNumber = newState.openSprint.sprintNumber};
  newState.sprintRequireRefresh = false;
  newState.error = initError;
  newState.loading = false;
  return newState;
},
[Actions.fetchOneSprintThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.updateOneSprintThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.updateOneSprintThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ISprint|any, number>>
) => {
  let newState = _.cloneDeep(state);
  const sprint = payload.payload.response as ISprint;
  const objIndex = newState.sprintPage.list.findIndex((s:ISprint)=>s.sprintNumber===sprint.sprintNumber);
  newState.sprintPage.list[objIndex] = sprint;
  if(sprint.isCurrent) {newState.activeSprintNumber = sprint.sprintNumber};
  if(newState.openSprint && newState.openSprint.sprintNumber === sprint.sprintNumber){newState.openSprint = sprint;}
  newState.loading = false;
  return newState;
},
[Actions.updateOneSprintThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.completeOneSprintThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.completeOneSprintThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ISprint, number>>
) => {
  let newState = _.cloneDeep(state);
  const sprint = payload.payload.response as ISprint;
  const objIndex = newState.sprintPage.list.findIndex((s:ISprint)=>s.sprintNumber===sprint.sprintNumber);
  (newState.sprintPage.list[objIndex] as ISprint) = sprint;
  if(sprint.isCurrent) {newState.activeSprintNumber = sprint.sprintNumber};
  if(newState.openSprint && newState.openSprint.sprintNumber === sprint.sprintNumber){newState.openSprint = sprint;}
  newState.loading = false;
  return newState;
},
[Actions.completeOneSprintThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.addSprintThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.addSprintThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ISprint, undefined>>) => {
  let newState = _.cloneDeep(state);
  const sprint = payload.payload.response as ISprint;
  if(newState.sprintPage && isArrayValid(newState.sprintPage.list))
  {
    newState.sprintPage.list = newState.sprintPage.list.concat([sprint]);
  }
  else{
    newState.sprintPage.list = [sprint];
  }
  if(sprint.isCurrent) {newState.activeSprintNumber = sprint.sprintNumber};
  newState.error = initError;
  newState.loading = false;
  return newState;
},
[Actions.addSprintThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
//TASKS
[Actions.fetchTasksThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchTasksThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITaskList, number>>
) => {
  let newState = _.cloneDeep(state);
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
  newState.loading = false;
  return newState;
},
[Actions.fetchTasksThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.fetchPBITasksThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.fetchPBITasksThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITaskList, number>>
) => {
  let newState = _.cloneDeep(state);
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
  newState.loading = false;
  return newState;
},
[Actions.fetchPBITasksThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.addTasksToPBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.addTasksToPBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITaskList, number>>
) => {
  let newState = _.cloneDeep(state);
  const tasks = payload.payload.response as ITaskList;
  const pbisList = [unassignedPBI] as IProductBacklogItem[];
  if (tasks && tasks.list.length>0) {
    if(!newState.pbiPage){
      newState.pbiPage = initProductBacklogList;
    }
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
  newState.productRequireRefresh = false;
  newState.error = initError;  
  newState.loading = false;
  return newState;
},
[Actions.addTasksToPBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.addTasksToSprintThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.addTasksToSprintThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITaskList, number>>
) => {
  let newState = _.cloneDeep(state);
  const tasks = payload.payload.response as ITaskList;
  if (newState.sprintPage && newState.sprintPage.list.length >0 && tasks && tasks.list.length>0) {

    newState.sprintPage.list = newState.sprintPage.list.map((sprint:ISprint)=>{
      sprint.backlogItems = sprint.backlogItems.map((item:IProductBacklogItem)=>{
      if(item.id === tasks.list[0].pbiId){
        return {...item, tasks:tasks.list};
      }
      return item;
      })
      return sprint;
    })
  }
  newState.productRequireRefresh = false;
  newState.error = initError;
  newState.loading = false;
  return newState;
},
[Actions.addTasksToSprintThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.addTaskThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.addTaskThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITask, number>>) => {
  let newState = _.cloneDeep(state);
  newState.error = initError;
  newState.loading = false;
  return newState;
},
[Actions.addTaskThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.assignTaskToPBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.assignTaskToPBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>) => {
  let newState = _.cloneDeep(state);
  newState.productRequireRefresh = true;
  newState.sprintRequireRefresh = true;
  newState.loading = false;
  return newState;
},
[Actions.assignTaskToPBIThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.assignPersonToTaskThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.assignPersonToTaskThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITask, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = initError;
  const task = payload.payload.response as ITask; 
  if (!task.isAssignedToPBI) {
    const index = newState.pbiPage && isArrayValid(newState.pbiPage.list) ? newState.pbiPage.list.findIndex((pbi:IProductBacklogItem)=>pbi.id===0):-1;
    if(index !== -1){
      newState.pbiPage.list = newState.pbiPage.list.map((item:IProductBacklogItem)=>{ 
        if(item.id === index){
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

  }
  else if (newState.pbiPage && newState.pbiPage.list.length >0 &&newState.pbiPage.list.filter((item:IProductBacklogItem)=>item.id===task.pbiId).length>0 ) {
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
  newState.loading = false;
  return newState;
},
[Actions.assignPersonToTaskThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
[Actions.unassignPersonToTaskThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},
[Actions.unassignPersonToTaskThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ITask, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = initError;
  const task = payload.payload.response as ITask; 
  if (!task.isAssignedToPBI) {
    const index = newState.pbiPage && isArrayValid(newState.pbiPage.list) ? newState.pbiPage.list.findIndex((pbi:IProductBacklogItem)=>pbi.id===0):-1;
    if(index !== -1){
      newState.pbiPage.list = newState.pbiPage.list.map((item:IProductBacklogItem)=>{ 
        if(item.id === index){
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

  }
  else if (newState.pbiPage && newState.pbiPage.list.length >0 &&newState.pbiPage.list.filter((item:IProductBacklogItem)=>item.id===task.pbiId).length>0 ) {
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
  newState.loading = false;
  return newState;
},
[Actions.unassignPersonToTaskThunk.rejected.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<undefined, undefined>>
) => {
  let newState = _.cloneDeep(state);
  newState.error = getError(payload.payload);
  newState.loading = false;
  return newState;
},
});
