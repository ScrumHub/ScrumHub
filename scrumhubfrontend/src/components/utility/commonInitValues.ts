import { IFilters } from "../../appstate/stateInterfaces";
import config from "../../configuration/config";
import { backlogPriorities } from "./BodyRowsAndColumns";
import { IFilteredInfo, IModals, IRowIds, ISortedInfo } from "./commonInterfaces";

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
export const initFilteredInfo = { complete: [] as number[], pbiPriority: [] as number[] } as IFilteredInfo;
export const initSortedInfo = {order: "",columnKey: ""} as ISortedInfo;

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


export const loginData = {
  isLoading: false,
  errorMessage: "Error! Login failed"
}

export const initReposFilters = {
  pageSize: config.defaultFilters.size,
  pageNumber: config.defaultFilters.page,
}