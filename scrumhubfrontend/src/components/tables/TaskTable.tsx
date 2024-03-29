import { Table } from "antd";
import { useSelector } from "react-redux";
import { ITask, IState } from "../../appstate/stateInterfaces";
import { IRowIds } from "../utility/commonInterfaces";
import React from "react";

/**
 * @returns TaskTableComponent Component that displays all {@linkcode ITask} items
 * // for the given {@linkcode IBacklogItem}
 */
export const TaskTableComponent = React.memo((props: any) => {
  const loadingKeys = useSelector(
    (appState: IState) => appState.loadingKeys.pbiKeys as number[]);
  
  return (<Table
    id="table"
    size="small"
    loading={!props.item || (props.item && loadingKeys.includes(props.item.id))}
    showHeader={props.showHeader}
    rowKey={(record: ITask) => record.id}
    columns={props.taskColumns}
    components={props.taskComponents}
    dataSource={props.item ? props.item.tasks : []}
    pagination={false}
    onRow={(row, id) => {
      const index = row.id;
      const record = { estimated: true, sprintNumber: props.item.sprintNumber, pbiID: row.pbiId ? row.pbiId : 0, taskID: row.id, } as IRowIds;
      const bodyType = "ITask"; return ({
        index,
        record,
        bodyType
      }) as any;
    }}
  />);
});