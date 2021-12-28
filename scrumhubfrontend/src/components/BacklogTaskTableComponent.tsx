import { Table } from "antd";
import { ITask } from "../appstate/stateInterfaces";
import { useIsMounted } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";

export default function TaskTableComponent(props: any) {
  return (<>
    {<Table
      size="small"
      showHeader={false}
      scroll={{ x: 800 }}
      //loading={loading}
      rowKey={(record: ITask) => record.id}
      columns={props.taskColumns}
      components={props.taskComponents}
      dataSource={props.item.tasks}
      pagination={false}
      onRow={(row, id) => {
        const index = row.id; 
        const record = { ...initRowIds, sprintNumber: props.item.sprintNumber, pbiID: row.pbiId ? row.pbiId : 0, taskID: row.id, } as IRowIds; 
        const bodyType = "ITask"; return ({
          index,
          record,
          bodyType
        }) as any;
      }}
    />}</>);
}