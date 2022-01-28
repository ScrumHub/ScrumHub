import { Table } from "antd";
import { useSelector } from "react-redux";
import { ITask, IState } from "../appstate/stateInterfaces";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";
import _ from "lodash";
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
    showHeader={false}
    rowKey={(record: ITask) => record.id}
    columns={props.taskColumns}
    components={props.taskComponents}
    dataSource={props.item ? props.item.tasks : []}
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
  />);
});