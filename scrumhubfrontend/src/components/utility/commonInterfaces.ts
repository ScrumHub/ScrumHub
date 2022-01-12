
  export interface BodyRowProps {
    index: any;
    bodyType:string;
    //row :ISprint|IProductBacklogItem|ITask;
    record:IRowIds;
    className: any;
    style: any;
     //IDs?:any[];
    //setIDs?:any|any[];
    "data-row-key":number;
    restProps: {
      [x: string]: any;
    };
  }

  export interface IModals {
    addTask: boolean,
    assgnTask: boolean,
    assgnPpl: boolean,
    completeSprint:boolean,
    //addSprint: boolean,
    updateSprint: boolean,
    //addPBI: boolean,
    editPBI: boolean,
    estimatePBI: boolean,
    startBranchId:number
  }

  export interface IRowIds {
    pbiID:number;
    taskID:number;
    sprintNumber:number;
    estimated:boolean;
  }

  export interface tableKeys{
    sprintKeys:number[],
    pbiKeys:number[],
  }