import React from 'react';
import { Modal, Form, Button } from 'antd';
import { IAddPBICollectionCreateFormProps } from './popupInterfaces';
import { AddPBIForm } from './AddPBIForm';
import { onOkAddPBIPopup } from './popupUtilities';

/**
 * Returns Popup with a form for adding new {@linkcode IBacklogItem} backlogitem
 */
export function AddPBIPopup({
  visible, onCreate, onCancel
}: IAddPBICollectionCreateFormProps): JSX.Element {
  const [form] = Form.useForm();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  return (
    <Modal
      title="Add Product Backlog Item"
      visible={visible}
      destroyOnClose={true}
      closable={true}
      onCancel={onCancel}
      footer={[
        <Button key="CancelInAddPBIPopup" id="CancelInAddPBIPopup" onClick={onCancel}>
          Cancel
        </Button>,
        <Button loading={loading} type="primary" id="SaveInAddPBIPopup" key="SaveInAddPBIPopup"
          onClick={() => { onOkAddPBIPopup(setLoading,form, onCreate); }}>
          Save
        </Button>
      ]}
    >
      {AddPBIForm(form, value, setValue)}
    </Modal>
  );
}


