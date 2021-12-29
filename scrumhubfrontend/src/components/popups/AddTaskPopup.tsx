import React from 'react';
import { Button, Modal, Form, Input, InputNumber, Space } from 'antd';
import { IFilters } from '../../appstate/stateInterfaces';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import FormItemLabel from 'antd/lib/form/FormItemLabel';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  data: IFilters;
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const AddTaskPopup: React.FC<CollectionCreateFormProps> = ({
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
          .then((values: Values) => {
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