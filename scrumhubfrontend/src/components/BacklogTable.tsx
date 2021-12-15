import React, { useState, useRef, useContext, useEffect } from 'react';
import { Badge, Button, Space, Table, Input, PageHeader, Divider } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as Actions from '../appstate/actions';
import { IFilters, IPBIFilter, IProductBacklogItem, IProductBacklogList, ISprint, ISprintList, ITask, State } from '../appstate/stateInterfaces';
import 'antd/dist/antd.css';
import './Dragtable.css';
import { store } from '../appstate/store';
import { AuthContext } from '../App';
import { useSelector } from 'react-redux';
import config from '../configuration/config';
import { Navigate } from 'react-router';
import { DragOutlined, MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import dragula from "dragula";
import "dragula/dist/dragula.css";

const { Search } = Input;

export const type = 'DraggableBodyRow';
export const fixedType = 'NonDraggableBodyRow';

export interface BodyRowProps {
  index: any;
  moveRow: any;
  className: any;
  style: any;
  restProps: {
    [x: string]: any;
  };
}

const NonDraggableBodyRow = ({ index: index_row, moveRow, className, style, ...restProps }: BodyRowProps) => {
  const ref = useRef();
  //console.log(ref);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const index = monitor.getItem() || {} as number;
      if (index === index_row) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: index as number < index_row ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      //console.log(item);
      if (item.index && typeof (item.index) != "undefined") {
        //console.log("move backlog item");
        //moveRow(item.index, index_row);
      }
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index: index_row },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(ref);
  return (
    <tr
      ref={ref as any}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ marginTop: "20px", marginBottom: "20px", ...style }}
      {...restProps}
    />
  );
};



const DraggableBodyRowNested = ({ index: index_row, moveRow, className, style, ...restProps }: BodyRowProps) => {
  const ref = useRef();
  //console.log(ref);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const index = monitor.getItem() || {} as number;
      if (index === index_row) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: index as number < index_row ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      //console.log(item);
      if (item.index && typeof (item.index) != "undefined") {
        //console.log("move backlog item");
        //moveRow(item.index, index_row);
      }
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index: index_row },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref as any}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', marginTop: "20px", marginBottom: "20px", ...style }}
      {...restProps}
    />
  );
};



/*export const DragSortingTable: React.FC = () => {
  const [data, setData] = useState([initProductBacklogItem, init2ProductBacklogItem]);
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ]);


  

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      console.log("dr"+dragIndex);
      console.log("hov"+hoverIndex);
      console.log("from"+data[dragIndex].name);
      console.log("to"+data[hoverIndex].name);
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [],
  );
  const taskColumns = [
    { title: 'Name', fixed: "left" as const, colSpan: 2, dataIndex: 'name', key: 'name' },
    {
      title: 'Action', colSpan: 1, align: "right" as const, key: 'operation', render: () => {
        return (<Button type="link" onClick={() => {  }} >
          <a>Add</a>
        </Button>)
      }
      ,
    }
  ];
  return (
    data &&(
    <DndProvider backend={HTML5Backend}>
      <Table
      scroll={{ x: 800 }}
      size="small"
      showHeader={false}
      pagination={false}
        dataSource={data}
        columns={taskColumns}
        rowKey={(record: IProductBacklogItem) => record.id}
        expandable={{expandedRowRender: ExpandedRowRender, defaultExpandAllRows: false, rowExpandable: record => record.tasks && record.tasks.length > 0, }}
        components={components}
        onRow={(record, index) => ({
          index,
          moveRow,
        }) as any}
      />
    </DndProvider>)
  );
};*/

export const BacklogTableWithSprints: React.FC = () => {
  const { state } = useContext(AuthContext);
  const sprintPage = useSelector(
    (state: State) => state.sprintPage as ISprintList
  );
  const [IDs, setIDs] = useState<IFilters>({ oldSprintId: -1, newSprintId: -1, pbiId: -1, dropped:false });
  //console.log(sprintPage);
  const { token } = state;
  const loading = useSelector((appState: State) => appState.loading as boolean);
  const [filterPBI, setFiltersPBI] = useState<IPBIFilter>({
    pageNumber: config.defaultFilters.page,
    pageSize: config.defaultFilters.size, nameFilter: "",
  });
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const [initialRefresh, setInitialRefresh] = useState(true);
  const refreshRequired = useSelector((appState: State) => appState.productRequireRefresh as boolean);
  const sprintRefreshRequired = useSelector((appState: State) => appState.sprintRequireRefresh as boolean);
  const pbiPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
  const [fetchSprints, setFetchSprints] = useState(false);
  const [fetchSprintsPBI, setFetchSprintsPBI] = useState(false);
  const [fetchPBIs, setFetchPBIs] = useState(false);
  const [fetched, setFetched] = useState(false);

  const DraggableBodyRow = ({ index: index_row, moveRow, className, style, ...restProps }: BodyRowProps) => {
    const ref = useRef();
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: monitor => {
        const index = monitor.getItem() || {} as number;
        if (index === index_row) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: index as number < index_row ? ' drop-over-downward' : ' drop-over-upward',
        };
      },
      drop: (item: any) => {
        //console.log(IDs);
          setIDs({...IDs, dropped:true});
        //if (item.index && typeof (item.index) != "undefined") {
          //console.log("move backlog item");
          //moveRow(item.index, index_row);
        //}
      },
    });
    const [, drag] = useDrag({
      type,
      item: { index: index_row },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    });
    drop(drag(ref));
    return (
      <tr
        ref={ref as any}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{ cursor: "move", marginTop: "20px", marginBottom: "20px", ...style }}
        {...restProps}
      />
    );
  };

  const TaskTableforPBI: React.FC<IProductBacklogItem> = (item: IProductBacklogItem) => {
    const sprintsColumns = [
      { title: 'Name', align: 'left' as const, fixed: "left" as const, dataIndex: 'name', key: 'name' },
      {
        title: 'Finished',
        key: 'finished',
        dataIndex: 'finished',
        align: 'center' as const,
        render: (val: boolean) => (
          <span>
            <Badge status={val ? "success" : "error"} />
            {val ? "Finished" : "In Progress"}
          </span>
        ),
      },
      {
        key: "isAssignedToPBI",
        title: 'Assigned',
        dataIndex: 'isAssignedToPBI',
        render: (val: boolean) => (
          <span>
            <Badge status={val ? "success" : "error"} />
            {val ? "Assigned" : "Not Assigned"}
          </span>
        ),
        align: 'center' as const,

      },
      {
        title: 'Related Link',
        dataIndex: 'link',
        key: 'link',
        align: 'center' as const,
        render: (text: string) => <a href={text}>{"See on GitHub"}</a>
      },
      {
        title: 'Action', colSpan: 1, align: "center" as const, key: 'operation', render: () => {
          return (<Button type="link" onClick={() => { }} >
            {"Assign"}
          </Button>)
        }
        ,
      }
    ];
    const sprintsComponents = {
      body: {
        row: DraggableBodyRowNested,
      },
    };
    return (
      <DndProvider backend={HTML5Backend}>
        <Table
          size="small"
          showHeader={false}
          scroll={{ x: 800 }}
          rowKey={(record: ITask) => record.id}
          columns={sprintsColumns}
          components={sprintsComponents}
          dataSource={item.tasks}
          pagination={false}
          onRow={(record) => {
            return {
              onMouseEnter: () => { if (IDs.pbiId > 0 && IDs.oldSprintId !== item.sprintNumber ) 
                { setIDs({ ...IDs, newSprintId: item.sprintNumber, drop:true}) } },
            };
          }}/*({
          index,
          moveRowNested,
        }) as any}*/
        />
      </DndProvider>
    )
  };

  const PBITableforSprint: React.FC<ISprint> = (item: ISprint) => {
    const taskColumns = [
      { title: 'Name', fixed: "left" as const, colSpan: 2, dataIndex: 'name', key: 'name',},
      {
        title: 'Action', colSpan: 1, key: 'operation', render: () => {
          return (<Button type="link" onClick={() => { console.log("task") }} >
            {"Add Task"}
          </Button>)
        }

      }
    ];
    const nestedcomponents = {
      body: {
        row: DraggableBodyRow,
      },
    };

    return (
      <DndProvider backend={HTML5Backend}>
        <Table
          size="small"
          showHeader={false}
          scroll={{ x: 800 }}
          columns={taskColumns}
          rowKey={(record: IProductBacklogItem) => record.id}
          expandable={{
            expandedRowRender: TaskTableforPBI,/*expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <MinusCircleTwoTone onClick={e => {onExpand(record, e);}} />
              ) : (
                <PlusCircleTwoTone onClick={e => {onExpand(record, e);}} />
              )
          ,*/
            defaultExpandAllRows: false, rowExpandable: record => record.tasks && record.tasks.length > 0, }}
        components={nestedcomponents}
        dataSource={item.backlogItems}
        pagination={false}
        onRow={(record) => {
          return {
            //onDragStart:()=>{console.log("start")},//setIDs({ ...IDs, pbiId: record.id, oldSprintId: IDs.pbiId !== 0 ? item.sprintNumber : -1 });},
            onDrag:()=>{if(record.id !== IDs.pbiId)
              {setIDs({ ...IDs,pbiId: record.id, oldSprintId: IDs.pbiId !== 0 ? item.sprintNumber : -1 });}},
            //onDragEnd:()=>{console.log("end");},//setIDs({ ...IDs, newSprintId: -1, pbiId: -1, oldSprintId: -1 }) },
            //onPointerDown: () => { setIDs({ ...IDs, pbiId: record.id, oldSprintId: IDs.pbiId !== 0 ? item.sprintNumber : -1 }); },
            //onMouseUp: () => { setIDs({ ...IDs, newSprintId: -1, pbiId: -1, oldSprintId: -1 }) },
            //onClick:()=>{if (record.id!==0) {setIDs({ ...IDs, pbiId: record.id, oldSprintId: IDs.pbiId !== 0 ?item.sprintNumber:-1 });}},
            //onMouseUpCapture: () => { setIDs({ ...IDs, newSprintId: -1, pbiId: -1, oldSprintId: -1 }) },
            onMouseEnter: () => {let temp = IDs.pbiId > 0 
              && IDs.oldSprintId !==record.sprintNumber;
               setIDs({ ...IDs, newSprintId: temp?item.sprintNumber:-1 });
            },
            //onMouseLeave:()=>{console.log("leave");setIDs({ ...IDs,pbiId:-1, oldSprintId:-1});},
          };
        }}/*({
          index,
          moveRowNested,
        }) as any}*/
        />
      </DndProvider>
    )
  };

  useEffect(() => {
    if (initialRefresh) {
      store.dispatch(Actions.clearPBIsList());
      store.dispatch(Actions.clearSprintList());
      setInitialRefresh(false);
    }
  }, [initialRefresh]);

  useEffect(() => {
    if (refreshRequired && ownerName && ownerName !== "") {
      try {
        store.dispatch(
          Actions.fetchPBIsThunk({
            ownerName: ownerName,
            token: token,
            filters: {
              ...filterPBI,
              pageNumber: config.defaultFilters.page,
              pageSize: config.defaultFilters.pbiSize,
              inSprint: false
            }
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the pbis: ", err);
      }
      finally {
        setFetchPBIs(true);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired]);

  useEffect(() => {
    if (fetchPBIs && ownerName && ownerName !== "" && pbiPage && pbiPage.pageCount !== null) {
      setFetchPBIs(false);
      try {
        store.dispatch(
          Actions.fetchPBIsThunk({
            ownerName: ownerName,
            token: token,
            filters: {
              ...filterPBI,
              pageNumber: config.defaultFilters.page,
              pageSize: config.defaultFilters.pbiSize * pbiPage.pageCount,
              inSprint: false
            }
          })
          //filters
        );
      } catch (err) {
        console.error("Failed to fetch the pbis: ", err);
      }
      finally {
        setFetched(true);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pbiPage]);

  useEffect(() => {
    if (sprintRefreshRequired && ownerName && ownerName !== "") {
      try {
        store.dispatch(
          Actions.fetchSprintsThunk({
            token: token,
            ownerName: ownerName as string,
            filters: {
              pageSize: config.defaultFilters.sprintSize,
              pageNumber: config.defaultFilters.page,
            },
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the sprints: ", err);
      }
      finally {
        //console.log("count"+sprintPage.pageCount);
        setFetchSprints(true);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintRefreshRequired]);

  useEffect(() => {
    //console.log(sprintPage);
    if (fetchSprints && ownerName && ownerName !== "" && sprintPage && sprintPage.pageCount !== null) {
      setFetchSprints(false);
      try {
        store.dispatch(
          Actions.fetchSprintsThunk({
            token: token,
            ownerName: ownerName as string,
            filters: {
              pageSize: config.defaultFilters.sprintSize * sprintPage.pageCount,
              pageNumber: config.defaultFilters.page,
            },
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the sprints: ", err);
      }
      finally {
        setFetchSprintsPBI(true);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintPage]);

  useEffect(() => {
    if (!sprintRefreshRequired && fetchSprintsPBI) {
      // console.log("fetch sprint tasks");
      setFetchSprintsPBI(false);
      sprintPage.list.map((sprint: ISprint) => {
        sprint.backlogItems.map((item: IProductBacklogItem) => {
          // console.log(item.id);
          store.dispatch(
            Actions.addTasksToSprintThunk({
              token: token,
              ownerName: ownerName,
              pbiId: item.id
            }) //filters
          );
          return ({});
        })
        return ({});
      })
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSprintsPBI, sprintRefreshRequired]);

  useEffect(() => {
    if (!refreshRequired && fetched) {
      setFetched(false);
      // console.log("fetching tasks");
      //fetch unassigned tasks
      store.dispatch(
        Actions.addTasksToPBIThunk({
          token: token,
          ownerName: ownerName,
          pbiId: 0
        }) //filters
      );
      //fetch other tasks
      pbiPage.list.map((item: IProductBacklogItem) => {
        store.dispatch(
          Actions.addTasksToPBIThunk({
            token: token,
            ownerName: ownerName,
            pbiId: item.id
          }) //filters
        );
      })
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetched, refreshRequired]);
  const validate = (IDs: IFilters) => {
    if(IDs.dropped){
      setIDs({...IDs,oldSprintId: -1, newSprintId: -1, pbiId: -1,dropped:false});
      return(false);
     }
    return (IDs.oldSprintId !== -1 && IDs.newSprintId !== -1 && IDs.pbiId !== -1 && IDs.newSprintId !== IDs.oldSprintId)
  }
  useEffect(() => {
    if (!loading && !refreshRequired && !sprintRefreshRequired && validate(IDs)) {
      try {
        const ids = IDs;
        setIDs({ oldSprintId: -1, newSprintId: -1, pbiId: -1 });
        console.log("fetch");
        //fetch unassigned tasks
        if (ids.oldSprintId !== 0) {
          const oldSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === ids.oldSprintId);
          const oldPbis = oldSprint?.backlogItems.map((i: IProductBacklogItem) => { return ((i.id !== ids.pbiId ? i.id.toString() : "")) }).filter((x: string) => x !== "");
          store.dispatch(
            Actions.updateOneSprintThunk({
              token: token,
              ownerName: ownerName,
              sprintNumber: ids.oldSprintId,
              sprint: { ...oldSprint, pbIs: oldPbis as string[], goal: oldSprint?.goal as string }
            }) //filters
          );
        }
        if (ids.newSprintId !== 0) {
          const newSprint = sprintPage.list.find((i: ISprint) => i.sprintNumber === ids.newSprintId);
          const newPbis = newSprint?.backlogItems.map((i: IProductBacklogItem) => { return (i.id.toString()) }).concat([ids.pbiId.toString()]);
          store.dispatch(
            Actions.updateOneSprintThunk({
              token: token,
              ownerName: ownerName,
              sprintNumber: ids.newSprintId,
              sprint: { ...newSprint, pbIs: newPbis as string[], goal: newSprint?.goal as string }
            }) //filters
          );

        }
      }
      finally {
        setInitialRefresh(true);
      }
      //fetch other tasks
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IDs]);

  /* const DraggableBodyRow = ({ index: index_row, moveRow, className, style, ...restProps }:BodyRowProps) => {
     const ref = useRef();
     const [{ isOver, dropClassName }, drop] = useDrop({
       accept: type,
       collect: monitor => {
         const index  = monitor.getItem() || {} as number;
         if (index === index_row) {
           return {};
         }
         return {
           isOver: monitor.isOver(),
           dropClassName: index as number < index_row ? ' drop-over-downward' : ' drop-over-upward',
         };
       },
       drop: (item:any) => {
         console.log(item);
         if(item.index && typeof(item.index)!= "undefined"){
           console.log("move backlog item");
         moveRow(item.index, index_row);
         }
       },
     });
     const [, drag] = useDrag({
       type,
       item: { index: index_row },
       collect: monitor => ({
         isDragging: monitor.isDragging(),
       }),
     });
     drop(drag(ref));
   
     return (
       <tr
         ref={ref as any}
         className={`${className}${isOver ? dropClassName : ''}`}
         style={{ cursor: 'move', ...style }}
         {...restProps}
       />
     );
   };*/
  /*const getIndexInParent = (el: any) => Array.from(el.parentNode.children).indexOf(el);
  useEffect(() => {
   let start: any;
   let end;
   const container = document.querySelector(".ant-table-container");
   console.log(container);
   const drake = dragula([container as Element], {
     moves: (el) => {
       console.log(el);
       start = getIndexInParent(el);
       return true;
     },
   });

   drake.on("drop", (el) => { 
     console.log(el);
     end = getIndexInParent(el);
     console.log("end")
     //handleReorder(start, end);
   });
 }, []);*/

  const sprintColumns = [
    {
      title: 'Name', colSpan: 1, dataIndex: 'sprintNumber', key: 'sprintNumber',
      render: (sprintNumber: number) => {
        return (<>{sprintNumber === 0 ? "Product Backlog" : ("Sprint " + sprintNumber)}</>)
      },
    },
    {
      title: 'Action', colSpan: 1, align: "right" as const, key: 'operation', render: () => {
        return (<Button type="link" onClick={() => { }} >
          <a>Add Backlog Item</a>
        </Button>)
      }
      ,
    }
  ];
  const onSearch = (value: any) => { };//console.log(value);

  const fixedComponents = {
    body: {
      row: NonDraggableBodyRow,
    },
  };
  //console.log(loading+"/"+refreshRequired+"/"+ sprintRefreshRequired +"/"+  initialRefresh);
  //console.log(fetchPBIs+"/"+fetchSprints+"/"+ fetchSprintsPBI +"/"+  fetched);
  console.log(IDs);
  if (!state.isLoggedIn) { return <Navigate to="/login" />; }
  return (
    <>
      <Space direction="horizontal"
        style={{ marginLeft: "2%", marginRight: "2%" }}>
        <Search placeholder="input search text" onSearch={onSearch} enterButton />
        <Button>{"Add New Sprint"}</Button>

      </Space>
      {sprintPage && sprintPage.list && pbiPage && pbiPage.list &&
        //<DndProvider backend={HTML5Backend}>
        <Table
          //components={fixedComponents}
          style={{ borderSpacing: "separate", marginLeft: "2%", marginRight: "2%", marginTop: "2%" }}
          scroll={{ x: 800 }}
          size="small"
          loading={loading || refreshRequired || sprintRefreshRequired || initialRefresh || fetchPBIs || fetchSprints || fetchSprintsPBI || fetched}
          showHeader={false}
          pagination={false}
          dataSource={sprintPage.list.slice(0, 1).concat([{ sprintNumber: 0, goal: "Product Backlog", backlogItems: pbiPage.list } as ISprint] as ISprint[]).concat(sprintPage.list.slice(1))}
          columns={sprintColumns}
          rowKey={(record: ISprint) => record.sprintNumber}
          expandable={{
            expandedRowRender: PBITableforSprint, defaultExpandAllRows: false,
            rowExpandable: record => record.backlogItems && record.backlogItems.length > 0, defaultExpandedRowKeys: [0, 1]
          }}
          onRow={(record) => {
            return {
              //onClick: () => {console.log("clicked");console.log(record.sprintNumber);},
              //onClickCapture: () => {console.log("captured");console.log(record.sprintNumber);},
              //onMouseDown: () => {console.log("sprintId");console.log(record.sprintNumber);},
              //onMouseUp: () => {console.log("up");console.log(record.sprintNumber);},
              onMouseEnter: () => { setIDs({ ...IDs, newSprintId: IDs.pbiId > 0 
                && IDs.oldSprintId !==record.sprintNumber ? record.sprintNumber : -1 }) },
              onMouseLeave: () => { setIDs({ ...IDs, newSprintId: -1, pbiId: -1, oldSprintId: -1 }) },
            };
          }}
        />
        //</></DndProvider>
      }
    </>
  );
};