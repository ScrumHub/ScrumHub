/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { RequestResponse } from "./response";
import * as Fetching from "./fetching";
import { IAddPBI, IFilters, IFiltersAndToken, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList, ISprint, ISprintList, IUpdateIdSprint, IUpdateSprint } from "./stateInterfaces";

//REPOS
export const fetchRepositoriesThunk = createAsyncThunk<
  RequestResponse<IRepositoryList, number>,
  { filters: IFilters; token: string },
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
  { id: number; token: string },
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
    console.log(response.code);
  if (response.code !== 201) {
    return rejectWithValue(
      response as RequestResponse<IRepository, number>
    );
  }
  return response as RequestResponse<IRepository, number>;
});

//PBIS
export const fetchPBIsThunk = createAsyncThunk<
  RequestResponse<IProductBacklogList, number>,
  { ownerName: string; token: string; filters: IFilters; },
  { rejectValue: RequestResponse<IProductBacklogList, number> }
>("fetchPBIs", async (
  item: {
    ownerName: string;
    token: string;
    filters: IFilters;
  },
  { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogList, number> =
    await Fetching.fetchPBIs(item.ownerName, item.token, item.filters);
  if (response.code !== 200) {
    return rejectWithValue(
      response as RequestResponse<IProductBacklogList, number>
    );
  }
  return response as RequestResponse<IProductBacklogList, number>;
});

export const finishPBIThunk = createAsyncThunk<
  RequestResponse<IProductBacklogItem, number>,
  { ownerName: string; token: string; pbild: number; },
  { rejectValue: RequestResponse<IProductBacklogItem, number> }
>("finishPBI", async (
  item: {
    ownerName: string;
    token: string;
    pbild: number;
  },
  { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogItem, number> =
    await Fetching.finishPBI(item.ownerName, item.token, item.pbild);
  if (response.code !== 200) {
    return rejectWithValue(
      response as RequestResponse<IProductBacklogItem, number>
    );
  }
  return response as RequestResponse<IProductBacklogItem, number>;
});

export const deletePBIThunk = createAsyncThunk<
  RequestResponse<number, number>,
  { ownerName: string; token: string; pbild: number; },
  { rejectValue: RequestResponse<number, number> }
>("deletePBI", async (
  item: {
    ownerName: string;
    token: string;
    pbild: number;
  },
  { rejectWithValue }
) => {
  const response: RequestResponse<number, number> =
    await Fetching.deletePBI(item.ownerName, item.token, item.pbild);
  if (response.code !== 204) {
    return rejectWithValue(
      response as RequestResponse<number, number>
    );
  }
  return response as RequestResponse<number, number>;
});

export const addPBIThunk = createAsyncThunk<
  RequestResponse<IProductBacklogItem, number>,
  { ownerName: string; token: string; pbi: IAddPBI; },
  { rejectValue: RequestResponse<IProductBacklogItem, number> }
>("addPBI", async (
  item: {
    ownerName: string;
    token: string;
    pbi: IAddPBI;
  },
  { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogItem, number> =
    await Fetching.addPBI(item.ownerName, item.token, item.pbi);
  if (response.code !== 201) {
    return rejectWithValue(
      response as RequestResponse<IProductBacklogItem, number>
    );
  }
  return response as RequestResponse<IProductBacklogItem, number>;
});

export const estimatePBIThunk = createAsyncThunk<
  RequestResponse<IProductBacklogItem, number>,
  { ownerName: string; token: string; pbiId: number; hours: number; },
  { rejectValue: RequestResponse<IProductBacklogItem, number> }
>("estimatePBI", async (
  item: {
    ownerName: string;
    token: string;
    pbiId: number;
    hours: number;
  },
  { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogItem, number> =
    await Fetching.estimatePBI(item.ownerName, item.token, item.pbiId, item.hours);
  if (response.code !== 200) {
    return rejectWithValue(
      response as RequestResponse<IProductBacklogItem, number>
    );
  }
  return response as RequestResponse<IProductBacklogItem, number>;
});

export const editPBIThunk = createAsyncThunk<
  RequestResponse<IProductBacklogItem, number>,
  { ownerName: string; token: string; pbi: IAddPBI; pbiId: number; },
  { rejectValue: RequestResponse<IProductBacklogItem, number> }
>("editPBI", async (
  item: {
    ownerName: string;
    token: string;
    pbi: IAddPBI;
    pbiId: number
  },
  { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogItem, number> =
    await Fetching.editPBI(item.ownerName, item.token, item.pbi, item.pbiId);
  if (response.code !== 200) {
    return rejectWithValue(
      response as RequestResponse<IProductBacklogItem, number>
    );
  }
  return response as RequestResponse<IProductBacklogItem, number>;
});

//SPRINTS
export const fetchSprintsThunk = createAsyncThunk<
  RequestResponse<ISprintList, number>,
  { token: string, ownerName: string; filters: IFilters; },
  { rejectValue: RequestResponse<ISprintList, number> }
>("fetchSprints", async (
  item: {
    token: string;
    ownerName: string;
    filters: IFilters;
  },
  { rejectWithValue }) => {
  const response: RequestResponse<ISprintList, number> =
    await Fetching.fetchSprints(item.token, item.ownerName, item.filters,);
  if (response.code !== 200) {
    return rejectWithValue(
      response as RequestResponse<ISprintList, number>
    );
  }
  return response as RequestResponse<ISprintList, number>;
});

export const fetchOneSprintThunk = createAsyncThunk<
  RequestResponse<ISprint, number>,
  { token: string, ownerName: string; sprintNumber:number; },
  { rejectValue: RequestResponse<ISprint, number> }
>("fetchOneSprint", async (
  item: {
    token: string;
    ownerName: string;
    sprintNumber:number;
  },
  { rejectWithValue }) => {
  const response: RequestResponse<ISprint, number> =
    await Fetching.fetchOneSprint(item.token, item.ownerName, item.sprintNumber,);
  if (response.code !== 200) {
    return rejectWithValue(
      response as RequestResponse<ISprint, number>
    );
  }
  return response as RequestResponse<ISprint, number>;
});

export const updateOneSprintThunk = createAsyncThunk<
  RequestResponse<ISprint, number>,
  { token: string, ownerName: string; sprintNumber:number; sprint:IUpdateIdSprint; },
  { rejectValue: RequestResponse<ISprint, number> }
>("updateOneSprint", async (
  item: {
    token: string;
    ownerName: string;
    sprintNumber:number;
    sprint:IUpdateIdSprint;
  },
  { rejectWithValue }) => {
  const response: RequestResponse<ISprint, number> =
    await Fetching.updateOneSprint(item.token, item.ownerName, item.sprintNumber,item.sprint);
  if (response.code !== 200) {
    return rejectWithValue(
      response as RequestResponse<ISprint, number>
    );
  }
  return response as RequestResponse<ISprint, number>;
});


export const clearError = createAction("clearError");
export const clearState = createAction("clearState");
export const clearSprintList = createAction("clearSprintList");
export const clearSprint = createAction("clearSprint");
export const clearReposList = createAction("clearReposList");
export const clearPBIsList = createAction("clearPBIsList");

