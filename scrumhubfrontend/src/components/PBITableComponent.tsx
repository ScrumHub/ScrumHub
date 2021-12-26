import { Table } from "antd";
import { IProductBacklogItem } from "../appstate/stateInterfaces";
import { useIsMounted } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";
import { IRowIds } from "./utility/commonInterfaces";

export default function PBITableComponent(props: any) {
  const isMounted = useIsMounted();
  if (!isMounted()){console.error("pbi"+isMounted())};
return(
        <Table
         style={{ borderSpacing: "separate" }}
         size="small"
         loading={props.loading}
          showHeader={true}
          scroll={{ x: 800 }}
          columns={props.pbiColumns}
          rowKey={(record: IProductBacklogItem) => record.id}
          expandable={{
            expandedRowRender: props.TaskTableforPBI,
            defaultExpandAllRows: props.peopleFilter && props.peopleFilter.length > 0, 
            rowExpandable: record => record.tasks && record.tasks.length > 0,
            
          }}
          components={props.nestedcomponents}
          dataSource={props.item.backlogItems}//:item.backlogItems.filter((item:IProductBacklogItem)=>{item.name.startsWith(filterPBI.nameFilter as string)})}
          pagination={false}
          onRow={(row, id) => {const index = row.id; const record = {...initRowIds, sprintNumber:props.item.sprintNumber,pbiID: row.id,estimated:row.estimated} as IRowIds;  const bodyType="IProductBacklogItem"; return({
            index,
            record,
            bodyType
          }) as any;}}          
        />);
}