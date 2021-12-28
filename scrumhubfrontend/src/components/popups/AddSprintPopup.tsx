
import React, { useState } from 'react';
import { Modal, Form, InputNumber, Typography, Checkbox } from 'antd';
import { IProductBacklogItem, ISprint } from '../../appstate/stateInterfaces';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';

interface CollectionCreateFormProps {
  data: ISprint;
  error: string;
  pbiData: IProductBacklogItem[];
  visible: boolean;
  onCreate: (values: ISprint) => void;
  onCancel: () => void;
}

export const AddSprintPopup: React.FC<CollectionCreateFormProps> = ({
  data,
  error,
  pbiData,
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const filteredData = pbiData.filter((item) => item.estimated !== false && item.id !== 0);
  const [temp, setTemp] = useState(filteredData);
  return (
    <Modal
      closable={true}
      visible={true}
      centered={true}
      title="Create Sprint"
      okText="Save"
      cancelText="Cancel"
      destroyOnClose={true}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values: ISprint) => {
            form.resetFields();
            onCreate({...values,backlogItems:temp});
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
        <Typography style={{ color: "red" }}>{error}</Typography>
        <FormItemLabel prefixCls="goal" label="Goal" required={true} />
        <Form.Item
          initialValue={data.goal}
          name="goal"
          required={true}
          rules={[{ required: true, message: 'Please input the goal of this sprint!' }]}
        >
          <TextArea
            maxLength={105}
          />
        </Form.Item>

        <FormItemLabel prefixCls="backlogItems" label="Backlog Items" required={true} />
        <Form.List name="backlogItems" initialValue={filteredData}>
          {(fields) => (
            <>
              {fields.map(({ key, name }) => (
                  <Form.Item key={key} name={key} style={{ marginBottom: "4px" }}>
                    <Checkbox checked={temp[key].isInSprint === true}
                      onClick={() => {
                        const temp2 = _.cloneDeep(temp);
                        temp2[key].isInSprint = !temp2[key].isInSprint;
                        setTemp(temp2);
                        form.setFieldsValue({ "backlogItems": temp2 });
                      }}>{filteredData[key].name + (filteredData[key].isInSprint ? " from Sprint " + filteredData[key].sprintNumber : "")}</Checkbox>
                  </Form.Item>
              ))}
            </>
          )}
        </Form.List>

      </Form>
    </Modal>
  );
};