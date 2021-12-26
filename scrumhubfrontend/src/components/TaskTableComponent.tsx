import { Table } from "antd";
import { useEffect, useState } from "react";
import { IPerson, ITask } from "../appstate/stateInterfaces";
import { useIsMounted } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";

export default function TaskTableComponent(props: any) {
  const isMounted = useIsMounted();
 /* const [data, setData] = useState([] as ITask[]);
  const [loading, setLoading] = useState(false);
  //console.log(props.data);
  //console.log(props.peopleFilter);
  console.log(isMounted());
  useEffect(() => {
    if (isMounted() && !loading) {
      setLoading(true);
      console.log(props);
      console.log(props.item);
      setData(props.item && props.peopleFilter && props.peopleFilter.length > 0 ?
        props.item.tasks.filter((item: ITask) => {
           return(item.assigness.filter((person: IPerson) => {
              return(props.peopleFilter.includes(person.login))}).length >0) })
        : props.item.tasks);
        setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.peopleFilter, props.item]);*/
  return (<>
    {<Table
      size="small"
      style={{ marginTop: "0.25%", marginBottom: "0.25%" }}
      showHeader={false}
      scroll={{ x: 800 }}
      //loading={loading}
      rowKey={(record: ITask) => record.id}
      columns={props.taskColumns}
      components={props.taskComponents}
      dataSource={props.item.tasks}
      pagination={false}
      onRow={(row, id) => {
        const index = row.id; const record = { ...initRowIds, sprintNumber: props.item.sprintNumber, pbiID: row.pbiId ? row.pbiId : 0, taskID: row.id, } as IRowIds; const bodyType = "ITask"; return ({
          index,
          record,
          bodyType
        }) as any;
      }}
    />}</>);
}