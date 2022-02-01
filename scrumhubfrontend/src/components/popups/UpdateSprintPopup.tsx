import { Modal, Form, DatePicker, Input, Button } from 'antd';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { IUpdateSprintCollectionCreateFormProps } from './popupInterfaces';
import React from 'react';
import { onOkUpdateSprintPopup } from './popupUtilities';
/**
 * Returns Popup with a form for updating the given {@linkcode ISprint} sprint 
 */
export function UpdateSprintPopup({
  data, visible, onCreate, onCancel,
}:IUpdateSprintCollectionCreateFormProps): JSX.Element {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  return (
    <Modal
      centered={true}
      visible={visible}
      closable={false}
      destroyOnClose={true}
      title="Update Sprint"
      footer={[
        <Button key="CancelInUpdateSprintPopup" id="CancelInUpdateSprintPopup" onClick={onCancel}>
          Cancel
        </Button>,
        <Button loading={loading} type="primary" id="SaveInUpdateSprintPopup" key="SaveInUpdateSprintPopup"
          onClick={() => { onOkUpdateSprintPopup(setLoading,data,form, onCreate); }}>
          Save
        </Button>
      ]}
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
          <DatePicker defaultValue={moment(data.finishDate, "YYYY-MM-DD")} showToday={true} format={"YYYY-MM-DD"} />
        </Form.Item>
        <FormItemLabel prefixCls="title" label="Title" required={true} />
        <Form.Item
          initialValue={data.title}
          name="title"
          rules={[{ required: true, message: 'Please input the title of this sprint!', whitespace: true }]}
        >
          <Input minLength={1} required={true} autoComplete="on" maxLength={60}/>
        </Form.Item>
        <FormItemLabel prefixCls="name" label="Goal" required={true} />
        <Form.Item
          initialValue={data.goal}
          name="goal"
          labelAlign="left"
          rules={[{ required: true, message: 'Please input the goal of this sprint!', whitespace: true }]}
        >
          <TextArea required={true} autoComplete="on" maxLength={200}
             />
        </Form.Item>
      </Form>
    </Modal>
  );
}