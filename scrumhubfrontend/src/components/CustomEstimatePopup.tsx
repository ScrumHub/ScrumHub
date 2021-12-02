import React, { useState } from 'react';
import { Button, Modal, Form, Input, Radio, InputNumber, Space } from 'antd';
import { IAddPBI, IProductBacklogItem } from '../appstate/stateInterfaces';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { required } from 'joi';
import FormItemLabel from 'antd/lib/form/FormItemLabel';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  data: IProductBacklogItem;
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const CustomEstimatePopup: React.FC<CollectionCreateFormProps> = ({
  data,
visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Estimate PBI"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onCreate(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
        initialValue={data.expectedTimeInHours}
          name="expectedTimeInHours"
          label="Estimated Hours"
          rules={[{ required: true, message: 'Please input the hour estimation of the new backlog item!' }]}
        >
          <InputNumber type="number" min={0} />
        </Form.Item>
    
      </Form>
    </Modal>
  );
};