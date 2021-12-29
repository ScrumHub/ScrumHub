import React, { useState } from 'react';
import { Modal, Form, Checkbox, DatePicker, Input } from 'antd';
import { IProductBacklogItem, ISprint } from '../../appstate/stateInterfaces';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import { disabledDate } from '../utility/commonFunctions';

interface Values {
  goal: string;
  backlogItems: IProductBacklogItem[];
}

interface CollectionCreateFormProps {
  data: ISprint;
  pbiData: IProductBacklogItem[];
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const UpdateSprintPBIsPopup: React.FC<CollectionCreateFormProps> = ({
  data,
  pbiData,
  visible,
  onCreate,
  onCancel,
}) => {
  //TO DO
  //DELETE after backend is fixed
  const [form] = Form.useForm();
  const filteredData = pbiData.filter((item) => item.estimated !== false && item.id !== 0);
  const [temp, setTemp] = useState(filteredData);

  const id = data.sprintNumber !== null ? data.sprintNumber : localStorage.getItem("sprintID")?.toString() as unknown as number;
  return (
    <Modal
      centered={true}
      visible={visible}
      closable={false}
      title="Edit Sprint"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values: Values) => {
            form.resetFields();
            onCreate({ ...values, backlogItems: temp });
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
          <Input required={true}
          />
        </Form.Item>
        <FormItemLabel prefixCls="goal" label="Goal" required={true} />
        <Form.Item
          initialValue={data.goal}
          name="goal"
          labelAlign="left"
          rules={[{ required: true, message: 'Please input the goal of this sprint!' }]}
        >
          <TextArea
            maxLength={105}
          />
        </Form.Item>
        <FormItemLabel prefixCls="name" label="Backlog Items" required={true} />
        {filteredData && filteredData.length > 0 && <Form.List name="backlogItems" initialValue={filteredData}>
          {(fields) => (
            <>
              {fields.map(({ key, name }) => (
                <Form.Item key={key} name={key} style={{ marginBottom: "4px" }}>
                  <Checkbox key={key} checked={temp[key].sprintNumber === id}
                    onClick={() => {
                      const temp2 = _.cloneDeep(temp);
                      temp2[key].sprintNumber = (temp[key].sprintNumber !== id) ? id : -1;
                      form.setFieldsValue({ "backlogItems": temp2 });
                      setTemp(temp2);
                    }}>{filteredData[key].name + (filteredData[key].isInSprint ? " from Sprint " + filteredData[key].sprintNumber : "")}</Checkbox>
                </Form.Item >
              ))}
            </>
          )}
        </Form.List>}
      </Form>
    </Modal>
  );
};