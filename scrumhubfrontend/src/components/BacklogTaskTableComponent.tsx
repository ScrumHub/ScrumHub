import { Table } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ITask, IState } from "../appstate/stateInterfaces";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";
import { getTimeFromDate, isItemDefined } from "./utility/commonFunctions";
import axios from "axios";
import * as Actions from "../appstate/actions";
import { store } from "../appstate/store";
import { getHeader } from "../appstate/stateUtilities";
import config from "../configuration/config";
import _ from "lodash";
import React from "react";

export const TaskTableComponent = React.memo((props: any) => {
  const keys = useSelector((appState: IState) => appState.keys.pbiKeys as number[]);
  const token = useSelector((appState: IState) => appState.loginState.token);
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  useEffect(() => {
    const timer = setInterval(
      async () => {
        const res = await axios.get(
          `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${props.item && props.item.id ? props.item.id : 0}`,
          { headers: getHeader(token, config) }
        ).then(response => { return (response.data) });
        axios.get(`https://api.github.com/rate_limit`, { headers: { "Accept": "application/vnd.github.v3+json", "Authorization": "token " + token } })
          //.then((response: any) => console.log("", getTimeFromDate(new Date()), isItemDefined(response.data) && isItemDefined(response.data.rate) && isItemDefined(response.data.rate.used) ? response.data.rate.used : 0))
          ;/*RATE LIMIT*/
        if (!_.isEqual(res.list, props.item.tasks)) {
          clearInterval(timer);
          store.dispatch(Actions.fetchPBITasksThunk({ token: token, ownerName: ownerName, pbiId: props.item && props.item.id ? props.item.id : 0 }));
        }
      }, 10000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (<Table
    size="small"
    loading={!props.item}
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