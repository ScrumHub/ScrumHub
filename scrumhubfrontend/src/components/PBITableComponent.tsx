import { Table } from "antd";
import { Key, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IProductBacklogItem } from "../appstate/stateInterfaces";
import { useIsMounted } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";

export default function PBITableComponent(props: any) {
  const isMounted = useIsMounted();
  const [expandedRows, setExpandedRows] = useState([] as number[]);
  if (!isMounted()){console.error("pbi"+isMounted())};
  const updateKeys = (key:number) => {
    if(isMounted() && !expandedRows.includes(key)){
    console.log("key"+key);
    const keys = expandedRows && expandedRows.length >0 ? expandedRows.concat([key]):[key] as number[];
    setExpandedRows(keys);
    }
};

return(
<DndProvider backend={HTML5Backend} key={"pbi"+props.item.sprintNumber}>
        <Table
         style={{ borderSpacing: "separate" }}
          size="small"
          showHeader={false}
          scroll={{ x: 800 }}
          columns={props.pbiColumns}
          rowKey={(record: IProductBacklogItem) => record.id}
          expandable={{
            expandedRowRender:record => props.TaskTableforPBI(record, updateKeys(record.id)),
            defaultExpandAllRows: props.peopleFilter && props.peopleFilter.length > 0, rowExpandable: record => record.tasks && record.tasks.length > 0,


            
          }}
          components={props.nestedcomponents}
          dataSource={props.item.backlogItems}//:item.backlogItems.filter((item:IProductBacklogItem)=>{item.name.startsWith(filterPBI.nameFilter as string)})}
          pagination={false}
          onRow={(row, id) => {const index = row.id; const record = {...initRowIds, sprintNumber:props.item.sprintNumber,pbiID: row.id,} as IRowIds;  const bodyType="IProductBacklogItem"; return({
            index,
            record,
            bodyType
          }) as any;}}
          /*onRow={(record) => {
            return {
              onDrag: () => {
                if (record.id !== IDs.pbiId) { setIDs({ ...IDs, pbiId: record.id, oldSprintId: IDs.pbiId !== 0 ? item.sprintNumber : -1 }); }
              },
              //onDragEnter: () => {
              //  console.log(record.name)
              //},
              onDragEnter: () => {
                let tmp = IDs.oldSprintId === record.sprintNumber && IDs.dropped;
                let temp = IDs.pbiId > 0 && IDs.oldSprintId !== record.sprintNumber && IDs.newSprintId !== record.sprintNumber;
                if(isMounted()){
                if(tmp){
                  setIDs({ ...IDs, oldSprintId: -1, dropped: true});
                }
                //else{
               //   setIDs({ ...IDs, dropped:false });
                //}
                if(temp)
                {
                  setIDs({ ...IDs,  newSprintId: record.sprintNumber });
                }
              }
                
              },
            };

          }}*/
          
        />
      </DndProvider>);
}