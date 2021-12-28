import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Slider, Progress, Skeleton, List, Spin } from 'antd';
import { IProductBacklogItem, ITask } from '../../appstate/stateInterfaces';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { MoreOutlined, NumberOutlined } from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
import "../BacklogTable.css";

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
  console.log(data);
  const [slicedData, setSlicedData] = useState([] as string[]);
  console.log(slicedData);
  useEffect(() => {
    if(slicedData.length < 1){
      setSlicedData(data.acceptanceCriteria.slice(0,2));
    }
    else{
      setSlicedData(data.acceptanceCriteria.slice(0,slicedData.length+2));
    }
  }, []);
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
        <FormItemLabel prefixCls="progress" label="Tasks Progress" required={true} />
        <Form.Item
          name="progress"
          key="progress"
        >  <div style={{width:"45vw", overflow:"hidden"}}>

            <Progress style={{width:"45vw"}} key={"progress_todo"} percent={data.tasks && data.tasks.length > 0 ? (100 * data.tasks.filter((item: ITask) => !item.finished).length / data.tasks.length) : 100}
              format={percent => `${data.tasks && data.tasks.length > 0 ? 100*data.tasks.filter((item: ITask) => !item.finished).length/data.tasks.length: 100}% To Do`} ></Progress>
            <Progress style={{width:"45vw"}} key={"progress_assgn"} percent={data.tasks && data.tasks.length > 0 ? (100 * data.tasks.filter((item: ITask) => item.assigness && item.assigness.length > 0).length / data.tasks.length) : 100}
              ></Progress>
            <Progress style={{width:"45vw"}} key={"progress_done"} percent={data.tasks && data.tasks.length > 0 ? (100 * data.tasks.filter((item: ITask) => item.finished).length / data.tasks.length) : 100}
               ></Progress>
          </div>
        </Form.Item>
        <FormItemLabel prefixCls="acceptanceCriteria" label="Acceptance Criteria" required={true} />
        <Form.Item name="acceptanceCriteria" key="acceptanceCriteria" initialValue={data.acceptanceCriteria}>
        <List>
      <VirtualList
        data={slicedData}
        height={70}
        itemHeight={42}
        itemKey="email"
        onScroll={(e: any )=>{if (e.target.scrollHeight-e.target.scrollTop > 0){setSlicedData(data.acceptanceCriteria.slice(0,slicedData.length+2))}}}
      >{(item, key) => (
                  <List.Item key={key}>
                    <List.Item.Meta
                      avatar={<span><NumberOutlined></NumberOutlined>{" "}{key}</span>}
                      title={item}
                    />
                  </List.Item>
                )}
            </VirtualList>
            </List>
        </Form.Item>
        <FormItemLabel prefixCls="fibonacci" label="Initial Fibonacci Story Points" required={true} />
        <Form.Item
          initialValue={data.expectedTimeInHours}
          name="fibonacci"
          key="fibonacci"
          style={{ width: "90%", display: "flex" }}
        >
          <Slider
            marks={marks}
            min={0}
            max={13}
            onChange={(e) => { setValue(e); form.setFieldsValue({ "expectedTimeInHours": e }) }}
            value={(typeof value) === 'number' ? value : 0}

          />
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