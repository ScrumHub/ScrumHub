import { Table } from "antd";
import { IProductBacklogItem, IState } from "../appstate/stateInterfaces";
import { initRowIds, initSortedInfo } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";
//import "./ProductBacklog.css"
import * as Actions from '../appstate/actions';
import { store } from "../appstate/store";
import { useSelector } from "react-redux";
import { isArrayValid } from "./utility/commonFunctions";
import React from "react";

export const PBITableComponent = React.memo((props: any) =>{
  const keys = useSelector((appState: IState) => appState.keys.pbiKeys as number[]);
  const loadingKeys = useSelector((appState: IState) => appState.loadingKeys.sprintKeys as number[]);
  const updateExpandedRowKeys = (record: IProductBacklogItem) => {
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
      loading={isArrayValid(loadingKeys) && props.item && loadingKeys.includes(props.item.sprintNumber)}
      columns={props.pbiColumns}
      rowKey={(record: IProductBacklogItem) => record.id}
      expandable={{
        expandedRowRender: props.TaskTableforPBI,
        expandedRowKeys: keys,
        defaultExpandAllRows:props.sortedInfo,
        onExpand: (expanded: any, record: IProductBacklogItem) => {
          updateExpandedRowKeys(record);
        },
        rowExpandable: (record: any) => record.tasks && record.tasks.length > 0,

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