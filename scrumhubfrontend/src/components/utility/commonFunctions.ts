import { IBacklogItem, IPeopleList, IPerson, ISprint, ITask } from "../../appstate/stateInterfaces"
import { useCallback, useEffect, useRef } from "react";
import moment from 'moment';
import { isNull } from "lodash";

/** Checks if {@linkcode IBacklogItem} backlogItem can be moved */
export function canDropPBI(pbiId: number, oldSprintId: number, newSprintId: number) {
  return (oldSprintId !== -2 && newSprintId !== null && newSprintId !== -2 && pbiId !== -2 && newSprintId !== oldSprintId);
}

/** Checks if {@linkcode ITask} task can be moved */
export function canDropTask(pbiId: number, taskId: number, oldPbiId: number) {
  return (pbiId !== -2 && pbiId !== null && taskId !== -2 && taskId !== null && oldPbiId !== pbiId);
}
/**
 * Checks if string is not null or empty
 * @param nameFilter  
 */
export function isNameFilterValid(nameFilter: string) {
  return !isNull(nameFilter) && nameFilter !== "";
}

/** Checks if string is not null nor empty nor undefined*/
export function isMessageValid(message: string | undefined): boolean {
  return (!isNull(message) && typeof (message) !== "undefined" && message !== "" && message.length > 0);
}

/** Checks if branch status is Review or Finished*/
export function isInReviewOrFinished(status: string): boolean {
  return status === ("InReview") || status === ("Finished");
}

/** Checks if branch can be created based on status*/
export function isBranchNotCreated(status: string): boolean {
  return (!isNull(status) && !status.includes("WBranch") && !isInReviewOrFinished(status));
}

/** Checks if array is defined, not null and has at least one 1 element*/
export function isArrayValid(objectArray: any[]) {
  return !isNull(objectArray) && typeof (objectArray) !== "undefined" && objectArray.length > 0;
}

/** Checks if item is defined */
export function isItemDefined(item: any | undefined) {
  return typeof (item) !== "undefined" && !isNull(item);
}
/** Checks if string exists and is not empty */
export function validateString(val: string) {
  return val && val !== "" ? val : "";
}
/** Checks if string is exists, is not empty and adds ellipsis if {@linkcode String} value is longer than 30 characters*/
export function ellipsisForString(val: string) {
  return val && val !== "" ? (val.length > 30 ? (val.substring(0, 30) + "...") : val) : "";
}
export function disabledDate(current: any) {
  // Can not select days before today and today
  return current < moment().endOf('day').subtract(1, 'days');
}
/** Formats date to ensure the date is valid in all types of browsers*/
export function dateFormat(date: Date|string) {
  return new Date(typeof(date)==="string"?date.replace(" UTC", ""):date.toString()).toLocaleString(['en-US'], { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Returns formated date*/
export function getDate(date: string) {
  const temp = date ? date.split("-") : "";
  return date && temp.length > 2 ? temp[0] + "/" + temp[1] + "/" + temp[2].slice(0, 2).trim() : temp;
}

/** Checks if component is mounted*/
export function useIsMounted() {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);

  return isMounted;
};

/** Removes all items from the storage and clears it*/
export function clearLocalStorage() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("token");
  localStorage.removeItem("ownerName");
  localStorage.removeItem("sprintID");
  localStorage.clear();
}

/** Removes all project-related items from the storage*/
export function clearProjectLocalStorage() {
  localStorage.removeItem("ownerName");
  localStorage.removeItem("sprintID");
}

/** Removes authorization from the storage*/
export function setLoginStateLocalStorage(token: string | undefined) {
  if (isMessageValid(token)) {
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    localStorage.setItem("token", JSON.stringify(token));
  }
}

/** Extracts code returned from GitHub*/
export function getFetchBodyData(url: string) {
  const newUrl = url.split("?code=");
  window.history.pushState({}, "", newUrl[0]);
  return ({ code: newUrl[1] });
}

/** Extracts owner and name of the repository from location*/
export function getOwnerNameLocation(url: string) {
  if(!url.includes("login") && url.split("/").length>=3){
return(url.split("/")[1]+"/"+url.split("/")[2]);
  }
  else{
    return("");
  }
}

/** Extracts sptint id from location*/
export function getSprintLocation(url: string): number {
  return(url && !url.includes("login") && url.split("/").length===5 ?Number(url.split("/")[4]):-1);
}

/** Checks if github authorization code was generated*/
export function hasGithubResponseCode(url: string) {
  return (isNameFilterValid(url) && url.includes("?code="));
}

/** Checks if sprint is loading*/
export function isSprintLoaded(sprintID: number, sprintPage: ISprint, shouldBeEqual: boolean) {
  return (sprintID !== -1 && isItemDefined(sprintPage) && shouldBeEqual === (sprintID === sprintPage.sprintNumber));
}

/** Formats {@linkcode ISprint} sprint status*/
export function formatSprintStatus(status: string) {
  return status.replace("Not", "Not ").replace("In", "In ");
}

/** Returns reference to tasks in store*/
export function useTasksRef(tasks: ITask[]) {
  const valueRef = useRef(tasks);
  valueRef.current = tasks;
  return valueRef;
}

/** Returns reference to loading state in store*/
export function useStateAndRefLoading(initial: boolean) {
  const valueRef = useRef(initial);
  valueRef.current = initial;
  return { loading: initial, loadingRef: valueRef };
}

/** Transforms {@linkcode IPeopleList} peoplelist into filters for assignee column of Task Table */
export function renderPeopleFilters(people: IPeopleList) {
  const isValid = people && isArrayValid(people.list);
  return (isValid ? people.list.map((p: IPerson) => { return ({ text: p.login, value: p.gitHubId }); }) : []);
}

/** Transforms {@linkcode ITask} task for given {@linkcode IBacklogItem} backlogItem into filters for name column of Task Table */
export function renderNameFilters(item: IBacklogItem) {
  const isValid = item && isArrayValid(item.tasks);
  return (isValid ? item.tasks.map((p: ITask) => { return ({ text: p.name, value: p.pbiId }); }) : []);
}
