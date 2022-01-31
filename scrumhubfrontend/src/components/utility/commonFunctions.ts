import { IBacklogItem, IPeopleList, IPerson, ISprint, ITask } from "../../appstate/stateInterfaces"
import { useCallback, useEffect, useRef } from "react";
import moment from 'moment';
import { isNull } from "lodash";
import _ from "lodash";

export const canDropPBI = (pbiId: number, oldSprintId: number, newSprintId: number) => {
  return (oldSprintId !== -2 && newSprintId !== null && newSprintId !== -2 && pbiId !== -2 && newSprintId !== oldSprintId);
}
export const canDropTask = (pbiId: number, taskId: number, oldPbiId: number) => {
  return (pbiId !== -2 && pbiId !== null && taskId !== -2 && taskId !== null && oldPbiId !== pbiId);
}
/**
 * Checks if string is not null or empty
 * @param nameFilter  
 */
export const isNameFilterValid = (nameFilter: string) => {
  return !isNull(nameFilter) && nameFilter !== "";
}

export const isMessageValid = (message: string | undefined): boolean => {
  return (!isNull(message) && typeof (message) !== "undefined" && message !== "" && message.length > 0);
}

export const isInReviewOrFinished = (message: string): boolean => {
  return message === ("InReview") || message === ("Finished");
}

export const isBranchNotCreated = (message: string): boolean => {
  return (!isNull(message) && !message.includes("WBranch") && !isInReviewOrFinished(message));
}

export const isArrayValid = (objectArray: any[]) => {
  return !isNull(objectArray) && typeof (objectArray) !== "undefined" && objectArray.length > 0;
}

export const isItemDefined = (item: any | undefined) => {
  return typeof (item) !== "undefined" && !isNull(item);
}
/** Checks if string exists and is not empty */
export const validateString = (val: string) => {
  return val && val !== "" ? val : "";
}
/** Checks if string is exists, is not empty and adds ellipsis if {@linkcode String} value is longer than 30 characters*/
export const ellipsisForString = (val: string) => {
  return val && val !== "" ? (val.length>30?(val.substring(0,30)+"..."):val) : "";
}

export function disabledDate(current: any) {
  // Can not select days before today and today
  return current < moment().endOf('day').subtract(1, 'days');
}

export function dateFormat(date: Date) {
  return new Date(date.toString()).toLocaleString(['en-US'], { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getDate(date: string) {
  const temp = date ? date.split("-") : "";
  return date && temp.length > 2 ? temp[0] + "/" + temp[1] + "/" + temp[2].slice(0, 2).trim() : temp;
}

export function saveDate(date: string) {
  const temp = date ? date.split("-") : "";
  return date && temp.length > 2 ? temp[0] + "-" + temp[1] + "-" + temp[2].slice(0, 2).trim() : temp;
}

export function getIndex(record: ISprint) {
  return record.sprintNumber;
}

export function updateRowKeys(record: ISprint, expKeys: any[]) {
  let expandedRowKeys = _.cloneDeep(expKeys);
  const rowKey = record.sprintNumber;
  const isExpanded = expandedRowKeys.includes(rowKey);
  let newExpandedRowKeys = [] as number[];
  if (isExpanded) {
    newExpandedRowKeys = expandedRowKeys.reduce((acc: number[], key: number) => {
      if (key !== rowKey) { acc.push(key) };
      return acc;
    }, []);
  } else {
    newExpandedRowKeys = expandedRowKeys;
    newExpandedRowKeys.push(rowKey);
  }
  return (newExpandedRowKeys);
};

export function useIsMounted() {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);

  return isMounted;
};

export function clearLocalStorage() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("token");
  localStorage.removeItem("ownerName");
  localStorage.removeItem("sprintID");
  localStorage.clear();
}

export function clearProjectLocalStorage() {
  localStorage.removeItem("ownerName");
  localStorage.removeItem("sprintID");
}

export function setLoginStateLocalStorage(token: string | undefined) {
  if (isMessageValid(token)) {
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    localStorage.setItem("token", JSON.stringify(token));
  }
}

export function getTimeFromDate(date: Date) {
  return (date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + ":" + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds());
}

export function getFetchBodyData(url: string) {
  const newUrl = url.split("?code=");
  window.history.pushState({}, "", newUrl[0]);
  return ({ code: newUrl[1] });
}

export function getOwnerNameLocation(url: string) {
  if(!url.includes("login") && url.split("/").length>=3){
return(url.split("/")[1]+"/"+url.split("/")[2]);
  }
  else{
    return("");
  }
}

export function getSprintLocation(url: string): number {
  return(url && !url.includes("login") && url.split("/").length===5 ?Number(url.split("/")[4]):-1);
}

export function hasGithubResponseCode(url: string) {
  return (isNameFilterValid(url) && url.includes("?code="));
}

export function isSprintLoaded(sprintID: number, sprintPage: ISprint, shouldBeEqual: boolean) {
  return (sprintID !== -1 && isItemDefined(sprintPage) && shouldBeEqual === (sprintID === sprintPage.sprintNumber));
}

export function formatSprintStatus(status: string) {
  return status.replace("Not", "Not ").replace("In", "In ");
}

export function useTasksRef(initial: ITask[]) {
  const valueRef = useRef(initial);
  valueRef.current = initial;
  return valueRef;
}
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
