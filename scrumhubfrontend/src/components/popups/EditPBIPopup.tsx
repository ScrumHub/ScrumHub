import React from 'react';
import { Button, Modal, Form, Input, Select, Popconfirm, message, Radio, Tag } from 'antd';
import { IAddPBI } from '../../appstate/stateInterfaces';
import { MinusCircleOutlined, PlusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
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

export const EditPBIPopup: React.FC<CollectionCreateFormProps> = ({
  data,
  visible,
  onCreate,
  onCancel,
  onDelete
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      centered={true}
      visible={visible}
      title="Edit Backlog Item"
      closable={true}
      destroyOnClose={true}
      footer={[
        <Popconfirm
          title="Are you sure you want to delete this backlog item?"
          onConfirm={onDelete}
          onCancel={(e) => { message.info(data.name + " was not deleted") }}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
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
          key="name"
          rules={[{ required: true, message: 'Please input the name of the new backlog item!' }]}
        >
          <Input />
        </Form.Item>
        <FormItemLabel prefixCls="priority" label="Priority" required={true} />
        <Form.Item
          initialValue={data.priority}
          name="priority"
          key="priority"
          rules={[{ required: true, message: 'Please input the priority of the new backlog item!' }]}
        >
          <Radio.Group value={data.priority} onChange={(e)=>{ form.setFieldsValue({"priority":e.target.value});}}>
          {backlogPriorities.map((item: string, key: number) => {
              return <Radio  key={"key"+key} value={key}><Tag key={"tag"+key} color={backlogColors[key]}>{item}</Tag></Radio>
            })}
            </Radio.Group>

        </Form.Item>
        <FormItemLabel prefixCls="acceptanceCriteria" label="Acceptance Criteria" required={true} />
        <Form.List name="acceptanceCriteria" initialValue={data.acceptanceCriteria}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Form.Item {...formItemLayoutWithOutLabel} style={{ marginBottom: "4px" }}>
                  <Form.Item
                    noStyle
                    key={key}
                    name={key}
                    rules={[{ required: form.getFieldValue("acceptanceCriteria").length < 2  ? true : false, whitespace: true, message: 'Please input at least one acceptance criteria!' }]}
                  >
                    <Input style={{ width: "95%" }} placeholder={`Input New Cirterion`} />
                  </Form.Item>
                  <MinusCircleOutlined style={{ width: "5%" }} className="dynamic-delete-button" onClick={() => remove(name)} />
                </Form.Item>
              ))}
              <Form.Item>
              <Button style={{ marginTop: "20px", float: "left", }} type="dashed" onClick={() => add()} block icon={<PlusCircleOutlined />}>
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