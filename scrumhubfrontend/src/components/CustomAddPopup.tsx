import React from 'react';
import { Button, Modal, Form, Input, InputNumber, Space } from 'antd';
import { IAddPBI } from '../appstate/stateInterfaces';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import FormItemLabel from 'antd/lib/form/FormItemLabel';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  data: IAddPBI;
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const CustomAddPopup: React.FC<CollectionCreateFormProps> = ({
  data,
visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Add Product Backlog Item"
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
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the name of the new backlog item!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: 'Please input the priority of the new backlog item!' }]}
        >
          <InputNumber type="number" min={0} />
        </Form.Item>
        <FormItemLabel prefixCls="acceptanceCriteria" label="Acceptance Criteria" required={true}/>
        <Form.List name="acceptanceCriteria" initialValue={[""]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  name={key}
                  rules={[{ required:key<1?true:false, message: 'Please input the acceptance criteria!' }]}
                >
                  <Input placeholder={`Cirteria ${key+1}`} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
     
      </Form>
    </Modal>
  );
};