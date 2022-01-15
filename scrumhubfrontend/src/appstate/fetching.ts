import type { APIResponse, RequestResponse } from "./response";
import config from "../configuration/config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosResponse } from "axios";
import { IAddPBI, IFilters, IPerson, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList } from "./stateInterfaces";
import { getHeader, getHeaderAcceptAll, getHeaderWithContent } from "./stateUtilities";
import { isNull } from "lodash";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getResponse<T, K>(
  axiosRequest: Promise<AxiosResponse<any>>
): Promise<RequestResponse<T, K>> {
  try {
    const response = await axiosRequest;
    return {
      code: response.status,
      response: response.data as APIResponse<T, K>,
    };
  } catch (error: any) {
    if (error instanceof TypeError || error.message === "Network Error") {
      return {
        code: 0,
        response: {
          message: "Connection error",
          successful: false,
          data: null,
          metadata: null,
        },
      };
    }

    let response_1 = error.response;
    return {
      code: response_1.status,
      response: response_1.data as APIResponse<T, K>,
    };
  }
}

export function fetchRepositories(filters: IFilters, token: string
): Promise<RequestResponse<IRepositoryList, number>> {
  const filtersString =
    filters === undefined
      ? ""
      : Object.keys(filters)
        .map((filterName) => {
          const value = String(filters[filterName]).trim();
          return value && value !== "null" ? `${filterName}=${value}` : "";
        })
        .filter((x) => x !== "")
        .join("&");
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Repositories?${filtersString}`,
      { headers: getHeader(token, config),}
    )
  );
}

export function addRepository(id: number, token: string,
): Promise<RequestResponse<IRepository, number>> {
  return getResponse(
    axios.post(
      `${config.backend.ip}:${config.backend.port}/api/Repositories`,
      { "index": JSON.stringify(id) },
      {headers: getHeaderWithContent(token, config)}
    )
  );
}

export function fetchPBIs(ownerName: any, token: string, filters: IFilters
): Promise<RequestResponse<IProductBacklogList, number>> {
  const filtersString =
    filters === undefined
      ? ""
      : Object.keys(filters)
        .map((filterName) => {
          const value = String(filters[filterName]).trim();
          return value && value !== "null" && value !== "undefined" ? `${filterName}=${value}` : "";
        })
        .filter((x) => x !== "")
        .join("&");
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}?${filtersString}`,
      {headers: getHeader(token, config)}
    )
  );
}

export function fetchPeople(ownerName: string, token: string
): Promise<RequestResponse<IProductBacklogList, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/People/${ownerName}`,
      {
        headers: getHeader(token, config)
      }
    )
  );
}
export function getCurrentUser(token: string
): Promise<RequestResponse<IPerson, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/People/current`,
      {
        headers: getHeader(token, config)
      }
    )
  );
}

export function finishPBI(ownerName: string, token: string, pbild: number
): Promise<RequestResponse<IProductBacklogItem, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbild}/finish`,
      {}, { headers: getHeader(token, config) }
    )
  );
}

export function deletePBI(ownerName: string, token: string, pbild: number
): Promise<RequestResponse<any, any>> {
  return getResponse(
    axios.delete(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbild}`,
      {
        headers: getHeaderAcceptAll(token, config)
      }
    )
  );
}

export function addPBI(ownerName: string, token: string, pbi: IAddPBI
): Promise<RequestResponse<IProductBacklogItem, number>> {
  return getResponse(
    axios.post(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}`,
      {
        "name": pbi.name,
        "priority": pbi.priority,
        "acceptanceCriteria": pbi.acceptanceCriteria
      },
      {
        headers: getHeaderWithContent(token, config)
      }
    )
  );
}

export function estimatePBI(ownerName: string, token: string, pbiId: number, hours: number
): Promise<RequestResponse<IProductBacklogItem, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbiId}/estimate`,
      { "hours": JSON.stringify(hours) }, { headers: getHeader(token, config) }
    )
  );
}

export function editPBI(ownerName: string, token: string, pbi: IAddPBI, pbiId: number
): Promise<RequestResponse<IProductBacklogItem, number>> {
  return getResponse(
    axios.put(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbiId}`,
      {
        "name": pbi.name,
        "priority": pbi.priority,
        "acceptanceCriteria": pbi.acceptanceCriteria
      },
      { headers: getHeaderWithContent(token, config) }
    )
  );
}

//SPRINTS
export function fetchSprints(token: string, ownerName: string, filters: IFilters,
): Promise<RequestResponse<ISprintList, number>> {
  const filtersString =
    filters === undefined
      ? ""
      : Object.keys(filters)
        .map((filterName) => {
          const value = String(filters[filterName]).trim();
          return value && value !== "null" ? `${filterName}=${value}` : "";
        })
        .filter((x) => x !== "")
        .join("&");
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}?${filtersString}`
      , { headers: getHeader(token, config) }
    )
  );
}

export function fetchOneSprint(token: string, ownerName: string, sprintNumber: number,
): Promise<RequestResponse<ISprint, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}/${sprintNumber}`
      , { headers: getHeader(token, config) }
    )
  );
}


export function updateOneSprint(token: string, ownerName: string, sprintNumber: number, sprint: any
): Promise<RequestResponse<ISprint, number>> {
  return getResponse(
    axios.put(
      `${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}/${sprintNumber}`,
      sprint, { headers: getHeaderWithContent(token, config) }
    )
  );
}

export function completeOneSprint(token: string, ownerName: string, sprintNumber: number, isFailure: boolean
  ): Promise<RequestResponse<ISprint, number>> {
    return getResponse(
      axios.put(
        `${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}/${sprintNumber}/finish?failed=${isFailure}`,
         {},{ headers: getHeader(token, config) }
      )
    );
  }

export function addSprint(token: string, ownerName: string, sprint: any
): Promise<RequestResponse<ISprint, number>> {
  return getResponse(
    axios.post(
      `${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}`,
      sprint, { headers: getHeader(token, config) }
    )
  );
}

//TASKS
export function fetchTasks(token: string, ownerName: string, filters: IFilters,
): Promise<RequestResponse<ITaskList, number>> {
  const filtersString =
    filters === undefined
      ? ""
      : Object.keys(filters)
        .map((filterName) => {
          const value = String(filters[filterName]).trim();
          return value && value !== "null" ? `${filterName}=${value}` : "";
        })
        .filter((x) => x !== "")
        .join("&");
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}?${filtersString}`,
      { headers: getHeader(token, config) }
    )
  );
}

export function fetchPBITasks(token: string, ownerName: string, pbiId: number,
  ): Promise<RequestResponse<ITaskList, number>> {
    return getResponse(
      axios.get(
        `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${isNull(pbiId)?0:pbiId}`,
        { headers: getHeader(token, config) }
      )
    );
  }

export function addUnassignedTasksToPBI(token: string, ownerName: string, pbiId: number,
): Promise<RequestResponse<ITaskList, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${pbiId}`,
      { headers: getHeader(token, config) }
    )
  );
}

export function addTasksToSprint(token: string, ownerName: string, pbiId: number,
): Promise<RequestResponse<ITaskList, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${pbiId}`,
      { headers: getHeader(token, config) }
    )
  );
}

export function addTask(token: string, ownerName: string, pbiId: number, name: string,
): Promise<RequestResponse<ITask, number>> {
  return getResponse(
    axios.post(
      `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}`,
      {
        "name": name,
        "pbiId": pbiId.toString()
      }, { headers: getHeader(token, config) }
    )
  );
}

export function getPBINames(ownerName: any, token: string, filters: IFilters
): Promise<RequestResponse<IProductBacklogList[], number>> {
  const filtersString =
    filters === undefined ? ""
      : Object.keys(filters)
        .map((filterName) => {
          const value = String(filters[filterName]).trim();
          return value && value !== "null" && value !== "undefined" ? `${filterName}=${value}` : "";
        })
        .filter((x) => x !== "")
        .join("&");
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}?${filtersString}`,
      { headers: getHeader(token, config) }
    )
  );
}

export function assignTaskToPBI(token: string, ownerName: string, pbiId: number, taskId: number
): Promise<RequestResponse<ITask, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/${taskId}/assignpbi`,
      { "index": pbiId === null ? 0 : pbiId }, { headers: getHeader(token, config) }
    )
  );
}
export function assignPersonToTask(token: string, ownerName: string, login: string, taskId: number
): Promise<RequestResponse<ITask, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/${taskId}/assignperson`,
      { "login": login}, { headers: getHeader(token, config) }
    )
  );
}

export function unassignPersonToTask(token: string, ownerName: string, login: string, taskId: number
): Promise<RequestResponse<ITask, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/${taskId}/unassignperson`,
      {"login": login}, { headers: getHeader(token, config) }
    )
  );
}

export function startBranchForTask(token: string, ownerName: string, hotfix: boolean, taskId: number
  ): Promise<RequestResponse<ITask, number>> {
    return getResponse(
      axios.patch(
        `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/${taskId}/start?hotFix=${hotfix}`,
        {}, { headers: getHeader(token, config) }
      )
    );
  }