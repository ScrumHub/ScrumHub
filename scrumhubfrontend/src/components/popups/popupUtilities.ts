import { FormInstance, message } from "antd";
import { IAddBI, IBacklogItem, ISprint } from "../../appstate/stateInterfaces";
import { IUpdateSprintValues } from "./popupInterfaces";

export function onOkAddPBIPopup(form: FormInstance<any>, onCreate: (values: IAddBI) => void) {
  form
    .validateFields()
    .then((values: IAddBI) => {
      onCreate(values);
    })
    .catch((info: any) => {
      message.error('Validate Failed:', info);
    });
}
export function onOkEstimatePBIPopup(form: FormInstance<any>, onCreate: (values: any) => void, estimate:number) {
  form.validateFields()
    .then((values: { expectedTimeInHours: number }) => {
      onCreate({ expectedTimeInHours: estimate });
    })
    .catch((info: any) => {
      console.error('Validate Failed:', info);
    });
}

export function onOkAddSprintPopup(form: FormInstance<any>, onCreate: (values: ISprint) => void, temp: IBacklogItem[]) {
  form
    .validateFields()
    .then((values: ISprint) => {
      const newSprint = { ...values, backlogItems: temp };
      onCreate(newSprint);
    })
    .catch((info: any) => {
      console.error('Validate Failed:', info);
    });
}

export function onOkAddTaskPopup(form: FormInstance<any>, onCreate: (values: { name: string; }) => void) {
  form
    .validateFields()
    .then((values: { name: string; }) => {
      onCreate(values);
    })
    .catch((info: any) => {
      console.error('Validate Failed:', info);
    });
};

export function onOkEditPBIPopup(form: FormInstance<any>, onCreate:(values: IAddBI) => void) {
  form.validateFields()
    .then((values: IAddBI) => {
      onCreate(values as IAddBI);
    })
    .catch((info: any) => {
      console.error('Validate Failed:', info);
    });
};

export function onOkUpdateSprintPopup(data: ISprint, form: FormInstance<any>, onCreate:(values: ISprint | IUpdateSprintValues) => void) {
  form
    .validateFields()
    .then((values: ISprint | IUpdateSprintValues) => {
      onCreate({ ...values, backlogItems: data.backlogItems, });
    })
    .catch((info: any) => {
      console.error('Validate Failed:', info);
    });
}

