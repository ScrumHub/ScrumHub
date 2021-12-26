import { Table } from "antd";
import { useEffect, useState } from "react";
import { IPerson, ITask } from "../appstate/stateInterfaces";
import { useIsMounted } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";

export default function TaskTableComponent(props: any) {
  const isMounted = useIsMounted();
  const [data, setData] = useState([] as ITask[]);
  console.log(data);
  useEffect(() => {
    if (!props.loading && isMounted()) {
      setData(props.data && props.data.length > 0 && props.peopleFilter && props.peopleFilter.length > 0 ? props.item.tasks.filter((item:ITask)=>{return(item.assigness.map((person:IPerson)=>{return(props.peopleFilter.includes(person.login))}).filter(x=>x!==false).length > 0)})
      :props.item.tasks);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loading, props.peopleFilter, props.data]);
return(<>
  {<Table
          size="small"
          style={{marginTop:"0.25%", marginBottom:"0.25%"}}
          showHeader={false}
          scroll={{ x: 800 }}
          rowKey={(record: ITask) => record.id}
          columns={props.taskColumns}
          components={props.taskComponents}
          dataSource={data}
          pagination={false}
          onRow={(row, id) => {const index = row.id; const record = {...initRowIds,sprintNumber:props.item.sprintNumber,pbiID: row.pbiId ? row.pbiId:0,taskID: row.id,} as IRowIds;const bodyType="ITask"; return({
            index,
            record,
            bodyType
          }) as any;}}
          />}</>);
}