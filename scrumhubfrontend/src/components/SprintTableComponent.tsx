import { Table } from "antd";
import { useEffect, useState } from "react";
import { IProductBacklogItem, ISprint } from "../appstate/stateInterfaces";
import { useIsMounted } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";

export default function SprintTableComponent(props: any) {
  const [data, setData] = useState(props.data);
  const isMounted = useIsMounted();
  if (!isMounted()){console.error("sprint"+isMounted())};
  useEffect(() => {
    if (!props.loading) {
        setData(props.data && props.data.length > 0 && props.nameFilter && props.nameFilter !== '' ? ([{...props.data.at(0), backlogItems:
          props.data.at(0).backlogItems.filter((item:IProductBacklogItem)=>item.name.toLowerCase().includes(props.nameFilter))}] as ISprint[]):props.data as ISprint[]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loading, props.nameFilter, props.data,isMounted]);

return(
  <>
  {<Table
                style={{ transform:"scale(0.96)", marginBottom: "0.25%", height: "auto" }}
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
                  defaultExpandAllRows: props.nameFilter && props.nameFilter !== "",
                  rowExpandable: record => record.backlogItems && record.backlogItems.length > 0, 
                  defaultExpandedRowKeys: [0,1], 
                }}
                onRow={(row) => {
                  const index = row.sprintNumber; const record = { ...initRowIds, sprintNumber: row.sprintNumber }; const bodyType = "ISprint"; return ({
                    index,
                    record,
                    bodyType
                  }) as any;
                }}
              />}</>);
}