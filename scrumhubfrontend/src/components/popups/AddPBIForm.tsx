import React from 'react';
import { Button, Modal, Form, Input, Radio, Tag, FormInstance } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { IAddPBICollectionCreateFormProps } from './popupInterfaces';
import { IAddBI } from '../../appstate/stateInterfaces';
import { backlogPriorities, backlogColors, formItemLayoutWithOutLabel } from '../utility/commonInitValues';

/**
 * Returns Form for adding new {@linkcode IBacklogItem} backlogitem
 */
export function AddPBIForm(form:FormInstance<any>,value:number, setValue:React.Dispatch<React.SetStateAction<number>>){ 
  return(
       <Form
        form={form}
        id="Addform"
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <FormItemLabel prefixCls="name" label="Name" required={true} />
        <Form.Item
          key="name"
          name="name"
          required tooltip="This is a required field!"
          rules={[{ required: true, message: 'Please input the name of the new backlog item!', whitespace: true }]}
        >
          <Input minLength={1} placeholder='Product Backlog Name' />
        </Form.Item>
        <FormItemLabel prefixCls="priority" label="Priority" required={true} />
        <Form.Item
          key="priority"
          name="priority"
          rules={[{ required: true, message: 'Please input the priority of the new backlog item!' }]}
        >
          <Radio.Group value={value} onChange={(e) => { setValue(e.target.value); form.setFieldsValue({ "priority": e.target.value }); } }>
            {backlogPriorities.map((item: string, key: number) => {
              return <Radio key={"key" + key} value={key}><Tag key={"tag" + key} color={backlogColors[key]}>{item}</Tag></Radio>;
            })}
          </Radio.Group>
        </Form.Item>
        <FormItemLabel prefixCls="acceptanceCriteria" label="Acceptance Criteria" required={true} />
        <Form.List name="acceptanceCriteria" initialValue={[""]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Form.Item {...formItemLayoutWithOutLabel} key={"key" + key} style={{ marginBottom: "4px" }}>
                  <Form.Item
                    noStyle
                    key={key}
                    name={name}
                    rules={[{ required: form.getFieldValue("acceptanceCriteria").length < 2 ? true : false, whitespace: true, message: 'Please input at least one acceptance criteria!' }]}
                  >
                    <Input style={{ width: "95%" }} placeholder={`New Cirterion`} />
                  </Form.Item>
                  <MinusCircleOutlined style={{ width: "5%", alignSelf: "flex-end" }} className="dynamic-delete-button" onClick={() => remove(name)} />
                </Form.Item>
              ))}
              <Form.Item>
                <Button style={{ marginTop: "20px", width: "95%" }} type="dashed" onClick={() => add()} block icon={<PlusCircleOutlined />}>
                  Add criterion
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
  );
}