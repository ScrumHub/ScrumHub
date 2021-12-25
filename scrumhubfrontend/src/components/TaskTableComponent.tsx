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
  if (!isMounted()){console.warn("task table is unmounted")};
  useEffect(() => {
    if ( isMounted() && props.peopleFilter.length > 0) {
        //console.log(props.item.tasks.filter((item:ITask)=>props.peopleFilter.includes(item.assigness.length>0?item.assigness[0].login:"")));
        setData(props.item.tasks.filter((item:ITask)=>{return(item.assigness.map((person:IPerson)=>{return(props.peopleFilter.includes(person.login))}).filter(x=>x!==false).length > 0)}));
        //setUpdated(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.peopleFilter]);
return(
//<DndProvider backend={HTML5Backend} key={"task"+props.item.id}>
        <Table
          size="small"
          style={{marginTop:"0.25%", marginBottom:"0.25%"}}
          showHeader={false}
          scroll={{ x: 800 }}
          rowKey={(record: ITask) => record.id}
          columns={props.taskColumns}
          components={props.taskComponents}
          dataSource={data}
          pagination={false}
          onRow={(row, id) => {const index = row.id; const record = {sprintNumber:props.item.sprintNumber,pbiID: row.pbiId ? row.pbiId:0,taskID: row.id} as IRowIds;const bodyType="ITask"; return({
            index,
            record,
            bodyType
          }) as any;}}
        />);
     // </DndProvider>);
}