import { IPerson, IBacklogItem, ISprint, ISprintList } from "../../appstate/stateInterfaces";
import { store } from "../../appstate/store";
import * as Actions from '../../appstate/actions';
import { initPBIFilter } from "../../appstate/stateInitValues";
import { isArrayValid } from "./commonFunctions";

/**
 * Dispatches an action for unassigning and assigning {@linkcode IPerson} person for the given {@linkcode ITask} task
 * @param {string} person Login of person to be assigned/unassigned 
 * @param {number} taskId Id of the task
 * @param {IPerson[]} taskPeople Assignees of the task
 * @param {string} token Authorization token from GitHub
 * @param {string} ownerName Repository name 
 */
export function assignPerson(person: string, taskId: number, taskPeople: IPerson[], token: string, ownerName: string) {
  const names = taskPeople.map((item: IPerson) => { return (item.login); });
  store.dispatch(Actions.updatePersonInTaskThunk({
    token: token, ownerName: ownerName, login: person, taskId: taskId,
    isAssign: taskPeople.length < 1 || !names.includes(person)
  }));
}
/**
 * Dispatches an action for creating a branch for the given {@linkcode ITask} task 
 * @param {string} token Authorization token from GitHub
 * @param {string} ownerName Repository name
 * @param {boolean} isHotfix True for the hotfix branch, false for the feature branch
 * @param {number} taskId Id of the task
 */
export function startTask(token: string, ownerName: string, isHotfix: boolean, taskId: number) {
  store.dispatch(Actions.startTaskThunk({ token: token, ownerName: ownerName, isHotfix: isHotfix, taskId: taskId, }));
}
/**
 * Removes the {@linkcode IBacklogItem} backlogItem from old {@linkcode ISprint} sprint
 * @param {ISprintList} sprintPage List of sprints
 * @param {number} oldSprintId Id of the sprint 
 * @param {number} pbiId Id of the backlogItem
 */
export function removeFromOldSprint(sprintPage: ISprintList, oldSprintId: number, pbiId: number) {
  const index = sprintPage.list.findIndex((s: ISprint) => s.sprintNumber === oldSprintId);
  if (index !== -1) {
    const oldPbis = sprintPage.list[index].backlogItems.map((i: IBacklogItem) => { return ((i.id !== pbiId ? i.id.toString() : "")); }).filter((x: string) => x !== "");
    return ({
      "goal": sprintPage.list[index].goal as string, "title": sprintPage.list[index].title as string, "pbIs": oldPbis as string[],
      "finishDate": new Date(sprintPage.list[index].finishDate as string)
    });
  } else {
    return ({
      "goal": "", "title": "", "pbIs": {} as string[],
      "finishDate": new Date(0)
    });
  }
}
/**
 * Adds the {@linkcode IBacklogItem} backlogItem to the new {@linkcode ISprint} sprint
 * @param {ISprintList} sprintPage List of sprints
 * @param {number} newSprintId Id of the sprint 
 * @param {number} pbiId Id of the backlogItem
 */
export function addToNewSprint(sprintPage: ISprintList, newSprintId: number, pbiId: number) {
  const index = sprintPage.list.findIndex((s: ISprint) => s.sprintNumber === newSprintId);
  if (index !== -1) {
    const newPbis = sprintPage.list[index].backlogItems.map((i: IBacklogItem) => { return (i.id.toString()); }).concat([pbiId.toString()]);
    return ({
      "goal": sprintPage.list[index].goal as string, "pbIs": newPbis as string[],
      "title": sprintPage.list[index].title, "finishDate": new Date(sprintPage.list[index].finishDate as string)
    });
  } else {
    return ({
      "goal": "", "title": "", "pbIs": {} as string[],
      "finishDate": new Date(0)
    });
  }
}
/**
 * Updates state of the store after {@linkcode IBacklogItem} backlogItem is dragged from {@linkcode ISprint} oldSprint and dropped on {@linkcode ISprint} newSprint
 * @param {number} pbiId Id of backlogItem
 * @param {number} oldSprintId Id of oldSprint
 * @param {number} newSprintId Id of newSprint
 * @param {ISprintList} sprintPage List of sprints
 */
export function updatePBI(pbiId: number, oldSprintId: number, newSprintId: number, sprintPage: ISprintList,
  token: string, ownerName: string) {
  if (sprintPage && isArrayValid(sprintPage.list)) {
    store.dispatch(Actions.updateSprintLoadingKeys([oldSprintId, newSprintId]));
    if (oldSprintId !== 0) {
      store.dispatch(Actions.updateOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: oldSprintId, sprint: removeFromOldSprint(sprintPage, oldSprintId, pbiId) }))
        .then((response: any) => {
          if (response.payload && response.payload?.code === 200) {
            store.dispatch(Actions.updateSprintLoadingKeys([oldSprintId]));
            if (newSprintId === 0) { updateDragPBIs(true, true, ownerName, token); }
            else {
              store.dispatch(Actions.updateOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: newSprintId, sprint: addToNewSprint(sprintPage, newSprintId, pbiId) }))
                .then((response: any) => {
                  if (response.payload && response.payload?.code === 200) { store.dispatch(Actions.updateSprintLoadingKeys([newSprintId])); }
                });
            }
          }
        });
    }
    if (newSprintId !== 0 && oldSprintId === 0) {
      store.dispatch(Actions.updateOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: newSprintId, sprint: addToNewSprint(sprintPage, newSprintId, pbiId) }))
        .then((response: any) => {
          if (response.payload && response.payload?.code === 200) {
            store.dispatch(Actions.updateSprintLoadingKeys([newSprintId]));
            store.dispatch(Actions.fetchPBIsThunk({ ownerName: ownerName, token: token, filters: { ...initPBIFilter, inSprint: false, onePage: true } }))
              .then((response: any) => {
                if (response.payload && response.payload?.code === 200) { store.dispatch(Actions.updateSprintLoadingKeys([oldSprintId])); }
              });
          }
        });
    }
  }
}
/**
 * Updates state of the store after {@linkcode ITask} task is dragged from {@linkcode IBacklogItem} oldPbi and dropped on new {@linkcode IBacklogItem} newPbi 
  * @param {number} newPbiId Id of newPbi
 * @param {number} taskId Id of task
 * @param {number} oldPbiId Id of oldPbi
 * @param {number[]} pbiKeys Keys of all expanded Backlog Items 
 * @param {string} token Authorization token from GitHub
 * @param {string} ownerName Repository name
 */
export function updateTask(newPbiId: number, taskId: number, oldPbiId: number, pbiKeys: number[], token: string, ownerName: string) {
  const keys = [newPbiId, oldPbiId].filter((n: number) => !isArrayValid(pbiKeys) || !pbiKeys.includes(n));
  store.dispatch(Actions.updatePBILoadingKeys(keys));
  store.dispatch(Actions.assignTaskToPBIThunk({ token: token, ownerName: ownerName, pbiId: newPbiId, taskId: taskId })).then((response: any) => {
    if (response.payload && response.payload.code === 200) {
      store.dispatch(Actions.updatePBILoadingKeys(keys));
    }
  });
}
/**
 * Dispatches actions that  first fetch {@linkcode IBacklogItem} backlogItems for Product Backlog, and the fetch unassigned {@linkcode ITask} tasks
 * @param {boolean} refreshRequired True if Product Backlog should be reloaded
 * @param {string} ownerName Repository name
 * @param {string} token Authorization token from GitHub
 */
export function fetchPBIsAndUnassigned(refreshRequired: boolean, ownerName: any, token: any) {
  if (refreshRequired && ownerName && ownerName !== "") {
    store.dispatch(Actions.fetchPBIsThunk({ ownerName: ownerName, token: token, filters: { ...initPBIFilter, inSprint: false, onePage: true } })).then((response: any) => {
      if (response.payload && response.payload.code === 200) {
        store.dispatch(Actions.addUnassignedTasksToPBI({ token: token, ownerName: ownerName, pbiId: 0 }));
      }
    });
  }
}
/**
 * Dispatches an action that updates Product BackXlog after {@linkcode IBacklogItem} backlogItem is dragged and dropped
  * @param {boolean} refreshRequired True if Product Backlog should be reloaded
  * @param {boolean} shouldClearKey True if Product Backlog should stop loading
 * @param {string} ownerName Repository name
 * @param {string} token Authorization token from GitHub
 */
export function updateDragPBIs(refreshRequired: boolean, shouldClearKey: boolean, ownerName: any, token: any) {
  if (refreshRequired && ownerName && ownerName !== "") {
    store.dispatch(Actions.fetchPBIsThunk({
      ownerName: ownerName, token: token,
      filters: { ...initPBIFilter, inSprint: false, onePage: true }
    })).then((response: any) => {
      if (response.payload && response.payload?.code === 200 && shouldClearKey) {
        store.dispatch(Actions.updateSprintLoadingKeys([0]));
      }
    });
  }
}