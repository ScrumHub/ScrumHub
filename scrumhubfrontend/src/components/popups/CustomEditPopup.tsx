import React from 'react';
import { Button, Modal, Form, Input, InputNumber, Space, Slider, Tag, Select, Popconfirm, message } from 'antd';
import { IAddPBI } from '../../appstate/stateInterfaces';
import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { backlogColors, backlogPriorities } from '../utility/BodyRowsAndColumns';
import { formItemLayoutWithOutLabel } from '../utility/commonInitValues';
const { Option } = Select;


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
  onDelete: () => void;
}

export const CustomEditPopup: React.FC<CollectionCreateFormProps> = ({
  data,
  visible,
  onCreate,
  onCancel,
  onDelete
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
    style={{marginTop:"-2vh"}}
      visible={visible}
      title="Edit Backlog Item"
      closable={true}
      destroyOnClose={true}
      footer={[
        <Popconfirm
          title="Are you sure you want to delete this backlog item?"
          onConfirm={onDelete}
          onCancel={(e)=>{message.info(data.name + " was not deleted")}}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
        ><Button key="1">
            {"Delete"}</Button>
        </Popconfirm>,
      <Button key="2" onClick={onCancel}>Cancel</Button>,
      <Button key="3" type="primary" onClick={() => {
        form
          .validateFields()
          .then((values: Values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info: any) => {
            console.error('Validate Failed:', info);
          });
      }}>
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
          initialValue={data.name}
          name="name"
          rules={[{ required: true, message: 'Please input the name of the new backlog item!' }]}
        >
          <Input />
        </Form.Item>
        <FormItemLabel prefixCls="priority" label="Priority" required={true} />
        <Form.Item
          initialValue={data.priority}
          name="priority"
          rules={[{ required: true, message: 'Please input the priority of the new backlog item!' }]}
        >
          <Select defaultValue={data.priority}>
            {backlogPriorities.map((item: string, key: number) => {
              return <Option key={key} value={key}  >{item}</Option>
            })}
          </Select>

        </Form.Item>
        <FormItemLabel prefixCls="acceptanceCriteria" label="Acceptance Criteria" required={true} />
        <Form.List name="acceptanceCriteria" initialValue={data.acceptanceCriteria}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Form.Item {...formItemLayoutWithOutLabel} style={{ marginBottom: "4px" }}>
                  <Form.Item
                    noStyle
                    name={key}
                    rules={[{ required: key < 1 ? true : false, whitespace: true, message: 'Please input at least one acceptance criteria!' }]}
                  >
                    <Input style={{ width: "95%" }} placeholder={`Input New Cirterion`} />
                  </Form.Item>
                  <MinusCircleOutlined style={{ width: "5%" }} className="dynamic-delete-button" onClick={() => remove(name)} />
                </Form.Item>
              ))}
              <Form.Item>
                <Button style={{ marginTop: "20px", float:"left"}} type="link" onClick={() => add()} block icon={<PlusCircleOutlined />}>
                  Add criterion
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

      </Form>
    </Modal>
  );
};