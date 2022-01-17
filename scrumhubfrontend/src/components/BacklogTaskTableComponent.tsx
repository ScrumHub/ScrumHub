import { Table } from "antd";
import { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { ITask, IState, ITaskList } from "../appstate/stateInterfaces";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";
import { getTimeFromDate, isArrayValid, isItemDefined } from "./utility/commonFunctions";
import axios from "axios";
import useSWRInfinite from "swr";
import * as Actions from "../appstate/actions";
import { store } from "../appstate/store";
import useSWR from "swr";
import { getResponse } from "../appstate/fetching";
import { getHeader } from "../appstate/stateUtilities";
import config from "../configuration/config";
import { isNull } from "lodash";
import { RequestResponse } from "../appstate/response";
import _ from "lodash";
import React from "react";

 export const TaskTableComponent = React.memo((props: any) =>{
  const keys = useSelector((appState: IState) => appState.keys.pbiKeys as number[]);
  const token = useSelector((appState: IState) => appState.loginState.token);
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  //const [index, setIndex] = useState(0);
  useEffect(()=>{
   //  console.log(props);
    
    //const {data:data2 } = useSWR(`${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}`,
    let time = 0;
     const timer = setInterval(
      async () => { 
      const res = await axios.get(
        `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${props.item && props.item.id?props.item.id:0}`,
        { headers: getHeader(token, config) }
      ).then(response=>{console.log("", getTimeFromDate(new Date()),response.data);return(response.data)});
      /*console.log(res.list && props.item && props.item.tasks?_.isEqual(res.list, props.item.tasks):[]);
      */axios.get(`https://api.github.com/rate_limit`, { headers: { "Accept": "application/vnd.github.v3+json", "Authorization": "token " + token } })
      .then((response: any) => console.log("", getTimeFromDate(new Date()),isItemDefined(response.data) && isItemDefined(response.data.rate) && isItemDefined(response.data.rate.used)?response.data.rate.used:0));
      if(!_.isEqual(res.list, props.item.tasks)){
        clearInterval(timer);
        store.dispatch(Actions.fetchPBITasksThunk({ token: token, ownerName: ownerName, pbiId: props.item && props.item.id?props.item.id:0 }));
        //return(true);
      }
      else{
        //return(false);
      }
  }, 10000);
  //store.dispatch(Actions.fetchPBITasksThunk({ token: token, ownerName: ownerName, pbiId: props.item && props.item.id?props.item.id:0 }));
  //console.log("time",timer, getTimeFromDate(new Date()));
  return () => clearInterval(timer);
      //, { refreshInterval: 5000 });
      //console.log((r as any).response);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[]);
  const taskFetcher = async (item: any) => {
    //console.log(item);
    const response: RequestResponse<ITaskList, number> = await getResponse(
      axios.get(
        `${config.backend.ip}:${config.backend.port}/api/Tasks/${ownerName}/PBI/${isNull(props.item.tasks.at(0).pbiId) ? 0 : props.item.tasks.at(0).pbiId}`,
        { headers: getHeader(token, config) }
      ));
      console.log((response as RequestResponse<ITaskList, number>).response);
      const fetchedTasks = (response as RequestResponse<ITaskList, number>).response as ITaskList;
      if(fetchedTasks&&isArrayValid(fetchedTasks.list)){
      console.log(_.isEqual(props.item?props.item.tasks:[],fetchedTasks.list));
      }
    //store.dispatch(Actions.fetchPBITasksThunk({ token: token, ownerName: ownerName, pbiId: props.item.tasks.at(0).pbiId })).then(response => response);
    /*if (isItemDefined(item.data) && isItemDefined(item.data.rate) && isItemDefined(item.data.rate.used)) {
      //console.log("Nr "+item.split("?")[1]);
      if (item.data.rate.used < 100) {
        store.dispatch(Actions.fetchPBITasksThunk({ token: token, ownerName: ownerName, pbiId: props.item.tasks.at(0).pbiId })).then(response => response)
      } else {

      }
      //console.log("here");
    };*/
  };
  
  //console.log(data);
  //useSWR((isNull(props.item)||isNull(props.item.id) ? 0 : props.item.id), taskFetcher, { refreshInterval: props.data<4000?1000:20000,refreshWhenHidden : true });
  //console.log("rerender");
  //console.log(isItemDefined(data) && isItemDefined(data.rate) && isItemDefined(data.rate.used) ? data.rate.used:0);
  /*useEffect(() => {
    if(isItemDefined(data) && isItemDefined(data.rate) && isItemDefined(data.rate.used)){
      //console.log(data.rate.used);
      let temp = 0;
      //const t = 15000;
      //console.log(isItemDefined(data) && isItemDefined(data.rate) && isItemDefined(data.rate.used) ? data.rate.used:0);
      const timer = setTimeout(
         () => {
           
      console.log(temp);
          //console.log(timer);
          //if (props.item && isArrayValid(props.item.tasks)) {
          //store.dispatch(Actions.getRateLimitThunk({token:token,url:"https://api.github.com/rate_limit"}));
          //fetch("https://api.github.com/rate_limit", {method:"GET",
           // headers: { "Accept": "application/vnd.github.v3+json", "Authorization": "token " + token } }).then((response: any) => {
              // handle success
             // console.log(response);
              //if(!isNull(response.data) && !isNull(response.data.rate) &&!isNull(response.data.rate.remaining)){

              //console.log(response.data.rate.remaining);
              //return(response.data.rate.remaining);
              //}
          //  });
            //if(){
          store.dispatch(Actions.fetchPBITasksThunk({ token: token, ownerName: ownerName, pbiId: props.item.tasks.at(0).pbiId }))
          .then(response=>{console.log(response);temp+=1;});
            //}*/

  //}
  //},
  //6000
  //     );
  //return () => clearTimeout(timer);
  // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);* /
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

const mapStateToProps = (dispatch: any, ownProps: { peopleFilter: any; item: any; taskColumns: any; taskComponents: any; }) => ({
  peopleFilter: ownProps.peopleFilter,
  item: ownProps.item,
  taskColumns: ownProps.taskColumns,
  taskComponents: ownProps.taskComponents,
});

//export default connect(mapStateToProps)(TaskTableComponent);
//export default TaskTableComponent;