import { useContext, useState } from 'react';
import { Button, Card } from 'antd';
import styled from "styled-components";
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { IFilters, IRepository, State } from '../appstate/stateInterfaces';
import { AuthContext } from '../App';
import { Navigate } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { CalendarOutlined, FolderAddOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { store } from '../appstate/store';
import { clearReposList } from '../appstate/actions';

const { Meta } = Card;
//import { IRepositoryList } from '../AppState/stateInterfaces';
//import {Layout, Header, Content, Footer} from "antd";



export default function Home() {
  //const mock_data = initRepositoryList;
  const { state } = useContext(AuthContext);
  const { token } = state;
  const pages = useSelector(
    (state: State) => state.pages
  );
  const [filters, setFilters] = useState<IFilters>({
    pageNumber: config.defaultFilters.page,
    pageSize: config.defaultFilters.size,
  });
  const lastPage = useSelector((state: State) => state.reposLastPage); // eslint-disable-next-line
  const [displayLoader, setDisplayLoader] = useState(false); // eslint-disable-next-line
  const [repoId, setRepoId] = useState(0);
  const [fetching, setFetching] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [initialRefresh, setInitialRefresh] = useState(false);
  const repos = useSelector(
    (state: State) => state.repositories as IRepository[]
  );
  if (!state.isLoggedIn) {
    return <Navigate to="/login" />;
  }

  const fetchMore = () => {
    if (!fetching) {
      setFetching(true);
      try {
        store.dispatch(
          Actions.fetchRepositoriesThunk({
            filters: {
              ...filters,
              pageNumber: pages,
            },
            token: token,
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the repos: ", err);
      } finally {
        if (filters.page != null) {
          setFilters({ ...filters, pageNumber: pages + 1 });
        }
        setInitialRefresh(true);
        setFetching(false);
      }
    }
  };

  function addProject (prop: number) {
      try {        
        store.dispatch(
          Actions.addRepositoryThunk({
            id: prop,
            token: token,
          }) //filters
        );
      } catch (err) {
        console.error("Failed to add the repos: ", err);
      } finally {
        store.dispatch(clearReposList());
        setFetching(false);
        //navigate("/", { replace: true });
      }
    };
  return (
    <section className="container">
      <InfiniteScroll
        dataLength={repos.length}
        scrollThreshold={0.7}
        next={fetchMore}
        hasMore={!lastPage && !fetching}
        loader={
          (displayLoader && <LoadingOutlined />) || (!displayLoader && <></>)
        }
      >
        <CardWrapper>
          {
            repos.map((rep: IRepository) => {
              return (<section className="card" style={{ width: "100%", }} key={rep.gitHubId} >
                <Card style={{ backgroundColor: "white" }} type="inner" actions =
                {[<Button disabled={rep.alreadyInScrumHub} style={{width:"180px"}} onClick={()=>{addProject(rep.gitHubId)}} ><span><FolderAddOutlined disabled={!rep.alreadyInScrumHub}/>
                {" Add to ScrumHub"}</span></Button>,
                <Button disabled={!rep.alreadyInScrumHub} style={{width:"180px"}} href={rep.gitHubId as unknown as string}><span><InfoCircleOutlined/>{" Project Details"}</span></Button>,
                <Button style={{width:"180px"}}><span><CalendarOutlined/>
                {rep.dateOfLastActivity === "No recent activity" ? " Not updated":" Updated "+ new Date(rep.dateOfLastActivity as Date).toLocaleString(['en-US'],{year:'numeric', month:'short', day:'numeric'})}</span></Button>
                ]}>
                <Meta
                  title={rep.name.split("/")[1]}
                  description={rep.description}
                ></Meta>
                <br/>
                <p>{"There are " + rep.sprints.length + " sprints."}</p>
                <p>{"There are " + rep.backlogItems.length + " backlog items.\n"}</p>
                <p>{rep.typeOfLastActivity + " backlog items.\n"}</p>
                  <a href={rep.gitHubId as unknown as string}></a>
                

              </Card>
            </section>);
          })
        }
      </CardWrapper>
    </InfiniteScroll>
    </section >
  );

}

const CardWrapper = styled.div`
display: grid;
place-items: center;
margin: 70px;
background: linear-gradient(to bottom, transparent, gray);
`;





