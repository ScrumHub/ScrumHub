import React from 'react';
import { Modal, Form, InputNumber } from 'antd';
import { IProductBacklogItem } from '../appstate/stateInterfaces';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  data: IProductBacklogItem;
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const CustomEstimatePopup: React.FC<CollectionCreateFormProps> = ({
  data,
visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
<<<<<<< HEAD
      title="Estimate Backlog Item"
=======
      title="Estimate PBI"
>>>>>>> 1fed599254bdb219c15c836716e38e42b8843ad9
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onCreate(values);
          })
          .catch(info => {
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
        initialValue={data.expectedTimeInHours}
          name="expectedTimeInHours"
<<<<<<< HEAD
          label="Estimated Story Points"
          rules={[{ required: true, message: 'Please input the story points estimation in hours of the new backlog item!' }]}
=======
          label="Estimated Hours"
          rules={[{ required: true, message: 'Please input the hour estimation of the new backlog item!' }]}
>>>>>>> 1fed599254bdb219c15c836716e38e42b8843ad9
        >
          <InputNumber type="number" min={0} />
        </Form.Item>
    
      </Form>
    </Modal>
  );
};