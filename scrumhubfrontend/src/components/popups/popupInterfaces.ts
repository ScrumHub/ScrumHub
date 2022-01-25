import { IAddBI, IFilters, IBacklogItem, ISprint } from "../../appstate/stateInterfaces";
import { Moment } from "moment";
//pbi
export interface IAddPBICollectionCreateFormProps {
    data: IAddBI;
    visible: boolean;
    onCreate: (values: IAddBI) => void;
    onCancel: () => void;
}
export interface IEditPBICollectionCreateFormProps {
    data: IAddBI;
    visible: boolean;
    onCreate: (values: IAddBI) => void;
    onCancel: () => void;
    onDelete: () => void;
    onFinish: () => void;
}

export interface IEstimatePBICollectionCreateFormProps {
    data: IBacklogItem;
    visible: boolean;
    onCreate: (values: { expectedTimeInHours: number }) => void;
    onCancel: () => void;
}

//sprint
export interface IUpdateSprintPBIsValues {
    goal: string;
    backlogItems: IBacklogItem[];
}
export interface IUpdateSprintPBIsCollectionCreateFormProps {
    data: ISprint;
    pbiData: IBacklogItem[];
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
    pbiData: IBacklogItem[];
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
