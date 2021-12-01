import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { GithubOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import AppRouter from '../Approuter';
import { AuthContext } from '../App';
import { store } from '../appstate/store';
import { clearReposList } from '../appstate/actions';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { State } from '../appstate/stateInterfaces';
const { Header, Footer, Content } = Layout;




function Main(props: any) {
  const { state, dispatch } = useContext(AuthContext);
  const { token, isLoggedIn } = state;
  const refreshRequired = useSelector(
    (appState: State) => appState.reposRequireRefresh as boolean
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigation = useNavigate();
  //const { state, dispatch } = useContext(AuthContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const [logout, setLogout] = useState(false);
  const [initialRefresh, setInitialRefresh] = useState(true);
  //const { avatar_url, name, public_repos, followers, following } = state.user

  useEffect(() => {
    if (state.isLoggedIn && (refreshRequired || initialRefresh)) {
      //store.dispatch(clearReposList());
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
      } finally {
        setInitialRefresh(false);
      }
    }
  }, [initialRefresh, refreshRequired, state.isLoggedIn, token]);

  useEffect(() => {
    if (logout) {
      //deleteCookie("user_session", "/", "github.com")
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      store.dispatch(clearReposList());
      dispatch({
        type: "LOGOUT"
      });
      setLogout(false);
    }
  }, [state, dispatch, data, logout, token]);

  if (!state.isLoggedIn) {
    //return (<Navigate to="/login" />);
  }

  const handleLogout = () => {
    setLogout(true);
  }
  return (
    <section className="container">
      <Layout style={{ minHeight: "100vh" }}>
        <Header hidden={!isLoggedIn} style={{ minHeight: "15%", minWidth: "100%" }}>
          <Menu mode="horizontal" theme="dark" style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Menu.Item key="proj" style={{ marginRight: "20px", marginLeft: "20px", fontSize: "20px" }}><NavLink to="/">Projects</NavLink></Menu.Item>
            <Menu.Item key="team" style={{ marginRight: "20px", marginLeft: "20px", fontSize: "20px" }}><NavLink to="/teams">Teams</NavLink></Menu.Item>
            <Menu.Item key="logout" onClick={() => handleLogout()} style={{ marginRight: "20px", marginLeft: "20px", fontSize: "20px" }}>Logout</Menu.Item>
          </Menu>
        </Header>
        <Content className="content"></Content>
        <AppRouter />
        <Footer hidden={!isLoggedIn} style={{ textAlign: 'center', minHeight: "10%" }}>ScrumHub © Created in 2021{true && (<a
          href="http://github.com/ScrumHub/ScrumHub"
          target="_blank"
          rel="noreferrer"
          className="GithubFooter"
        >
          <GithubOutlined />
        </a>)}
        </Footer>
      </Layout>
    </section>
  );
}

export default Main;
