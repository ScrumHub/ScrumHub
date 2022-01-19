import { PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { isArrayValid, isItemDefined } from "../components/utility/commonFunctions";
import config from "../configuration/config";
import { initError, initProductBacklogList, unassignedPBI } from "./initStateValues";
import { RequestResponse } from "./response";
import { IError, IFilters, IProductBacklogItem, ISprint, ITask, ITaskList, IState, IRepositoryList, IRepository } from "./stateInterfaces";

/**
 * returns a header
 * @param {String} token User validation
 * @param {Object} config Configuration of port and id, can be in Production or Development
 */
export const getHeader = (token: string, config: any) => {
  return ({
    'Accept': "application/json",
    'authToken': token,
    'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
  });
};

/**
 * returns a header with "application/json" content type
 * @param {String} token User validation
 * @param {Object} config Configuration of port and id, can be in Production or Development
 */
export const getHeaderWithContent = (token: string, config: any) => {
  return ({
    'authToken': token,
    'Accept': "application/json",
    'contentType': "application/json",
    'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
  } as IFilters);
};

/**
 * returns a header that accepts all responses type
 * @param {String} token User validation
 * @param {Object} config Configuration of port and id, can be in Production or Development
 */
export const getHeaderAcceptAll = (token: string, config: any) => {
  return ({
    'authToken': token,
    'Accept': "*/*",
    'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
  } as IFilters);
};

/**
 * @returns error object after validation
 */
export const getError = (res: any) => { return ({ hasError: true, errorCode: res ? res.code : -1, erorMessage: isItemDefined(res) && isItemDefined(res.response)? (res.response as IError).Message : "", }) };

/**
 * @param {String|undefined} uri Uri to validate
 * @returns {String} Empty string on undefined uri
 */
export function validateUri(uri: string | undefined) { return (typeof (uri) === "undefined" ? "" : uri); }

/**
 * @param {IFilters} filters Filters to validate and concatenate into string
 * @returns {String} stringWithFilters 
 */
export function filterUrlString(filters: IFilters) {
  return (typeof (filters) === "undefined" ? ""
    : Object.keys(filters)
      .map((filterName: string) => {
        const value = String(filters[filterName]).trim();
        return value && value !== "null" && value !== "undefined" ? `${filterName}=${value}` : "";
      })
      .filter((x) => x !== "")
      .join("&"));
}

/*removes duplicate key and concates expanded keys arrays*/
export function updateStateKeys(oldKeys: number[], newKeys: number[]) {
  return ((oldKeys.filter((key: number) => !newKeys.includes(key))).concat(newKeys.filter((key: number) => !oldKeys.includes(key))));
};

export function updateStateTasks(newState: IState, task: ITask) {
  newState.error = initError;
  if (newState.openSprint && isArrayValid(newState.openSprint.backlogItems) && newState.openSprint.backlogItems.findIndex((pbi: IProductBacklogItem) => pbi.id === task.pbiId) !== -1) {
    const index = newState.openSprint.backlogItems.findIndex((pbi: IProductBacklogItem) => pbi.id === task.pbiId);
    newState.openSprint.backlogItems[index] = {
      ...newState.openSprint.backlogItems[index],
      tasks: newState.openSprint.backlogItems[index].tasks.map((t: ITask) => {
        if (t.id === task.id) {
          return task;
        }
        return t;
      })
    };
  }
  if (newState.pbiPage && isArrayValid(newState.pbiPage.list) && (task.isAssignedToPBI ? newState.pbiPage.list.findIndex((pbi: IProductBacklogItem) => pbi.id === task.pbiId) : newState.pbiPage.list.findIndex((pbi: IProductBacklogItem) => pbi.id === 0)) !== -1) {
    const index = task.isAssignedToPBI ? newState.pbiPage.list.findIndex((pbi: IProductBacklogItem) => pbi.id === task.pbiId) : newState.pbiPage.list.findIndex((pbi: IProductBacklogItem) => pbi.id === 0);
    newState.pbiPage.list[index] = {
      ...newState.pbiPage.list[index],
      tasks: newState.pbiPage.list[index].tasks.map((t: ITask) => {
        if (t.id === task.id) {
          return task;
        }
        return t;
      })
    };
  }
  else if (newState.sprintPage && isArrayValid(newState.sprintPage.list)) {
    newState.sprintPage.list = newState.sprintPage.list.map((sprint: ISprint) => {
      sprint.backlogItems = sprint.backlogItems.map((item: IProductBacklogItem) => {
        if (item.id === task.pbiId && isArrayValid(item.tasks)) {
          item.tasks = item.tasks.map((t: ITask) => {
            if (t.id === task.id) {
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
  return (newState)
};

export function addStateTask(state: IState, task: ITask) {
  let newState = state;
  newState.error = initError;
  if (newState.openSprint && isArrayValid(newState.openSprint.backlogItems) && newState.openSprint.backlogItems.findIndex((pbi: IProductBacklogItem) => pbi.id === task.pbiId) !== -1) {
    const index = newState.openSprint.backlogItems.findIndex((pbi: IProductBacklogItem) => pbi.id === task.pbiId);
    newState.openSprint.backlogItems[index] = { ...newState.openSprint.backlogItems[index], tasks: isArrayValid(newState.openSprint.backlogItems[index].tasks) ? newState.openSprint.backlogItems[index].tasks.concat([task]) : [task] };
  }
  if (newState.pbiPage && isArrayValid(newState.pbiPage.list) && (task.isAssignedToPBI ? newState.pbiPage.list.findIndex((pbi: IProductBacklogItem) => pbi.id === task.pbiId) : newState.pbiPage.list.findIndex((pbi: IProductBacklogItem) => pbi.id === 0)) !== -1) {
    const index = task.isAssignedToPBI ? newState.pbiPage.list.findIndex((pbi: IProductBacklogItem) => pbi.id === task.pbiId) : newState.pbiPage.list.findIndex((pbi: IProductBacklogItem) => pbi.id === 0);
    newState.pbiPage.list[index] = {
      ...newState.pbiPage.list[index],
      tasks: isArrayValid(newState.pbiPage.list[index].tasks) ?
        newState.pbiPage.list[index].tasks.concat([task]) : [task]
    };
  }
  else if (newState.sprintPage && isArrayValid(newState.sprintPage.list)) {
    newState.sprintPage.list = newState.sprintPage.list.map((sprint: ISprint) => {
      sprint.backlogItems = sprint.backlogItems.map((item: IProductBacklogItem) => {
        if (item.id === task.pbiId) {
          item.tasks = isArrayValid(item.tasks) ? item.tasks.concat([task]) : [task];
        }
        return item;
      });
      return sprint;
    });
  }
  newState.loading = false;
  return (newState)
};

export function addStateUnassignedTaskToPBI(state: IState, tasks: ITaskList) {
  let newState = state;
  const pbisList = [unassignedPBI] as IProductBacklogItem[];
  if (tasks && tasks.list.length > 0) {
    if (!newState.pbiPage || !isArrayValid(newState.pbiPage.list)) {
      newState.pbiPage = initProductBacklogList;
    }
    else if (newState.pbiPage.list.findIndex((pbi: IProductBacklogItem) => pbi.id === 0) === -1) {
      newState.pbiPage.list = pbisList.concat(newState.pbiPage.list);//add empty pbi that holds unassigned tasks
    }
    newState.pbiPage = {
      ...newState.pbiPage, list: newState.pbiPage.list.map((item: IProductBacklogItem) => {
        if (item.id === 0 && isArrayValid(tasks.list)) {
          return { ...item, tasks: tasks.list };
        }
        return item;
      })
    };
  }
  newState.productRequireRefresh = false;
  newState.error = initError;
  newState.loading = false;
  return (newState);
}

export function updateTasksSWR(state: IState, tasks: ITaskList) {
  let newState = state;
  newState.error = initError;
  if (tasks && isArrayValid(tasks.list)) {
    const pbiIndex = tasks.list.at(0)?.isAssignedToPBI ? tasks.list.at(0)?.pbiId as number : 0;
    if (newState.openSprint && isArrayValid(newState.openSprint.backlogItems) && newState.openSprint.backlogItems.findIndex((pbi: IProductBacklogItem) => pbi.id === pbiIndex) !== -1) {
      const index = newState.openSprint.backlogItems.findIndex((pbi: IProductBacklogItem) => pbi.id === pbiIndex);
      newState.openSprint.backlogItems[index] = { ...newState.openSprint.backlogItems[index], tasks: tasks.list };
    }
    if (newState.pbiPage && isArrayValid(newState.pbiPage.list) && (newState.pbiPage.list.findIndex((pbi: IProductBacklogItem) => pbi.id === pbiIndex)) !== -1) {
      const index = newState.pbiPage.list.findIndex((pbi: IProductBacklogItem) => pbi.id === pbiIndex);
      newState.pbiPage.list[index] = { ...newState.pbiPage.list[index], tasks: tasks.list };
    }
    else if (newState.sprintPage && isArrayValid(newState.sprintPage.list)) {
      newState.sprintPage.list = newState.sprintPage.list.map((sprint: ISprint) => {
        sprint.backlogItems = sprint.backlogItems.map((item: IProductBacklogItem) => {
          if (item.id === pbiIndex) {
            item.tasks = tasks.list;
          }
          return item;
        });
        return sprint;
      });
    }
  }
  newState.productRequireRefresh = false;
  newState.error = initError;
  newState.loading = false;
  return (newState);

}

export function updateStatePBI(state: IState, pbi: IProductBacklogItem) {
  let newState = state;
  if (pbi.isInSprint) {
    if (newState.sprintPage && isArrayValid(newState.sprintPage.list)) {
      const index = newState.sprintPage.list.findIndex((sprint: ISprint) => sprint.sprintNumber === pbi.sprintNumber);
      if (index !== -1) {
        const pbiIndex = newState.sprintPage.list[index].backlogItems.findIndex((pb: IProductBacklogItem) => pb.id === pbi.id);
        newState.sprintPage.list[index].backlogItems[pbiIndex] = pbi;
      }
    }
    if (newState.openSprint && isArrayValid(newState.openSprint.backlogItems) && newState.openSprint.sprintNumber === pbi.sprintNumber) {
      const pbiIndex = newState.openSprint.backlogItems.findIndex((pb: IProductBacklogItem) => pb.id === pbi.id);
      newState.openSprint.backlogItems[pbiIndex] = pbi;
    }
  }
  else {
    const index = newState.pbiPage.list.findIndex((pb: IProductBacklogItem) => pb.id === pbi.id);
    newState.pbiPage.list[index] = pbi;
  }
  newState.error = initError;
  newState.loading = false;
  return (newState);
}

export function fetchStateRepos(newState: IState, repos: IRepositoryList, pageNumber: number, pageSize: number, pageCount:number) {
  if (newState.repositories == null || !isArrayValid(newState.repositories)|| pageNumber === 1) {
    newState = { ...newState, repositories: (repos.list).slice(0, (pageNumber + 1) * pageSize) };
  } else if (newState.repositories !== repos.list) {
    newState = { ...newState, repositories: newState.repositories
      .concat(repos.list)
      .slice(0, (pageNumber + 1) * pageSize)};
  }
  newState.reposLastPage = repos.list.length < pageSize ||  (isItemDefined(pageCount) && pageCount===1);
  newState.reposRequireRefresh = false;
  newState.error = initError;
  newState.loading = false;
  return (newState);
}

export function updateStateOneSprint(newState: IState, sprint: ISprint) {
  const objIndex = newState.sprintPage.list.findIndex((s: ISprint) => s.sprintNumber === sprint.sprintNumber);
  if (objIndex !== -1) { newState.sprintPage.list[objIndex] = sprint };
  if (sprint.isCurrent) { newState.activeSprintNumber = sprint.sprintNumber };
  if (newState.openSprint && newState.openSprint.sprintNumber === sprint.sprintNumber) { newState.openSprint = sprint; }
  newState.loading = false;
  newState.error = initError;
  return (newState);
}

export function addStateRepo(newState: IState, repo: IRepository) {
  if (isArrayValid(newState.repositories)) {
    const index = newState.repositories.findIndex((el: IRepository) => el.gitHubId === repo.gitHubId);
    if (index !== -1) { newState.repositories[index] = repo; }
  }
  newState.loading = false;
  newState.error = initError;
  return (newState);
}
export function addStatePBI(newState: IState, pbi: IProductBacklogItem) {
  if (newState.pbiPage && isArrayValid(newState.pbiPage.list)) {
    newState.pbiPage.list = newState.pbiPage.list.concat([pbi]);
  } else { newState.pbiPage.list = [pbi]; }
  newState.loading = false;
  newState.error = initError;
  return (newState);
}

export function addStateSprint(newState: IState, sprint: ISprint) {
  if (isArrayValid(sprint.backlogItems) && newState.pbiPage && isArrayValid(newState.pbiPage.list)) {
    newState.pbiPage = { ...newState.pbiPage, list: newState.pbiPage.list.filter((pbi: IProductBacklogItem) => !sprint.backlogItems.filter((pbi2: IProductBacklogItem) => pbi.id === pbi2.id).length) };
  }
  if (newState.sprintPage && isArrayValid(newState.sprintPage.list)) {
    newState.sprintPage.list = newState.sprintPage.list.concat([sprint]);
  }
  else { newState.sprintPage.list = [sprint]; }
  if (sprint.isCurrent) { newState.activeSprintNumber = sprint.sprintNumber };
  newState.error = initError;
  newState.loading = false;
  return (newState);
}




