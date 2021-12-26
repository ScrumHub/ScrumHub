import { Table } from "antd";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IProductBacklogItem, ISprint } from "../appstate/stateInterfaces";
import { useIsMounted } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";

export default function SprintTableComponent(props: any) {
  const [data, setData] = useState(props.data as ISprint[]);
  const [expand, setExpanded] = useState(false);
  const isMounted = useIsMounted();
  const [expandedRowKeys, setExpandedRowKeys] = useState([0, 1]);
  const updateExpandedRowKeys = (record: ISprint) => {
    const rowKey = record.sprintNumber;
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
    if (!props.loading) {
      setExpanded(props.nameFilter && props.nameFilter !== "");
      const filteredData = props.data && props.data.length > 0 && props.nameFilter && props.nameFilter !== '' ? ([{
        ...props.data.at(0), backlogItems:
          props.data.at(0).backlogItems.filter((item: IProductBacklogItem) => item.name.toLowerCase().includes(props.nameFilter))
      }] as ISprint[]) : props.data as ISprint[];
      setData(filteredData);
      if (props.nameFilter && props.nameFilter !== "" && filteredData && filteredData.length > 0 && filteredData.at(0) && (filteredData.at(0) as ISprint).backlogItems && (filteredData.at(0) as ISprint).backlogItems.length > 0) {
        setExpandedRowKeys([(filteredData.at(0) as ISprint).sprintNumber]);
      }
      else if(!props.nameFilter || props.nameFilter===""){
        setExpandedRowKeys([0, 1]);
      }
      if (!isMounted()) { console.error("sprint" + isMounted()) };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loading, props.nameFilter, props.peopleFilter, props.data, isMounted]);
  useEffect(() => {
    //setData(data);
    //setExpanded(props.nameFilter && props.nameFilter !== "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.peopleFilter]);

  return (
    <DndProvider backend={HTML5Backend} key={"dnd" + props.data && props.data.length > 0 ? props.data[0].sprintNumber : 0}>
      {<Table
        key={props.data && props.data.length > 0 ? props.data.at(0).sprintNumber : "table0"}
        style={{ transform: "scale(0.96)", marginBottom: "0.25%", height: "auto" }}
        scroll={{ x: 800 }}
        size="small"
        loading={props.loading}
        showHeader={false}
        pagination={false}
        dataSource={data}//props.data.filter((item:IProductBacklogItem)=>item.name.includes(props.nameFilter))] as ISprint[]}
        columns={props.columns}
        components={props.components}
        rowKey={(record: ISprint) => record.sprintNumber}
        expandable={{
          expandedRowRender: props.PBITableforSprint,
          expandedRowKeys: expandedRowKeys,
          onExpand: (expanded, record) => {
            updateExpandedRowKeys(record);
          },
          //defaultExpandAllRows: props.peopleFilter && props.peopleFilter.length>0,//data && data.length > 0 ? data[0].backlogItems && data[0].backlogItems.length>0:false ,//(props.nameFilter && props.nameFilter !== "") || (props.peopleFilter && props.peopleFilter.length>0),
          rowExpandable: record => record.backlogItems && record.backlogItems.length > 0,
          //defaultExpandedRowKeys: [0, 1],
        }}
        onRow={(row) => {
          const index = row.sprintNumber; const record = { ...initRowIds, sprintNumber: row.sprintNumber }; const bodyType = "ISprint"; return ({
            index,
            record,
            bodyType
          }) as any;
        }}
      />}</DndProvider>);
}