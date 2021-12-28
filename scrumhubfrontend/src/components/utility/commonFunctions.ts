import { ISprint } from "../../appstate/stateInterfaces"
import { useCallback, useEffect, useRef } from "react";
import moment from 'moment';

export function useIsMounted() {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);

  return isMounted;
}

export const validatePBIDrag = (pbiId: number, oldSprintId: number, newSprintId: number) => {
  return (oldSprintId !== -2 && newSprintId !== null && newSprintId !== -2 && pbiId !== -2 && newSprintId !== oldSprintId);
}
export const validateTaskDrag = (pbiId: number, taskId:number,oldPbiId: number) => {
  return (pbiId !== -2 && pbiId !== null && taskId !== -2 && taskId !== null && oldPbiId !== pbiId );
}

export const validateNameFilter = (nameFilter:any) => {
  return nameFilter && nameFilter !== "";
}

export const validatePeopleFilter = (peopleFilter:string[]) => {
  return peopleFilter && peopleFilter.length >0;
}

export function disabledDate(current:any) {
  // Can not select days before today and today
  return current < moment().endOf('day').subtract(1, 'days');
}
export function uuid() {
  var buf = new Uint32Array(4);
  window.crypto.getRandomValues(buf);
  var idx = -1;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      idx++;
      var r = (buf[idx>>3] >> ((idx%8)*4))&15;
      var v = c === 'x' ? r : (r&&0x3|0x8);
      return v.toString(16);
  });
};

export function dateFormat(date: Date) {
  return new Date(date as Date).toLocaleString(['en-US'], { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getDate(date:string){
  const temp = date.split("-");
  return date && temp.length > 1 ? temp[0]+"/"+temp[1]+"/"+temp[2].slice(0,2).trim():"";
}

export function saveDate(date:string){
  const temp = date.split("-");
  return date && temp.length > 1 ? temp[0]+"-"+temp[1]+"-"+temp[2].slice(0,2).trim():"";
}


export function getIndex(record: ISprint) {
  return record.sprintNumber;
}

