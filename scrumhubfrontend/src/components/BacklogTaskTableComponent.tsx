import { Table } from "antd";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ITask, IState } from "../appstate/stateInterfaces";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";
import axios from "axios";
import * as Actions from "../appstate/actions";
import { store } from "../appstate/store";
import { getHeader } from "../appstate/stateUtilities";
import config from "../configuration/config";
import _ from "lodash";
import React from "react";
import { isItemDefined, isTaskTableInViewPort } from "./utility/commonFunctions";

export const TaskTableComponent = React.memo((props: any) => {
  const token = useSelector((appState: IState) => appState.loginState.token);
  const loadingKeys = useSelector((appState: IState) => appState.loadingKeys.pbiKeys as number[]);
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  let x = 0;
  const value = useRef(0);
  useEffect(() => {
    const timer = setInterval(
      async () => {
        console.log(value.current);
        //fetches tasks only for tables that are in the viewport, to avoid uneccessary requests
        //console.log("",document.querySelector('#table')?.getBoundingClientRect(),isTaskTableInViewPort(document.querySelector('#table')));
       // if (isTaskTableInViewPort(document.querySelector('#table'))) {
          ++x;
          const data = await axios.get(`https://api.github.com/rate_limit`, { headers: { "Accept": "application/vnd.github.v3+json", "Authorization": "token " + token } })
            .then((response: any) => { //console.log("", getTimeFromDate(new Date()), isItemDefined(response.data) && isItemDefined(response.data.rate) && isItemDefined(response.data.rate.used) ? response.data.rate.used : 0); 
              return (isItemDefined(response.data) && isItemDefined(response.data.rate) && isItemDefined(response.data.rate.used) ? response.data.rate.used as number : 0);
            });
           // console.log(x, data);
          if (isItemDefined(data) && typeof (data) === "number" && (data < 4000 || (data > 4000 && x % 2 === 0))) {
            const res = await axios.get(
              `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${props.item && props.item.id ? props.item.id : 0}`,
              { headers: getHeader(token, config) }
            ).then(response => { console.log(response); return (response.data); });
            if (!_.isEqual(res.list, props.item.tasks)) {
              store.dispatch(Actions.updateTasks({ ...props.item, tasks: res.list }));
            }
          }
       // }
      }, 7000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //const box = document.querySelector('#table');
  //const rect = box.length;

  //console.log(box?.getBoundingClientRect());
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