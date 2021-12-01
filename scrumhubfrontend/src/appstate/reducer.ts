import * as Actions from "./actions";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
//import _ from "lodash";
import { RequestResponse } from "./response";
import config from "../configuration/config";
import { IError, initState, IRepository, IRepositoryList, State } from "./stateInterfaces";
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
  if (newState.repositories !== null || pageNumber !== 1) {
    newState.repositories = newState.repositories
      .concat(repos.list)
      .slice(0, (pageNumber + 1) * pageSize);
  } else {
    newState.repositories = (repos.list).slice(0, (pageNumber + 1) * pageSize);
  }
  // if response is shorter than default size - it means end is reached.
  newState.reposLastPage = repos.list.length < pageSize;
  newState.pages = pageNumber + 1;
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
  newState.repositories = [];
  newState.reposRequireRefresh = true;
  newState.reposLastPage = false;
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
});