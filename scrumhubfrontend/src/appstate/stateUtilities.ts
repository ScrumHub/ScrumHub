import _ from "lodash";
import { isArrayValid, isItemDefined, isNameFilterValid } from "../components/utility/commonFunctions";
import { initBI2, initError, initBacklogItemList, unassignedBI, initBI } from "./stateInitValues";
import { IError, IFilters, IBacklogItem, ISprint, ITask, ITaskList, IState, IRepositoryList, IRepository } from "./stateInterfaces";

/**
 * @returns Request header
 * @param {String} token User validation
 * @param {Object} config Configuration of port and id, can be in Production or Development
 */
export const getHeader = (token: string, config: any) => {
  return ({
    'Accept': "application/json",
    'authToken': token,
    'Access-Control-Allow-Origin': `*`,
  });
};

/**
 * @returns Request header with "application/json" content type
 * @param {String} token User validation
 * @param {Object} config Configuration of port and id, can be in Production or Development
 */
export const getHeaderWithContent = (token: string, config: any) => {
  return ({
    'authToken': token,
    'Accept': "application/json",
    'contentType': "application/json",
    'Access-Control-Allow-Origin': `*`,
  } as IFilters);
};

/**
 * @returns Request header that accepts all responses type
 * @param {String} token User validation
 * @param {Object} config Configuration of port and id, can be in Production or Development
 */
export const getHeaderAcceptAll = (token: string, config: any) => {
  return ({
    'authToken': token,
    'Accept': "*/*",
    'Access-Control-Allow-Origin': `*`,
  } as IFilters);
};

/**
 * @returns Error object after validation
 */
export const getError = (res: any) => { return ({ hasError: true, errorCode: res ? res.code : -1, erorMessage: isItemDefined(res) && isItemDefined(res.response) ? (res.response as IError).Message : "", }) };

/**
 * @param {String|undefined} uri Uri to validate
 * @returns {String} Empty string on undefined uri
 */
export function validateUri(uri: string | undefined) { return (typeof (uri) === "undefined" ? "" : uri); }

/**
 * @param {IFilters} filters Filters to validate and concatenate into string
 * @returns {String} Filters' names and values combined into one string 
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

/**
 * Removes duplicate tasks
 * @param {ITask[]} tasks Array of tasks to be filtered by unique id
 * @returns {ITask[]} Array of tasks, with each task having unique id
 */
export function filterTasksById(tasks: ITask[]) {
  return [...new Map(tasks.map(item => [item['id'], item])).values()];
}

/**
 * Removes duplicate tasks from pbi
 * @param {IBacklogItem} pbi Backlog Item with an array of tasks to be filtered by unique id
 * @returns {IBacklogItem} Backlog Item with an array of of tasks, with each task having unique id
 */
export function filterPbiTasksById(pbi: IBacklogItem) {
  return { ...pbi, tasks: isArrayValid(pbi.tasks) ? filterTasksById(pbi.tasks) : [] };
}

/**
 * Removes duplicate key and concates expanded keys arrays
 **/
export function updateStateKeys(oldKeys: number[], newKeys: number[]) {
  return ((oldKeys.filter((key: number) => !newKeys.includes(key))).concat(newKeys.filter((key: number) => !oldKeys.includes(key))));
};

export function updateStateTasks(newState: IState, task: ITask) {
  newState.error = initError;
  if (newState.openSprint && isArrayValid(newState.openSprint.backlogItems) && newState.openSprint.backlogItems.findIndex((pbi: IBacklogItem) => pbi.id === task.pbiId) !== -1) {
    const index = newState.openSprint.backlogItems.findIndex((pbi: IBacklogItem) => pbi.id === task.pbiId);
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
  if (newState.pbiPage && isArrayValid(newState.pbiPage.list) && (task.isAssignedToPBI ? newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === task.pbiId) : newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === 0)) !== -1) {
    const index = task.isAssignedToPBI ? newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === task.pbiId) : newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === 0);
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
      sprint.backlogItems = sprint.backlogItems.map((item: IBacklogItem) => {
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

export function filterPBIsList(pbis: IBacklogItem[], task: ITask) {
  let list = _.cloneDeep(pbis);
  return (list.map((pbi: IBacklogItem) => {
    if (pbi.id === task.pbiId) {
      return ({ ...pbi, tasks: isArrayValid(pbi.tasks) ? pbi.tasks.concat([task]) : [task] });
    } else {
      return ({ ...pbi, tasks: pbi.tasks.filter((t: ITask) => t.id !== task.id) });
    }
  }));
}

export function updateOnDragStateTasks(newState: IState, task: ITask) {
  newState.error = initError;
  if (newState.openSprint && isArrayValid(newState.openSprint.backlogItems)) {
    newState.openSprint = { ...newState.openSprint, backlogItems: filterPBIsList(newState.openSprint.backlogItems, task) }
  }
  if (newState.pbiPage && isArrayValid(newState.pbiPage.list)) {
    newState.pbiPage = { ...newState.pbiPage, list: filterPBIsList(newState.pbiPage.list, task) }
  }
  if (newState.sprintPage && isArrayValid(newState.sprintPage.list)) {
    newState.sprintPage = {
      ...newState.sprintPage, list: newState.sprintPage.list.map((sprint: ISprint) => {
        return ({ ...sprint, backlogItems: filterPBIsList(sprint.backlogItems, task) });
      })
    }
  }
  newState.loading = false;
  return (newState);
};

export function addStateTask(state: IState, task: ITask) {
  let newState = state;
  newState.error = initError;
  if (newState.openSprint && isArrayValid(newState.openSprint.backlogItems) && newState.openSprint.backlogItems.findIndex((pbi: IBacklogItem) => pbi.id === task.pbiId) !== -1) {
    const index = newState.openSprint.backlogItems.findIndex((pbi: IBacklogItem) => pbi.id === task.pbiId);
    newState.openSprint.backlogItems[index] = { ...newState.openSprint.backlogItems[index], tasks: isArrayValid(newState.openSprint.backlogItems[index].tasks) ? newState.openSprint.backlogItems[index].tasks.concat([task]) : [task] };
  }
  if (newState.pbiPage && isArrayValid(newState.pbiPage.list) && (task.isAssignedToPBI ? newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === task.pbiId) : newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === 0)) !== -1) {
    const index = task.isAssignedToPBI ? newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === task.pbiId) : newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === 0);
    newState.pbiPage.list[index] = {
      ...newState.pbiPage.list[index],
      tasks: isArrayValid(newState.pbiPage.list[index].tasks) ?
        newState.pbiPage.list[index].tasks.concat([task]) : [task]
    };
  }
  else if (newState.sprintPage && isArrayValid(newState.sprintPage.list)) {
    newState.sprintPage.list = newState.sprintPage.list.map((sprint: ISprint) => {
      sprint.backlogItems = sprint.backlogItems.map((item: IBacklogItem) => {
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

export function addStateUnassignedTaskToPBI(state: IState, temp: ITaskList) {
  let newState = state;
  const pbisList = [unassignedBI] as IBacklogItem[];
  if (temp && isArrayValid(temp.list)) {
    const tasks = filterTasksById(temp.list);
    if (!newState.pbiPage || !isArrayValid(newState.pbiPage.list)) {
      newState.pbiPage = initBacklogItemList;
    }
    else if (newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === 0) === -1) {
      newState.pbiPage.list = pbisList.concat(newState.pbiPage.list);//add empty pbi that holds unassigned tasks
    }
    newState.pbiPage = {
      ...newState.pbiPage, list: newState.pbiPage.list.map((item: IBacklogItem) => {
        if (item.id === 0 && isArrayValid(tasks)) {
          return { ...item, tasks: tasks };
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

export function updateTasksSWR(state: IState, temp: ITaskList) {
  let newState = state;
  newState.error = initError;
  if (temp && isArrayValid(temp.list)) {
    const tasks = filterTasksById(temp.list);
    const pbiIndex = tasks.at(0)?.isAssignedToPBI ? tasks.at(0)?.pbiId as number : 0;
    if (newState.openSprint && isArrayValid(newState.openSprint.backlogItems) && newState.openSprint.backlogItems.findIndex((pbi: IBacklogItem) => pbi.id === pbiIndex) !== -1) {
      const index = newState.openSprint.backlogItems.findIndex((pbi: IBacklogItem) => pbi.id === pbiIndex);
      newState.openSprint.backlogItems[index] = { ...newState.openSprint.backlogItems[index], tasks: tasks };
    }
    if (newState.pbiPage && isArrayValid(newState.pbiPage.list) && (newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === pbiIndex)) !== -1) {
      const index = newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === pbiIndex);
      newState.pbiPage.list[index] = { ...newState.pbiPage.list[index], tasks: tasks };
    }
    else if (newState.sprintPage && isArrayValid(newState.sprintPage.list)) {
      newState.sprintPage.list = newState.sprintPage.list.map((sprint: ISprint) => {
        sprint.backlogItems = sprint.backlogItems.map((item: IBacklogItem) => {
          if (item.id === pbiIndex) {
            item.tasks = tasks;
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

export function updateAllTasksSWR(state: IState, temp: ITaskList) {
  let newState = state;
  newState.error = initError;
  const isValid = temp && isArrayValid(temp.list);
  newState.tasks = isValid ? filterTasksById(temp.list) : [];
  /*if (isValid && isArrayValid(state.tasks)) {
    const tasks = temp.list);
    const pbiIndex = tasks.at(0)?.isAssignedToPBI ? tasks.at(0)?.pbiId as number : 0;
    if (newState.openSprint && isArrayValid(newState.openSprint.backlogItems) && newState.openSprint.backlogItems.findIndex((pbi: IBacklogItem) => pbi.id === pbiIndex) !== -1) {
      const index = newState.openSprint.backlogItems.findIndex((pbi: IBacklogItem) => pbi.id === pbiIndex);
      newState.openSprint.backlogItems[index] = { ...newState.openSprint.backlogItems[index], tasks: tasks };
    }
    if (newState.pbiPage && isArrayValid(newState.pbiPage.list) && (newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === pbiIndex)) !== -1) {
      const index = newState.pbiPage.list.findIndex((pbi: IBacklogItem) => pbi.id === pbiIndex);
      newState.pbiPage.list[index] = { ...newState.pbiPage.list[index], tasks: tasks };
    }
    else if (newState.sprintPage && isArrayValid(newState.sprintPage.list)) {
      newState.sprintPage.list = newState.sprintPage.list.map((sprint: ISprint) => {
        sprint.backlogItems = sprint.backlogItems.map((item: IBacklogItem) => {
          if (item.id === pbiIndex) {
            item.tasks = tasks;
          }
          return item;
        });
        return sprint;
      });
    }
  }*/
  newState.productRequireRefresh = false;
  newState.error = initError;
  newState.loading = false;
  return (newState);

}

export function updateStatePBI(state: IState, pbi: IBacklogItem) {
  let newState = state;
  if (pbi.isInSprint) {
    if (newState.sprintPage && isArrayValid(newState.sprintPage.list)) {
      const index = newState.sprintPage.list.findIndex((sprint: ISprint) => sprint.sprintNumber === pbi.sprintNumber);
      if (index !== -1) {
        const pbiIndex = newState.sprintPage.list[index].backlogItems.findIndex((pb: IBacklogItem) => pb.id === pbi.id);
        newState.sprintPage.list[index].backlogItems[pbiIndex] = filterPbiTasksById(pbi);
      }
    }
    if (newState.openSprint && isArrayValid(newState.openSprint.backlogItems) && newState.openSprint.sprintNumber === pbi.sprintNumber) {
      const pbiIndex = newState.openSprint.backlogItems.findIndex((pb: IBacklogItem) => pb.id === pbi.id);
      newState.openSprint.backlogItems[pbiIndex] = filterPbiTasksById(pbi);
    }
  }
  else {
    const index = newState.pbiPage.list.findIndex((pb: IBacklogItem) => pb.id === pbi.id);
    newState.pbiPage.list[index] = filterPbiTasksById(pbi);
  }
  newState.error = initError;
  newState.loading = false;
  return (newState);
}

export function fetchStateRepos(newState: IState, repos: IRepositoryList, pageNumber: number, pageSize: number, pageCount: number) {
  const temp = isNameFilterValid(newState.changedRepo) ? repos.list.filter((r: IRepository) => r.name !== newState.changedRepo) : repos.list;
  if (newState.repositories == null || !isArrayValid(newState.repositories) || pageNumber === 1) {
    newState = { ...newState, repositories: (temp).slice(0, (pageNumber + 1) * pageSize) };
  } else if (newState.repositories !== temp) {
    newState = {
      ...newState, repositories: newState.repositories
        .concat(temp)
        .slice(0, (pageNumber + 1) * pageSize)
    };
  }
  newState.reposLastPage = repos.list.length < pageSize || (isItemDefined(pageCount) && pageCount === 1);
  newState.changedRepo = "";
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
export function addStatePBI(newState: IState, pbi: IBacklogItem) {
  if (newState.pbiPage && isArrayValid(newState.pbiPage.list)) {
    newState.pbiPage.list = newState.pbiPage.list.concat([pbi]);
  } else { newState.pbiPage.list = [pbi]; }
  newState.loading = false;
  newState.error = initError;
  return (newState);
}

export function addStateSprint(newState: IState, sprint: ISprint) {
  if (isArrayValid(sprint.backlogItems) && newState.pbiPage && isArrayValid(newState.pbiPage.list)) {
    newState.pbiPage = { ...newState.pbiPage, list: newState.pbiPage.list.filter((pbi: IBacklogItem) => !sprint.backlogItems.filter((pbi2: IBacklogItem) => pbi.id === pbi2.id).length) };
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




