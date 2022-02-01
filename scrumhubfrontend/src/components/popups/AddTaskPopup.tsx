import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { IAddTaskCollectionCreateFormProps } from './popupInterfaces';
import { onOkAddTaskPopup } from './popupUtilities';
/**
 * Returns Popup with a form for adding new {@linkcode ITask} task
 */
export function AddTaskPopup({
  data, visible, onCreate, onCancel,
}:IAddTaskCollectionCreateFormProps): JSX.Element {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  if(!visible && loading){
   form.resetFields();
   setLoading(false);
  }
  return (
    <Modal
    title="Add New Task"
      centered={true}
      visible={visible}
      destroyOnClose={true}
      closable={true}
      onCancel={onCancel}
      footer={[
        <Button key="CancelInAddTaskPopup" id="CancelInAddTaskPopup" onClick={onCancel}>
          Cancel
        </Button>,
        <Button loading={loading} type="primary" id="SaveInAddTaskPopup" key="SaveInAddTaskPopup"
        onClick={() => {onOkAddTaskPopup(setLoading,form, onCreate); }}>
          Save
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <FormItemLabel prefixCls="name" label="Name" required={true} />
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input the name of the new task!', whitespace: true }]}
        >
          <Input id="InputInAddTaskPopup" minLength={1} autoComplete='on' onKeyPress={event => {
            if (event.key === 'Enter') {
              onOkAddTaskPopup(setLoading,form, onCreate); 
            }
          } } />
        </Form.Item>
      </Form>
    </Modal>
  );
}