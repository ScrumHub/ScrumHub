
export interface BodyRowProps {
  index: any;
  bodyType: string;
  record: IRowIds;
  className: any;
  style: any;
  "data-row-key": number;
  restProps: {
    [x: string]: any;
  };
}

export interface IModals {
  addTask: boolean,
  addPBI:boolean,
  assgnTask: boolean,
  assgnPpl: boolean,
  completeSprint: boolean,
  updateSprint: boolean,
  editPBI: boolean,
  estimatePBI: boolean,
  startBranchId: number
}

export interface IRowIds {
  pbiID: number;
  taskID: number;
  sprintNumber: number;
  estimated: boolean;
}

export interface tableKeys {
  sprintKeys: number[];
  pbiKeys: number[];
}

export interface IFilteredInfo {
  complete: number[];
  pbiPriority: number[];
}

export interface ISortedInfo {
  order: string;
  columnKey: string;
}

export interface ILoginData {
  errorMessage: string;
  isLoading: boolean;
}

export interface IProductBacklogProps {
  /** function for updating sort values */
  sortSelected: (arg0: ISortedInfo) => void, 
  /** function for updating filter values */
  itemSelected: (arg0: number[]) => void, 
  /** current sort values */
  sortedInfo: ISortedInfo,
  /** current Backlog Item priority and Sprint Completeness values values */
  filteredInfo: IFilteredInfo, 
  /** current people filter values */
  peopleFilter: string[], 
  /** current name filter values */
  nameFilter: string[]
}