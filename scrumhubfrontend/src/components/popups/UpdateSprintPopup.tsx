import React from 'react';
import { Modal, Form, DatePicker, Input } from 'antd';
import { IProductBacklogItem, ISprint, IUpdateIdSprint } from '../../appstate/stateInterfaces';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import TextArea from 'antd/lib/input/TextArea';
import { disabledDate } from '../utility/commonFunctions';
import moment, { Moment } from 'moment';
interface Values {
  goal: string;
  backlogItems?: IProductBacklogItem[];
  title:string;
  finishDate:Date|string|Moment
}

interface CollectionCreateFormProps {
  data: ISprint;
  visible: boolean;
  onCreate: (values: ISprint|Values) => void;
  onCancel: () => void;
}

export const UpdateSprintPopup: React.FC<CollectionCreateFormProps> = ({
  data,
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      centered={true}
      closable={true}
      visible={visible}
      title="Edit Sprint"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values: ISprint|Values) => {
            form.resetFields();
            onCreate({...values,backlogItems:data.backlogItems,});
          })
          .catch((info: any) => {
            console.error('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        <FormItemLabel prefixCls="finishDate" label="Sprint Deadline" required={true} />
        <Form.Item
        initialValue={moment(data.finishDate, "YYYY-MM-DD")}
          name="finishDate"
          rules={[{ required: true, message: 'Please input the deadline of this sprint!' }]}
        >
          <DatePicker defaultValue={moment(data.finishDate, "YYYY-MM-DD")} showToday={true} disabledDate={disabledDate} format={"YYYY-MM-DD"}
          />
        </Form.Item>
        <FormItemLabel prefixCls="title" label="Title" required={true} />
        <Form.Item
          initialValue={data.title}
          name="title"
          rules={[{ required: true, message: 'Please input the title of this sprint!' }]}
        >
          <Input required={true}
          />
        </Form.Item>
        <FormItemLabel prefixCls="name" label="Goal" required={true} />
        <Form.Item
          initialValue={data.goal}
          name="goal"
          labelAlign="left"
          rules={[{ required: true, message: 'Please input the goal of this sprint!' }]}
        >
          <TextArea
            maxLength={105}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};