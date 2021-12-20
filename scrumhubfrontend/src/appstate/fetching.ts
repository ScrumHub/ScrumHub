import type { APIResponse, RequestResponse } from "./response";
import config from "../configuration/config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosResponse } from "axios";
import { IAddPBI, IFilters, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList, ITaskNamed, IUpdateIdSprint } from "./stateInterfaces";

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
          //}
        })
        .filter((x) => x !== "")
        .join("&");
  return getResponse(
    axios.get(
      `https://${config.backend.ip}:${config.backend.port}/api/Repositories?${filtersString}`,
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function addRepository(id: number, token: string,
): Promise<RequestResponse<IRepository, number>> {
  return getResponse(
    axios.post(
      `https://${config.backend.ip}:${config.backend.port}/api/Repositories`,
      { "index": JSON.stringify(id) },
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'contentType': "application/json",
          'Access-Control-Allow-Origin': "*",
        },
      }
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
      `https://${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}?${filtersString}`,
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function fetchPeople(ownerName: string, token: string
  ): Promise<RequestResponse<IProductBacklogList, number>> {
    return getResponse(
      axios.get(
        `https://${config.backend.ip}:${config.backend.port}/api/People/${ownerName}`,
        {
          headers: {
            'authToken': token,
            'Accept': "application/json",
            'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
          },
        }
      )
    );
  }

export function finishPBI(ownerName: string, token: string, pbild: number
): Promise<RequestResponse<IProductBacklogItem, number>> {
  return getResponse(
    axios.patch(
      `https://${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbild}/finish`,
      {},
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function deletePBI(ownerName: string, token: string, pbild: number
): Promise<RequestResponse<number, number>> {
  return getResponse(
    axios.delete(
      `https://${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbild}`,
      {
        headers: {
          'authToken': token,
          'Accept': "*/*",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function addPBI(ownerName: string, token: string, pbi: IAddPBI
): Promise<RequestResponse<IProductBacklogItem, number>> {
  return getResponse(
    axios.post(
      `https://${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}`,
      {
        "name": pbi.name,
        "priority": pbi.priority,
        "acceptanceCriteria": pbi.acceptanceCriteria
      },
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'contentType': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function estimatePBI(ownerName: string, token: string, pbiId: number, hours: number
): Promise<RequestResponse<IProductBacklogItem, number>> {
  return getResponse(
    axios.patch(
      `https://${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbiId}/estimate`,
      { "hours": JSON.stringify(hours) },
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function editPBI(ownerName: string, token: string, pbi: IAddPBI, pbiId: number
): Promise<RequestResponse<IProductBacklogItem, number>> {
  return getResponse(
    axios.put(
      `https://${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbiId}`,
      {
        "name": pbi.name,
        "priority": pbi.priority,
        "acceptanceCriteria": pbi.acceptanceCriteria
      },
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'contentType': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
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
          //}
        })
        .filter((x) => x !== "")
        .join("&");
  return getResponse(
    axios.get(
      `https://${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}?${filtersString}`,
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function fetchOneSprint(token: string, ownerName: string, sprintNumber: number,
): Promise<RequestResponse<ISprint, number>> {
  return getResponse(
    axios.get(
      `https://${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}/${sprintNumber}`,
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}


export function updateOneSprint(token: string, ownerName: string, sprintNumber: number, sprint: IUpdateIdSprint
): Promise<RequestResponse<ISprint, number>> {
  return getResponse(
    axios.put(
      `https://${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}/${sprintNumber}`,
      sprint,
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function addSprint(token: string, ownerName: string, sprint: any
): Promise<RequestResponse<ISprint, number>> {
  return getResponse(
    axios.post(
      `https://${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}`,
      sprint,
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
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
          //}
        })
        .filter((x) => x !== "")
        .join("&");
  return getResponse(
    axios.get(
      `https://${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}?${filtersString}`,
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function fetchPBITasks(token: string, ownerName: string, pbiId: number,
): Promise<RequestResponse<ITaskList, number>> {
  return getResponse(
    axios.get(
      `https://${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${pbiId}`,
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function addTasksToPBI(token: string, ownerName: string, pbiId: number,
): Promise<RequestResponse<ITaskList, number>> {
  return getResponse(
    axios.get(
      `https://${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${pbiId}`,
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function addTasksToSprint(token: string, ownerName: string, pbiId: number,
  ): Promise<RequestResponse<ITaskList, number>> {
    return getResponse(
      axios.get(
        `https://${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${pbiId}`,
        {
          headers: {
            'authToken': token,
            'Accept': "application/json",
            'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
          },
        }
      )
    );
  }

export function addTask(token: string, ownerName: string, pbiId: number, name: string,
): Promise<RequestResponse<ITask, number>> {
  return getResponse(
    axios.post(
      `https://${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}`,
      {
        "name": name,
        "pbiId": pbiId.toString()
      },
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function getPBINames(ownerName: any, token: string, filters: IFilters
  ): Promise<RequestResponse<IProductBacklogList[], number>> {
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
        `https://${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}?${filtersString}`,
        {
          headers: {
            'authToken': token,
            'Accept': "application/json",
            'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
          },
        }
      )
    );
  }

  export function assignTask(token: string, ownerName: string, pbiId: number, taskId: number
    ): Promise<RequestResponse<ITask, number>> {
      return getResponse(
        axios.patch(
          `https://${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/${taskId}/assignpbi`,
          {
            "index": pbiId === null ? 0 : pbiId
          },
          {
            headers: {
              'authToken': token,
              'Accept': "application/json",
              'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
            },
          }
        )
      );
    }