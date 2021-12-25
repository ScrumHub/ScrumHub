import { Table } from "antd";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IProductBacklogItem, ISprint } from "../appstate/stateInterfaces";
import { useIsMounted } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";

export default function SprintTableComponent(props: any) {
  const [mount, setMount] = useState(false);
  const [data, setData] = useState([] as ISprint[]);
  //console.log(data);
  //console.log(props.nameFilter);
  const isMounted = useIsMounted();
  if (!isMounted()){console.error("sprint"+isMounted())};
  useEffect(() => {
    if (isMounted() && !mount) {
       console.log(props.data);
       console.log(props.data.at(0).backlogItems.filter((item:IProductBacklogItem)=>item.name.includes(props.nameFilter)));
        setData(props.data && props.data.length > 0 && props.nameFilter && props.nameFilter !== '' ? ([{...props.data.at(0), backlogItems:
          props.data.at(0).backlogItems.filter((item:IProductBacklogItem)=>item.name.toLowerCase().includes(props.nameFilter))}] as ISprint[]):props.data as ISprint[]);
        setMount(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  useEffect(() => {
    if (mount) {
       console.log(props.data);
       console.log(props.data.at(0).backlogItems.filter((item:IProductBacklogItem)=>item.name.includes(props.nameFilter)));
        setData(props.data && props.data.length > 0 && props.nameFilter && props.nameFilter !== '' ? ([{...props.data.at(0), backlogItems:
          props.data.at(0).backlogItems.filter((item:IProductBacklogItem)=>item.name.toLowerCase().includes(props.nameFilter))}] as ISprint[]):props.data as ISprint[]);
        setMount(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.nameFilter]);
return(
  //<DndProvider backend={HTML5Backend} key={"sprint" + props.data.sprintNumber}>
  <>
  {mount && <Table
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
           // </DndProvider>);
}