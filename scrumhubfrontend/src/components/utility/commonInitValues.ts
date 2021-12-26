import { IFilters } from "../../appstate/stateInterfaces";
import { IModals, IRowIds } from "./commonInterfaces";

export const initIDs: IFilters = {
    oldSprintId: -1, newSprintId: -1, pbiId: -1, dropped: false
  };

  export const fixedType = 'NonDraggableBodyRow';

  export const initModalVals : IModals = {
    addTask: false,
    assgnTask: false,
    assgnPpl: false,
    //addSprint: false,
    updateSprint: false,
    //addPBI: false,
    editPBI: false,
    estimatePBI: false,
  }

  export const initRowIds : IRowIds ={
    pbiID: -2,
    taskID: -2,
    sprintNumber: -2,
    estimated:true
  }

  export const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { offset: 0 },
      sm: { offset: 0 },
    },
  };
