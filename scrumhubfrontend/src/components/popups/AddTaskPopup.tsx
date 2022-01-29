import React from 'react';
import { Modal, Form, Input } from 'antd';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { IAddTaskCollectionCreateFormProps } from './popupInterfaces';
/**
 * Returns Popup with a form for adding new {@linkcode ITask} task
 */
export function AddTaskPopup({
  data, visible, onCreate, onCancel,
}:IAddTaskCollectionCreateFormProps): JSX.Element {
  const [form] = Form.useForm();
  const okForm = () => {
    form
      .validateFields()
      .then((values: { name: string; }) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info: any) => {
        console.error('Validate Failed:', info);
      });
  };
  return (
    <Modal
      centered={true}
      visible={visible}
      closable={false}
      title="Add New Task"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={okForm}
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
          <Input minLength={1} autoComplete='on' onKeyPress={event => {
            if (event.key === 'Enter') {
              okForm();
            }
          } } />
        </Form.Item>
      </Form>
    </Modal>
  );
}