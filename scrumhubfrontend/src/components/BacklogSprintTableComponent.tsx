import { Empty, Table } from "antd";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IPerson, IBacklogItem, ISprint, IState, ITask } from "../appstate/stateInterfaces";
import { store } from "../appstate/store";
import { initFilteredInfo, initRowIds } from "./utility/commonInitValues";
import * as Actions from '../appstate/actions';
import { useSelector } from "react-redux";
import { isArrayValid, useIsMounted } from "./utility/commonFunctions";
import React from "react";
import _ from "lodash";

/**
 * @returns SprintTableComponent Component that displays each {@linkcode ISprint} from
 * // the given list of Sprints 
 */
export const SprintTableComponent = React.memo((props: any) => {
  const keys = useSelector((appState: IState) => appState.keys.sprintKeys as number[]);
  const pbiKeys = useSelector((appState: IState) => appState.keys.pbiKeys as number[]);
  const loadingKeys = useSelector((appState: IState) => appState.loadingKeys.sprintKeys as number[]);
  const [wait, setWait] = useState(false);
  const updateExpandedRowKeys = (record: ISprint) => {
    store.dispatch(Actions.updateSprintKeys([record.sprintNumber]));
  };
  let locales = {
    emptyText: () => { return (!props.loading ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No Sprints"} /> : "") }
  };
  const mounted = useIsMounted();
  useEffect(() => {
    if (isArrayValid(props.data) && !wait && mounted) {
      setWait(true);
      const tempSKeys = props.data.map((sprint: ISprint) => { return (sprint.sprintNumber) });
      const tempPKeys = [].concat.apply([],props.data.map((sprint: ISprint) => { return sprint.backlogItems.map((pbi:IBacklogItem)=>{return(pbi.id)})}));
      if (isArrayValid(props.nameFilter) || isArrayValid(props.peopleFilter) || (!_.isEqual(props.filteredInfo,initFilteredInfo))) {
        store.dispatch(Actions.updateSprintKeys(tempSKeys.filter((item: number) => !keys.includes(item))));
        if(props.filteredInfo && !isArrayValid(props.filteredInfo.complete)){store.dispatch(Actions.updatePBIKeys(tempPKeys.filter((item: number) => !pbiKeys.includes(item))))};
      }
      //else {
      //  store.dispatch(Actions.updateSprintKeys(tempSKeys.filter((item: number) => keys.includes(item))));
      //  store.dispatch(Actions.updatePBIKeys(tempPKeys.filter((item: number) => pbiKeys.includes(item))));
      //}
      setWait(false);
    }// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.peopleFilter, props.nameFilter,props.filteredInfo, wait]);

  return (
    <DndProvider backend={HTML5Backend} key={"dnd" + props.keys}>
      <Table
        locale={locales}
        key={props.keys}
        style={{ height: "auto", visibility: !props.loading && !isArrayValid(props.data) ? "hidden" : "visible" }}
        scroll={{ x: 800 }}
        size="small"
        loading={props.loading || (isArrayValid(props.data) && loadingKeys.filter((v: number) => props.data.map((sprint: ISprint) => { return (sprint.sprintNumber) }).includes(v)).length > 0)}
        showHeader={false}
        bordered={false}
        pagination={false}
        dataSource={props.data}
        columns={props.columns}
        components={props.components}
        rowKey={(record: ISprint) => record.sprintNumber}
        expandable={{
          expandedRowRender: props.PBITableforSprint,
          expandedRowKeys: keys,
          onExpand: (expanded, record) => {
            updateExpandedRowKeys(record);
          },
          rowExpandable: record => isArrayValid(record.backlogItems) && (isArrayValid(props.nameFilter) ? record.backlogItems.filter((pbi: IBacklogItem) => pbi.name.toLowerCase().includes(props.nameFilter[0].toLowerCase())).length > 0 : true)
            && (isArrayValid(props.peopleFilter) ? record.backlogItems.filter((pbi: IBacklogItem) => {
              return (pbi.tasks.filter((task: ITask) => {
                return (task.assigness.filter((person: IPerson) => {
                  return (props.peopleFilter.includes(person.login))
                }).length > 0)
              }).length > 0)
            }).length > 0
              : true)
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