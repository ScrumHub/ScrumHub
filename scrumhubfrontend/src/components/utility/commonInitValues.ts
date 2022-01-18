import { IFilters } from "../../appstate/stateInterfaces";
import { backlogPriorities } from "./BodyRowsAndColumns";
import { IModals, IRowIds, tableKeys } from "./commonInterfaces";

export const initIDs: IFilters = {
  oldSprintId: -1, newSprintId: -1, pbiId: -1, dropped: false
};

export const fixedType = 'NonDraggableBodyRow';

export const initModalVals: IModals = {
  addTask: false,
  assgnTask: false,
  assgnPpl: false,
  completeSprint: false,
  updateSprint: false,
  editPBI: false,
  estimatePBI: false,
  startBranchId:-1
}

export const initRowIds: IRowIds = {
  pbiID: -2,
  taskID: -2,
  sprintNumber: -2,
  estimated: true
}

export const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { offset: 0 },
    sm: { offset: 0 },
  },
};
export const initFilteredInfo = { complete: [] as number[], pbiPriority: [] as number[] };
export const initSortedInfo = {order: '',columnKey: '',};

export const initFilterSortInfo =  {
  filteredInfo: initFilteredInfo,
  sortedInfo: initSortedInfo
};
export const initFilterMenu = {
  filterMenuVisible: false,
  openKeys: [] as string[]
};

export const pbiFilterVals = 
[{text: backlogPriorities[0], value: 0, },
{text: backlogPriorities[1],value: 1,}, 
{text: backlogPriorities[2],value: 2,},];

export const initKeys: tableKeys = {
  sprintKeys: [0],
  pbiKeys: []
}

export const initLoadingKeys: tableKeys = {
  sprintKeys: [],
  pbiKeys: []
}

export const loginData = {
  isLoading: false,
  errorMessage: "Sorry! Login failed"
}