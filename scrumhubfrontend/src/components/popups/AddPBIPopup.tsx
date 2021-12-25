import React from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import { IAddPBI } from '../../appstate/stateInterfaces';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { backlogPriorities } from '../utility/BodyRowsAndColumns';
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
}

export const AddPBIPopup: React.FC<CollectionCreateFormProps> = ({
  data,
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      destroyOnClose={true}
      closable={true}
      visible={true}
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
        <FormItemLabel prefixCls="name" label="Name" required={true} />
        <Form.Item
          key="name"
          name="name"
          rules={[{ required: true, message: 'Please input the name of the new backlog item!' }]}
        >
          <Input />
        </Form.Item>
        <FormItemLabel prefixCls="priority" label="Priority" required={true} />
        <Form.Item
          key="priority"
          name="priority"
          rules={[{ required: true, message: 'Please input the priority of the new backlog item!' }]}
        >
          <Select defaultValue={""}>
            {backlogPriorities.map((item: string, key: number) => {
              return <Option key={key} value={key}  >{item}</Option>
            })}
          </Select>

        </Form.Item>
        <FormItemLabel prefixCls="acceptanceCriteria" label="Acceptance Criteria" required={true} />
        <Form.List name="acceptanceCriteria" initialValue={[""]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Form.Item {...formItemLayoutWithOutLabel} key={"key"+key} style={{ marginBottom: "4px" }}>
                  <Form.Item
                    noStyle
                    key={key}
                    name={key}
                    rules={[{ required: key < 1 ? true : false, whitespace: true, message: 'Please input at least one acceptance criteria!' }]}
                  >
                    <Input style={{ width: "95%" }} placeholder={`Input New Cirterion`} />
                  </Form.Item>
                  <MinusCircleOutlined style={{ width: "5%" }} className="dynamic-delete-button" onClick={() => remove(name)} />
                </Form.Item>
              ))}
              <Form.Item>
                <Button style={{ marginTop: "20px", float: "left" }} type="link" onClick={() => add()} block icon={<PlusCircleOutlined />}>
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