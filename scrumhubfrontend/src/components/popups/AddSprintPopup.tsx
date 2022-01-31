
import React, { useState } from 'react';
import { Modal, Form, Typography, Checkbox, Input, DatePicker, Button } from 'antd';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import TextArea from 'antd/lib/input/TextArea';
import _, { isNull } from 'lodash';
import { IAddSprintCollectionCreateFormProps } from './popupInterfaces';
import { onOkAddSprintPopup } from './popupUtilities';
import { renderDateSprint } from '../utility/LoadAnimations';
import { IBacklogItem } from '../../appstate/stateInterfaces';
import { isArrayValid } from '../utility/commonFunctions';
/**
 * Returns Popup with a form for adding new {@linkcode ISprint} sprint
 */
export function AddSprintPopup({
  data, pbiData, sprintData, error, visible, onCreate, onCancel,
}:IAddSprintCollectionCreateFormProps): JSX.Element {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const filteredData = (isArrayValid(sprintData) ? sprintData.flatMap((sprintData) => sprintData.backlogItems):[] as IBacklogItem[])
  .concat(isArrayValid(pbiData)?pbiData:[]).filter((item:IBacklogItem) => item.estimated !== false && item.id !== 0).map((b:IBacklogItem)=>{return({...b,isInSprint:false});});
  const [temp, setTemp] = useState(filteredData);
  return (
    <Modal
      title="Create Sprint"
      visible={visible}
      destroyOnClose={true}
      closable={true}
      onCancel={onCancel}
      footer={[
        <Button key="CancelInAddSprintPopup" id="CancelInAddSprintPopup" onClick={onCancel}>
          Cancel
        </Button>,
        <Button loading={loading} type="primary" id="SaveInAddSprintPopup" key="SaveInAddSprintPopup"
        onClick={() => {setLoading(true);onOkAddSprintPopup(form, onCreate,temp); }}>
          Save
        </Button>
      ]}
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
          <DatePicker dateRender={renderDateSprint} showToday={true} format={"YYYY-MM-DD"} />
        </Form.Item>
        <FormItemLabel prefixCls="title" label="Title" required={true} />
        <Form.Item
          initialValue={data.title}
          name="title"
          rules={[{ required: true, message: 'Please input the title of this sprint!', whitespace: true }]}
        >
          <Input required={true} autoComplete="on" maxLength={60} />
        </Form.Item>
        <FormItemLabel prefixCls="goal" label="Goal" required={true} />
        <Form.Item
          initialValue={data.goal}
          name="goal"
          rules={[{ required: true, message: 'Please input the goal of this sprint!', whitespace: true }]}
        >
          <TextArea required={true}
            maxLength={200} />
        </Form.Item>
        {filteredData && isArrayValid(filteredData) && <FormItemLabel prefixCls="backlogItems" label="Backlog Items" required={true} />}
        {filteredData && isArrayValid(filteredData) && <Form.List name="backlogItems" initialValue={filteredData}>
          { (fields) => (
            <>
              {isArrayValid(fields) && fields.map(({ key, name }) => (
                <Form.Item key={key} name={key} style={{ marginBottom: "4px" }}>
                  <Checkbox checked={temp[key].isInSprint === true}
                    onClick={() => {
                      const temp2 = _.cloneDeep(temp);
                      temp2[key].isInSprint = !temp2[key].isInSprint;
                      setTemp(temp2);
                      form.setFieldsValue({ "backlogItems": temp2 });
                    } }>{filteredData[key].name + (!isNull(filteredData[key].sprintNumber) ? " from Sprint " + filteredData[key].sprintNumber : "")}</Checkbox>
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>}

      </Form>
    </Modal>
  );
}