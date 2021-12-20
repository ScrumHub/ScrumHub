import { IFilters, ISprint } from "../../appstate/stateInterfaces"
import { useCallback, useEffect, useRef } from "react";

export function useIsMounted() {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);

  return isMounted;
}
export const validate = (IDs: IFilters) => {
  console.log(IDs);
  return (IDs.oldSprintId !== -1 && IDs.newSprintId !== null && IDs.newSprintId !== -1 && IDs.pbiId !== -1 && IDs.newSprintId !== IDs.oldSprintId)
}

export const validatePBIDrag = (pbiId: number, oldSprintId: number, newSprintId: number) => {
  return (oldSprintId !== -2 && newSprintId !== null && newSprintId !== -2 && pbiId !== -2 && newSprintId !== oldSprintId);
}
export const validateTaskDrag = (pbiId: number, taskId:number) => {
  return (pbiId !== -2 && pbiId !== null && taskId !== -2 && taskId !== null );
}

export function dateFormat(date: Date) {
  return new Date(date as Date).toLocaleString(['en-US'], { year: 'numeric', month: 'short', day: 'numeric' });
}

/*export function MenuWithPeople(people: IPeopleList) {
  return (<Menu>{people.list.map((item: IPerson) => {
    return (
      <MenuItem key={item.login}>
        {item.login as string}
      </MenuItem>);
  })
  }</Menu>);
}*/


export function getIndex(record: ISprint) {
  return record.sprintNumber;
}
