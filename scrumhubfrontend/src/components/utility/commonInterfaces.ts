import { IProductBacklogItem, ISprint, ITask } from "../../appstate/stateInterfaces";

  export interface BodyRowProps {
    index: any;
    className: any;
    style: any;
    bodyType:string;//"ISprint"|"IProductBacklogItem"|"ITask";
    IDs?:any[];
    setIDs?:any|any[];
    "data-row-key":number;
    "record":ISprint|IProductBacklogItem|ITask;
    restProps: {
      [x: string]: any;
    };
  }

  export interface IModals {
    addTask: boolean,
    assgnTask: boolean,
    assgnPpl: boolean,
    addSprint: boolean,
    updateSprint: boolean,
    addPBI: boolean,
    editPBI: boolean,
    estimatePBI: boolean,
  }
