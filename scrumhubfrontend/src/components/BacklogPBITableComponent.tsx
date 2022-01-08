import { Table } from "antd";
import { IProductBacklogItem } from "../appstate/stateInterfaces";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";
import "./ProductBacklog.css"
import { useEffect, useState } from "react";

export default function PBITableComponent(props: any) {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]as number[]);
  const handleChange = (pagination: any, filters: any, sorter: any) => {
    console.log('Various parameters', pagination, filters, sorter);
  };
  const updateExpandedRowKeys = (record: IProductBacklogItem) => {
    const rowKey = record.id;
    const isExpanded = expandedRowKeys.includes(rowKey);
    let newExpandedRowKeys = [] as number[];
    if (isExpanded) {
      newExpandedRowKeys = expandedRowKeys.reduce((acc: number[], key: number) => {
        if (key !== rowKey) { acc.push(key) };
        return acc;
      }, []);
    } else {
      newExpandedRowKeys = expandedRowKeys;
      newExpandedRowKeys.push(rowKey);
    }
    setExpandedRowKeys(newExpandedRowKeys);
  };
  useEffect(() => {
    if (expandedRowKeys && expandedRowKeys.length > 1) {
      setExpandedRowKeys(expandedRowKeys);
    }
  }, [props.sortedInfo]);
  return (
    <Table
      size="small"
      showHeader={true}
      scroll={{x:800,scrollToFirstRowOnChange:true }}
      columns={props.pbiColumns}
      rowKey={(record: IProductBacklogItem) => record.id}
      expandable={{
        expandedRowRender: props.TaskTableforPBI,
        expandedRowKeys: expandedRowKeys,
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