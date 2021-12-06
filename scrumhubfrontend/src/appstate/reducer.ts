import * as Actions from "./actions";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { RequestResponse } from "./response";
import config from "../configuration/config";
import { IError, initState, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList, ISprint, ISprintList, State } from "./stateInterfaces";
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
[Actions.clearPBIsList.type]: (state: State) => {
  let newState = _.cloneDeep(state);
  if(newState.openRepository){
  newState.openRepository.backlogItems = [];}
  newState.productRequireRefresh = true;
  newState.reposLastPage = false;
  newState.pages = 1;
  return newState;
},
[Actions.clearSprintList.type]: (state: State) => {
  let newState = _.cloneDeep(state);
  newState.sprintPage=null;
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
},
[Actions.fetchRepositoriesThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
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
    erorMessage: errorResponse ? (errorResponse.response as IError).message : "",
  };
  return newState;
},
[Actions.addRepositoryThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},

[Actions.addRepositoryThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IRepository, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.pages = 1;
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
    erorMessage: errorResponse ? (errorResponse.response as IError).message : "",
  };
  return newState;
},
[Actions.finishPBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},

[Actions.finishPBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>
) => {
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
    erorMessage: errorResponse ? (errorResponse.response as IError).message : "",
  };
  return newState;
},

[Actions.addPBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},

[Actions.addPBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.pbiPage = [];
  newState.productRequireRefresh = true;
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
    erorMessage: errorResponse ? (errorResponse.response as IError).message : "",
  };
  return newState;
},

[Actions.deletePBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},

[Actions.deletePBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<number, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.pbiPage = [];
  newState.productRequireRefresh = true;
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
    erorMessage: errorResponse ? (errorResponse.response as IError).message : "",
  };
  return newState;
},

[Actions.fetchPBIsThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
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
  console.log(payload.payload.response);
  newState.pbiPage = payload.payload.response as IProductBacklogList;
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
    erorMessage: errorResponse ? (errorResponse.response as IError).message : "",
  };
  return newState;
},
[Actions.estimatePBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},

[Actions.estimatePBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.pbiPage = [];
  newState.productRequireRefresh = true;
  newState.pages = 1;
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
    erorMessage: errorResponse ? (errorResponse.response as IError).message : "",
  };
  return newState;
},
[Actions.editPBIThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},

[Actions.editPBIThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  newState.pbiPage = [];
  newState.productRequireRefresh = true;
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
    erorMessage: errorResponse ? (errorResponse.response as IError).message : "",
  };
  return newState;
},
[Actions.fetchSprintsThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
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
  console.log(payload.payload.response);
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
  if (newState.sprintPage !== null && pageNumber !== 1) {
    newState.sprintPage.pageSize = sprints.pageSize;
    newState.sprintPage.pageNumber = sprints.pageNumber;
    newState.sprintPage.pageCount = sprints.pageCount;
    newState.sprintPage.realSize = sprints.pageCount;
    newState.sprintPage.list = newState.sprintPage.list
      .concat(sprints.list)
      .slice(0, (pageNumber + 1) * pageSize);
  } else {
    newState.sprintPage = sprints;
  }
  // if response is shorter than default size - it means end is reached.
  newState.sprintLastPage = sprints.list.length < pageSize;
  newState.sprintRequireRefresh = false;
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
    erorMessage: errorResponse ? (errorResponse.response as IError).message : "",
  };
  return newState;
},
[Actions.fetchOneSprintThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},

[Actions.fetchOneSprintThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ISprint, number>>
) => {
  let newState = _.cloneDeep(state);
  console.log(payload.payload.response);
  newState.openSprint = payload.payload.response as ISprint;
  newState.loading = false;
  newState.sprintRequireRefresh = false;
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
    erorMessage: errorResponse ? (errorResponse.response as IError).message : "",
  };
  return newState;
},
[Actions.updateOneSprintThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},

[Actions.updateOneSprintThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<ISprint, number>>
) => {
  let newState = _.cloneDeep(state);
  console.log(payload.payload.response);
  newState.openSprint = payload.payload.response as ISprint;
  newState.loading = false;
  newState.sprintRequireRefresh = false;
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
    erorMessage: errorResponse ? (errorResponse.response as IError).message : "",
  };
  return newState;
},
});