import { useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import './Home.css';
import { IFilters, IRepository, IState } from '../appstate/stateInterfaces';
import { useNavigate } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { CalendarOutlined, FolderAddOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { store } from '../appstate/store';
import { clearReposList } from '../appstate/actions';
import SkeletonList, { CantAddToShButton, InShButton } from './utility/LoadAnimations';
import { dateFormat, isArrayValid } from './utility/commonFunctions';
const { Meta } = Card;


export function Home() {
  const isLoggedIn = useSelector((appState: IState) => appState.loginState.isLoggedIn);
  const token = useSelector((appState: IState) => appState.loginState.token);
  const [filters, setFilters] = useState<IFilters>({pageNumber: config.defaultFilters.page,pageSize: config.defaultFilters.size,});
  const lastPage = useSelector((state: IState) => state.reposLastPage);
  const [displayId, setDisplayId] = useState(-1);
  const [fetching, setFetching] = useState(false);
  const loading = useSelector((state: IState) => state.loading);
  const refreshRequired = useSelector(
    (appState: IState) => appState.reposRequireRefresh as boolean
  );
  const repos = useSelector(
    (state: IState) => state.repositories as IRepository[]
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
      try {
        store.dispatch(
          Actions.fetchRepositoriesThunk({
            filters: {
              pageSize: config.defaultFilters.size,
              pageNumber: config.defaultFilters.page,
            },
            token: token,
          })
        );
      } catch (err) {
        console.error("Failed to fetch the repos: ", err);
      }
      finally {
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
          Actions.fetchRepositoriesThunk({
            filters: {
              ...filters,
              pageNumber: filters.pageNumber,
            },
            token: token,
          }) 
        );
      } catch (err) {
        console.error("Failed to fetch the repos: ", err);
      } finally {
        setFilters({ ...filters, pageNumber: filters.pageNumber + 1 });
        setFetching(false);
      }
    }
  };

  function addProject(projId: number) {
    setDisplayId(projId);
      store.dispatch(
        Actions.addRepositoryThunk({
          id: projId,
          token: token,
        })
      )
      .catch((error: any)=>{console.error("Failed to fetch the pbis: ", error);
      setDisplayId(-1);
      return({});})
      .then(()=>setDisplayId(-1));
  };

  function redirectToProject(props: IRepository) {
    localStorage.setItem("ownerName", props.name);
    navigate(`/${props.name.split("/")[0]}/${props.name.split("/")[1]}`, { replace: true });
  };

  return (
    <div>
      <InfiniteScroll
      scrollableTarget="scrollableDiv"
      dataLength={isArrayValid(repos) ? repos.length : 0}
      scrollThreshold={0.7}
      next={fetchMore}
      hasMore={!lastPage && !fetching}
      loader={<></>}>
      <div className="reposGrid">
        {isArrayValid(repos) && repos.map((rep: IRepository) => {
          return (<section className="card" style={{ width: "85%" }} key={rep.gitHubId} >
            <Card loading={rep.gitHubId===displayId &&loading } className='repoCard' type="inner" actions=
              {[!rep.hasAdminRights ? <CantAddToShButton/>:(rep.alreadyInScrumHub ? <InShButton/>:
                <Button loading={rep.gitHubId===displayId &&loading } disabled={false} className='cardButton' onClick={() => { addProject(rep.gitHubId);}} >
                <span>{<FolderAddOutlined disabled={false} />}{" Add to ScrumHub" }</span></Button>),
              <Button loading={rep.gitHubId===displayId &&loading} disabled={!rep.alreadyInScrumHub} type="primary" className='cardButton' onClick={() => { redirectToProject(rep) }}><span><InfoCircleOutlined />{" Manage project"}</span></Button>,
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
        <SkeletonList loading={loading  || refreshRequired} number={repos.length < 1?5:1} />
      </div>
    </InfiniteScroll>
    </div >
  );
}