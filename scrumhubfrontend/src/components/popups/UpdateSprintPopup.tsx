import React from 'react';
import { Modal, Form } from 'antd';
import { IProductBacklogItem, ISprint } from '../../appstate/stateInterfaces';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import TextArea from 'antd/lib/input/TextArea';

interface Values {
  goal: string;
  backlogItems: IProductBacklogItem[];
}

interface CollectionCreateFormProps {
  data: ISprint;
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const UpdateSprintPopup: React.FC<CollectionCreateFormProps> = ({
  data,
  visible,
  onCreate,
  onCancel,
}) => {
  //TO DO
  //DELETE after backend is fixed
  const [form] = Form.useForm();

  return (
    <Modal
      centered={true}
      closable={true}
      visible={visible}
      title="Edit Sprint"
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
        <FormItemLabel prefixCls="name" label="Goal" required={true} />
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
      </Form>
    </Modal>
  );
};