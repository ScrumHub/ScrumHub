import * as Actions from "./actions";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { RequestResponse } from "./response";
import config from "../configuration/config";
import { IAssignPBI, ILoginState, IPeopleList, IPerson, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList, IState } from "./stateInterfaces";
import { initError, loggedOutLoginState, unassignedPBI } from "./initStateValues";
import { isArrayValid } from "../components/utility/commonFunctions";
import { getError, updateStateTasks, updateStateKeys, addStateTask, addStateUnassignedTaskToPBI, updateStatePBI, updateTasksSWR } from "./stateUtilities";
import { isNull } from "lodash";
var _ = require('lodash');

export const reducerFunction = (initState: IState) => {
  return (createReducer(initState, {
    [Actions.clearError.type]: (state: IState) => {
      let newState = _.cloneDeep(state as IState);
      newState.error = {
        hasError: false,
        errorCode: 0,
        erorMessage: "",
      };
      return newState as IState;
    },
    [Actions.clearReposList.type]: (state: IState) => {
      let newState = _.cloneDeep(state);
      newState.repositories = [];
      newState.reposRequireRefresh = true;
      newState.reposLastPage = false;
      return newState;
    },
    [Actions.clearState.type]: (state: IState) => {
      let newState = _.cloneDeep(state);
      newState = initState;
      return newState;
    },
    [Actions.clearProject.type]: (state: IState) => {
      let newState = _.cloneDeep(state) as IState;
      newState = { ...initState, repositories: newState.repositories, currentUser: newState.currentUser };
      return newState;
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
      newState.keys = { ...newState.keys, sprintKeys: updateStateKeys(newState.keys.sprintKeys, temp) };
      return newState;
    },
    [Actions.updatePBIKeys.type]: (state: IState, expanded: any) => {
      let newState = _.cloneDeep(state);
      const temp = expanded.payload as number[];
      newState.keys = { ...newState.keys, pbiKeys: updateStateKeys(newState.keys.pbiKeys, temp) };
      return newState;
    },
    [Actions.updateSprintLoadingKeys.type]: (state: IState, expanded: any) => {
      let newState = _.cloneDeep(state);
      const temp = expanded.payload as number[];
      newState.loadingKeys = { ...newState.loadingKeys, sprintKeys: updateStateKeys(newState.loadingKeys.sprintKeys, temp) };
      return newState;
    },
    [Actions.updatePBILoadingKeys.type]: (state: IState, expanded: any) => {
      let newState = _.cloneDeep(state);
      const temp = expanded.payload as number[];
      newState.loadingKeys = { ...newState.loadingKeys, pbiKeys: updateStateKeys(newState.loadingKeys.pbiKeys, temp) };
      return newState;
    },
    [Actions.login.type]: (state: IState, expanded: any) => {
      let newState = _.cloneDeep(state);
      const tempLogin = expanded.payload as ILoginState
      newState.loginState.isLoggedIn = tempLogin.isLoggedIn;
      newState.loginState.token = tempLogin.token;
      return newState;
    },
    [Actions.logout.type]: (state: IState) => {
      return ({ ...initState, loginState: loggedOutLoginState });
    },
    [Actions.getRateLimitThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<any, any>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.getRateLimitThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<any, any>>) => {
      const temp = payload.payload.response as any;
      if (!isNull(temp.rate) && !isNull(temp.rate.remaining) && state.rateLimitLeft !== temp.rate.remaining) {
        let newState = _.cloneDeep(state);
        newState.loading = false;
        newState.rateLimitLeft = temp.rate.remaining;
        return newState;
      }
    },
    [Actions.getRateLimitThunk.rejected.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<any, any>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    //REPOS
    [Actions.fetchRepositoriesThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchRepositoriesThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<IRepositoryList, number>>
    ) => {
      let newState = _.cloneDeep(state);
      const pageNumber = _.get(
        payload,
        ["meta", "arg", "filters", "pageNumber"],
        config.defaultFilters.page
      );
      const pageSize = _.get(
        payload,
        ["meta", "arg", "filters", "pageSize"],
        config.defaultFilters.size
      );
      const repos = payload.payload.response as IRepositoryList;
      if (newState.repositories == null || pageNumber === 1) {
        newState.repositories = (repos.list).slice(0, (pageNumber + 1) * pageSize);
      } else if (newState.repositories !== repos.list) {
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
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.addRepositoryThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.addRepositoryThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<IRepository, number>>) => {
      let newState = _.cloneDeep(state);
      const repo = payload.payload.response as IRepository;
      newState.repositories[newState.repositories.findIndex((el: IRepository) => el.gitHubId === repo.gitHubId)] = repo;
      newState.loading = false;
      return newState;
    },
    [Actions.addRepositoryThunk.rejected.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },//PBIS
    [Actions.finishPBIThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.finishPBIThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>) => {
      let newState = _.cloneDeep(state);
      const pbi = payload.payload.response as IProductBacklogItem;
      return updateStatePBI(newState, pbi);
    },
    [Actions.finishPBIThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.addPBIThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.addPBIThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      const pbi = payload.payload.response as IProductBacklogItem;
      if (newState.pbiPage && isArrayValid(newState.pbiPage.list)) {
        newState.pbiPage.list = newState.pbiPage.list.concat([pbi]);
      }
      else {
        newState.pbiPage.list = [pbi];
      }
      newState.error = initError;
      newState.loading = false;
      return newState;
    },
    [Actions.addPBIThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.deletePBIThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.deletePBIThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<any, any>>) => {
      let newState = _.cloneDeep(state);
      newState.loading = false;
      return newState;
    },
    [Actions.deletePBIThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.fetchPBIsThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchPBIsThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<IProductBacklogList, number>>
    ) => {
      let newState = _.cloneDeep(state);
      const pbisList = payload.payload.response as IProductBacklogList;
      if (newState.pbiPage && isArrayValid(newState.pbiPage.list) && newState.pbiPage.list[0].id === 0) {
        newState.pbiPage = { ...pbisList, list: [newState.pbiPage.list[0]].concat(pbisList.list) };
      }
      else {
        newState.pbiPage = { ...pbisList, list: [unassignedPBI].concat(pbisList.list) };
      }
      newState.loading = false;
      return newState;
    },
    [Actions.fetchPBIsThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.fetchPeopleThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchPeopleThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<IPeopleList, number>>
    ) => {
      let newState = _.cloneDeep(state);
      newState.people = payload.payload.response as IPeopleList;
      newState.error = initError;
      newState.loading = false;
      return newState;
    },
    [Actions.fetchPeopleThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.getCurrentUserThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.getCurrentUserThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<IPerson, number>>
    ) => {
      let newState = _.cloneDeep(state);
      newState.currentUser = payload.payload.response as IPerson;
      newState.error = initError;
      newState.loading = false;
      return newState;
    },
    [Actions.getCurrentUserThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.getPBINamesThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.getPBINamesThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<IProductBacklogList, number>>
    ) => {
      let newState = _.cloneDeep(state);
      newState.error = initError;
      newState.namedPBI = (payload.payload.response as IProductBacklogList).list as IAssignPBI[];
      newState.loading = false;
      return newState;
    },
    [Actions.getPBINamesThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.estimatePBIThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.estimatePBIThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>) => {
      let newState = _.cloneDeep(state);
      const pbi = payload.payload.response as IProductBacklogItem;
      return updateStatePBI(newState, pbi);
    },
    [Actions.estimatePBIThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.editPBIThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.editPBIThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>) => {
      let newState = _.cloneDeep(state);
      const pbi = payload.payload.response as IProductBacklogItem;
      return updateStatePBI(newState, pbi);
    },
    [Actions.editPBIThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },//SPRINTS
    [Actions.fetchSprintsThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchSprintsThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ISprintList, number>>
    ) => {
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
    [Actions.fetchSprintsThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.fetchOneSprintThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchOneSprintThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ISprint, number>>
    ) => {
      let newState = _.cloneDeep(state);
      newState.openSprint = payload.payload.response as ISprint;
      if (newState.openSprint.isCurrent) { newState.activeSprintNumber = newState.openSprint.sprintNumber };
      newState.sprintRequireRefresh = false;
      newState.error = initError;
      newState.loading = false;
      return newState;
    },
    [Actions.fetchOneSprintThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.updateOneSprintThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.updateOneSprintThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ISprint | any, number>>
    ) => {
      let newState = _.cloneDeep(state);
      const sprint = payload.payload.response as ISprint;
      const objIndex = newState.sprintPage.list.findIndex((s: ISprint) => s.sprintNumber === sprint.sprintNumber);
      newState.sprintPage.list[objIndex] = sprint;
      if (sprint.isCurrent) { newState.activeSprintNumber = sprint.sprintNumber };
      if (newState.openSprint && newState.openSprint.sprintNumber === sprint.sprintNumber) { newState.openSprint = sprint; }
      newState.loading = false;
      return newState;
    },
    [Actions.updateOneSprintThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.completeOneSprintThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.completeOneSprintThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ISprint, number>>
    ) => {
      let newState = _.cloneDeep(state);
      const sprint = payload.payload.response as ISprint;
      const objIndex = newState.sprintPage.list.findIndex((s: ISprint) => s.sprintNumber === sprint.sprintNumber);
      (newState.sprintPage.list[objIndex] as ISprint) = sprint;
      if (sprint.isCurrent) { newState.activeSprintNumber = sprint.sprintNumber };
      if (newState.openSprint && newState.openSprint.sprintNumber === sprint.sprintNumber) { newState.openSprint = sprint; }
      newState.loading = false;
      return newState;
    },
    [Actions.completeOneSprintThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.addSprintThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.addSprintThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ISprint, undefined>>) => {
      let newState = _.cloneDeep(state);
      const sprint = payload.payload.response as ISprint;
      if (isArrayValid(sprint.backlogItems) && newState.pbiPage && isArrayValid(newState.pbiPage.list)) {
        newState.pbiPage = { ...newState.pbiPage, list: newState.pbiPage.list.filter((pbi: IProductBacklogItem) => !sprint.backlogItems.filter((pbi2: IProductBacklogItem) => pbi.id === pbi2.id).length) };
      }
      if (newState.sprintPage && isArrayValid(newState.sprintPage.list)) {
        newState.sprintPage.list = newState.sprintPage.list.concat([sprint]);
      }
      else {
        newState.sprintPage.list = [sprint];
      }
      if (sprint.isCurrent) { newState.activeSprintNumber = sprint.sprintNumber };
      newState.error = initError;
      newState.loading = false;
      return newState;
    },
    [Actions.addSprintThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    //TASKS
    [Actions.fetchTasksThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchTasksThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ITaskList, number>>
    ) => {
      let newState = _.cloneDeep(state);
      const pageNumber = _.get(payload, ["meta", "arg", "filters", "pageNumber"], config.defaultFilters.page);
      const pageSize = _.get(payload, ["meta", "arg", "filters", "pageSize"], config.defaultFilters.size);
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
      newState.taskLastPage = tasks.list.length < pageSize;
      newState.taskRequireRefresh = false;
      newState.error = initError;
      newState.loading = false;
      return newState;
    },
    [Actions.fetchTasksThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.fetchPBITasksThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.fetchPBITasksThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ITaskList, number>>
    ) => {
      let newState = _.cloneDeep(state);
      const tasks = payload.payload.response as ITaskList;
      return updateTasksSWR(newState, tasks);
    },
    [Actions.fetchPBITasksThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.addUnassignedTasksToPBI.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.addUnassignedTasksToPBI.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ITaskList, number>>
    ) => {
      let newState = _.cloneDeep(state);
      const tasks = payload.payload.response as ITaskList;
      return addStateUnassignedTaskToPBI(newState, tasks);
    },
    [Actions.addUnassignedTasksToPBI.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.addTasksToSprintThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.addTasksToSprintThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ITaskList, number>>
    ) => {
      let newState = _.cloneDeep(state);
      const tasks = payload.payload.response as ITaskList;
      if (newState.sprintPage && newState.sprintPage.list.length > 0 && tasks && tasks.list.length > 0) {

        newState.sprintPage.list = newState.sprintPage.list.map((sprint: ISprint) => {
          sprint.backlogItems = sprint.backlogItems.map((item: IProductBacklogItem) => {
            if (item.id === tasks.list[0].pbiId) {
              return { ...item, tasks: tasks.list };
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
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.addTaskThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.addTaskThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ITask, number>>) => {
      let newState = _.cloneDeep(state);
      const task = payload.payload.response as ITask;
      return addStateTask(newState, task);
    },
    [Actions.addTaskThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.assignTaskToPBIThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.assignTaskToPBIThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<IProductBacklogItem, number>>) => {
      let newState = _.cloneDeep(state);
      newState.productRequireRefresh = true;
      newState.sprintRequireRefresh = true;
      newState.loading = false;
      return newState;
    },
    [Actions.assignTaskToPBIThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.assignPersonToTaskThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.assignPersonToTaskThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ITask, number>>
    ) => {
      let newState = _.cloneDeep(state);
      const task = payload.payload.response as ITask;
      return updateStateTasks(newState, task);
    },
    [Actions.assignPersonToTaskThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.unassignPersonToTaskThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.unassignPersonToTaskThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ITask, number>>
    ) => {
      let newState = _.cloneDeep(state);
      const task = payload.payload.response as ITask;
      return updateStateTasks(newState, task);
    },
    [Actions.unassignPersonToTaskThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
    [Actions.startTaskThunk.pending.toString()]: (
      state: IState, payload: PayloadAction<RequestResponse<undefined, undefined>>) => {
      let newState = _.cloneDeep(state);
      return { ...newState, loading: true };
    },
    [Actions.startTaskThunk.fulfilled.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<ITask, number>>
    ) => {
      let newState = _.cloneDeep(state);
      const task = payload.payload.response as ITask;
      return updateStateTasks(newState, task);
    },
    [Actions.startTaskThunk.rejected.toString()]: (
      state: IState,
      payload: PayloadAction<RequestResponse<undefined, undefined>>
    ) => {
      let newState = _.cloneDeep(state);
      return { ...newState, error: getError(payload.payload), loading: false };
    },
  }));
}