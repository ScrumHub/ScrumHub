
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
  sprintKeys: number[],
  pbiKeys: number[],
}

export interface IFilteredInfo {
  complete: number[],
  pbiPriority: number[]
}

export interface ISortedInfo {
  order: string,
  columnKey: string
}

export interface ILoginData {
  isLoading: boolean,
  errorMessage: string
}