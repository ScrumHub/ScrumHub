import { Table } from "antd";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IPerson, IProductBacklogItem, ISprint, ITask } from "../appstate/stateInterfaces";
import { useIsMounted, validateNameFilter, validatePeopleFilter } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";

export default function SprintTableComponent(props: any) {
  const [data, setData] = useState(props.data as ISprint[]);
  const [expand, setExpanded] = useState(false);
  const [reload, setReload] = useState(true);
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
      const isNameFilter = validateNameFilter(props.nameFilter);
      const isPeopleFilter = validatePeopleFilter(props.peopleFilter);
      setExpanded(isNameFilter);
      const filteredData = props.data && props.data.length > 0 && (isNameFilter || isPeopleFilter) ?
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
      setData(filteredData);
      if (isNameFilter && filteredData && filteredData.length > 0 && filteredData.at(0) && (filteredData.at(0) as ISprint).backlogItems && (filteredData.at(0) as ISprint).backlogItems.length > 0) {
        setExpandedRowKeys([(filteredData.at(0) as ISprint).sprintNumber]);
      }
      else if (!isNameFilter) {
        setExpandedRowKeys([0, 1]);
      }
      if (!isMounted()) { console.error("sprint" + isMounted()) };
      setReload(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loading, props.nameFilter, props.data, isMounted]);
  return (
    <DndProvider backend={HTML5Backend} key={"dnd"+props.keys}>
      {<Table
        key={props.keys}
        style={{ transform: "scale(0.96)", height: "auto"}}
        scroll={{ x: 800 }}
        size="small"
        loading={props.loading || reload}
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