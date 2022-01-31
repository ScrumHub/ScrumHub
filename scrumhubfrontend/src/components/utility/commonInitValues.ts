import { IFilters } from "../../appstate/stateInterfaces";
import config from "../../configuration/config";
import { IFilteredInfo, ILoginData, IModals, IRowIds, ISortedInfo } from "./commonInterfaces";

export const initIDs: IFilters = {
  oldSprintId: -1, newSprintId: -1, pbiId: -1, dropped: false
};

export const fixedType = 'NonDraggableBodyRow';

export const initLoginData: ILoginData = { errorMessage: "", isLoading: false };

export const initModalVals: IModals = {
  addTask: false,
  assgnTask: false,
  assgnPpl: false,
  completeSprint: false,
  updateSprint: false,
  editPBI: false,
  estimatePBI: false,
  startBranchId: -1,
  addPBI: false
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
export const initSortedInfo = { order: "", columnKey: "" } as ISortedInfo;

export const initFilterSortInfo = {
  filteredInfo: initFilteredInfo,
  sortedInfo: initSortedInfo
};
export const initFilterMenu = {
  filterMenuVisible: false,
  openKeys: [] as string[]
};
export const backlogPriorities = ["Could", "Should", "Must"];
export const backlogColors = ["green", "blue", "red"];
export const pbiFilterVals =
  [{ text: backlogPriorities[0], value: 0, },
  { text: backlogPriorities[1], value: 1, },
  { text: backlogPriorities[2], value: 2, },];

export const pbiStatusVals =
  [{ text: "Not Finished", value: false, },
  { text: "Finished", value: true, },];

export const sprintStatusVals =
  [{ text: "Complete", value: 1, },
  { text: "Not Complete", value: 0, }
  ];

export const loginDataError = {
  isLoading: false,
  errorMessage: "Error! Login failed"
} as ILoginData;

export const initReposFilters = {
  pageSize: config.defaultFilters.size,
  pageNumber: config.defaultFilters.page,
}