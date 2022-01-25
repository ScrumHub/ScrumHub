
import React from 'react';
import { Modal, Form, Typography, Progress, Timeline, Button, message, Popconfirm } from 'antd';
import { IBacklogItem } from '../../appstate/stateInterfaces';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { getDate, isArrayValid, validateString } from '../utility/commonFunctions';
import moment from 'moment';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ICompleteSprintCollectionCreateFormProps } from './popupInterfaces';

export const CompleteSprintPopup: React.FC<ICompleteSprintCollectionCreateFormProps> = ({
  data,
  visible,
  onComplete,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
    centered={true}
    visible={visible}
    closable={false}
      title="Complete Sprint"
      footer={[
        <Button key="CancelInCompletePopup" onClick={onCancel}>
          Cancel
        </Button>,
        <Popconfirm
        key="succInComplPopup"
        title="Are you sure you want to mark this sprint as successful?"
        onConfirm={()=>{onComplete(true)}}
        onCancel={(e) => { message.info("Sprint " +data.sprintNumber+ " was not marked") }}
        okText="Yes"
        cancelText="No"
        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      ><Button  type="primary"  key="FailedInCompletePopup">
          {"Mark As Failed"}</Button>
      </Popconfirm>,
              <Popconfirm
              key="failInComplPopup"
              title="Are you sure you want to mark this sprint as successful?"
              onConfirm={()=>{onComplete(false)}}
              onCancel={(e) => { message.info("Sprint " +data.sprintNumber+ " was not marked") }}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            ><Button  type="primary"  key="SuccesfulInCompletePopup">
                {"Mark As Successful"}</Button>
            </Popconfirm>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <FormItemLabel prefixCls="progress" label="Backlog Items Progress" required={true} />
        <Form.Item
          name="progress"
          key="progress"
          style={{ width: "87%" }}
        >  <>
            <Progress percent={isArrayValid(data.backlogItems) ? (100 * data.backlogItems.filter((item: IBacklogItem) => !item.estimated).length / data.backlogItems.length) : 100}
              format={percent => `${isArrayValid(data.backlogItems) ? data.backlogItems.filter((item: IBacklogItem) => !item.estimated).length : 0} Estimated`} ></Progress>
            <br />
            <Progress percent={isArrayValid(data.backlogItems) ? (100 * data.backlogItems.filter((item: IBacklogItem) => !item.finished).length / data.backlogItems.length) : 100}
              format={percent => `${isArrayValid(data.backlogItems) ? data.backlogItems.filter((item: IBacklogItem) => !item.finished).length : 0} To Do`} ></Progress>
            <Progress percent={isArrayValid(data.backlogItems) ? (100 * data.backlogItems.filter((item: IBacklogItem) => item.finished).length / data.backlogItems.length) : 100}
              format={percent => `${isArrayValid(data.backlogItems) ? data.backlogItems.filter((item: IBacklogItem) => item.finished).length : 0} Done`} ></Progress>
          </>
        </Form.Item>
        <FormItemLabel prefixCls="finishDate" label="Sprint Timeline" required={true} />
        <Form.Item
          initialValue={data.finishDate}
          name="finishDate"
          rules={[{ required: true, message: 'Please input the deadline of this sprint!' }]}
        >{moment().endOf('day') < moment(data.finishDate) ?
          <Timeline style={{marginTop:"2%", paddingBottom:0, height:50}}>
            <Timeline.Item  >{moment().endOf('day').format("YYYY/MM/DD").toString()+" "+
            (isArrayValid(data.backlogItems)?data.backlogItems.filter((pbi:IBacklogItem)=>!pbi.finished).length=== 0:true)? "All items finished":"Not all items are finished"}</Timeline.Item>
            <Timeline.Item color="green">{getDate(data.finishDate as string)+" "+validateString(data.title)+" Deadline"} </Timeline.Item>
          </Timeline>:
          <Timeline style={{marginTop:"2%",paddingBottom:0, height:50}}>
            <Timeline.Item color="red">{getDate(data.finishDate as string)+" "+validateString(data.title)+" Deadline"} </Timeline.Item>
          <Timeline.Item>{moment().endOf('day').format("YYYY/MM/DD").toString()+" "+
            (isArrayValid(data.backlogItems)?data.backlogItems.filter((pbi:IBacklogItem)=>!pbi.finished).length=== 0:true)? "All items finished":"Not all items are finished"}</Timeline.Item>
        </Timeline>
          }
        </Form.Item>
        <FormItemLabel prefixCls="title" label="Title" required={true} />
        <Form.Item
          initialValue={data.title}
          name="title"
          rules={[{ required: true, message: 'Please input the title of this sprint!' }]}
        >
          <Typography>{data.title}</Typography>
        </Form.Item>
        <FormItemLabel prefixCls="goal" label="Goal" required={true} />
        <Form.Item
          initialValue={data.goal}
          name="goal"
          rules={[{ required: true, message: 'Please input the goal of this sprint!' }]}
        >
          <Typography
          >{data.goal}</Typography>
        </Form.Item>
      </Form>
    </Modal>
  );
};