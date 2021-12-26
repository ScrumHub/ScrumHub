import { Table } from "antd";
import { useState, useEffect } from "react";
import { IPerson, IProductBacklogItem, ITask } from "../appstate/stateInterfaces";
import { useIsMounted } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";

export default function PBITableComponent(props: any) {
  const isMounted = useIsMounted();
  if (!isMounted()) { console.error("pbi" + isMounted()) };
  const [data, setData] = useState([] as IProductBacklogItem[]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isMounted() && !loading) {
      setLoading(true);
      setData(props.item && props.item.backlogItems && props.item.backlogItems.length > 0 && props.peopleFilter && props.peopleFilter.length > 0 ?
        props.item.backlogItems.map((pbi: IProductBacklogItem) => {
          if (pbi && pbi.tasks) {
            const tasks = pbi.tasks.filter((task: ITask) => {
              return (task.assigness.filter((person: IPerson) => {
                return (props.peopleFilter.includes(person.login))
              }).length > 0)
            });
            return { ...pbi, tasks: tasks };
          }
          return(pbi);
        })
        : props.item.backlogItems);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.peopleFilter, props.item]);
  return (
    <Table
      style={{ borderSpacing: "separate" }}
      size="small"
      loading={loading}
      showHeader={true}
      scroll={{ x: 800 }}
      columns={props.pbiColumns}
      rowKey={(record: IProductBacklogItem) => record.id}
      expandable={{
        expandedRowRender: props.TaskTableforPBI,
        defaultExpandAllRows: props.peopleFilter,
        rowExpandable: record => record.tasks && record.tasks.length > 0,

      }}
      components={props.nestedcomponents}
      dataSource={data}//:item.backlogItems.filter((item:IProductBacklogItem)=>{item.name.startsWith(filterPBI.nameFilter as string)})}
      pagination={false}
      onRow={(row, id) => {
        const index = row.id;
        const record = { ...initRowIds, sprintNumber: props.item.sprintNumber, pbiID: row.id, estimated: row.estimated } as IRowIds;
        const bodyType = "IProductBacklogItem";
        return ({
          index,
          record,
          bodyType
        }) as any;
      }}
    />);
}