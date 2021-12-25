import React, { useState } from 'react';
import { Modal, Form, InputNumber, Slider, Progress, Skeleton, List } from 'antd';
import { IProductBacklogItem, ITask } from '../../appstate/stateInterfaces';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { NumberOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Values {
  expectedTimeInHours: number
}

interface CollectionCreateFormProps {
  data: IProductBacklogItem;
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const EstimatePBIPopup: React.FC<CollectionCreateFormProps> = ({
  data,
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [value, setValue] = useState(data.expectedTimeInHours);
  const marks = {
    0: 0,
    0.5: 0.5,
    1: 1,
    2: 2,
    3: 3,
    5: 5,
    8: 8,
    13: 13,
  };
  return (
    <Modal
      centered={true}
      closable={true}
      width={"50vw"}
      visible={visible}
      title="Estimate Backlog Item"
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
        <FormItemLabel prefixCls="fibonacci" label="Initial Fibonacci Story Points" required={true} />
        <Form.Item
          initialValue={data.expectedTimeInHours}
          name="fibonacci"
          key="fibonacci"
          style={{ width: "100%", display: "flex" }}
        >
          <Slider
            marks={marks}
            min={0}
            max={13}
            onChange={(e) => { setValue(e); form.setFieldsValue({ "expectedTimeInHours": e }) }}
            value={(typeof value) === 'number' ? value : 0}

          />
        </Form.Item>
        <FormItemLabel prefixCls="progress" label="Tasks Progress" required={true} />
        <Form.Item
          name="progress"
          key="progress"
          style={{ width: "92%"}}
        >  <>
        
        <Progress percent={data.tasks && data.tasks.length > 0 ? (100*data.tasks.filter((item: ITask) => !item.assigness || item.assigness.length <1).length / data.tasks.length) : 100}
              format={percent => `${data.tasks && data.tasks.length > 0 ? data.tasks.filter((item: ITask) => !item.assigness || item.assigness.length <1).length:0} Assigned`} ></Progress>
        <Progress percent={data.tasks && data.tasks.length > 0 ? (100*data.tasks.filter((item: ITask) => item.finished).length / data.tasks.length) : 100}
              format={percent => `${data.tasks && data.tasks.length > 0 ? data.tasks.filter((item: ITask) => item.finished).length:0} To Do`} ></Progress>            
            <Progress percent={data.tasks && data.tasks.length > 0 ? (100*data.tasks.filter((item: ITask) => !item.finished).length / data.tasks.length) : 100}
              format={percent => `${data.tasks && data.tasks.length > 0 ? data.tasks.filter((item: ITask) => !item.finished).length:0} Done`} ></Progress>
        </>,
      </Form.Item>
      <FormItemLabel prefixCls="acceptanceCriteria" label="Acceptance Criteria" required={true} />
        <Form.Item name="acceptanceCriteria" key="acceptanceCriteria" initialValue={data.acceptanceCriteria}>
            <InfiniteScroll
            next={()=>{}}
        dataLength={data.acceptanceCriteria.length}
        hasMore={false}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data.acceptanceCriteria}
          renderItem={(item, id) => (
            <List.Item key={id}>
              <List.Item.Meta
                avatar={<span><NumberOutlined></NumberOutlined>{" "}{id}</span>}
                title={item}
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
        </Form.Item>
      <FormItemLabel prefixCls="expectedTimeInHours" label="Estimate Story Points" required={true} />
      <Form.Item
        initialValue={data.expectedTimeInHours}
        name="expectedTimeInHours"
        key="expectedTimeInHours"
        style={{ width: "100%", display: "flex" }}
        rules={[{ required: true, message: 'Please input the story points estimation in hours of the new backlog item!' }]}
      >
        {/*<InputNumber type="number" min={0} />*/}
        <InputNumber
          min={0}
          max={999}
          type="number"
          value={value}
          onChange={(e) => { setValue(e); form.setFieldsValue({ "expectedTimeInHours": e }) }}
        />
      </Form.Item>


    </Form>
    </Modal >
  );
};