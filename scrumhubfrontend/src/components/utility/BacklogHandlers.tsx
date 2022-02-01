import { IPerson, IBacklogItem, ISprint, ISprintList, IFilters, IAddBI } from "../../appstate/stateInterfaces";
import { store } from "../../appstate/store";
import * as Actions from '../../appstate/actions';
import { initPBIFilter } from "../../appstate/stateInitValues";
import { isArrayValid } from "./commonFunctions";
import { BodyRowProps, IModals } from "./commonInterfaces";
import { isNull } from "lodash";

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
 * Dispatches actions that fetch {@linkcode ISprint} sprints and {@linkcode IBacklogItem} backlogItems
 * @param {boolean} refreshRequired True if Product Backlog should be reloaded
 * @param {string} ownerName Repository name
 * @param {string} token Authorization token from GitHub
 */
export function fetchBacklog(refreshRequired: boolean, ownerName: any, token: any) {
  if (refreshRequired && ownerName && ownerName !== "") {
    store.dispatch(Actions.fetchPBIsThunk({
      ownerName: ownerName, token: token,
      filters: { ...initPBIFilter, inSprint: false, onePage: true }
    })).then((response: any) => {
      if (response.payload && response.payload.code === 200) {
        store.dispatch(Actions.addUnassignedTasksToPBI({ token: token, ownerName: ownerName, pbiId: 0 })).then((response: any) => {
          if (response.payload && response.payload.code === 200) {
            store.dispatch(Actions.fetchSprintsThunk({
              token: token, ownerName: ownerName as string,
              filters: { ...initPBIFilter, onePage: true }
            })).then((response: any) => {
              if (response.payload && response.payload.code === 200) {
                store.dispatch(Actions.fetchRepoTasksThunk({ token: token, ownerName: ownerName }));
              }
            })
          }
        })
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
/** Dispatches an action that adds {@linkcode ITask} task to {@linkcode IBacklogItem} backlogItem */
export const addTaskToPBI = (input: IFilters, token: string, ownerName: string, selectedPBIid: number, setIsModal: React.Dispatch<React.SetStateAction<IModals>>, isModal: IModals, setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>) => {
  store.dispatch(Actions.addTaskThunk({ token: token, ownerName: ownerName, pbiId: selectedPBIid, name: input.name }))
    .then((response: any) => { setIsModal({ ...isModal, addTask: false }); setSelectedPBI({} as IBacklogItem); }).catch((info: any) => {
      console.error('Validate Failed:', info);
    });
};

/** Dispatches an action that adds {@linkcode IBacklogItem} backlogItem to {@linkcode IRepository} repository */
export function addPBIToRepo(pbi: IAddBI, ownerName: string, token: string, setIsAddPBI: React.Dispatch<React.SetStateAction<boolean>>) {
  pbi.acceptanceCriteria = pbi.acceptanceCriteria.filter((value: any) => { return (typeof (value) === "string"); });
  store.dispatch(
    Actions.addPBIThunk({
      ownerName: ownerName,
      token: token,
      pbi: pbi
    })
  ).then((response: any) => { setIsAddPBI(false); }).catch((info: any) => {
    console.error('Validate Failed:', info);
  });
}

/** Dispatches an action that adds {@linkcode ISprint} sprint to {@linkcode IRepository} repository */
export function addSprintToRepo(ids: string[], sprint: ISprint, ownerName: string, token: string, setFinishLoad) {
  store.dispatch(
    Actions.addSprintThunk({
      token: token as string,
      ownerName: ownerName as string,
      sprint: { "title": sprint.title, "finishDate": sprint.finishDate, "goal": sprint.goal, "pbIs": ids }
    })
  ).then((response: any) => { if (response.payload && response.payload.code === 201) {setFinishLoad(false); } }).catch((info: any) => {
    console.error('Validate Failed:', info);
  });
}

/** Draggable row of the table, intended for testing */
export const TestDraggableBodyRow = ({ index: index_row, bodyType, record, className, style, ...restProps }: BodyRowProps) => {
  return (<tr className={`${className}${''}`}
    style={{ cursor: "default", ...style }} {...restProps} />
  );
};

/** Dispatches an action that estimates Story Points for {@linkcode IBacklogItem} backlogItem in {@linkcode IRepository} repository */
export function estimatePBItemInRepo(pbi: IBacklogItem, ownerName: string, token: string, pbiID: number,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>, isModal: IModals, setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>) {
  store.dispatch(Actions.estimatePBIThunk({ ownerName: ownerName, token: token, pbiId: pbiID, hours: pbi.expectedTimeInHours }))
    .then((response: any) => {
      if (response.payload && response.payload?.code === 200) { setIsModal({ ...isModal, estimatePBI: false }); setSelectedPBI({} as IBacklogItem); }
    });
}

/** Dispatches an action that edits Story Points for {@linkcode IBacklogItem} backlogItem in {@linkcode IRepository} repository */
export function editPBItemInRepo(pbi: IBacklogItem, ownerName: string, token: string, pbiID: number,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>, isModal: IModals, setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>) {
  pbi.acceptanceCriteria = pbi.acceptanceCriteria.filter((value: any) => { return (typeof (value) === "string"); });//check if all elements of acceptanceCriteria array are defined    
  store.dispatch(Actions.editPBIThunk({ ownerName: ownerName, token: token, pbi: pbi, pbiId: pbiID, })).then((response: any) => {
    if (response.payload && response.payload?.code === 200) { setIsModal({ ...isModal, editPBI: false }); setSelectedPBI({} as IBacklogItem); }
  });
};
/** Dispatches an action that marks {@linkcode IBacklogItem} backlogItem as finished in {@linkcode IRepository} repository */
export function finishPBItemInRepo(pbi: IBacklogItem, ownerName: string, token: string,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>, isModal: IModals, setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>) {
  store.dispatch(Actions.finishPBIThunk({ ownerName: ownerName, token: token, pbiId: pbi.id })).then((response: any) => {
    if (response.payload && response.payload?.code === 200) { setIsModal({ ...isModal, editPBI: false }); setSelectedPBI({} as IBacklogItem); }
  });
}

/** Dispatches an action that deletes {@linkcode IBacklogItem} backlogItem in {@linkcode IRepository} repository */
export function deletePBItemInRepo(item: IBacklogItem, ownerName: string, token: string,
  setIsModal: React.Dispatch<React.SetStateAction<IModals>>, isModal: IModals, setSelectedPBI: React.Dispatch<React.SetStateAction<IBacklogItem>>) {
  store.dispatch(Actions.deletePBIThunk({ ownerName: ownerName, token: token, pbiId: item.id as number }))
    .then((response: any) => {
      if (response.payload && response.payload.code === 204) {
        if (item.isInSprint) { store.dispatch(Actions.clearSprintList()) }
        else { store.dispatch(Actions.clearPBIsList()); }
        setSelectedPBI({} as IBacklogItem); setIsModal({ ...isModal, editPBI: false });
      }
    })
}

/**
 * Removes the {@linkcode IBacklogItem} backlogItems from old {@linkcode ISprint} sprint
 * @param {ISprintList} sprintPage List of sprints
 * @param {number} oldSprintId Id of the sprint 
 * @param {number} pbiIds Id of the backlogItem
 */
export function removeItemsFromOldSprint(sprintPage: ISprintList, oldSprintId: number, pbiIds: string[]) {
  const index = sprintPage.list.findIndex((s: ISprint) => s.sprintNumber === oldSprintId);
  if (index !== -1) {
    const oldPbis = sprintPage.list[index].backlogItems.map((i: IBacklogItem) => { return ((pbiIds.includes(i.id.toString()) ? "" : i.id.toString())); }).filter((x: string) => x !== "");
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
/** Dispatches an action that unassigns {@linkcode IBacklogItem} backlogItems from {@linkcode IRepository} sprints */
export function unassignPBIsFromSprint(sprint: ISprint, setIsAddSprint, sprintPage: ISprintList, token: string, ownerName: string,setFinishLoad) {
  setIsAddSprint(false);
  setFinishLoad(true);
  const ids = sprint.backlogItems.map((value: IBacklogItem) => { return ((value.isInSprint ? value.id.toString() : "")); }).filter((x: string) => x !== "");
  let unassignIds = sprint.backlogItems.map((value: IBacklogItem) => { return ((value.isInSprint && !isNull(value.sprintNumber) ? value.sprintNumber : -1)); })
    .filter((x: number) => x !== -1);
  unassignIds = unassignIds.filter((v, i) => (unassignIds.indexOf(v) === i));
  const isBacklog = sprint.backlogItems.map((value: IBacklogItem) => { return ((value.isInSprint && isNull(value.sprintNumber) ? value.id : -1)); })
    .filter((x: number) => x !== -1).length > 0;
  store.dispatch(Actions.updateSprintLoadingKeys(isBacklog ? [0].concat(unassignIds) : unassignIds));
  if (isArrayValid(unassignIds)) {
    unassignIds.map((id: number, index: number) => {
      store.dispatch(Actions.updateOneSprintThunk({
        token: token, ownerName: ownerName, sprintNumber: id,
        sprint: removeItemsFromOldSprint(sprintPage, id, ids)
      })).then((response: any) => {
        if (response.payload && response.payload.code === 200 && index + 1 === unassignIds.length) {
          store.dispatch(Actions.updateSprintLoadingKeys(isBacklog ? [0].concat(unassignIds) : unassignIds));
          addSprintToRepo(ids, sprint, ownerName, token, setFinishLoad);
        }
        else{
          setFinishLoad(false);
        }
      });
      return (0);
    })
  } else {
    store.dispatch(Actions.updateSprintLoadingKeys(isBacklog?[0]:[]));
    addSprintToRepo(ids, sprint, ownerName, token, setFinishLoad);
  }
}