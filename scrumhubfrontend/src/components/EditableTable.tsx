import React, { useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Checkbox } from 'antd';
import { initProductBacklogItem, IProductBacklogItem } from '../appstate/stateInterfaces';
import TextArea from 'rc-textarea';


//const originData: IProductBacklogItem[] = [];
/*for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}*/
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'texts';
  record: IProductBacklogItem;
  index: number;
  children: React.ReactNode;
}
/*(record:IProductBacklogItem) => <div style={{verticalAlign:"center", alignItems:"center",textAlign:"center"}}>{
    record.acceptanceCriteria.map((value: string) => { console.log(record);return (<Input value={value}/>) })
  }</div>
  */
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
    /*<><Input value={record.acceptanceCriteria[0]}/>
  <Input placeholder={record.acceptanceCriteria[1]}/>
  {(record:IProductBacklogItem) => {
    console.log(record);
    record.acceptanceCriteria.map((value: string, i:number) => { return (<Input key={i}/>) })
  ;}}</> as JSX.Element
  */
  const inputNode = inputType === "text" ? <Input width="auto"/> : 
  ((inputType === "texts")?
  <TextArea value={record.acceptanceCriteria} rows={record.acceptanceCriteria.length*2}/>
  :<InputNumber />);
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const EditableTable = (props:any) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(props.pbis ? props.pbis : [initProductBacklogItem]);
  const [editingKey, setEditingKey] = useState('');
  
  const isEditing = (record: IProductBacklogItem) => record.id.toString() === editingKey;

  const edit = (record: IProductBacklogItem) => {
    form.setFieldsValue({ key: '', age: '', address: '', ...record });
    if(record && record.id){
    setEditingKey(record.id.toString());
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      
    console.log(form.getFieldsValue());
    //data.map((item:IProductBacklogItem)=>{item.acceptanceCriteria = (item.acceptanceCriteria as string).split(",")});
    const row = (await form.validateFields()) as IProductBacklogItem;
      const newData = [...data];
      console.log(newData);
      const index = newData.findIndex(item => key === item.id);
      console.log(index);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log(newData);
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
      {
        key: "1",
        title: 'Name',
        dataIndex: 'name',
        align: 'center' as const,
        render: (text: string) => <a>{text}</a>,
        editable: true,
        fixed: 'left' as const,
      },
      {
        key: "2",
        title: 'Expected Time',
        dataIndex: 'expectedTimeInHours',
        align: 'center' as const,
        editEstimate: true
        //sortDirections: ['descend', 'ascend'],
      },
      {
        key: "3",
        title: 'Sprint',
        dataIndex: 'sprintNumber',
        align: 'center' as const,
      },
      {
        key: "4",
        title: 'Real Time',
        dataIndex: 'realTime',
        align: 'center' as const,
      },
      {
        key: "5",
        title: 'Priority',
        dataIndex: 'priority',
        align: 'center' as const,
        editable: true
      },
      {
        key: "6",
        colSpan:2,
        title: 'Acceptance Criteria',
        dataIndex: 'acceptanceCriteria',
        align: 'center' as const,
        render: (record:string[]) => {
            return({children:<div style={{verticalAlign:"center", alignItems:"center",textAlign:"center"}}>{
          Array.from(record).map((value: string) => { return (<p style={{margin:"auto", marginTop:"5%", marginBottom:"5%"}}>{value}</p>) })
        }
        </div>,
        props:{colspan:2}})},
        editable: true
      },
      {
        key: "7",
        title: 'Finished',
        dataIndex: 'finished',
        render: (finishValue: boolean) => <Checkbox checked={finishValue}></Checkbox>,
        align: 'center' as const,
        editFinish: true,
      },
    {
      title: 'operation',
      key:"8",
      fixed: 'right' as const,
      dataIndex: 'operation',
      render: (_: any, record: IProductBacklogItem) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IProductBacklogItem) => ({
        record,
        inputType: col.dataIndex === 'name' ? 'text' : (col.dataIndex === 'acceptanceCriteria'?'texts':'number'),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
      scroll={{ x: 800}}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};