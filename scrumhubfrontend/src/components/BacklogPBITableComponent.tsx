import { Table } from "antd";
import { IProductBacklogItem, ISprint, State } from "../appstate/stateInterfaces";
import { initRowIds, initSortedInfo } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";
import "./ProductBacklog.css"
import { useEffect, useState } from "react";
import * as Actions from '../appstate/actions';
import { store } from "../appstate/store";
import { useSelector } from "react-redux";

export default function PBITableComponent(props: any) {
  const keys = useSelector((appState: State) => appState.keys.pbiKeys as number[]);
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
    console.log('Various parameters', pagination, filters, sorter);
  };
  /*useEffect(() => {
    if (expandedRowKeys && expandedRowKeys.length > 1) {
      setExpandedRowKeys(expandedRowKeys);
    }
  }, [props.sortedInfo]);*/
  return (
    <Table
      size="small"
      showHeader={true}
      //scroll={{x:800,scrollToFirstRowOnChange:true }}
      columns={props.pbiColumns}
      rowKey={(record: IProductBacklogItem) => record.id}
      expandable={{
        expandedRowRender: props.TaskTableforPBI,
        expandedRowKeys: keys,
        defaultExpandAllRows:props.sortedInfo,
        onExpand: (expanded, record) => {
          updateExpandedRowKeys(record);
        },
        rowExpandable: record => record.tasks && record.tasks.length > 0,

      }}
      components={props.nestedcomponents}
      onChange={(pagination: any, filters: any, sorter: any)=>{handleChange(pagination, filters, sorter)}}
      dataSource={props.item.backlogItems}//:item.backlogItems.filter((item:IProductBacklogItem)=>{item.name.startsWith(filterPBI.nameFilter as string)})}
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