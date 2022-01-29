import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Slider, Progress, List } from 'antd';
import { IFilters, ITask } from '../../appstate/stateInterfaces';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { NumberOutlined } from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
import "../ProductBacklog.css";
import { IEstimatePBICollectionCreateFormProps } from './popupInterfaces';
import { isArrayValid, isItemDefined } from '../utility/commonFunctions';
/**
 * Returns Popup with a form for estimating the given {@linkcode IBacklogItem} backlogitem
 */
export function EstimatePBIPopup({
  data, visible, onCreate, onCancel,
}:IEstimatePBICollectionCreateFormProps): JSX.Element {
  const [form] = Form.useForm();
  const [slicedData, setSlicedData] = useState([] as IFilters[]);
  useEffect(() => {
    if (slicedData.length < 1) {
      setSlicedData(isItemDefined(data) && isArrayValid(data.acceptanceCriteria) ? data.acceptanceCriteria.slice(0, 2).map((data, key) => { return { "key": key, "acceptanceCriteria": data }; }) : []);
    }
    else {
      setSlicedData(isItemDefined(data) && isArrayValid(data.acceptanceCriteria) ? data.acceptanceCriteria.slice(0, slicedData.length + 2).map((data, key) => { return { "key": key, "acceptanceCriteria": data }; }) : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [value, setValue] = useState(data.expectedTimeInHours);
  const marks = { 0: 0, 1: 1, 2: 2, 3: 3, 5: 5, 8: 8, 13: 13, 20: 20 };
  return (
    <Modal
      centered={true}
      visible={visible}
      closable={false}
      width={"50vw"}
      title="Estimate Backlog Item"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values: { expectedTimeInHours: number; }) => {
            form.resetFields();
            onCreate({ expectedTimeInHours: value });
          })
          .catch((info: any) => {
            console.error('Validate Failed:', info);
          });
      } }
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
          style={{ width: "87%" }}
        >  <>
            <Progress percent={data.tasks && data.tasks.length > 0 ? (100 * data.tasks.filter((item: ITask) => !item.assigness || item.assigness.length < 1).length / data.tasks.length) : 100}
              format={percent => `${data.tasks && data.tasks.length > 0 ? data.tasks.filter((item: ITask) => !item.assigness || item.assigness.length < 1).length : 0} Assigned`}></Progress>
            <br />
            <Progress percent={data.tasks && data.tasks.length > 0 ? (100 * data.tasks.filter((item: ITask) => item.finished).length / data.tasks.length) : 100}
              format={percent => `${data.tasks && data.tasks.length > 0 ? data.tasks.filter((item: ITask) => item.finished).length : 0} To Do`}></Progress>
            <Progress percent={data.tasks && data.tasks.length > 0 ? (100 * data.tasks.filter((item: ITask) => !item.finished).length / data.tasks.length) : 100}
              format={percent => `${data.tasks && data.tasks.length > 0 ? data.tasks.filter((item: ITask) => !item.finished).length : 0} Done`}></Progress>
          </>
        </Form.Item>
        <FormItemLabel prefixCls="acceptanceCriteria" label="Acceptance Criteria" required={true} />
        <Form.Item key="acceptanceCriteria" initialValue={data.acceptanceCriteria}>
          <List>
            <VirtualList
              data={slicedData}
              key="virtual_list"
              height={80}
              itemHeight={42}
              itemKey="acceptanceCriteria"
              onScroll={(e: any) => { if (e.target.scrollHeight - e.target.scrollTop > 0) { setSlicedData(data.acceptanceCriteria.slice(0, slicedData.length + 2).map((data, key) => { return { "key": key, "acceptanceCriteria": data }; })); } } }
            >{item => (
              <List.Item key={item.key}>
                <List.Item.Meta
                  avatar={<span><NumberOutlined></NumberOutlined>{" "}{item.key + 1}</span>}
                  title={item.acceptanceCriteria} />
              </List.Item>
            )}
            </VirtualList>
          </List>
        </Form.Item>
        <FormItemLabel prefixCls="fibonacci" label="Fibonacci Story Points Values" required={true} />
        <Form.Item
          initialValue={data.expectedTimeInHours}
          name="fibonacci"
          key="fibonacci"
          style={{ width: "80%", display: "flex" }}
        >
          <Slider
            marks={marks}
            min={0}
            max={20}
            onChange={(e) => { setValue(e); form.setFieldsValue({ "expectedTimeInHours": e }); } }
            value={(typeof value) === 'number' ? value : 0} />
        </Form.Item>
        <FormItemLabel prefixCls="expectedTimeInHours" label="Estimate Story Points" required={true} />
        <Form.Item
          initialValue={data.expectedTimeInHours}
          name="expectedTimeInHours"
          key="expectedTimeInHours"
          style={{ width: "100%", display: "flex" }}
          rules={[{ required: true, message: 'Please input the story points estimation in hours of the new backlog item!' }]}
        >
          <InputNumber
            min={0}
            max={999}
            type="number"
            value={value}
            onChange={(e) => { setValue(e); form.setFieldsValue({ "expectedTimeInHours": e }); } } />
        </Form.Item>
      </Form>
    </Modal>
  );
}