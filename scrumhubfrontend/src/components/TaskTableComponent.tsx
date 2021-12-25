import { Table } from "antd";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IPerson, IProductBacklogItem, ITask } from "../appstate/stateInterfaces";
import { useIsMounted } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";

export default function TaskTableComponent(props: any) {
  const isMounted = useIsMounted();
  const [data, setData] = useState(props.item.tasks);
  const [updated, setUpdated] = useState(true);
  if (!isMounted()){console.warn("task table is unmounted")};
  //console.log(updated);
  console.log(props.peopleFilter);
  useEffect(() => {
    //console.log(isMounted()+"/"+initialRefresh);
    if ( isMounted() && props.peopleFilter.length > 0) {
        //console.log(props.item.tasks.filter((item:ITask)=>props.peopleFilter.includes(item.assigness.length>0?item.assigness[0].login:"")));
        setData(props.item.tasks.filter((item:ITask)=>{return(item.assigness.map((person:IPerson)=>{return(props.peopleFilter.includes(person.login))}).filter(x=>x!==false).length > 0)}));
        props.updateKeys(props.item.id);
        //setUpdated(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.peopleFilter]);
return(
<DndProvider backend={HTML5Backend} key={"task"+props.item.id}>
        <Table
          size="small"
          showHeader={false}
          scroll={{ x: 800 }}
          rowKey={(record: ITask) => record.id}
          columns={props.taskColumns}
          components={props.taskComponents}
          dataSource={data}
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