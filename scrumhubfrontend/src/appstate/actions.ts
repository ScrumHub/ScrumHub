/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { RequestResponse } from "./response";
import * as Fetching from "./fetching";
import { IAddPBI, IFilters, IFiltersAndToken, ILoginState, IPeopleList, IPerson, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList } from "./stateInterfaces";

export const fetchRepositoriesThunk = createAsyncThunk<
  RequestResponse<IRepositoryList, number>,
  { filters: IFilters; token: string },
  { rejectValue: RequestResponse<IRepositoryList, number> }
>("fetchRepositories", async (item: IFiltersAndToken, { rejectWithValue }) => {
  const response: RequestResponse<IRepositoryList, number> = await Fetching.fetchRepositories(item.filters, item.token);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IRepositoryList, number>); }
  return response as RequestResponse<IRepositoryList, number>;
});

export const fetchPeopleThunk = createAsyncThunk<
  RequestResponse<IPeopleList, number>,
  { ownerName: string; token: string },
  { rejectValue: RequestResponse<IPeopleList, number> }
>("fetchPeople", async (item: { ownerName: string; token: string }, { rejectWithValue }) => {
  const response: RequestResponse<IRepositoryList, number> = await Fetching.fetchPeople(item.ownerName, item.token);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IPeopleList, number>); }
  return response as RequestResponse<IPeopleList, number>;
});

export const getCurrentUserThunk = createAsyncThunk<
  RequestResponse<IPerson, number>,
  { token: string },
  { rejectValue: RequestResponse<IPeopleList, number> }
>("getCurrentUser", async (item: { token: string }, { rejectWithValue }) => {
  const response: RequestResponse<IRepositoryList, number> = await Fetching.getCurrentUser(item.token);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IPeopleList, number>); }
  return response as RequestResponse<IPeopleList, number>;
});

export const addRepositoryThunk = createAsyncThunk<
  RequestResponse<IRepository, number>,
  { id: number; token: string },
  { rejectValue: RequestResponse<IRepository, number> }
>("addRepositories", async (
  repoWithToken: {
    id: number;
    token: string;
  }, { rejectWithValue }
) => {
  const response: RequestResponse<IRepository, number> = await Fetching.addRepository(repoWithToken.id, repoWithToken.token);
  if (response.code !== 201) { return rejectWithValue(response as RequestResponse<IRepository, number>); }
  return response as RequestResponse<IRepository, number>;
});

export const fetchPBIsThunk = createAsyncThunk<
  RequestResponse<IProductBacklogList, number>,
  { ownerName: string; token: string; filters: IFilters; },
  { rejectValue: RequestResponse<IProductBacklogList, number> }
>("fetchPBIs", async (item: { ownerName: string; token: string; filters: IFilters; }, { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogList, number> = await Fetching.fetchPBIs(item.ownerName, item.token, item.filters);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<undefined, undefined>); }
  return response as RequestResponse<IProductBacklogList, number>;
});

export const finishPBIThunk = createAsyncThunk<
  RequestResponse<IProductBacklogItem, number>,
  { ownerName: string; token: string; pbiId: number; },
  { rejectValue: RequestResponse<IProductBacklogItem, number> }
>("finishPBI", async (item: { ownerName: string; token: string; pbiId: number; }, { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogItem, number> = await Fetching.finishPBI(item.ownerName, item.token, item.pbiId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<undefined, number>); }
  return response as RequestResponse<IProductBacklogItem, number>;
});

export const deletePBIThunk = createAsyncThunk<
  RequestResponse<any, any>,
  { ownerName: string; token: string; pbiId: number; },
  { rejectValue: RequestResponse<any, any> }
>("deletePBI", async (item: { ownerName: string; token: string; pbiId: number; }, { rejectWithValue }
) => {
  const response: RequestResponse<any, any> = await Fetching.deletePBI(item.ownerName, item.token, item.pbiId);
  if (response.code !== 204) { return rejectWithValue(response as RequestResponse<undefined, undefined>); }
  return response as RequestResponse<any, any>;
});

export const addPBIThunk = createAsyncThunk<
  RequestResponse<IProductBacklogItem, number>,
  { ownerName: string; token: string; pbi: IAddPBI; },
  { rejectValue: RequestResponse<IProductBacklogItem, number> }
>("addPBI", async (item: { ownerName: string; token: string; pbi: IAddPBI; }, { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogItem, number> = await Fetching.addPBI(item.ownerName, item.token, item.pbi);
  if (response.code !== 201) { return rejectWithValue(response as RequestResponse<IProductBacklogItem, number>); }
  return response as RequestResponse<IProductBacklogItem, number>;
});

export const estimatePBIThunk = createAsyncThunk<
  RequestResponse<IProductBacklogItem, number>,
  { ownerName: string; token: string; pbiId: number; hours: number; },
  { rejectValue: RequestResponse<IProductBacklogItem, number> }
>("estimatePBI", async (item: {
  ownerName: string; token: string; pbiId: number;
  hours: number;
}, { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogItem, number> = await Fetching.estimatePBI(item.ownerName, item.token, item.pbiId, item.hours);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IProductBacklogItem, number>); }
  return response as RequestResponse<IProductBacklogItem, number>;
});

export const editPBIThunk = createAsyncThunk<
  RequestResponse<IProductBacklogItem, number>,
  { ownerName: string; token: string; pbi: IAddPBI; pbiId: number; },
  { rejectValue: RequestResponse<IProductBacklogItem, number> }
>("editPBI", async (item: { ownerName: string; token: string; pbi: IAddPBI; pbiId: number }, { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogItem, number> = await Fetching.editPBI(item.ownerName, item.token, item.pbi, item.pbiId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IProductBacklogItem, number>); }
  return response as RequestResponse<IProductBacklogItem, number>;
});

//SPRINTS
export const fetchSprintsThunk = createAsyncThunk<
  RequestResponse<ISprintList, number>,
  { token: string, ownerName: string; filters: IFilters; },
  { rejectValue: RequestResponse<ISprintList, number> }
>("fetchSprints", async (item: { token: string; ownerName: string; filters: IFilters; }, { rejectWithValue }) => {
  const response: RequestResponse<ISprintList, number> = await Fetching.fetchSprints(item.token, item.ownerName, item.filters,);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ISprintList, number>); }
  return response as RequestResponse<ISprintList, number>;
});

export const fetchOneSprintThunk = createAsyncThunk<
  RequestResponse<ISprint, number>,
  { token: string, ownerName: string; sprintNumber: number; },
  { rejectValue: RequestResponse<ISprint, number> }
>("fetchOneSprint", async (item: { token: string; ownerName: string; sprintNumber: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ISprint, number> = await Fetching.fetchOneSprint(item.token, item.ownerName, item.sprintNumber,);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ISprint, number>); }
  return response as RequestResponse<ISprint, number>;
});

export const updateOneSprintThunk = createAsyncThunk<
  RequestResponse<ISprint, number>,
  { token: string, ownerName: string; sprintNumber: number; sprint: any; },
  { rejectValue: RequestResponse<ISprint, number> }
>("updateOneSprint", async (item: {
  token: string; ownerName: string; sprintNumber: number;
  sprint: any;
}, { rejectWithValue }) => {
  const response: RequestResponse<ISprint, number> = await Fetching.updateOneSprint(item.token, item.ownerName, item.sprintNumber, item.sprint);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<undefined, undefined>); }
  return response as RequestResponse<ISprint, number>;
});

export const completeOneSprintThunk = createAsyncThunk<
  RequestResponse<ISprint, number>,
  { token: string, ownerName: string; sprintNumber: number; isFailure: boolean },
  { rejectValue: RequestResponse<ISprint, number> }
>("completeOneSprint", async (item: {
  token: string; ownerName: string; sprintNumber: number;
  isFailure: boolean;
}, { rejectWithValue }) => {
  const response: RequestResponse<ISprint, number> = await Fetching.completeOneSprint(item.token, item.ownerName, item.sprintNumber, item.isFailure);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ISprint, number>); }
  return response as RequestResponse<ISprint, number>;
});

export const addSprintThunk = createAsyncThunk<
  RequestResponse<ISprint, number>,
  { token: string, ownerName: string; sprint: ISprint | any; },
  { rejectValue: RequestResponse<ISprint, number> }
>("addSprint", async (item: { token: string; ownerName: string; sprint: ISprint | any; }, { rejectWithValue }) => {
  const response: RequestResponse<ISprint, number> = await Fetching.addSprint(item.token, item.ownerName, item.sprint);
  if (response.code !== 201) { return rejectWithValue(response as RequestResponse<ISprint, number>); }
  return response as RequestResponse<ISprint, number>;
});

//TASKS
export const fetchTasksThunk = createAsyncThunk<
  RequestResponse<ITaskList, number>,
  { token: string, ownerName: string; filters: IFilters; },
  { rejectValue: RequestResponse<ITaskList, number> }
>("fetchTasks", async (item: { token: string; ownerName: string; filters: IFilters; }, { rejectWithValue }) => {
  const response: RequestResponse<ITaskList, number> = await Fetching.fetchTasks(item.token, item.ownerName, item.filters,);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITaskList, number>); }
  return response as RequestResponse<ITaskList, number>;
});

export const fetchPBITasksThunk = createAsyncThunk<
  RequestResponse<ITaskList, number>,
  { token: string, ownerName: string; pbiId: number; },
  { rejectValue: RequestResponse<ITaskList, number> }
>("fetchPBITasks", async (item: { token: string; ownerName: string; pbiId: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ITaskList, number> = await Fetching.fetchPBITasks(item.token, item.ownerName, item.pbiId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITaskList, number>); }
  return response as RequestResponse<ITaskList, number>;
});

export const addUnassignedTasksToPBI = createAsyncThunk<
  RequestResponse<ITaskList, number>,
  { token: string, ownerName: string; pbiId: number; },
  { rejectValue: RequestResponse<ITaskList, number> }
>("addUnassignedTasksToPBI", async (item: { token: string; ownerName: string; pbiId: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ITaskList, number> = await Fetching.addUnassignedTasksToPBI(item.token, item.ownerName, item.pbiId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITaskList, number>); }
  return response as RequestResponse<ITaskList, number>;
});

export const addTasksToSprintThunk = createAsyncThunk<
  RequestResponse<ITaskList, number>,
  { token: string, ownerName: string; pbiId: number; },
  { rejectValue: RequestResponse<ITaskList, number> }
>("addTasksToSprint", async (item: { token: string; ownerName: string; pbiId: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ITaskList, number> = await Fetching.addTasksToSprint(item.token, item.ownerName, item.pbiId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITaskList, number>); }
  return response as RequestResponse<ITaskList, number>;
});

export const addTaskThunk = createAsyncThunk<
  RequestResponse<ITask, number>,
  { token: string, ownerName: string; pbiId: number; name: string },
  { rejectValue: RequestResponse<ITask, number> }
>("addTask", async (item: {
  token: string; ownerName: string; pbiId: number;
  name: string;
}, { rejectWithValue }) => {
  const response: RequestResponse<ITask, number> = await Fetching.addTask(item.token, item.ownerName, item.pbiId, item.name);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITask, number>); }
  return response as RequestResponse<ITask, number>;
});

export const getPBINamesThunk = createAsyncThunk<
  RequestResponse<string[], number>,
  { ownerName: string; token: string; filters: IFilters; },
  { rejectValue: RequestResponse<IProductBacklogList, number> }
>("getPBINames", async (item: { ownerName: string; token: string; filters: IFilters; }, { rejectWithValue }
) => {
  const response: RequestResponse<IProductBacklogList, number> = await Fetching.getPBINames(item.ownerName, item.token, item.filters);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IProductBacklogList, number>); }
  return response as RequestResponse<IProductBacklogList, number>;
});

export const assignTaskToPBIThunk = createAsyncThunk<
  RequestResponse<ITask, number>,
  { token: string, ownerName: string; pbiId: number; taskId: number },
  { rejectValue: RequestResponse<ITask, number> }
>("assignTaskToPBI", async (item: { token: string; ownerName: string; pbiId: number; taskId: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ITask, number> = await Fetching.assignTaskToPBI(item.token, item.ownerName, item.pbiId, item.taskId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITask, number>); }
  return response as RequestResponse<ITask, number>;
});

export const assignPersonToTaskThunk = createAsyncThunk<
  RequestResponse<ITask, number>,
  { token: string, ownerName: string; login: string; taskId: number },
  { rejectValue: RequestResponse<ITask, number> }
>("assignPersonToTaskThunk", async (item: { token: string; ownerName: string; login: string; taskId: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ITask, number> = await Fetching.assignPersonToTask(item.token, item.ownerName, item.login, item.taskId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITask, number>); }
  return response as RequestResponse<ITask, number>;
});

export const unassignPersonToTaskThunk = createAsyncThunk<
  RequestResponse<ITask, number>,
  { token: string, ownerName: string; login: string; taskId: number },
  { rejectValue: RequestResponse<ITask, number> }
>("unassignPersonToTaskThunk", async (item: { token: string; ownerName: string; login: string; taskId: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ITask, number> = await Fetching.unassignPersonToTask(item.token, item.ownerName, item.login, item.taskId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITask, number>); }
  return response as RequestResponse<ITask, number>;
});

export const startTaskThunk = createAsyncThunk<
  RequestResponse<ITask, number>,
  { token: string, ownerName: string; hotfix: boolean; taskId: number },
  { rejectValue: RequestResponse<ITask, number> }
>("startTaskThunk", async (item: { token: string; ownerName: string; hotfix: boolean; taskId: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ITask, number> = await Fetching.startBranchForTask(item.token, item.ownerName, item.hotfix, item.taskId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITask, number>); }
  return response as RequestResponse<ITask, number>;
});

export const getRateLimitThunk = createAsyncThunk<
  RequestResponse<any, any>,{token:string,url:string},
  { rejectValue: RequestResponse<any, any> }
>("getRateLimit", async (item:{token:string,url:string,}, { rejectWithValue }) => {
  const response: RequestResponse<any, any> = await Fetching.getRateLimit(item.token, item.url);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<any, any>); }
  return response as RequestResponse<any, any>;
});

export const login = createAction<any>("login");
export const logout = createAction("logout");
export const clearError = createAction("clearError");
export const clearState = createAction("clearState");
export const clearProject = createAction("clearProject");
export const clearSprintList = createAction("clearSprintList");
export const clearSprint = createAction("clearSprint");
export const clearReposList = createAction("clearReposList");
export const clearPBIsList = createAction("clearPBIsList");
export const updateSprintKeys = createAction<number[]>("updateSprintKeys");
export const updatePBIKeys = createAction<number[]>("updatePBIKeys");
export const updateSprintLoadingKeys = createAction<number[]>("updateSprintLoadingKeys");
export const updatePBILoadingKeys = createAction<number[]>("updatePBILoadingKeys");