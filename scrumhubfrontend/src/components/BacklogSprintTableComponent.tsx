import { Table } from "antd";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IPerson, IProductBacklogItem, ISprint, ITask } from "../appstate/stateInterfaces";
import { store } from "../appstate/store";
import { useIsMounted, isNameFilterValid, isPeopleFilterValid, isArrayValid } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";
import * as Actions from '../appstate/actions';

export default function SprintTableComponent(props: any) {
  const [data, setData] = useState(props.data as ISprint[]);
  const [reload, setReload] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState(isArrayValid(props.data)&&props.data.at(0).expanded?[props.data.at(0).sprintNumber]:[]);
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
    store.dispatch(Actions.updateExpandedSprint(newExpandedRowKeys));
  };
  useEffect(() => {
    console.log(props.data);
    console.log(props.loading);
    console.log(props.nameFilter);
    

    /*if (!props.loading && data !== props.data) {
    if(!reload){setReload(true);}
      console.log("here");
      const isNameFilter = isNameFilterValid(props.nameFilter);
      const isPeopleFilter = isPeopleFilterValid(props.peopleFilter);
      const filteredData = isArrayValid(props.data) && (isNameFilter || isPeopleFilter) ?
        ([{
          ...props.data.at(0), backlogItems: isNameFilter ? (
            isPeopleFilter ? (props.data.at(0).backlogItems.map((pbi: IProductBacklogItem) => {
              if (pbi && pbi.tasks) {
                const tasks = pbi.tasks.filter((task: ITask) => {
                  return (task.assigness.filter((person: IPerson) => {
                    return (props.peopleFilter.includes(person.login))
                  }).length > 0)
                });
                return { ...pbi, tasks: tasks };
              } return (pbi);
            })).filter((item: IProductBacklogItem) =>
              item.name.toLowerCase().includes(props.nameFilter)) as ISprint[] :
              (props.data.at(0).backlogItems.filter((item: IProductBacklogItem) =>
                item.name.toLowerCase().includes(props.nameFilter)) as ISprint[]))
            : props.data.at(0).backlogItems.map((pbi: IProductBacklogItem) => {
              if (pbi && pbi.tasks) {
                const tasks = pbi.tasks.filter((task: ITask) => {
                  return (task.assigness.filter((person: IPerson) => {
                    return (props.peopleFilter.includes(person.login))
                  }).length > 0)
                });
                return { ...pbi, tasks: tasks };
              } return (pbi);
            })
        }])
        : props.data as ISprint[];
        if(props.data !== filteredData){
          setData(filteredData);}
      if (isNameFilter && filteredData && filteredData.length > 0 && filteredData.at(0) && (filteredData.at(0) as ISprint).backlogItems && (filteredData.at(0) as ISprint).backlogItems.length > 0) {
        const newExp = [(filteredData.at(0) as ISprint).sprintNumber];
        if(newExp!== expandedRowKeys){
        setExpandedRowKeys(newExp);
        store.dispatch(Actions.updateExpandedSprint(newExp));
        }
      }
      else if (!isNameFilter) {
        const newExp = isArrayValid(props.data)&&props.data.at(0).expanded?[props.data.at(0).sprintNumber]:[];
        if(newExp!== expandedRowKeys){
        setExpandedRowKeys(newExp);
        store.dispatch(Actions.updateExpandedSprint(newExp));
        }
      }
      setReload(false);
    }*/
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loading, props.nameFilter, props.data]);
  
  return (
    <DndProvider backend={HTML5Backend} key={"dnd"+props.keys}>
      {<Table
        key={props.keys}
        style={{ transform: "scale(0.96)", height: "auto"}}
        scroll={{ x: 800 }}
        size="small"
        loading={props.loading||reload}
        showHeader={false}
        pagination={false}
        dataSource={data}
        columns={props.columns}
        components={props.components}
        rowKey={(record: ISprint) => record.sprintNumber}
        expandable={{
          expandedRowRender: props.PBITableforSprint,
          expandedRowKeys: expandedRowKeys,
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
      />}</DndProvider>);
}