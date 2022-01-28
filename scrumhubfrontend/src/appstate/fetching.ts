import type { APIResponse, RequestResponse } from "./response";
import config from "../configuration/config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosResponse } from "axios";
import { IAddBI, IFilters, IPeopleList, IPerson, IBacklogItem, IBacklogItemList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList } from "./stateInterfaces";
import { filterUrlString, getHeader, getHeaderAcceptAll, getHeaderWithContent } from "./stateUtilities";
import { isNull } from "lodash";
import { errorObject } from "./stateInitValues";
import { isItemDefined } from "../components/utility/commonFunctions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getResponse<T, K>(
  axiosRequest: Promise<AxiosResponse<any>>
): Promise<RequestResponse<T, K>> {
  let response;
    try{
    response = await axiosRequest.catch((error:any) => { 
    if (error instanceof TypeError || error.message === "Network Error") {
      return errorObject;
    }
    let response_1 = error.response;
    return {
      code: response_1.status,
      response: response_1.data as APIResponse<T, K>,
    }; }).then((response: any) => { 
    return {
      code: response && isItemDefined(response.status)? response.status:(isItemDefined(response.Code)?response.Code:errorObject.code),
      response: response && isItemDefined(response.status)?response.data as APIResponse<T, K>:(isItemDefined(response.response) && isItemDefined(response.response.Message)?({...errorObject.response, Message:response.response.Message}):errorObject.response),
    }; });
  }
  catch(error: any) {
    return errorObject;
  }
  finally{
    return response;
  }
}

export function fetchRepos(filters: IFilters, token: string
): Promise<RequestResponse<IRepositoryList, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Repositories?${filterUrlString(filters)}`,
      { headers: getHeader(token, config), }
    )
  );
}

export function addRepo(id: number, token: string,
): Promise<RequestResponse<IRepository, number>> {
  return getResponse(
    axios.post(
      `${config.backend.ip}:${config.backend.port}/api/Repositories`,
      { "index": JSON.stringify(id) },
      { headers: getHeaderWithContent(token, config) }
    )
  );
}

export function fetchPeople(ownerName: string, token: string
): Promise<RequestResponse<IPeopleList, number>> {
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

export function fetchPBIs(ownerName: any, token: string, filters: IFilters
): Promise<RequestResponse<IBacklogItemList, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}?${filterUrlString(filters)}`,
      { headers: getHeader(token, config) }
    )
  );
}

export function finishPBI(ownerName: string, token: string, pbiId: number
): Promise<RequestResponse<IBacklogItem, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbiId}/finish`,
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

export function addPBI(ownerName: string, token: string, pbi: IAddBI
): Promise<RequestResponse<IBacklogItem, number>> {
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
): Promise<RequestResponse<IBacklogItem, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbiId}/estimate`,
      { "hours": JSON.stringify(hours) }, { headers: getHeader(token, config) }
    )
  );
}

export function editPBI(ownerName: string, token: string, pbi: IAddBI, pbiId: number
): Promise<RequestResponse<IBacklogItem, number>> {
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
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}?${filterUrlString(filters)}`
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
      {}, { headers: getHeader(token, config) }
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
export function fetchPBITasks(token: string, ownerName: string, pbiId: number | null,
): Promise<RequestResponse<ITaskList, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${isNull(pbiId) ? 0 : pbiId}`,
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

export function requestFetchAllRepoTasks(token:string, ownerName:string): Promise<AxiosResponse<ITask, any>>{
  return axios.get(
    `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}?onePage=true`,
    { headers: getHeader(token, config) }
  );
}

export function requestFetchRateLimit(token:string): Promise<AxiosResponse<any, any>>{
   return axios.get(`https://api.github.com/rate_limit`, { headers: { "Accept": "application/vnd.github.v3+json", "Authorization": "token " + token } });  
}

export function fetchAllRepoTasks(token: string, ownerName: string,
  ): Promise<RequestResponse<ITask, number>> {
    return getResponse(requestFetchAllRepoTasks(token, ownerName));
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
): Promise<RequestResponse<IBacklogItemList, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}?${filterUrlString(filters)}`,
      { headers: getHeader(token, config) }
    )
  );
}

export function assignTaskToPBI(token: string, ownerName: string, pbiId: number | null, taskId: number
): Promise<RequestResponse<ITask, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/${taskId}/assignpbi`,
      { "index": pbiId === null ? 0 : pbiId }, { headers: getHeader(token, config) }
    )
  );
}
export function updatePersonInTask(token: string, ownerName: string, login: string, taskId: number, isAssign: boolean
): Promise<RequestResponse<ITask, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/${taskId}/${isAssign ? "" : "un"}assignperson`,
      { "login": login }, { headers: getHeader(token, config) }
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