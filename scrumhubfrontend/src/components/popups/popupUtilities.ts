import { FormInstance, message } from "antd";
import { IAddBI } from "../../appstate/stateInterfaces";

export function onOkAddPBIPopup(form:FormInstance<any>,onCreate:(values: IAddBI) => void) {
    form
      .validateFields()
      .then((values: IAddBI) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info: any) => {
        message.error('Validate Failed:', info);
      });
  }