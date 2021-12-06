import React, { useState } from 'react';
import { Button, Modal, Form, Input, Switch } from 'antd';
import { IPBIFilter } from '../appstate/stateInterfaces';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  data: IPBIFilter;
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const CustomFilterPopup: React.FC<CollectionCreateFormProps> = ({
  data,
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [isNameOpen, setIsNameOpen] = useState(false);
  const [isFinishedOpen, setIsFinishedOpen] = useState(false);
  const [isEstimatedOpen, setIsEstimatedOpen] = useState(false);
  const [isSprintOpen, setIsSprintOpen] = useState(false);
  return (
    <Modal
      visible={visible}
      title="Filter Backlog Items"
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
          initialValue={data.nameFilter}
          hidden={!isNameOpen}
          name="nameFilter"
          label="Filter by Name"
        >
          <Input />
        </Form.Item>
        <Form.Item hidden={!isNameOpen}>
          <Button type="primary" onClick={() => { form.setFieldsValue({ "nameFilter": null });setIsNameOpen(false)}} block icon={<MinusCircleOutlined />}>
            Do Not Filter By Name
          </Button>
        </Form.Item>
        <Form.Item hidden={isNameOpen}>
          <Button type="dashed" onClick={() => setIsNameOpen(true)} block icon={<PlusOutlined />}>
            Filter By Name
          </Button>
        </Form.Item>
        <Form.Item
          initialValue={data.finished}
          name="finished"
          label="PBI finished?"
          hidden={!isFinishedOpen}
          valuePropName="checked"
        >
          <Switch/>
        </Form.Item>
        <Form.Item hidden={!isFinishedOpen} >
          <Button type="primary" onClick={() => { form.setFieldsValue({ "finished": null }); setIsFinishedOpen(false);}} block icon={<MinusCircleOutlined />}>
            Do Not Filter By Finished Status
          </Button>
        </Form.Item>
        <Form.Item hidden={isFinishedOpen} >
          <Button type="dashed" onClick={() => {form.setFieldsValue({"finished": false }); setIsFinishedOpen(true);}} block icon={<PlusOutlined />}>
            Filter By Finished Status
          </Button>
        </Form.Item>
        <Form.Item
          initialValue={data.estimated}
          name="estimated"
          label="PBI estimated?"
          hidden={!isEstimatedOpen}
          valuePropName="checked"
        >  <Switch />
        </Form.Item>
        <Form.Item hidden={!isEstimatedOpen}>
          <Button type="primary" onClick={() =>{form.setFieldsValue({ "estimated": null }); setIsEstimatedOpen(false);}} block icon={<MinusCircleOutlined />}>
            Do Not Filter By Estimated Status
          </Button>
        </Form.Item>
        <Form.Item hidden={isEstimatedOpen}>
          <Button type="dashed" onClick={() => {form.setFieldsValue({ "estimated": false }); setIsEstimatedOpen(true);}} block icon={<PlusOutlined />}>
            Filter By Estimated Status
          </Button>
        </Form.Item>
        <Form.Item
          initialValue={data.inSprint}
          name="inSprint"
          label="PBI Is In Sprint?"
          hidden={!isSprintOpen}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item hidden={!isSprintOpen}>
          <Button type="primary" onClick={() => {form.setFieldsValue({ "isSprintOpen": null }); setIsSprintOpen(false);}} block icon={<MinusCircleOutlined />}>
            Do Not Filter By Sprint Status
          </Button>
        </Form.Item>
        <Form.Item hidden={isSprintOpen}>
          <Button type="dashed" onClick={() => {form.setFieldsValue({ "isSprintOpen": false }); setIsSprintOpen(true);}} block icon={<PlusOutlined />}>
            Filter By Sprint Status
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};