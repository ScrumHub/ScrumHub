import { Empty, Table } from "antd";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ISprint, IState } from "../appstate/stateInterfaces";
import { store } from "../appstate/store";
import { initRowIds } from "./utility/commonInitValues";
import * as Actions from '../appstate/actions';
import { useSelector } from "react-redux";
import { isArrayValid } from "./utility/commonFunctions";
import React from "react";

export const SprintTableComponent = React.memo((props: any) =>{
  const keys = useSelector((appState: IState) => appState.keys.sprintKeys as number[]);
  const updateExpandedRowKeys = (record: ISprint) => {
    store.dispatch(Actions.updateSprintKeys([record.sprintNumber]));
  };
  const handleChange = (pagination: any, filters: any, sorter: any, data:any) => {
    //console.log('Various parameters', pagination, filters, sorter, data);
  };
  let locales = {
    emptyText: ()=>{return(!props.loading?<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No Sprints"} />:"")}
  };
  useEffect(() => {
    
  },[props.peopleFilter,props.nameFilter]);
  return (
    <DndProvider backend={HTML5Backend} key={"dnd"+props.keys}>
       <Table
        locale={locales}
        key={props.keys}
        style={{ height: "auto",visibility:!props.loading && !isArrayValid(props.data)?"hidden":"visible"}}
        scroll={{ x: 800 }}
        size="small"
        loading={props.loading}
        showHeader={false}
        bordered={false}
        pagination={false}
        dataSource={props.data}
        onChange={(pagination: any, filters: any, sorter: any, data:any)=>{handleChange(pagination, filters, sorter, data)}}
        columns={props.columns}
        components={props.components}
        rowKey={(record: ISprint) => record.sprintNumber}
        expandable={{
          expandedRowRender: props.PBITableforSprint,
          expandedRowKeys: keys,
          onExpand: (expanded, record) => {
            updateExpandedRowKeys(record);
          },
          rowExpandable: record => record.backlogItems && record.backlogItems.length > 0,
        }}
        onRow={(row) => {
          const index = row.sprintNumber; 
          const record = { ...initRowIds, sprintNumber: row.sprintNumber }; 
          const bodyType = "ISprint"; 
          return ({
            index,
            record,
            bodyType
          }) as any;
        }}
      /></DndProvider>);
});