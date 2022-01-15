import { Table } from "antd";
import { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { ITask } from "../appstate/stateInterfaces";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";
import * as Actions from '../appstate/actions';
import { store } from "../appstate/store";
import { isArrayValid, isItemDefined } from "./utility/commonFunctions";
import { AuthContext } from "../App";
import axios from "axios";
import useSWR from "swr";

function TaskTableComponent(props: any) {
  const { state } = useContext(AuthContext);
  const { token } = state;
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const fetcher = (url: any) => axios.get(url,
    { headers: {"Accept": "application/vnd.github.v3+json", "Authorization":"token "+token} }).then(res => res.data)
  const { data, error } = useSWR("https://api.github.com/rate_limit", fetcher,{refreshInterval:80000});
  console.log(isItemDefined(data) && isItemDefined(data.rate) && isItemDefined(data.rate.used) ? data.rate.used:0);
  useEffect(() => {
    if(props.item && isArrayValid(props.item.tasks)){
    console.log(isItemDefined(data) && isItemDefined(data.rate) && isItemDefined(data.rate.used) ? data.rate.used:0);
      const timer = setTimeout(
      () => store.dispatch(Actions.fetchPBITasksThunk({token:token, ownerName:ownerName, pbiId:props.item.tasks.at(0).pbiId })),
      80000
    );
    return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.item]);
  return (<>
    {<Table
      size="small"
      loading={!props.item}
      showHeader={false}
      rowKey={(record: ITask) => record.id}
      columns={props.taskColumns}
      components={props.taskComponents}
      dataSource={props.item ?props.item.tasks:[]}
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
    />}</>);
}

const mapStateToProps = (dispatch:any, ownProps: { peopleFilter: any; item: any; taskColumns: any; taskComponents: any; }) => ({
  peopleFilter:ownProps.peopleFilter,
  item:ownProps.item,
  taskColumns:ownProps.taskColumns, 
  taskComponents:ownProps.taskComponents,
});

export default connect(mapStateToProps)(TaskTableComponent);