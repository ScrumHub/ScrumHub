import React, { useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Space, Typography, Checkbox, PageHeader } from 'antd';
import { IAddPBI, IProductBacklogItem, IProductBacklogList, ISprint, ISprintList, IUpdateSprint, State } from '../../appstate/stateInterfaces';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import { Header } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import { useSelector } from 'react-redux';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  data: ISprint;
  pbiData:IProductBacklogItem[];
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const CustomAddSprintPopup: React.FC<CollectionCreateFormProps> = ({
  data,
  pbiData,
  visible,
  onCreate,
  onCancel,
}) => {
  //TO DO
  //DELETE after backend is fixed

  pbiData = pbiData.filter((item)=>item.estimated !== false);
  const [form] = Form.useForm();
  const [temp, setTemp] = useState(pbiData);
  const id = Number(localStorage.getItem("sprintID"));
  return (
    <Modal
      visible={visible}
      title="Add Sprint"
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

<Form.Item
          initialValue={data.sprintNumber}
          name="sprintNumber"
          labelAlign="left"
          label={<Title style={{marginTop:"10%"}} level={4}>{"Sprint Number"}</Title>}
          rules={[{ required: true, message: 'Please input the number of this sprint!' }]}
        >
          <InputNumber onChange={()=>{}}/>
        </Form.Item>
        <Form.Item
          initialValue={data.goal}
          name="goal"
          labelAlign="left"
          label={<Title style={{marginTop:"10%"}} level={4}>{"Goal"}</Title>}
          rules={[{ required: true, message: 'Please input the goal of this sprint!' }]}
        >
          <TextArea
            maxLength={105}
          />
        </Form.Item>

        <FormItemLabel
        labelAlign="left"
        label={<Title style={{marginTop:"10%"}} level={4}>{"Backlog Items"}</Title>} prefixCls="backlogItems" required={true} />
        <></>
        <Form.List name="backlogItems" initialValue={pbiData}>
          {(fields) => (
            <>
              {fields.map(({ key, name }) => (
                <Space key={key} style={{ display: 'flex', margin:0}} align="baseline">
                  <Checkbox checked={form.getFieldValue("backlogItems")[key].sprintNumber != null}
                    onClick={() => {
                      const temp2 = _.cloneDeep(temp);
                      temp2[key].sprintNumber = (temp2[key].sprintNumber === id) ? null : id;
                      setTemp(temp2);
                      form.setFieldsValue({ "backlogItems": temp2 });
                    }} />
                  <Form.Item
                    name={key}
                  >
                    <Typography>{pbiData[key].name +(pbiData[key].isInSprint?" from Sprint "+ pbiData[key].sprintNumber:"")}</Typography>
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
