import React from 'react';
import { Modal, Form } from 'antd';
import { IAddPBICollectionCreateFormProps } from './popupInterfaces';
import { AddPBIForm } from './AddPBIForm';
import { onOkAddPBIPopup } from './popupUtilities';

/**
 * Returns Popup with a form for adding new {@linkcode IBacklogItem} backlogitem
 */
export function AddPBIPopup({
  visible, onCreate, onCancel
}:IAddPBICollectionCreateFormProps): JSX.Element {
  const [form] = Form.useForm();
  const [value, setValue] = React.useState(0);
  return (
    <Modal
      className='modalAdd'
      visible={visible}
      closable={false}
      title="Add Product Backlog Item"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={()=>{onOkAddPBIPopup(form, onCreate)}}
    >
      {AddPBIForm(form,value, setValue)}
    </Modal>
  );
}


