
import React, { useState } from 'react';
import { Modal, Form, Typography, Checkbox, Input, DatePicker } from 'antd';
import { IProductBacklogItem, ISprint } from '../../appstate/stateInterfaces';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import { disabledDate } from '../utility/commonFunctions';

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
        <FormItemLabel prefixCls="finishDate" label="Sprint Deadline" required={true} />
        <Form.Item
          initialValue={data.finishDate}
          name="finishDate"
          rules={[{ required: true, message: 'Please input the deadline of this sprint!' }]}
        >
          <DatePicker showToday={true} disabledDate={disabledDate} format={"YYYY-MM-DD"}
          />
        </Form.Item>
        <FormItemLabel prefixCls="title" label="Title" required={true} />
        <Form.Item
          initialValue={data.title}
          name="title"
          rules={[{ required: true, message: 'Please input the title of this sprint!' }]}
        >
          <Input required={true} autoComplete="on"
          />
        </Form.Item>
        <FormItemLabel prefixCls="goal" label="Goal" required={true} />
        <Form.Item
          initialValue={data.goal}
          name="goal"
          rules={[{ required: true, message: 'Please input the goal of this sprint!' }]}
        >
          <TextArea required={true}
            maxLength={105}
          />
        </Form.Item>

        {filteredData && filteredData.length>0 && <FormItemLabel prefixCls="backlogItems" label="Backlog Items" required={true} />}
        {filteredData && filteredData.length>0 && <Form.List name="backlogItems" initialValue={filteredData}>
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
        </Form.List>}

      </Form>
    </Modal>
  );
};