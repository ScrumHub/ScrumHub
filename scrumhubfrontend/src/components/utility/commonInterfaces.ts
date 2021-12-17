  export interface BodyRowProps {
    IDs:any[],
    setIDs:any|any[],
    index: any;
    moveRow: any;
    className: any;
    style: any;
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
