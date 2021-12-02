import * as Actions from "./actions";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
//import _ from "lodash";
import { RequestResponse } from "./response";
import config from "../configuration/config";
import { IError, initState, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList, State } from "./stateInterfaces";
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
[Actions.fetchRepositoriesThunk.pending.toString()]: (
  state: State,
  payload: PayloadAction<undefined>
) => {
  console.log("pending");
  let newState = _.cloneDeep(state);
  newState.loading = true;
  return newState;
},

[Actions.fetchRepositoriesThunk.fulfilled.toString()]: (
  state: State,
  payload: PayloadAction<RequestResponse<IRepositoryList, number>>
) => {
  let newState = _.cloneDeep(state);
  console.log(newState);
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
  console.log(payload.payload.response);
  const repos = payload.payload.response as IRepositoryList;
  if (newState.repositories !== null || pageNumber !== 1) {
    newState.repositories = newState.repositories
      .concat(repos.list)
      .slice(0, (pageNumber + 1) * pageSize);
  } else {
    newState.repositories = (repos.list).slice(0, (pageNumber + 1) * pageSize);
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
  //newState.repositories = [];
  //newState.reposRequireRefresh = true;
  //newState.reposLastPage = false;
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
    config.defaultFilters.pbiSize//config.defaultFilters.size
  );
  newState.ownerName = localStorage.getItem("ownerName");
  newState.openRepository = newState.repositories.find((e : IRepository) => e.name === newState.ownerName) as IRepository;
  //console.log(payload.payload.response);
  //console.log(newState.openRepository);
  newState.pbiPage = payload.payload.response as IProductBacklogList;
  console.log(newState.pbiPage);
  //if (newState.openRepository && newState.openRepository.backlogItems )//&& newState.openRepository.backlogItems.length > 0 && pageNumber > 11) {
    //newState.openRepository.backlogItems = newState.openRepository.backlogItems
      //.concat(pbis.list)
      //.slice(0, (pageNumber + 1) * pageSize);
  //}// else {
   // newState.openRepository.backlogItems = pbis.list;//(pbis.list).slice(0, (pageNumber + 1) * pageSize);
  //}
  //newState.openRepository.backlogItems = newState.openRepository.backlogItems.filter((item:any)=>typeof(item)!= "number");
  //console.log(pbis.list);
  //console.log(newState.openRepository.backlogItems);
  // if response is shorter than default size - it means end is reached.
  //newState.productLastPage = pbis.list.length < pageSize;
  //newState.pages = newState.pbiPage.list.length < pageSize?pageNumber:pageNumber + 1;
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
});