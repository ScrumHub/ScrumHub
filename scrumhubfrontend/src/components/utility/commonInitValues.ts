import { IFilters } from "../../appstate/stateInterfaces";
import { IFetch, IModals } from "./commonInterfaces";

export const initIDs: IFilters = {
    oldSprintId: -1, newSprintId: -1, pbiId: -1, dropped: false
  };

  export const fixedType = 'NonDraggableBodyRow';

  export const initModalVals : IModals = {
    addTask: false,
    assgnTask: false,
    assgnPpl: false,
    addSprint: false,
    updateSprint: false,
    addPBI: false,
    editPBI: false,
    estimatePBI: false,
  }

  export const initFetchVals : IFetch = {
    fetchSprints: false,
    fetchSprintsPBI: false,
    fetchPBIs: false,
    fetched: false,
  }
