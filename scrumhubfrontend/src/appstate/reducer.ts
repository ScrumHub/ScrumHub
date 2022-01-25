import * as Actions from "./actions";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { RequestResponse } from "./response";
import { IAssignBI, ILoginState, IPeopleList, IPerson, IBacklogItem, IBacklogItemList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList, IState } from "./stateInterfaces";
import { initError, loggedOutLoginState, unassignedPBI } from "./stateInitValues";
import { isArrayValid, isNameFilterValid } from "../components/utility/commonFunctions";
import { getError, updateStateTasks, updateStateKeys, addStateTask, addStateUnassignedTaskToPBI, updateStatePBI, updateTasksSWR, fetchStateRepos, updateStateOneSprint, addStateRepo, addStatePBI, addStateSprint, updateOnDragStateTasks } from "./stateUtilities";
import { isNull } from "lodash";
import config from "../configuration/config";
var _ = require('lodash');

export const reducerFunction = (initState: IState) => {
  return (createReducer(initState, {
    [Actions.clearError.type]: (state: IState, payload: any) => {
      let newState = _.cloneDeep(state as IState);
      return ({ ...newState, error: initError, changedRepo:isNameFilterValid(payload.payload)?payload.payload:""});
    },
    [Actions.clearReposList.type]: (state: IState) => {
      let newState = _.cloneDeep(state);
      newState.repositories = [];
      newState.reposRequireRefresh = true;
      newState.reposLastPage = false;
      return newState;
    },
    [Actions.clearState.type]: (state: IState) => {
      return (initState);
    },
    [Actions.clearProject.type]: (state: IState) => {
      let newState = _.cloneDeep(state) as IState;
      return { ...initState, repositories: newState.repositories, loginState:newState.loginState, currentUser: newState.currentUser };
    },
    [Actions.clearPBIsList.type]: (state: IState) => {
      let newState = _.cloneDeep(state);
      newState.pbiPage.list = [];
      newState.productRequireRefresh = true;
      newState.reposLastPage = false;
      return newState;
    },
    [Actions.clearSprintList.type]: (state: IState) => {
      let newState = _.cloneDeep(state);
      newState.sprintPage.list = [];
      newState.sprintRequireRefresh = true;
      newState.sprintLastPage = false;
      return newState;
    },
    [Actions.clearSprint.type]: (state: IState) => {
      let newState = _.cloneDeep(state);
      newState.openSprint = null;
      newState.sprintRequireRefresh = true;
      newState.sprintLastPage = false;
      return newState;
    },
    [Actions.updateSprintKeys.type]: (state: IState, expanded: any) => {
      let newState = _.cloneDeep(state);
      const temp = expanded.payload as number[];
      return { ...newState, keys: { ...newState.keys, sprintKeys: updateStateKeys(newState.keys.sprintKeys, temp) } };
    },
    [Actions.updatePBIKeys.type]: (state: IState, expanded: any) => {
      let newState = _.cloneDeep(state);
      const temp = expanded.payload as number[];
      return { ...newState, keys: { ...newState.keys, pbiKeys: updateStateKeys(newState.keys.pbiKeys, temp) } };
    },
    [Actions.updateSprintLoadingKeys.type]: (state: IState, expanded: any) => {
      let newState = _.cloneDeep(state);
      const temp = expanded.payload as number[];
      return { ...newState, loadingKeys: { ...newState.loadingKeys, sprintKeys: updateStateKeys(newState.loadingKeys.sprintKeys, temp) } };
    },
    [Actions.updatePBILoadingKeys.type]: (state: IState, expanded: any) => {
      let newState = _.cloneDeep(state);
      const temp = expanded.payload as number[];
      return { ...newState, loadingKeys: { ...newState.loadingKeys, pbiKeys: updateStateKeys(newState.loadingKeys.pbiKeys, temp) } };
    },
    [Actions.login.type]: (state: IState, expanded: any) => {
      let newState = _.cloneDeep(state);
      const tempLogin = expanded.payload as ILoginState
      return ({ ...newState, loginState: { ...newState.loginState, isLoggedIn: tempLogin.isLoggedIn, token: tempLogin.token } });
    },
    [Actions.logout.type]: (state: IState) => { return ({ ...initState, loginState: loggedOutLoginState }); },
    /*REPOS*/
    [Actions.fetchReposThunk.pending.toString()]: (state: IState) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchReposThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<IRepositoryList, number>>) => {
      let newState = _.cloneDeep(state);
      return fetchStateRepos(newState, payload.payload.response as IRepositoryList, _.get(payload, ["meta", "arg", "filters", "pageNumber"], config.defaultFilters.page),
       _.get(payload, ["meta", "arg", "filters", "pageSize"], config.defaultFilters.size),_.get(payload.payload.response, ["pageCount"], 1));
    },
    [Actions.fetchReposThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.addRepositoryThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.addRepositoryThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<IRepository, number>>) => {
      let newState = _.cloneDeep(state);
      return (addStateRepo(newState, payload.payload.response as IRepository));
    },
    [Actions.addRepositoryThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },/*PBIS*/
    [Actions.finishPBIThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.finishPBIThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<IBacklogItem, number>>) => {
      let newState = _.cloneDeep(state);
      return updateStatePBI(newState, payload.payload.response as IBacklogItem);
    },
    [Actions.finishPBIThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.addPBIThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.addPBIThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<IBacklogItem, number>>) => {
      let newState = _.cloneDeep(state);
      return(addStatePBI(newState,payload.payload.response as IBacklogItem));
    },
    [Actions.addPBIThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.deletePBIThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.deletePBIThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<any, any>>) => {
      let newState = _.cloneDeep(state);
      newState.loading = false;
      return newState;
    },
    [Actions.deletePBIThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.fetchPBIsThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchPBIsThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<IBacklogItemList, number>>) => {
      let newState = _.cloneDeep(state);
      const pbisList = payload.payload.response as IBacklogItemList;
      if (newState.pbiPage && isArrayValid(newState.pbiPage.list) && newState.pbiPage.list[0].id === 0) {
        newState.pbiPage = { ...pbisList, list: [newState.pbiPage.list[0]].concat(pbisList.list) };
      }
      else {
        newState.pbiPage = { ...pbisList, list: [unassignedPBI].concat(pbisList.list) };
      }
      newState.loading = false;
      return newState;
    },
    [Actions.fetchPBIsThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.fetchPeopleThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchPeopleThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<IPeopleList, number>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, people: payload.payload.response as IPeopleList, error: initError, loading: false };
    },
    [Actions.fetchPeopleThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.getCurrentUserThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.getCurrentUserThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<IPerson, number>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, currentUser: payload.payload.response as IPerson, error: initError, loading: false };
    },
    [Actions.getCurrentUserThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.getPBINamesThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.getPBINamesThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<IBacklogItemList, number>>) => {
      let newState = _.cloneDeep(state);
      newState.error = initError;
      newState.namedPBI = (payload.payload.response as IBacklogItemList).list as IAssignBI[];
      newState.loading = false;
      return newState;
    },
    [Actions.getPBINamesThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.estimatePBIThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.estimatePBIThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<IBacklogItem, number>>) => {
      let newState = _.cloneDeep(state);
      return updateStatePBI(newState, payload.payload.response as IBacklogItem);
    },
    [Actions.estimatePBIThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.editPBIThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.editPBIThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<IBacklogItem, number>>) => {
      let newState = _.cloneDeep(state);
      return updateStatePBI(newState, payload.payload.response as IBacklogItem);
    },
    [Actions.editPBIThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },/*SPRINTS*/
    [Actions.fetchSprintsThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchSprintsThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<ISprintList, number>>) => {
      let newState = _.cloneDeep(state);
      const sprints = payload.payload.response as ISprintList;
      newState.sprintPage = sprints;
      const index = sprints && isArrayValid(sprints.list) ? sprints.list.findIndex((sprint: ISprint) => sprint.isCurrent) : -1;
      if (index !== -1) { newState.activeSprintNumber = sprints.list[index].sprintNumber };
      newState.sprintRequireRefresh = false;
      newState.loading = false;
      newState.error = initError;
      return newState;
    },
    [Actions.fetchSprintsThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.fetchOneSprintThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchOneSprintThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<ISprint, number>>) => {
      let newState = _.cloneDeep(state);
      newState.openSprint = payload.payload.response as ISprint;
      if (!isNull(newState.openSprint) && newState.openSprint.isCurrent) { newState.activeSprintNumber = newState.openSprint.sprintNumber };
      newState.sprintRequireRefresh = false;
      newState.error = initError;
      newState.loading = false;
      return newState;
    },
    [Actions.fetchOneSprintThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.updateOneSprintThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.updateOneSprintThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<ISprint | any, number>>) => {
      let newState = _.cloneDeep(state);
      return (updateStateOneSprint(newState, payload.payload.response as ISprint));
    },
    [Actions.updateOneSprintThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.completeOneSprintThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.completeOneSprintThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<ISprint, number>>) => {
      let newState = _.cloneDeep(state);
      return (updateStateOneSprint(newState, payload.payload.response as ISprint));
    },
    [Actions.completeOneSprintThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.addSprintThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.addSprintThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<ISprint, undefined>>) => {
      let newState = _.cloneDeep(state);
      return(addStateSprint(newState,payload.payload.response as ISprint));
    },
    [Actions.addSprintThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },/*TASKS*/
    [Actions.fetchPBITasksThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchPBITasksThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<ITaskList, number>>) => {
      let newState = _.cloneDeep(state);
      return updateTasksSWR(newState, payload.payload.response as ITaskList);
    },
    [Actions.updateTasks.type]: (state: IState, payload: PayloadAction<any>) => {
      let newState = _.cloneDeep(state);
      const item = payload.payload as IBacklogItem;
      return updateStatePBI(newState, item);
    },
    [Actions.fetchPBITasksThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.addUnassignedTasksToPBI.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.addUnassignedTasksToPBI.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<ITaskList, number>>) => {
      let newState = _.cloneDeep(state);
      return addStateUnassignedTaskToPBI(newState, payload.payload.response as ITaskList);
    },
    [Actions.addUnassignedTasksToPBI.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.addTaskThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.addTaskThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<ITask, number>>) => {
      let newState = _.cloneDeep(state);
      return addStateTask(newState, payload.payload.response as ITask);
    },
    [Actions.addTaskThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.assignTaskToPBIThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.assignTaskToPBIThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<IBacklogItem, number>>) => {
      let newState = _.cloneDeep(state);
      return updateOnDragStateTasks(newState,payload.payload.response as ITask);
    },
    [Actions.assignTaskToPBIThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.updatePersonInTaskThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.updatePersonInTaskThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<ITask, number>>) => {
      let newState = _.cloneDeep(state);
      return updateStateTasks(newState, payload.payload.response as ITask);
    },
    [Actions.updatePersonInTaskThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.startTaskThunk.pending.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.startTaskThunk.fulfilled.toString()]: (state: IState, payload: PayloadAction<RequestResponse<ITask, number>>) => {
      let newState = _.cloneDeep(state);
      return updateStateTasks(newState, payload.payload.response as ITask);
    },
    [Actions.startTaskThunk.rejected.toString()]: (state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
  }));
}