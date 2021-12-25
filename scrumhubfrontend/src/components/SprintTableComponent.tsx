import { Table } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ISprint } from "../appstate/stateInterfaces";
import { useIsMounted } from "./utility/commonFunctions";
import { initRowIds } from "./utility/commonInitValues";

export default function SprintTableComponent(props: any) {
  const isMounted = useIsMounted();
  if (!isMounted()){console.error("sprint"+isMounted())};
  //const [data, setData] = useState(props.data as ISprint);
return(
  <DndProvider backend={HTML5Backend} key={"sprint" + props.data.sprintNumber}>
              <Table
                style={{ transform:"scale(0.96)", marginBottom: "0.25%", height: "auto" }}
                scroll={{ x: 800 }}
                size="small"
                loading={props.loading}
                showHeader={false}
                pagination={false}
                dataSource={props.data}
                columns={props.columns}
                components={props.components}
                rowKey={(record: ISprint) => record.sprintNumber}
                expandable={{
                  expandedRowRender: props.PBITableforSprint, defaultExpandAllRows: false,
                  rowExpandable: record => record.backlogItems && record.backlogItems.length > 0, 
                  defaultExpandedRowKeys: [0,1]
                }}
                onRow={(row) => {
                  const index = row.sprintNumber; const record = { ...initRowIds, sprintNumber: row.sprintNumber }; const bodyType = "ISprint"; return ({
                    index,
                    record,
                    bodyType
                  }) as any;
                }}
              />
            </DndProvider>);
}