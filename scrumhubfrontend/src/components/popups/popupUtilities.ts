import { FormInstance, message } from "antd";
import { IAddBI, IBacklogItem, ISprint } from "../../appstate/stateInterfaces";
import { IUpdateSprintValues } from "./popupInterfaces";

export async function onOkAddPBIPopup(setLoading:React.Dispatch<React.SetStateAction<boolean>>,form: FormInstance<any>, onCreate: (values: IAddBI) => void) {
  form
    .validateFields()
    .then((values: IAddBI) => {
      onCreate(values);
      setLoading(true);
    })
    .catch((info: any) => {
      message.error('Validate Failed',5);
    });
}
export async function onOkEstimatePBIPopup(setLoading:React.Dispatch<React.SetStateAction<boolean>>,form: FormInstance<any>, onCreate: (values: any) => void, estimate: number) {
  form.validateFields()
    .then((values: { expectedTimeInHours: number }) => {
      onCreate({ expectedTimeInHours: estimate });
      setLoading(true);
    })
    .catch((info: any) => {
      message.error('Validate Failed',5);
    });
}

export async function onOkAddSprintPopup(setLoading:React.Dispatch<React.SetStateAction<boolean>>,form: FormInstance<any>, onCreate: (values: ISprint) => void, temp: IBacklogItem[]) {
  form
    .validateFields()
    .then((values: ISprint) => {
      const newSprint = { ...values, backlogItems: temp };
      onCreate(newSprint);
      setLoading(true);
    })
    .catch((info: any) => {
      message.error('Validate Failed',5);
    });
}

export async function onOkAddTaskPopup(setLoading:React.Dispatch<React.SetStateAction<boolean>>, form: FormInstance<any>, onCreate: (values: { name: string; }) => void) {
  form
    .validateFields()
    .then((values: { name: string; }) => {
      onCreate(values);
      setLoading(true);
    })
    .catch((info: any) => {
      message.error('Validate Failed',5);
    });
};

export async function onOkEditPBIPopup(loading: {
  finish: boolean;
  save: boolean;
}, setLoading: React.Dispatch<React.SetStateAction<{
  finish: boolean;
  save: boolean;
}>>, form: FormInstance<any>, onCreate: (values: IAddBI) => void) {
  form.validateFields()
    .then((values: IAddBI) => {
      onCreate(values as IAddBI);
      setLoading({ ...loading, save: true });
    })
    .catch((info: any) => {
      message.error('Validate Failed',5);
    });
};

export async function onOkUpdateSprintPopup(setLoading:React.Dispatch<React.SetStateAction<boolean>>,data: ISprint, form: FormInstance<any>, onCreate: (values: ISprint | IUpdateSprintValues) => void) {
  form
    .validateFields()
    .then((values: ISprint | IUpdateSprintValues) => {
      onCreate({ ...values, backlogItems: data.backlogItems, });
      setLoading(true);
    })
    .catch((info: any) => {
      message.error('Validate Failed',5);
    });
}

