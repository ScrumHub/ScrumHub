import { IPerson, IProductBacklogItem, ISprint, ISprintList } from "../../appstate/stateInterfaces";
import { store } from "../../appstate/store";
import * as Actions from '../../appstate/actions';
import { initPBIFilter } from "../../appstate/initStateValues";
import { isArrayValid } from "./commonFunctions";

export const assignPerson = (person: string, taskId: number, taskPeople: IPerson[], token: string, ownerName: string) => {
  const names = taskPeople.map((item: IPerson) => { return (item.login) });
  store.dispatch(Actions.updatePersonInTaskThunk({ token: token, ownerName: ownerName, login: person, taskId: taskId,
    isAssign:taskPeople.length < 1 || !names.includes(person) })); 
}

export const startTask = (token: string, ownerName: string, hotfix: boolean, taskId: number) => {
  store.dispatch(Actions.startTaskThunk({ token: token, ownerName: ownerName, hotfix: hotfix, taskId: taskId, }));
}

export const calculateOldSprint = (sprintPage: ISprintList, oldSprintId: number, pbiId: number) => {
  const oldSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === oldSprintId);
  const oldPbis = oldSprint?.backlogItems.map((i: IProductBacklogItem) => { return ((i.id !== pbiId ? i.id.toString() : "")) }).filter((x: string) => x !== "");
  return ({
    "goal": oldSprint?.goal as string, "title": oldSprint?.title, "pbIs": oldPbis as string[],
    "finishDate": new Date(oldSprint?.finishDate as string)
  });
}
export const calculateNewSprint = (sprintPage: ISprintList, newSprintId: number, pbiId: number) => {
  const newSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === newSprintId);
  const newPbis = newSprint?.backlogItems.map((i: IProductBacklogItem) => { return (i.id.toString()) }).concat([pbiId.toString()]);
  return ({ "goal": newSprint?.goal as string, "pbIs": newPbis as string[], "title": newSprint?.title, "finishDate": new Date(newSprint?.finishDate as string) });
}

export const updatePBI = (pbiId: number, oldSprintId: number, newSprintId: number, sprintPage: ISprintList, token: string, ownerName: string) => {
  if (sprintPage && isArrayValid(sprintPage.list)) {
    store.dispatch(Actions.updateSprintLoadingKeys([oldSprintId, newSprintId]));
    if (oldSprintId !== 0) {
      store.dispatch(Actions.updateOneSprintThunk({token: token, ownerName: ownerName, sprintNumber: oldSprintId,sprint: calculateOldSprint(sprintPage, oldSprintId, pbiId)}))
      .then((response:any) => {
        if (response.payload && response.payload?.code === 200) {
          store.dispatch(Actions.updateSprintLoadingKeys([oldSprintId]))
          if (newSprintId === 0) { updateDragPBIs(true, true, ownerName, token, oldSprintId, newSprintId); }
          else {store.dispatch(Actions.updateOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: newSprintId, sprint: calculateNewSprint(sprintPage, newSprintId, pbiId) }))
          .then((response:any) => {
            if (response.payload && response.payload?.code === 200) {store.dispatch(Actions.updateSprintLoadingKeys([newSprintId]));}
          });
          }
        }
      });
    }
    if (newSprintId !== 0 && oldSprintId === 0) {
      store.dispatch(Actions.updateOneSprintThunk({token: token, ownerName: ownerName, sprintNumber: newSprintId, sprint: calculateNewSprint(sprintPage, newSprintId, pbiId)}))
      .then((response:any) => {
        if (response.payload && response.payload?.code === 200) {
          store.dispatch(Actions.updateSprintLoadingKeys([newSprintId]))
          store.dispatch(Actions.fetchPBIsThunk({ownerName: ownerName, token: token, filters: { ...initPBIFilter, inSprint: false, onePage: true }}))
          .then((response:any) => {
            if (response.payload && response.payload?.code === 200) {store.dispatch(Actions.updateSprintLoadingKeys([oldSprintId]));}
          })
        }
      });
    }
  }
}

export const updateTask = (pbiId: number, taskId: number, token: string, ownerName: string) => {
  store.dispatch(Actions.assignTaskToPBIThunk({ token: token, ownerName: ownerName, pbiId: pbiId, taskId: taskId }));
}

export const fetchPBIsAndUnassigned = (refreshRequired: boolean, ownerName: any, token: any) => {
  if (refreshRequired && ownerName && ownerName !== "") {
    store.dispatch(Actions.fetchPBIsThunk({ ownerName: ownerName, token: token, filters: { ...initPBIFilter, inSprint: false, onePage: true } })).then((response: any) => {
      if (response.payload && response.payload.code === 200) {
        store.dispatch(Actions.addUnassignedTasksToPBI({ token: token, ownerName: ownerName, pbiId: 0 }));
      }
    });
  }
}
export const updateDragPBIs = (refreshRequired: boolean, shouldClearKey: boolean, ownerName: any, token: any, oldSprintId: number, newSprintId: number) => {
  if (refreshRequired && ownerName && ownerName !== "") {
    store.dispatch(Actions.fetchPBIsThunk({
      ownerName: ownerName, token: token,
      filters: { ...initPBIFilter, inSprint: false, onePage: true }
    })).then((response:any) => {
      if (response.payload && response.payload?.code === 200 && shouldClearKey) {
        store.dispatch(Actions.updateSprintLoadingKeys([0]));
      }
    });
  }
}