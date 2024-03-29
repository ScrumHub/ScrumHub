
import React from 'react';
import { Modal, Form, Typography, Progress, Timeline, Button, message, Popconfirm } from 'antd';
import { IBacklogItem } from '../../appstate/stateInterfaces';
import FormItemLabel from 'antd/lib/form/FormItemLabel';
import { ellipsisForString, getDate, isArrayValid } from '../utility/commonFunctions';
import moment from 'moment';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ICompleteSprintCollectionCreateFormProps } from './popupInterfaces';
/**
 * Returns Popup with a form for marking {@linkcode ISprint} sprint as complete
 */
export function CompleteSprintPopup({
  data, visible, onComplete, onCancel,
}:ICompleteSprintCollectionCreateFormProps): JSX.Element {
  const [form] = Form.useForm();
  const [loadingF, setLoadingF] = React.useState(false);
  const [loadingS, setLoadingS] = React.useState(false);
  return (
    <Modal
      centered={true}
      visible={visible}
      destroyOnClose={true}
      closable={true}
      onCancel={onCancel}
      title={data.isCompleted ? "Sprint Details" : "Complete Sprint"}
      footer={data.isCompleted ? [] : [
        <Button key="CancelInCompletePopup" onClick={onCancel}>
          Cancel
        </Button>,
        <Popconfirm
          key="succInComplPopup"
          title={() => <><div>{`There are ${isArrayValid(data.backlogItems) ? data.backlogItems.filter((item: IBacklogItem) => !item.finished).length : 0} unfinished backlog items in this sprint.`}</div>
            <div>Are you sure you want to mark this sprint as failed?</div></>}
          onConfirm={() => { setLoadingF(true); onComplete(true); } }
          onCancel={(e) => { message.info("Sprint " + data.sprintNumber + " was not marked"); } }
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        ><Button loading={loadingF} type="primary" disabled={!data.status.includes("Not")} id="FailedInCompletePopup" key="FailedInCompletePopup">
            {"Mark As Failed"}</Button>
        </Popconfirm>,
        <Popconfirm
          key="failInComplPopup"
          title={() => <><div>{`There are ${isArrayValid(data.backlogItems) ? data.backlogItems.filter((item: IBacklogItem) => !item.finished).length : 0} unfinished backlog items in this sprint.`}</div>
            <div>Are you sure you want to mark this sprint as successful?</div></>}
          onConfirm={() => {setLoadingS(true); onComplete(false); } }
          onCancel={(e) => { message.info("Sprint " + data.sprintNumber + " was not marked"); } }
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        ><Button loading={loadingS} disabled={!data.status.includes("Not")} type="primary" id="SuccesfulInCompletePopup" key="SuccesfulInCompletePopup">
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
              format={percent => `${isArrayValid(data.backlogItems) ? data.backlogItems.filter((item: IBacklogItem) => !item.estimated).length : 0} Estimated`}></Progress>
            <br />
            <Progress percent={isArrayValid(data.backlogItems) ? (100 * data.backlogItems.filter((item: IBacklogItem) => !item.finished).length / data.backlogItems.length) : 100}
              format={percent => `${isArrayValid(data.backlogItems) ? data.backlogItems.filter((item: IBacklogItem) => !item.finished).length : 0} To Do`}></Progress>
            <Progress percent={isArrayValid(data.backlogItems) ? (100 * data.backlogItems.filter((item: IBacklogItem) => item.finished).length / data.backlogItems.length) : 100}
              format={percent => `${isArrayValid(data.backlogItems) ? data.backlogItems.filter((item: IBacklogItem) => item.finished).length : 0} Done`}></Progress>
          </>
        </Form.Item>
        <FormItemLabel prefixCls="finishDate" label="Sprint Timeline" required={true} />
        <Form.Item
          initialValue={data.finishDate}
          name="finishDate"
          rules={[{ required: true, message: 'Please input the deadline of this sprint!' }]}
        >{moment().endOf('day') < moment(data.finishDate) ?
          <Timeline style={{ marginTop: "2%", paddingBottom: 0, height: 50 }}>
            <Timeline.Item>{moment().endOf('day').format("YYYY/MM/DD").toString() + " " +
              ((isArrayValid(data.backlogItems) ? data.backlogItems.filter((pbi: IBacklogItem) => !pbi.finished).length === 0 : true) ? "All items finished" : "Not all items are finished")}</Timeline.Item>
            <Timeline.Item style={{textOverflow:"ellipsis"}} color="green">{getDate(data.finishDate as string) + " \"" + ellipsisForString(data.title) + "\" Deadline"} </Timeline.Item>
          </Timeline> :
          <Timeline style={{ marginTop: "2%", paddingBottom: 0, height: 50 }}>
            <Timeline.Item style={{textOverflow:"ellipsis"}} color="red">{getDate(data.finishDate as string) + " \"" + ellipsisForString(data.title) + "\" Deadline"} </Timeline.Item>
            <Timeline.Item>{moment().endOf('day').format("YYYY/MM/DD").toString() + " " +
              ((isArrayValid(data.backlogItems) ? data.backlogItems.filter((pbi: IBacklogItem) => !pbi.finished).length === 0 : true) ? "All items finished" : "Not all items are finished") + (data.isCompleted ? (", Sprint marked as " + data.status.toLowerCase()) : "")}</Timeline.Item>
          </Timeline>}
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
}