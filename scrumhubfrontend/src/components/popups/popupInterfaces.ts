import { IAddPBI, IFilters, IProductBacklogItem, ISprint } from "../../appstate/stateInterfaces";
import { Moment } from "moment";
//pbi
export interface IAddPBICollectionCreateFormProps {
    data: IAddPBI;
    visible: boolean;
    onCreate: (values: IAddPBI) => void;
    onCancel: () => void;
}
export interface IEditPBICollectionCreateFormProps {
    data: IAddPBI;
    visible: boolean;
    onCreate: (values: IAddPBI) => void;
    onCancel: () => void;
    onDelete: () => void;
    onFinish: () => void;
}

export interface IEstimatePBICollectionCreateFormProps {
    data: IProductBacklogItem;
    visible: boolean;
    onCreate: (values: { expectedTimeInHours: number }) => void;
    onCancel: () => void;
}

//sprint
export interface IUpdateSprintPBIsValues {
    goal: string;
    backlogItems: IProductBacklogItem[];
}
export interface IUpdateSprintPBIsCollectionCreateFormProps {
    data: ISprint;
    pbiData: IProductBacklogItem[];
    visible: boolean;
    onCreate: (values: IUpdateSprintPBIsValues) => void;
    onCancel: () => void;
}
export interface IUpdateSprintValues {
    goal: string;
    pbIs: string[];
    finishDate: string | Date | Moment;
    title: string;
}

export interface IUpdateSprintCollectionCreateFormProps {
    data: ISprint;
    visible: boolean;
    onCreate: (values: ISprint | IUpdateSprintValues) => void;
    onCancel: () => void;
}
export interface IAddSprintCollectionCreateFormProps {
    data: ISprint;
    error: string;
    pbiData: IProductBacklogItem[];
    visible: boolean;
    onCreate: (values: ISprint) => void;
    onCancel: () => void;
}
export interface ICompleteSprintCollectionCreateFormProps {
    data: ISprint;
    visible: boolean;
    onComplete: (isFailure: boolean) => void;
    onCancel: () => void;
}


//task
export interface IAddTaskCollectionCreateFormProps {
    data: IFilters;
    visible: boolean;
    onCreate: (values: { name: string }) => void;
    onCancel: () => void;
}
