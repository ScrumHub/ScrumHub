import { Table } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IProductBacklogItem, ITask } from "../appstate/stateInterfaces";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";

export default function TaskTableComponent(props: any) {
return(
<DndProvider backend={HTML5Backend} key={"task"+props.item.id}>
        <Table
          size="small"
          showHeader={false}
          scroll={{ x: 800 }}
          rowKey={(record: ITask) => record.id}
          columns={props.taskColumns}
          components={props.taskComponents}
          dataSource={props.item.tasks}
          pagination={false}
          /*onRow={(record) => {
            return {
              onMouseEnter: () => {
                if (IDs.pbiId > 0 && IDs.oldSprintId !== item.sprintNumber) { setIDs({ ...IDs, newSprintId: item.sprintNumber, drop: true }) }
              },
            };
          }}*/
          onRow={(row, id) => {const index = row.id; const record = {sprintNumber:props.item.sprintNumber,pbiID: row.pbiId ? row.pbiId:0,taskID: row.id} as IRowIds;const bodyType="ITask"; return({
            index,
            record,
            bodyType
          }) as any;}}
        />
      </DndProvider>);
}