import { IPerson, IProductBacklogItem, ISprint, ISprintList } from "../../appstate/stateInterfaces";
import { store } from "../../appstate/store";
import * as Actions from '../../appstate/actions';

export const assignPerson = (person: string, taskId: number, taskPeople: IPerson[], token:string, ownerName:string) => {
  const names = taskPeople.map((item: IPerson) => { return (item.login) });
    store.dispatch(taskPeople.length < 1 || !names.includes(person) ?
      Actions.assignPersonToTaskThunk({ token: token, ownerName: ownerName, login: person, taskId: taskId, }) :
      Actions.unassignPersonToTaskThunk({ token: token, ownerName: ownerName, login: person, taskId: taskId, }));
}

export const startTask = (token:string, ownerName:string,hotfix: boolean, taskId: number) => {
    store.dispatch(Actions.startTaskThunk({ token: token, ownerName: ownerName, hotfix: hotfix, taskId: taskId, }));
}

export const updatePBI = (pbiId: number, oldSprintId: number, newSprintId: number, sprintPage:ISprintList, token:string, ownerName:string) => {
  if (oldSprintId !== 0) {
    const oldSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === oldSprintId);
    const oldPbis = oldSprint?.backlogItems.map((i: IProductBacklogItem) => { return ((i.id !== pbiId ? i.id.toString() : "")) }).filter((x: string) => x !== "");
    store.dispatch(Actions.updateOneSprintThunk({
      token: token, ownerName: ownerName, sprintNumber: oldSprintId, sprint:
      { "goal": oldSprint?.goal as string,"title": oldSprint?.title,"pbIs": oldPbis as string[],"finishDate": new Date(oldSprint?.finishDate as string)}
    })).then((response) => { if (response.payload && response.payload?.code === 200) { if(newSprintId === 0){store.dispatch(Actions.clearPBIsList());}
    else{
      const newSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === newSprintId);
    const newPbis = newSprint?.backlogItems.map((i: IProductBacklogItem) => { return (i.id.toString()) }).concat([pbiId.toString()]);
    store.dispatch(Actions.updateOneSprintThunk({
      token: token, ownerName: ownerName, sprintNumber: newSprintId, sprint:
      {"goal": newSprint?.goal as string, "pbIs": newPbis as string[], "title": newSprint?.title,"finishDate": new Date(newSprint?.finishDate as string)}
    }));
    } } });
  }
  if (newSprintId !== 0 && oldSprintId === 0) {
    const newSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === newSprintId);
    const newPbis = newSprint?.backlogItems.map((i: IProductBacklogItem) => { return (i.id.toString()) }).concat([pbiId.toString()]);
    store.dispatch(Actions.updateOneSprintThunk({
      token: token, ownerName: ownerName, sprintNumber: newSprintId, sprint:
      {"goal": newSprint?.goal as string, "pbIs": newPbis as string[], "title": newSprint?.title,"finishDate": new Date(newSprint?.finishDate as string)}
    })).then((response) => {if (response.payload && response.payload?.code === 200 ) { store.dispatch(Actions.clearPBIsList()); } });
  }
}

export const updateTask = (pbiId: number, taskId: number, token:string, ownerName:string) => {
  store.dispatch(Actions.assignTaskToPBIThunk({ token: token, ownerName: ownerName, pbiId: pbiId, taskId: taskId}));
}