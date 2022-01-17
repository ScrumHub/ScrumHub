import { isArrayValid } from "../components/utility/commonFunctions";
import { initError, initProductBacklogList, unassignedPBI } from "./initStateValues";
import { IError, IFilters, IProductBacklogItem, ISprint, ITask, ITaskList, IState } from "./stateInterfaces";

export const getHeader = (token: string, config: any) => {
  return ({
    'Accept': "application/json",
    'authToken': token,
    'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
  });
}

export const getHeaderWithContent = (token: string, config: any) => {
  return ({
    'authToken': token,
    'Accept': "application/json",
    'contentType': "application/json",
    'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
  } as IFilters);
}

export const getHeaderAcceptAll = (token: string, config: any) => {
  return ({
    'authToken': token,
    'Accept': "*/*",
    'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
  } as IFilters);
}

export const getError = (errorResponse: any) => {
  return ({
    hasError: true,
    errorCode: errorResponse ? errorResponse.code : -1,
    erorMessage: errorResponse ? (errorResponse.response as IError).Message : "",
  })
}

export function updateStateKeys(oldKeys: number[], newKeys: number[]) {
  //remove unexpanded
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

export function addStateTask(newState: IState, task: ITask) {
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

export function addStateUnassignedTaskToPBI(newState: IState, tasks: ITaskList) {
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

export function updateTasksSWR(newState: IState, tasks: ITaskList) {
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

  export function updateStatePBI(newState: IState, pbi: IProductBacklogItem) {
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

  export function validateUri(item: string | undefined) {
    return (typeof (item) === "undefined" ? "" : item);
  }

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



