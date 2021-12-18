import { useContext, useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import './Home.css';
import { IFilters, IRepository, State } from '../appstate/stateInterfaces';
import { AuthContext } from '../App';
import { Navigate, useNavigate } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { CalendarOutlined, FolderAddOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { store } from '../appstate/store';
import { clearReposList } from '../appstate/actions';
import SkeletonList, { CantAddToShButton, InShButton } from './utility/LoadAnimations';
import { dateFormat } from './utility/commonFunctions';
const { Meta } = Card;


export default function Home() {
  const { state } = useContext(AuthContext);
  const { token, isLoggedIn } = state;
  const [filters, setFilters] = useState<IFilters>({
    pageNumber: config.defaultFilters.page,
    pageSize: config.defaultFilters.size,
  });
  const lastPage = useSelector((state: State) => state.reposLastPage); // eslint-disable-next-line
  const [displayLoader, setDisplayLoader] = useState(false); // eslint-disable-next-line
  const [fetching, setFetching] = useState(false);
  const loading = useSelector((state: State) => state.loading);
  const refreshRequired = useSelector(
    (appState: State) => appState.reposRequireRefresh as boolean
  );
  const repos = useSelector(
    (state: State) => state.repositories as IRepository[]
  );
  const navigate = useNavigate();
  const [initialRefresh, setInitialRefresh] = useState(true);
  useEffect(() => {
    if (initialRefresh) {
      setInitialRefresh(false);
      store.dispatch(clearReposList());
    }
  }, [initialRefresh]);

  useEffect(() => {
    if (isLoggedIn && refreshRequired) {
      setDisplayLoader(true);
      try {
        store.dispatch(
          Actions.fetchRepositoriesThunk({
            filters: {
              pageSize: config.defaultFilters.size,
              pageNumber: config.defaultFilters.page,
            },
            token: token,
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the repos: ", err);
      }
      finally {
        setFilters({ ...filters, pageNumber: config.defaultFilters.page + 1 });
        setDisplayLoader(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired, isLoggedIn]);

  const fetchMore = () => {
    if (!fetching) {
      setFetching(true);
      try {
        store.dispatch(
          Actions.fetchRepositoriesThunk({
            filters: {
              ...filters,
              pageNumber: filters.pageNumber,
            },
            token: token,
          }) //filters
        );
      } catch (err) {
        console.error("Failed to fetch the repos: ", err);
      } finally {
        setFilters({ ...filters, pageNumber: filters.pageNumber + 1 });
        setFetching(false);
      }
    }
  };

  function addProject(prop: number) {
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
      setFilters({ ...filters, pageNumber: config.defaultFilters.page });
      //setInitialRefresh(true);
    }
  };

  function redirectToProject(props: IRepository) {
    localStorage.setItem("ownerName", props.name);
    try {
      store.dispatch(
        Actions.fetchPBIsThunk({
          ownerName: props.name,
          token: token,
          filters: {
            ...filters,
            pageSize: config.defaultFilters.pbiSize
          }
        }) //filters
      );
    } catch (err) {
      console.error("Failed to add the repos: ", err);
      localStorage.setItem("ownerName", "");
    } finally {
      navigate(`/${props.name.split("/")[0]}/${props.name.split("/")[1]}`, { replace: true });
    }

  };

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return (
    <section className="container">
      <InfiniteScroll
      dataLength={repos ? repos.length : 0}
      scrollThreshold={0.7}
      next={fetchMore}
      hasMore={!lastPage && !fetching}
      loader={<></>}>
      <div className="reposGrid">
        {repos.map((rep: IRepository) => {
          return (<section className="card" style={{ width: "85%" }} key={rep.gitHubId} >
            <Card className='repoCard' type="inner" actions=
              {[!rep.hasAdminRights ? <CantAddToShButton/>:(rep.alreadyInScrumHub ? <InShButton/>:
                <Button disabled={false} className='cardButton' onClick={() => { addProject(rep.gitHubId) }} >
                <span>{<FolderAddOutlined disabled={false} />}{" Add to ScrumHub" }</span></Button>),
              <Button disabled={!rep.alreadyInScrumHub} type="primary" className='cardButton' onClick={() => { redirectToProject(rep) }}><span><InfoCircleOutlined />{" Manage project"}</span></Button>,
              <Button className='calButton'><span><CalendarOutlined />{rep.typeOfLastActivity === "No recent activity" ? " Not updated" : " " + dateFormat(rep.dateOfLastActivity as Date)}</span></Button>]}>
              <Meta
                title={rep.alreadyInScrumHub ? <div className='link-button' onClick={() => { redirectToProject(rep) }}>{rep.name.split("/")[1]}</div> : <div>{rep.name.split("/")[1]}</div>}
                description={rep.description}
              ></Meta>
              <br />
              <p>{"This project has " + (rep.sprints && rep.sprints.length === 1 ? "1 sprint and " : (rep.sprints.length + " sprints and ")) + (rep.backlogItems && rep.backlogItems.length === 1 ? "1 backlog item.\n" : rep.backlogItems.length + " backlog items.\n")}</p>
              <p>{rep.typeOfLastActivity + (rep.dateOfLastActivity === "No recent activity" ? " " : " was the last activity") + " in the repository."}</p>
            </Card>
          </section>);
        })
        }
        <SkeletonList loading={loading} number={repos.length < 1?5:1} />
      </div>
    </InfiniteScroll>
    </section >
  );
}
