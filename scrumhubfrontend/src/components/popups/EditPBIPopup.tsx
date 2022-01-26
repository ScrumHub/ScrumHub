import React from 'react';
import { Button, Modal, Form, Input, Popconfirm, message, Radio, Tag } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { backlogColors, backlogPriorities } from '../utility/BodyRowsAndColumns';
import { formItemLayoutWithOutLabel } from '../utility/commonInitValues';
import { IEditPBICollectionCreateFormProps } from './popupInterfaces';
import { IAddBI } from '../../appstate/stateInterfaces';

export const EditPBIPopup: React.FC<IEditPBICollectionCreateFormProps> = ({
  data,
  visible,
  onCreate,
  onCancel,
  onDelete,
  onFinish
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      centered={true}
      title="Edit Backlog Item"
      visible={visible}
      closable={true}
      onCancel={onCancel}
      footer={[
        <Popconfirm
          key="delInEditPopup"
          title="Are you sure you want to delete this backlog item?"
          onConfirm={onDelete}
          onCancel={(e) => { message.info(data.name + " was not deleted") }}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        ><Button key="DeleteInEditPopup" type="link">
            {"Delete"}</Button>
        </Popconfirm>,
        <Button key="CancelInEditPopup" onClick={onCancel}>Cancel</Button>,
        <Popconfirm
        key="finInEditPopup"
          title="Are you sure you want to finish this backlog item?"
          onConfirm={onFinish}
          onCancel={(e) => { message.info(data.name + " was not finished") }}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        ><Button hidden={data.finished} type="primary" key="FinishInEditPopup">
            {"Finish"}</Button>
        </Popconfirm>,
        <Button key="SaveInEditPopup" type="primary" onClick={() => {
          form
            .validateFields()
            .then((values: IAddBI) => {
              form.resetFields();
              onCreate(values as IAddBI);
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
          rules={[{ required: true, message: 'Please input the name of the new backlog item!', whitespace: true }]}
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
                <Form.Item {...formItemLayoutWithOutLabel} key={"key"+key} style={{ marginBottom: "4px" }}>
                  <Form.Item
                    noStyle
                    key={"inner"+key}
                    name={name}
                    rules={[{ required: form.getFieldValue("acceptanceCriteria").length < 2  ? true : false, whitespace: true, message: 'Please input at least one acceptance criteria!' }]}
                  >
                    <Input key={"input"+key} style={{ width: "95%" }} placeholder={`Input New Cirterion`} />
                  </Form.Item>
                  <MinusCircleOutlined style={{ width: "5%", alignSelf:"flex-end"}} className="dynamic-delete-button" onClick={() => remove(name)} />
                </Form.Item>
              ))}
              <Form.Item key="add_criterion">
              <Button style={{ marginTop: "20px",width: "95%"  }} type="dashed" onClick={() => add()} block icon={<PlusCircleOutlined />}>
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