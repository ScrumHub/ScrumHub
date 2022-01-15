import { ISprint } from "../../appstate/stateInterfaces"
import { useCallback, useEffect, useRef } from "react";
import moment from 'moment';
import { isNull } from "lodash";

export const canDropPBI = (pbiId: number, oldSprintId: number, newSprintId: number) => {
  return (oldSprintId !== -2 && newSprintId !== null && newSprintId !== -2 && pbiId !== -2 && newSprintId !== oldSprintId);
}
export const canDropTask = (pbiId: number, taskId:number,oldPbiId: number) => {
  return (pbiId !== -2 && pbiId !== null && taskId !== -2 && taskId !== null && oldPbiId !== pbiId );
}

export const isNameFilterValid = (nameFilter:string) => {
  return !isNull(nameFilter) && nameFilter !== "";
}

export const isMessageValid = (message:string):boolean => {
  return(!isNull(message) && typeof(message)!== "undefined" && message !== "" && message.length>0);
}

export const isBranchNotCreated = (message:string):boolean => {
  return(!isNull(message) && message === "New");
}

export const isPeopleFilterValid = (peopleFilter:string[]) => {
  return peopleFilter && peopleFilter.length >0;
}

export const isArrayValid = (objectArray:any[]) => {
  return objectArray && objectArray.length >0;
}

export const validateString = (val:string) => {
  return val && val !== ""? val:"";
}

export function disabledDate(current:any) {
  // Can not select days before today and today
  return current < moment().endOf('day').subtract(1, 'days');
}

export function dateFormat(date: Date) {
  return new Date(date as Date).toLocaleString(['en-US'], { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getDate(date:string){
  const temp = date ? date.split("-"):"";
  return date && temp.length > 2 ? temp[0]+"/"+temp[1]+"/"+temp[2].slice(0,2).trim():temp;
}

export function saveDate(date:string){
  const temp = date ? date.split("-"):"";
  return date && temp.length > 2 ? temp[0]+"-"+temp[1]+"-"+temp[2].slice(0,2).trim():temp;
}

export function getIndex(record: ISprint) {
  return record.sprintNumber;
}

export function updateRowKeys(record: ISprint, expandedRowKeys:any[]) {
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
  return(newExpandedRowKeys);
};

export function useIsMounted() {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);

  return isMounted;
};


