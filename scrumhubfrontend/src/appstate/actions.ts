/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { RequestResponse } from "./response";
import * as Fetching from "./fetching";
import { IFilters, IFiltersAndToken, IProductBacklogList, IRepository, IRepositoryList } from "./stateInterfaces";

export const fetchRepositoriesThunk = createAsyncThunk<
  RequestResponse<IRepositoryList, number>,
  { filters: IFilters; token: string},
  { rejectValue: RequestResponse<IRepositoryList, number> }
>("fetchRepositories", async (item: IFiltersAndToken, { rejectWithValue }) => {
  const response: RequestResponse<IRepositoryList, number> =
    await Fetching.fetchRepositories(item.filters, item.token);
  if (response.code !== 200) {
    return rejectWithValue(
      response as RequestResponse<IRepositoryList, number>
    );
  }
  return response as RequestResponse<IRepositoryList, number>;
});

export const addRepositoryThunk = createAsyncThunk<
  RequestResponse<IRepository, number>,
  { id: number; token: string},
  { rejectValue: RequestResponse<IRepository, number> }
>("addRepositories", async (
  repoWithToken: {
    id: number;
    token: string;
  },
  { rejectWithValue }
) => {
  const response: RequestResponse<IRepository, number> =
    await Fetching.addRepository(repoWithToken.id, repoWithToken.token);
  if (response.code !== 200) {
    return rejectWithValue(
      response as RequestResponse<IRepository, number>
    );
  }
  return response as RequestResponse<IRepository, number>;
});

export const fetchPBIsThunk = createAsyncThunk<
  RequestResponse<IProductBacklogList, number>,
  { ownerName: string; token: string},
  { rejectValue: RequestResponse<IProductBacklogList, number> }
>("fetchPBIs", async (
  item: {
    ownerName: string;
    token: string;
  },
  { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogList, number> =
    await Fetching.fetchPBIs(item.ownerName, item.token);
  if (response.code !== 200) {
    return rejectWithValue(
      response as RequestResponse<IProductBacklogList, number>
    );
  }
  return response as RequestResponse<IProductBacklogList, number>;
});

export const clearError = createAction("clearError");
export const clearReposList = createAction("clearReposList");
//export const clearLoginInformation = createAction("clearLoginInformation");
//export const clearRedirect = createAction("clearRedirect");
//export const startRefreshing = createAction("startRefreshing");
//export const finishRefreshing = createAction("finishRefreshing");



