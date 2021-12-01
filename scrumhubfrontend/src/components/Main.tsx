import { Layout, Menu, Typography} from 'antd';
import { Navigate, useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import * as Actions from '../appstate/actions';
import 'antd/dist/antd.css';
import { CarOutlined, FileOutlined, GithubOutlined, HourglassOutlined, LaptopOutlined, NotificationOutlined, PaperClipOutlined, PieChartOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import AppRouter from '../Approuter';
import { AuthContext } from '../App';
import { store } from '../appstate/store';
import { clearReposList } from '../appstate/actions';
import config from '../configuration/config';
import { useSelector } from 'react-redux';
import { State } from '../appstate/stateInterfaces';
import SubMenu from 'antd/lib/menu/SubMenu';
import logo from './scrum.jpg';
const { Header, Footer, Content, Sider} = Layout;



function Main(props: any) {
  const { state, dispatch: unAuth } = useContext(AuthContext);
  const { token, isLoggedIn } = state;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const [logout, setLogout] = useState(false);
  const [initialRefresh, setInitialRefresh] = useState(true);
  const refreshRequired = useSelector(
    (appState: State) => appState.reposRequireRefresh as boolean
  );
  const ownerName = localStorage.getItem("ownerName")?localStorage.getItem("ownerName"):"";
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
      //clearing local storage
      localStorage.removeItem("ownerName");
      localStorage.clear();
      store.dispatch(clearReposList());
      unAuth({
        type: "LOGOUT"
      });
      setLogout(false);
    }
  }, [state, unAuth, data, logout, token]);

  useEffect(() => {
    if (initialRefresh) {
      store.dispatch(clearReposList());
      setInitialRefresh(false);
    }
  }, [initialRefresh]);

  useEffect(() => {
    if (state.isLoggedIn && refreshRequired) {
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
        //setFilters({ ...filters, pageNumber: config.defaultFilters.page + 1 });
        setInitialRefresh(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequired, state.isLoggedIn]);

  const handleLogout = () => {
    setLogout(true);
  }

  const handleProjects = () => {
    localStorage.removeItem("ownerName");
    navigate("/", { replace: true });
  }

  const handleTeams = () => {
    localStorage.removeItem("ownerName");
    navigate("/teams", { replace: true });
  }

  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <section className="container">
      <Layout style={{ minHeight: "100vh" }}>
        <Header hidden={!isLoggedIn} style={{ minHeight: "15%", minWidth: "100%" }}>
          <Menu mode="horizontal" theme="dark" style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Menu.Item key="proj" style={{ marginRight: "20px", marginLeft: "20px", fontSize: "20px" }} onClick={()=> handleProjects()}>Projects</Menu.Item>
            <Menu.Item key="team" style={{ marginRight: "20px", marginLeft: "20px", fontSize: "20px" }}onClick={()=> handleTeams()}>Teams</Menu.Item>
            <Menu.Item key="logout" onClick={() => handleLogout()} style={{ marginRight: "20px", marginLeft: "20px", fontSize: "20px" }}>Logout</Menu.Item>
          </Menu>
        </Header>
        <Content className="content">
          <Layout className="site-layout-background" style={{ padding: ownerName === "" ? '':'24px 0' }}>
          <Sider hidden={ownerName === ""} theme="dark" style={{backgroundColor:"white", borderColor:"transparent"}} collapsedWidth="0" onCollapse={()=>setIsCollapsed(!isCollapsed)} collapsible={true} collapsed={isCollapsed} className="site-layout-background" width={200}>
          <Menu
          mode="inline"
          defaultSelectedKeys={['2']}
          style={{ height: '100vh' }}
          >
          <Menu.Item key="1"><FileOutlined />
              <span>Project Details</span></Menu.Item>
          <Menu.Item key="2"><FileOutlined />
              <span>Product Backlog</span></Menu.Item>
          <Menu.Item key="3"><FileOutlined />
              <span>Sprint Backlog</span></Menu.Item>
          <Menu.Item key="4"><CarOutlined />
              <span>Sprint Backlog</span></Menu.Item>
          <Menu.Item key="5"><HourglassOutlined />
              <span>Planning Poker</span></Menu.Item>
              <Menu.Item key="6"><PieChartOutlined />
              <span>Progress Report</span></Menu.Item>
          </Menu>
          </Sider>
          <Content style={ownerName === "" ?{}:{ padding: '0 50px', minHeight: 280 }}>
          <AppRouter />
          </Content>
          </Layout>
        </Content>
        <Footer hidden={!isLoggedIn} style={{ textAlign: 'center', minHeight: "10%" }}>ScrumHub © Created in 2021{true && (<a
          href="http://github.com/ScrumHub/ScrumHub"
          target="_blank"
          rel="noreferrer"
          className="GithubFooter"
        >
          <GithubOutlined style={{marginLeft:"5px"}}/>
        </a>)}
        </Footer>
      </Layout>
    </section>
  );
}

export default Main;
