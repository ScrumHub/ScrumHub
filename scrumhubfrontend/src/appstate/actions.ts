/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { RequestResponse } from "./response";
import * as Fetching from "./fetching";
import { IAddBI, IFilters, IFiltersAndToken, ILoginState, IPeopleList, IPerson, IBacklogItem, IBacklogItemList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList } from "./stateInterfaces";

/** Thunk that waits for response from function {@linkcode fetchRepos} that sends a request fetching {@linkcode IRepositoryList}*/
export const fetchReposThunk = createAsyncThunk<
  RequestResponse<IRepositoryList, number>,
  { filters: IFilters; token: string },
  { rejectValue: RequestResponse<IRepositoryList, number> }
>("fetchRepos", async (item: IFiltersAndToken, { rejectWithValue }) => {
  const response: RequestResponse<IRepositoryList, number> = await Fetching.fetchRepos(item.filters, item.token);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IRepositoryList, number>); }
  return response as RequestResponse<IRepositoryList, number>;
});
/**  Thunk that waits for response from function {@linkcode fetchPeople} that sends a request fetching {@linkcode IPeopleList}*/
export const fetchPeopleThunk = createAsyncThunk<
  RequestResponse<IPeopleList, number>,
  { ownerName: string; token: string },
  { rejectValue: RequestResponse<IPeopleList, number> }
>("fetchPeople", async (item: { ownerName: string; token: string }, { rejectWithValue }) => {
  const response: RequestResponse<IPeopleList, number> = await Fetching.fetchPeople(item.ownerName, item.token);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IPeopleList, number>); }
  return response as RequestResponse<IPeopleList, number>;
});
/** Thunk that waits for response from function {@linkcode getCurrentUser} that sends a request fetching {@linkcode IPerson} currentUser*/
export const getCurrentUserThunk = createAsyncThunk<
  RequestResponse<IPerson, number>,
  { token: string },
  { rejectValue: RequestResponse<IPeopleList, number> }
>("getCurrentUser", async (item: { token: string }, { rejectWithValue }) => {
  const response: RequestResponse<IPeopleList, number> = await Fetching.getCurrentUser(item.token);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IPeopleList, number>); }
  return response as RequestResponse<IPeopleList, number>;
});
/** Thunk that waits for response from function {@linkcode addRepo} that sends a request adding {@linkcode IRepository} repository to ScrumHub*/
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
  const response: RequestResponse<IRepository, number> = await Fetching.addRepo(repoWithToken.id, repoWithToken.token);
  if (response.code !== 201) { return rejectWithValue(response as RequestResponse<IRepository, number>); }
  return response as RequestResponse<IRepository, number>;
});
/** Thunk that waits for response from function {@linkcode fetchPBIs} that sends a request fetching {@linkcode IBacklogItemList} backlogItemList*/
export const fetchPBIsThunk = createAsyncThunk<
  RequestResponse<IBacklogItemList, number>,
  { ownerName: string; token: string; filters: IFilters; },
  { rejectValue: RequestResponse<IBacklogItemList, number> }
>("fetchPBIs", async (item: { ownerName: string; token: string; filters: IFilters; }, { rejectWithValue }
) => {
  const response: RequestResponse<IBacklogItemList, number> = await Fetching.fetchPBIs(item.ownerName, item.token, item.filters);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<undefined, undefined>); }
  return response as RequestResponse<IBacklogItemList, number>;
});
/** Thunk that waits for response from function {@linkcode finishPBI} that sends a request that completes {@linkcode IBacklogItem} backlogItem*/
export const finishPBIThunk = createAsyncThunk<
  RequestResponse<IBacklogItem, number>,
  { ownerName: string; token: string; pbiId: number; },
  { rejectValue: RequestResponse<IBacklogItem, number> }
>("finishPBI", async (item: { ownerName: string; token: string; pbiId: number; }, { rejectWithValue }
) => {
  const response: RequestResponse<IBacklogItem, number> = await Fetching.finishPBI(item.ownerName, item.token, item.pbiId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<undefined, number>); }
  return response as RequestResponse<IBacklogItem, number>;
});
/** Thunk that waits for response from function {@linkcode deletePBI} that sends a request that deletes {@linkcode IBacklogItem} backlogItem*/
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
/** Thunk that waits for response from function {@linkcode addPBI} that sends a request that adds new {@linkcode IBacklogItem} backlogItem*/
export const addPBIThunk = createAsyncThunk<
  RequestResponse<IBacklogItem, number>,
  { ownerName: string; token: string; pbi: IAddBI; },
  { rejectValue: RequestResponse<IBacklogItem, number> }
>("addPBI", async (item: { ownerName: string; token: string; pbi: IAddBI; }, { rejectWithValue }
) => {
  const response: RequestResponse<IBacklogItem, number> = await Fetching.addPBI(item.ownerName, item.token, item.pbi);
  if (response.code !== 201) { return rejectWithValue(response as RequestResponse<IBacklogItem, number>); }
  return response as RequestResponse<IBacklogItem, number>;
});
/** Thunk that waits for response from function {@linkcode estimatePBI} that sends a request that estimates StoryPoints for the given {@linkcode IBacklogItem} backlogItem*/
export const estimatePBIThunk = createAsyncThunk<
  RequestResponse<IBacklogItem, number>,
  { ownerName: string; token: string; pbiId: number; hours: number; },
  { rejectValue: RequestResponse<IBacklogItem, number> }
>("estimatePBI", async (item: {
  ownerName: string; token: string; pbiId: number;
  hours: number;
}, { rejectWithValue }
) => {
  const response: RequestResponse<IBacklogItem, number> = await Fetching.estimatePBI(item.ownerName, item.token, item.pbiId, item.hours);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IBacklogItem, number>); }
  return response as RequestResponse<IBacklogItem, number>;
});
/** Thunk that waits for response from function {@linkcode editPBI} that sends a request that updates {@linkcode IBacklogItem} backlogItem*/
export const editPBIThunk = createAsyncThunk<
  RequestResponse<IBacklogItem, number>,
  { ownerName: string; token: string; pbi: IAddBI; pbiId: number; },
  { rejectValue: RequestResponse<IBacklogItem, number> }
>("editPBI", async (item: { ownerName: string; token: string; pbi: IAddBI; pbiId: number }, { rejectWithValue }
) => {
  const response: RequestResponse<IBacklogItem, number> = await Fetching.editPBI(item.ownerName, item.token, item.pbi, item.pbiId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IBacklogItem, number>); }
  return response as RequestResponse<IBacklogItem, number>;
});

//SPRINTS
/** Thunk that waits for response from function {@linkcode fetchSprints} that sends a request that fetches {@linkcode ISprintList} sprintList*/
export const fetchSprintsThunk = createAsyncThunk<
  RequestResponse<ISprintList, number>,
  { token: string, ownerName: string; filters: IFilters; },
  { rejectValue: RequestResponse<ISprintList, number> }
>("fetchSprints", async (item: { token: string; ownerName: string; filters: IFilters; }, { rejectWithValue }) => {
  const response: RequestResponse<ISprintList, number> = await Fetching.fetchSprints(item.token, item.ownerName, item.filters,);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ISprintList, number>); }
  return response as RequestResponse<ISprintList, number>;
});
/** Thunk that waits for response from function {@linkcode fetchSprints} that sends a request that fetches one {@linkcode ISprint} sprint*/
export const fetchOneSprintThunk = createAsyncThunk<
  RequestResponse<ISprint, number>,
  { token: string, ownerName: string; sprintNumber: number; },
  { rejectValue: RequestResponse<ISprint, number> }
>("fetchOneSprint", async (item: { token: string; ownerName: string; sprintNumber: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ISprint, number> = await Fetching.fetchOneSprint(item.token, item.ownerName, item.sprintNumber,);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ISprint, number>); }
  return response as RequestResponse<ISprint, number>;
});
/** Thunk that waits for response from function {@linkcode updateOneSprint} that sends a request that updates one {@linkcode ISprint} sprint*/
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
/** Thunk that waits for response from function {@linkcode completeOneSprint} that sends a request that completes {@linkcode ISprint} sprint */
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
/** Thunk that waits for response from function {@linkcode addSprint} that sends a request that adds new {@linkcode ISprint} sprint */
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
/** Thunk that waits for response from function {@linkcode fetchPBITasks} that sends a request that fetches {@linkcode ITaskList} taskList for the given {@linkcode IBacklogItem} backlogItem */
export const fetchPBITasksThunk = createAsyncThunk<
  RequestResponse<ITaskList, number>,
  { token: string, ownerName: string; pbiId: number; },
  { rejectValue: RequestResponse<ITaskList, number> }
>("fetchPBITasks", async (item: { token: string; ownerName: string; pbiId: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ITaskList, number> = await Fetching.fetchPBITasks(item.token, item.ownerName, item.pbiId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITaskList, number>); }
  return response as RequestResponse<ITaskList, number>;
});
/** Thunk that waits for response from function {@linkcode addUnassignedTasksToPBI} that sends a request that fetches {@linkcode ITaskList} taskList of unassiggned {@linkcode ITask} tasks */
export const addUnassignedTasksToPBI = createAsyncThunk<
  RequestResponse<ITaskList, number>,
  { token: string, ownerName: string; pbiId: number; },
  { rejectValue: RequestResponse<ITaskList, number> }
>("addUnassignedTasksToPBI", async (item: { token: string; ownerName: string; pbiId: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ITaskList, number> = await Fetching.addUnassignedTasksToPBI(item.token, item.ownerName, item.pbiId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITaskList, number>); }
  return response as RequestResponse<ITaskList, number>;
});
/** Thunk that waits for response from function {@linkcode fetchAllRepoTasks} that sends a request that fetches {@linkcode ITaskList} taskList for the given {@linkcode IRepository} */
export const fetchRepoTasksThunk = createAsyncThunk<
  RequestResponse<ITaskList, number>,
  { token: string, ownerName: string; },
  { rejectValue: RequestResponse<ITask, number> }
>("fetchRepoTasks", async (item: {
  token: string; ownerName: string; 
}, { rejectWithValue }) => {
  const response: RequestResponse<ITaskList, number> = await Fetching.fetchAllRepoTasks(item.token, item.ownerName);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITask, number>); }
  return response as RequestResponse<ITaskList, number>;
});
/** Thunk that waits for response from function {@linkcode addTask} that sends a request that adds {@linkcode ITask} task to the given {@linkcode IBacklogItem} */
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
  { rejectValue: RequestResponse<IBacklogItemList, number> }
>("getPBINames", async (item: { ownerName: string; token: string; filters: IFilters; }, { rejectWithValue }
) => {
  const response: RequestResponse<IBacklogItemList, number> = await Fetching.getPBINames(item.ownerName, item.token, item.filters);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<IBacklogItemList, number>); }
  return response as RequestResponse<IBacklogItemList, number>;
});
/** Thunk that waits for response from function {@linkcode assignTaskToPBI} that sends a request that assigns {@linkcode ITask} task to the given {@linkcode IBacklogItem} */
export const assignTaskToPBIThunk = createAsyncThunk<
  RequestResponse<ITask, number>,
  { token: string, ownerName: string; pbiId: number; taskId: number },
  { rejectValue: RequestResponse<ITask, number> }
>("assignTaskToPBI", async (item: { token: string; ownerName: string; pbiId: number; taskId: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ITask, number> = await Fetching.assignTaskToPBI(item.token, item.ownerName, item.pbiId, item.taskId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITask, number>); }
  return response as RequestResponse<ITask, number>;
});
/** Thunk that waits for response from function {@linkcode updatePersonInTask} that sends a request that un/assigns {@linkcode IPerson[]} people to the given {@linkcode ITask} task */
export const updatePersonInTaskThunk = createAsyncThunk<
  RequestResponse<ITask, number>,
  { token: string, ownerName: string; login: string; taskId: number, isAssign:boolean },
  { rejectValue: RequestResponse<ITask, number> }
>("updatePersonInTaskThunk", async (item: { token: string; ownerName: string; login: string; taskId: number;isAssign:boolean; }, { rejectWithValue }) => {
  const response: RequestResponse<ITask, number> = await Fetching.updatePersonInTask(item.token, item.ownerName, item.login, item.taskId,item.isAssign);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITask, number>); }
  return response as RequestResponse<ITask, number>;
});
/** Thunk that waits for response from function {@linkcode startBranchForTask} that sends a request that starts new GitHub branch for the given {@linkcode ITask} task */
export const startTaskThunk = createAsyncThunk<
  RequestResponse<ITask, number>,
  { token: string, ownerName: string; hotfix: boolean; taskId: number },
  { rejectValue: RequestResponse<ITask, number> }
>("startTaskThunk", async (item: { token: string; ownerName: string; hotfix: boolean; taskId: number; }, { rejectWithValue }) => {
  const response: RequestResponse<ITask, number> = await Fetching.startBranchForTask(item.token, item.ownerName, item.hotfix, item.taskId);
  if (response.code !== 200) { return rejectWithValue(response as RequestResponse<ITask, number>); }
  return response as RequestResponse<ITask, number>;
});

export const login = createAction<any>("login");
export const logout = createAction("logout");
export const clearError = createAction<string>("clearError");
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
export const updateTasks = createAction<IBacklogItem>("updateTasks");
export const updateAllTasks = createAction<ITask[]>("updateAllTasks");