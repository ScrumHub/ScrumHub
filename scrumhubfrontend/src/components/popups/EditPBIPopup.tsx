import React from 'react';
import { Button, Modal, Form, Input, Popconfirm, message, Radio, Tag } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { backlogColors, backlogPriorities, formItemLayoutWithOutLabel } from '../utility/commonInitValues';
import { IEditPBICollectionCreateFormProps } from './popupInterfaces';
import { onOkEditPBIPopup } from './popupUtilities';
/**
 * Returns Popup with a form for editing the given {@linkcode IBacklogItem} backlogitem
 */
export function EditPBIPopup({
  data, visible, onCreate, onCancel, onDelete, onFinish
}:IEditPBICollectionCreateFormProps): JSX.Element {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState({finish:false, save:false});
  if(!visible && (loading.finish || loading.save)){
   form.resetFields();
   setLoading({finish:false, save:false});
  }
  return (
    <Modal
      centered={true}
      title="Edit Backlog Item"
      visible={visible}
      destroyOnClose={true}
      closable={true}
      onCancel={onCancel}
      footer={[
        <Popconfirm
          key="delInEditPopup"
          title="Are you sure you want to delete this backlog item?"
          onConfirm={onDelete}
          onCancel={(e) => { message.info(data.name + " was not deleted"); } }
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        ><Button key="DeleteInEditPopup" id="DeleteInEditPopup" type="link">
            {"Delete"}</Button>
        </Popconfirm>,
        <Button key="CancelInEditPopup" onClick={onCancel}>Cancel</Button>,
        <Popconfirm
          key="finInEditPopup"
          title="Are you sure you want to finish this backlog item?"
          onConfirm={()=>
            {setLoading({...loading, finish:true});onFinish();}}
          onCancel={(e) => { message.info(data.name + " was not finished"); } }
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        ><Button loading={loading.finish} hidden={data.finished} type="primary" id="FinishInEditPopup" key="FinishInEditPopup">
            {"Finish"}</Button>
        </Popconfirm>,
        <Button loading={loading.save} id="SaveInEditPopup" key="SaveInEditPopup" type="primary" onClick={()=>
        {onOkEditPBIPopup(loading,setLoading,form, onCreate);}}>
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
          <Radio.Group value={data.priority} onChange={(e) => { form.setFieldsValue({ "priority": e.target.value }); } }>
            {backlogPriorities.map((item: string, key: number) => {
              return <Radio key={"key" + key} value={key}><Tag key={"tag" + key} color={backlogColors[key]}>{item}</Tag></Radio>;
            })}
          </Radio.Group>

        </Form.Item>
        <FormItemLabel prefixCls="acceptanceCriteria" label="Acceptance Criteria" required={true} />
        <Form.List name="acceptanceCriteria" initialValue={data.acceptanceCriteria}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Form.Item {...formItemLayoutWithOutLabel} key={"key" + key} style={{ marginBottom: "4px" }}>
                  <Form.Item
                    noStyle
                    key={"inner" + key}
                    name={name}
                    rules={[{ required: form.getFieldValue("acceptanceCriteria").length < 2 ? true : false, whitespace: true, message: 'Please input at least one acceptance criteria!' }]}
                  >
                    <Input key={"input" + key} style={{ width: "95%" }} placeholder={`Input New Cirterion`} />
                  </Form.Item>
                  <MinusCircleOutlined style={{ width: "5%", alignSelf: "flex-end" }} className="dynamic-delete-button" onClick={() => remove(name)} />
                </Form.Item>
              ))}
              <Form.Item key="add_criterion">
                <Button style={{ marginTop: "20px", width: "95%" }} type="dashed" onClick={() => add()} block icon={<PlusCircleOutlined />}>
                  Add criterion
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

      </Form>
    </Modal>
  );
}