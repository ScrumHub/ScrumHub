import { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Divider, PageHeader, Row } from 'antd';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { IFilters, initSprint, IProductBacklogItem, IProductBacklogList, IRepository, ISprint, ISprintList, State } from '../appstate/stateInterfaces';
import { AuthContext } from '../App';
import { Navigate, useNavigate } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { CalendarOutlined, FolderAddOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { store } from '../appstate/store';
import { clearReposList, clearSprintList } from '../appstate/actions';
import { CustomAddSprintPopup } from './CustomAddSprintPopup';
const { Meta } = Card;


export default function SprintList() {
  const { state } = useContext(AuthContext);
  const { token, isLoggedIn } = state;
  const [filters, setFilters] = useState<IFilters>({
    pageNumber: config.defaultFilters.page,
    pageSize: config.defaultFilters.sprintSize,
  });
  const lastPage = useSelector((state: State) => state.sprintLastPage); // eslint-disable-next-line
  const [displayLoader, setDisplayLoader] = useState(false); // eslint-disable-next-line
  const [fetching, setFetching] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const refreshRequired = useSelector(
    (appState: State) => appState.sprintRequireRefresh as boolean
  );
  const sprintPage = useSelector(
    (state: State) => state.sprintPage as ISprintList
  );
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const loading=useSelector(
    (state: State) => state.loading
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") : "";
  const sprintID = localStorage.getItem("sprintID") ? localStorage.getItem("sprintID") : "";
  const navigate = useNavigate();
  const [initialRefresh, setInitialRefresh] = useState(true);
  useEffect(() => {
    if (initialRefresh) {
      setInitialRefresh(false);
      store.dispatch(clearSprintList());
    }
  }, [initialRefresh]);

  const tempPBIPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
  const handleUpdate= () => {
    try {
      store.dispatch(
        Actions.fetchPBIsThunk({
          ownerName: ownerName as string,
          token: token,
          filters: {
            pageNumber: filters.pageNumber,
            pageSize: config.defaultFilters.pbiSize,
            estimated: true
          }
        }) //filters
      );
    } catch (err) {
      console.error("Failed to fetch the pbis: ", err);
    }
  }

  const fetchMoreUpdates=() => {
    if(tempPBIPage.pageCount > 1){
    try {
      store.dispatch(
        Actions.fetchPBIsThunk({
          ownerName: ownerName as string,
          token: token,
          filters: {
            pageNumber: 1,
            pageSize: config.defaultFilters.pbiSize*tempPBIPage.pageCount,
            estimated: true
          }
        }) //filters
      );
    } catch (err) {
      console.error("Failed to fetch the pbis: ", err);
    }
  }
  }

  useEffect(() => {
    if (isLoggedIn && refreshRequired) {
      try {
        store.dispatch(
          Actions.fetchSprintsThunk({
            token: token,
            ownerName:ownerName as string,
            filters: {
              pageSize: config.defaultFilters.sprintSize,
              pageNumber: config.defaultFilters.page,
            },
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch sprints: ", err);
      } 
      finally{
        setFilters({ ...filters, pageNumber: config.defaultFilters.page + 1 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired, isLoggedIn]);

  const fetchMore = () => {
    if (!fetching) {
      setFetching(true);
      try {
        store.dispatch(
          Actions.fetchSprintsThunk({
            token: token,
            ownerName:ownerName as string,
            filters: {
              ...filters,
              pageNumber: filters.pageNumber,
            },
            
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch sprints: ", err);
      } finally {
        setFilters({ ...filters, pageNumber: filters.pageNumber + 1 });
        setFetching(false);
      }
    }
  };

   const handleSprintAdd=(pbi: ISprint)=> {
    setIsAddModalVisible(false);
    const ids = pbi.backlogItems.map((value: IProductBacklogItem) => 
   {  return((value.sprintNumber === Number(sprintID) ? value.id.toString():"")) }).filter((x) => x !== "");
    try {
      store.dispatch(
        Actions.addSprintThunk({
          token: token as string,
          ownerName: ownerName as string,
          sprint:{"number":pbi.sprintNumber, "goal":pbi.goal, "pbIs":ids}
        }) //filters
      );
    } catch (err) {
      console.error("Failed to add the sprint: ", err);
    } finally {
      //setFilters({ ...filters, pageNumber: config.defaultFilters.page });
      //setInitialRefresh(true);
    }
  };
  function openSprint(props: number) {
    localStorage.setItem("sprintID", JSON.stringify(props));
    try {
      store.dispatch(
        Actions.fetchOneSprintThunk({
          token: token,
          ownerName: ownerName as string,
          sprintNumber:props
          
        }) 
      );
    } catch (err) {
      console.error("Failed to open the repo: ", err);
      localStorage.setItem("ownerName", "");
    } finally {
      navigate(`/${(ownerName as string).split("/")[0]}/${(ownerName as string).split("/")[1]}/sprints/${props}`, { replace: true });
    } 
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return (
    <section className="container" style={{ marginLeft:"1vh", marginRight:"1vh"}}>
      <PageHeader
        ghost={false}
        title={"Sprint List"}
        subTitle={`The number of sprints in ${ownerName?.split("/")[1]} is ${sprintPage && sprintPage.list ?sprintPage.list.length: 0}.`}
        extra={[
          <Button key="1" type="link" onClick={()=>{handleUpdate();fetchMore();setIsAddModalVisible(true);}}> Add New Sprint </Button>,
        ]}
        style={{ marginBottom: "4vh",}}
      >
      </PageHeader>
      <Divider style={{alignSelf:"center"}}/>
      {sprintPage && sprintPage.list && 
      <InfiniteScroll
        dataLength={sprintPage.list.length}
        scrollThreshold={0.7}
        next={fetchMore}
        hasMore={!lastPage && !fetching}
        loader={
          (displayLoader && <LoadingOutlined />) || (!displayLoader && <></>)
        }>
          <Row style={{ background:"transparent", marginLeft:"1vh", marginRight:"1vh",width:"95%"}} gutter={{xs:8, sm:16, md:24, lg:32}}>
          {
            sprintPage.list.map((rep: ISprint,key:number) => {
              
              return (<section className="card" 
              style={{ width: "46%", height:"30vh",marginTop:"3vh", marginBottom:"3vh", marginLeft:"2%",marginRight:"2%"}} key={rep.sprintNumber} >
                <Card style={{ backgroundColor: "white" }} type="inner" actions=
                  {[<Button onClick={() => { openSprint(rep.sprintNumber) }} >
                    {" Open Sprint "}</Button>,]}>
                  <Meta
                  style={{height:"10vh"}}
                    title={"Sprint "+rep.sprintNumber}
                    description={rep.goal} 
                  ></Meta>
                  <br />
                  <p>{"There "+(rep.backlogItems.length===1?"is 1 backlog item in this sprint.":"are " +rep.backlogItems.length + " backlog items in this sprint.")}</p>
                </Card>
              </section>)
            })
          }
          </Row>
        </InfiniteScroll>}
        {isAddModalVisible && !loading && <CustomAddSprintPopup data={initSprint} pbiData={tempPBIPage.list as IProductBacklogItem[]} visible={isAddModalVisible}
          onCreate={function (values: any): void { handleSprintAdd(values) }}
          onCancel={() => { setIsAddModalVisible(false); }} />}
    </section >
  );

}
