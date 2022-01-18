import React from 'react';
import { Modal, Form, Input } from 'antd';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { IAddTaskCollectionCreateFormProps } from './popupInterfaces';

export const AddTaskPopup: React.FC<IAddTaskCollectionCreateFormProps> = ({
  data,
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      centered={true}
      visible={visible}
      closable={false}
      title="Add New Task"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values: {name:string}) => {
            form.resetFields();
            onCreate(values);
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
        initialValues={{ modifier: 'public' }}
      >
        <FormItemLabel prefixCls="name" label="Name" required={true} />
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input the name of the new task!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};