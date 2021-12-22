import { IProductBacklogItem, ISprint, ITask } from "../../appstate/stateInterfaces";

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
    //addSprint: boolean,
    updateSprint: boolean,
    //addPBI: boolean,
    editPBI: boolean,
    estimatePBI: boolean,
  }

  export interface IRowIds {
    pbiID:number;
    taskID:number;
    sprintNumber:number;
  }
