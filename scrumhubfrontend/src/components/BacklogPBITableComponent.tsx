import { Table } from "antd";
import { IPerson, IBacklogItem, IState, ITask } from "../appstate/stateInterfaces";
import { initRowIds, initSortedInfo } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";
import * as Actions from '../appstate/actions';
import { store } from "../appstate/store";
import { useSelector } from "react-redux";
import { isArrayValid } from "./utility/commonFunctions";
import React from "react";
import _ from "lodash";

export const PBITableComponent = React.memo((props: any) =>{
  let keys = useSelector((appState: IState) => appState.keys.pbiKeys as number[]);
  const loadPbiKeys = useSelector((appState: IState) => appState.loadingKeys.pbiKeys as number[]);
  const loadSprintKeys = useSelector((appState: IState) => appState.loadingKeys.sprintKeys as number[]);
  const updateExpandedRowKeys = (record: IBacklogItem) => {
    store.dispatch(Actions.updatePBIKeys([record.id]));
  };
  const handleChange = (pagination: any, filters: any, sorter: any) => {
    if (props.itemSelected && filters && typeof(filters.pbiPriority)!=="undefined" && (props.filteredInfos && props.filteredInfo.pbiPriorities? filters.pbiPriority !== props.filteredInfo.pbiPriorities:true)){
          props.itemSelected(filters.pbiPriority);
    }

    if (props.sortSelected && sorter && sorter.order!==false)
    {
      if(typeof(sorter.order)!=="undefined" && (props.sortedInfo ? (sorter.order !== props.sortedInfo.order || sorter.columnKey !== props.sortedInfo.columnKey):true)){
      props.sortSelected({columnKey:sorter.columnKey, order:sorter.order});}
      else{
        props.sortSelected(initSortedInfo);}
    }
  };

  return (
    <Table
      size="small"
      showHeader={true}
      //loading={(props.item && isArrayValid(props.item.backlogItems) && pbiKeys.filter((nr:number)=>props.item.backlogItems.map((pbi:IProductBacklogItem)=>{return(pbi.id)}).includes(nr)).length>0)}
      columns={props.pbiColumns}
      rowKey={(record: IBacklogItem) => record.id}
      expandable={{
        expandedRowRender: props.TaskTableforPBI,
        expandedRowKeys: keys,
        onExpand: (expanded: any, record: IBacklogItem) => {
          updateExpandedRowKeys(record);
        },
        rowExpandable: (record: IBacklogItem) => (isArrayValid(record.tasks) &&
           (isArrayValid(props.peopleFilter) ? record.tasks.filter((task: ITask) => {
              return (task.assigness.filter((person: IPerson) => {
                return (props.peopleFilter.includes(person.login))
              }).length > 0)
            }).length > 0
            : true)) || record.id===0

      }}
      components={props.nestedcomponents}
      onChange={(pagination: any, filters: any, sorter: any)=>{handleChange(pagination, filters, sorter)}}
      dataSource={props.item.backlogItems}
      pagination={false}
      onRow={(row: { id: any; estimated: any; }, id: any) => {
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
});