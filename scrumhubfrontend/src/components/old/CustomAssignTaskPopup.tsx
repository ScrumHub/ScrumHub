import React, { useState } from 'react';
import { Modal, Form, Space, Typography, Checkbox } from 'antd';
import { ICheckedAssignPBI } from '../../appstate/stateInterfaces';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import _ from 'lodash';
import Title from 'antd/lib/typography/Title';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  error: string;
  pbiData: ICheckedAssignPBI[];
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const CustomAssignTaskPopup: React.FC<CollectionCreateFormProps> = ({
  error,
  pbiData,
  visible,
  onCreate,
  onCancel,
}) => {
  pbiData = pbiData.filter((item) => item.id !== 0);
  const [form] = Form.useForm();
  const [temp, setTemp] = useState(pbiData);
  return (
    <Modal
      centered={true}
      closable={true}
      visible={visible}
      title="Assign Task To Backlog Item"
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
        <FormItemLabel
          labelAlign="left"
          label={<Title level={4}>{"Estimated Backlog Items"}</Title>} prefixCls="backlogItems" required={true} />
        <></>
        <Form.List name="backlogItems" initialValue={pbiData}>
          {(fields) => (
            <>
              {fields.map(({ key, name }) => (
                <Space key={key} style={{ display: 'flex', margin: 0 }} align="baseline">
                  <Checkbox checked={form.getFieldValue("backlogItems")[key].checked}
                    onClick={() => {
                      const temp2 = _.cloneDeep(temp);
                      temp2[key].checked = temp2[key].checked === null ? true : !temp2[key].checked;
                      form.setFieldsValue({ "backlogItems": temp2 });
                    }} />
                  <Form.Item
                    name={key}
                    key={key}
                  >
                    <Typography>{pbiData[key].name}</Typography>
                  </Form.Item>
                </Space>
              ))}
            </>
          )}
        </Form.List>

      </Form>
    </Modal>
  );
};