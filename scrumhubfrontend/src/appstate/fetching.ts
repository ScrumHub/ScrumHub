import type { APIResponse, RequestResponse } from "./response";
import config from "../configuration/config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosResponse } from "axios";
import { IAddBI, IFilters, IPeopleList, IPerson, IBacklogItem, IBacklogItemList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList } from "./stateInterfaces";
import { filterUrlString, getHeader, getHeaderAcceptAll, getHeaderWithContent } from "./stateUtilities";
import { isNull } from "lodash";
import { errorObject } from "./stateInitValues";
import { isItemDefined } from "../components/utility/commonFunctions";

/** 
 * Awaits for the promise and returns response as custom object {@linkcode RequestResponse}
 * @typeParam T type of returned payload data 
 * @typeParam K type of returned payload status
 * @returns {Promise<RequestResponse<T, K>>} Promise with custom request response object {@linkcode RequestResponse}
*/
export async function getResponse<T, K>(
  axiosRequest: Promise<AxiosResponse<any>>): Promise<RequestResponse<T, K>> {
  let axiosResponse;
  try {
    axiosResponse = await axiosRequest.catch((error: any) => {
      if (error instanceof TypeError || error.message === "Network Error") { return errorObject; }
      let response_1 = error.response;
      return {
        code: response_1.status,
        response: response_1.data as APIResponse<T, K>,
      };
    }).then((response: any) => {
      return {
        code: response && isItemDefined(response.status) ? response.status : (isItemDefined(response.Code) ? response.Code : errorObject.code),
        response: response && isItemDefined(response.status) ? response.data as APIResponse<T, K> : (isItemDefined(response.response) && isItemDefined(response.response.Message) ? ({ ...errorObject.response, Message: response.response.Message }) : errorObject.response),
      };
    });
  }
  catch (error: any) { return errorObject; }
  finally { return axiosResponse; }
}
/** Fetches {@linkcode IRepositoryList} repositoryList for logged in user */
export function fetchRepos(filters: IFilters, token: string): Promise<RequestResponse<IRepositoryList, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Repositories?${filterUrlString(filters)}`,
      { headers: getHeader(token, config), }
    )
  );
}
/** Adds {@linkcode IRepository} repository to ScrumHub */
export function addRepo(id: number, token: string,): Promise<RequestResponse<IRepository, number>> {
  return getResponse(
    axios.post(
      `${config.backend.ip}:${config.backend.port}/api/Repositories`,
      { "index": JSON.stringify(id) },
      { headers: getHeaderWithContent(token, config) }
    )
  );
}
/** Fetches {@linkcode IPeopleList} peopleList for opened {@linkcode IRepository} repository */
export function fetchPeople(ownerName: string, token: string): Promise<RequestResponse<IPeopleList, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/People/${ownerName}`,
      { headers: getHeader(token, config) }
    )
  );
}
/** Fetches {@linkcode IPerson} current logged in user */
export function getCurrentUser(token: string): Promise<RequestResponse<IPerson, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/People/current`,
      { headers: getHeader(token, config) }
    )
  );
}
/** Fetches {@linkcode IBacklogItemList} backlogItemsList for opened repository */
export function fetchPBIs(ownerName: any, token: string, filters: IFilters): Promise<RequestResponse<IBacklogItemList, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}?${filterUrlString(filters)}`,
      { headers: getHeader(token, config) }
    )
  );
}
/** Finishes {@linkcode IBacklogItem} backlogItem */
export function finishPBI(ownerName: string, token: string, pbiId: number): Promise<RequestResponse<IBacklogItem, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbiId}/finish`,
      {}, { headers: getHeader(token, config) }
    )
  );
}
/** Deletes {@linkcode IBacklogItem} backlogItem */
export function deletePBI(ownerName: string, token: string, pbild: number): Promise<RequestResponse<any, any>> {
  return getResponse(
    axios.delete(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbild}`,
      {
        headers: getHeaderAcceptAll(token, config)
      }
    )
  );
}
/** Adds {@linkcode IBacklogItem} backlogItem to the open {@linkcode IRepository} repository */
export function addPBI(ownerName: string, token: string, pbi: IAddBI): Promise<RequestResponse<IBacklogItem, number>> {
  return getResponse(
    axios.post(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}`,
      { "name": pbi.name, "priority": pbi.priority, "acceptanceCriteria": pbi.acceptanceCriteria },
      { headers: getHeaderWithContent(token, config) }
    )
  );
}
/** Estimates Story Points value for {@linkcode IBacklogItem} backlogItem */
export function estimatePBI(ownerName: string, token: string, pbiId: number, hours: number): Promise<RequestResponse<IBacklogItem, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbiId}/estimate`,
      { "hours": JSON.stringify(hours) }, { headers: getHeader(token, config) }
    )
  );
}
/** Updates {@linkcode IBacklogItem} backlogItem */
export function editPBI(ownerName: string, token: string, pbi: IAddBI, pbiId: number): Promise<RequestResponse<IBacklogItem, number>> {
  return getResponse(
    axios.put(
      `${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbiId}`,
      { "name": pbi.name, "priority": pbi.priority, "acceptanceCriteria": pbi.acceptanceCriteria },
      { headers: getHeaderWithContent(token, config) }
    )
  );
}
//SPRINTS
/** Fetches {@linkcode ISprintList} sprintList for opened {@linkcode IRepository} repository */
export function fetchSprints(token: string, ownerName: string, filters: IFilters,): Promise<RequestResponse<ISprintList, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}?${filterUrlString(filters)}`,
      { headers: getHeader(token, config) }
    )
  );
}
/** Fetches {@linkcode ISprint} sprint for opened {@linkcode IRepository} repository */
export function fetchOneSprint(token: string, ownerName: string, sprintNumber: number,): Promise<RequestResponse<ISprint, number>> {
  return getResponse(
    axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}/${sprintNumber}`
      , { headers: getHeader(token, config) }
    )
  );
}
/** Updates {@linkcode ISprint} sprint for opened {@linkcode IRepository} repository */
export function updateOneSprint(token: string, ownerName: string, sprintNumber: number, sprint: any)
: Promise<RequestResponse<ISprint, number>> {
  return getResponse(
    axios.put(`${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}/${sprintNumber}`,
      sprint, { headers: getHeaderWithContent(token, config) }
    )
  );
}
/** Completes {@linkcode ISprint} sprint for opened {@linkcode IRepository} repository */
export function completeOneSprint(token: string, ownerName: string, sprintNumber: number, isFailure: boolean)
: Promise<RequestResponse<ISprint, number>> {
  return getResponse(
    axios.put(`${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}/${sprintNumber}/finish?failed=${isFailure}`,
      {}, { headers: getHeader(token, config) }
    )
  );
}
/** Adds {@linkcode ISprint} sprint to {@linkcode ISprintList} sprintList in opened {@linkcode IRepository} repository */
export function addSprint(token: string, ownerName: string, sprint: any): Promise<RequestResponse<ISprint, number>> {
  return getResponse(
    axios.post( `${config.backend.ip}:${config.backend.port}/api/Sprints/${ownerName}`,
      sprint, { headers: getHeader(token, config) }
    )
  );
}
//TASKS
/** Fetches {@linkcode ITaskList} tasksList for given {@linkcode IBacklogItem} backlogItem */
export function fetchPBITasks(token: string, ownerName: string, pbiId: number | null,): Promise<RequestResponse<ITaskList, number>> {
  return getResponse(
    axios.get(`${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${isNull(pbiId) ? 0 : pbiId}`,
      { headers: getHeader(token, config) }
    )
  );
}
/** Fetches {@linkcode ITask} tasks that are unassigned for opened {@linkcode IRepository} repository */
export function addUnassignedTasksToPBI(token: string, ownerName: string, pbiId: number,): Promise<RequestResponse<ITaskList, number>> {
  return getResponse(
    axios.get(`${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${pbiId}`,
      { headers: getHeader(token, config) }
    )
  );
}
/** Request for fetching all {@linkcode ITask} tasks for opened {@linkcode IRepository} repository */
export function requestFetchAllRepoTasks(token: string, ownerName: string): Promise<AxiosResponse<ITask, any>> {
  return axios.get(`${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}?onePage=true`,
    { headers: getHeader(token, config) }
  );
}
/** Fetches request rate limit for currently logged in {@linkcode IPerson} user */
export function requestFetchRateLimit(token: string): Promise<AxiosResponse<any, any>> {
  return axios.get(`https://api.github.com/rate_limit`, 
  { headers: { "Accept": "application/vnd.github.v3+json", "Authorization": "token " + token } });
}
/** Fetches all {@linkcode ITask} tasks for opened {@linkcode IRepository} repository */
export function fetchAllRepoTasks(token: string, ownerName: string,): Promise<RequestResponse<ITask, number>> {
  return getResponse(requestFetchAllRepoTasks(token, ownerName));
}
/** Adds {@linkcode ITask} task for opened {@linkcode IRepository} repository */
export function addTask(token: string, ownerName: string, pbiId: number, name: string,): Promise<RequestResponse<ITask, number>> {
  return getResponse(
    axios.post(`${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}`,
      {"name": name,"pbiId": pbiId.toString() }, { headers: getHeader(token, config) }
    )
  );
}
/** Fetches {@linkcode IBacklogItemList} backlogItemsList for opened {@linkcode IRepository} repository */
export function getPBINames(ownerName: string, token: string, filters: IFilters): Promise<RequestResponse<IBacklogItemList, number>> {
  return getResponse(
    axios.get(`${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}?${filterUrlString(filters)}`,
      { headers: getHeader(token, config) }
    )
  );
}
/** Assigns {@linkcode ITask} task to {@linkcode IBacklogItem} backlogItem */
export function assignTaskToPBI(token: string, ownerName: string, pbiId: number | null, taskId: number): Promise<RequestResponse<ITask, number>> {
  return getResponse(
    axios.patch(`${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/${taskId}/assignpbi`,
      { "index": pbiId === null ? 0 : pbiId }, { headers: getHeader(token, config) }
    )
  );
}
/** Assigns or unassigns {@linkcode IPerson} person with given login to {@linkcode ITask} task */
export function updatePersonInTask(token: string, ownerName: string, login: string, taskId: number, isAssign: boolean): Promise<RequestResponse<ITask, number>> {
  return getResponse(
    axios.patch(`${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/${taskId}/${isAssign ? "" : "un"}assignperson`,
      { "login": login }, { headers: getHeader(token, config) }
    )
  );
}
/** Creates branch for given {@linkcode ITask}
 * @param {boolean} isHotfix For true starts a hotfix branch, for false starts feature branch
 */
export function startBranchForTask(token: string, ownerName: string, isHotfix: boolean, taskId: number): Promise<RequestResponse<ITask, number>> {
  return getResponse(
    axios.patch(
      `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/${taskId}/start?hotFix=${isHotfix}`,
      {}, { headers: getHeader(token, config) }
    )
  );
}