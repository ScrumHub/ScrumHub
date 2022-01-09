import { Avatar, Breadcrumb, Layout, Menu, message, PageHeader } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { useContext } from 'react';
import 'antd/dist/antd.css';
import { DatabaseOutlined, GithubOutlined, ProjectOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import AppRouter from '../Approuter';
import { AuthContext } from '../App';
import { store } from '../appstate/store';
import { clearState } from '../appstate/actions';
//@ts-ignore
import { useCookies } from "react-cookie";
import * as Actions from '../appstate/actions';
import './Main.css';
import { useSelector } from 'react-redux';
import { ISprint, State } from '../appstate/stateInterfaces';
import { routes } from './utility/BodyRowsAndColumns';
const { Header, Footer, Content, Sider } = Layout;
const { SubMenu } = Menu;

function ItemRender(route: any, params: any[], routes: any[], paths: any[]) {
  return (<span key={route.path}>{(route.icon ? route.icon : "")}{" " + route.breadcrumbName}</span>)
}

function Main(props: any) {
  const { state, dispatch: unAuth } = useContext(AuthContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies();
  const [load, setLoad] = useState(false);
  const { isLoggedIn, token } = state;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const location = useLocation();
  const error = useSelector((appState: State) => appState.error);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const [logout, setLogout] = useState(false);
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") : "";
  const currentUser = useSelector((appState: State) => appState.currentUser);
  const activeSprintNumber = useSelector((appState: State) => appState.activeSprintNumber);
  const sprintID = localStorage.getItem("sprintID") ? localStorage.getItem("sprintID") as string : "";
  const sprintPage = useSelector((appState: State) => appState.openSprint as ISprint);
  const loading = useSelector((appState: State) => appState.loading);
  useEffect(() => {
    if (logout || (!isLoggedIn)) {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      store.dispatch(clearState());
      removeCookie("token", { path: "/" });
      unAuth({
        type: "LOGOUT"
      });
      setLogout(false);
      if (!state.isLoggedIn) {
        navigate("/login",{replace:true});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, isLoggedIn]);
  const handleLogout = () => {
    setLogout(true);
  }
  const handleProjects = () => {
    store.dispatch(Actions.clearProject());
    localStorage.removeItem("ownerName");
    localStorage.removeItem("sprintID");
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
      //store.dispatch(clearReposList());
    }
    
  }
  const [selectedSiderKey, setSelectedSiderKey] = useState('2');
  const handlePBacklog = () => {
    if (ownerName && ownerName !== "") {
      const newPath = `/${ownerName.split("/")[0]}/${ownerName.split("/")[1]}`;
      if (location.pathname !== newPath) {
        //localStorage.removeItem("sprintID");
        setSelectedSiderKey('ProductBacklog');
        //return(<Link to={newPath} replace={true}/>);
        navigate(newPath, { replace: true });
      }
    }
  }
  const handleActiveSprint = () => {
    if (ownerName && ownerName !== "" && activeSprintNumber !== -1) {
      const newPath = `/${ownerName.split("/")[0]}/${ownerName.split("/")[1]}/active-sprint`;
      if (location.pathname !== newPath) {
        localStorage.setItem("sprintID", JSON.stringify(activeSprintNumber));
        setSelectedSiderKey('ActiveSprint');
        store.dispatch(Actions.fetchOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: Number(localStorage.getItem("sprintID") as string) }));
        store.dispatch(Actions.fetchPeopleThunk({ownerName,token}));
        navigate(newPath, { replace: true });
      }
    }
  }
  useEffect(() => {
    if (error.hasError && error.erorMessage !== "") {
      message.error(error.erorMessage, 2);
      store.dispatch(Actions.clearError());
    }
  }, [error]);

  useEffect(() => {
    if (state.isLoggedIn && !currentUser.isCurrentUser && !load) {
      setLoad(true);
      store.dispatch(
        Actions.getCurrentUserThunk({
          token: token,
        })
      ).then(()=>{setLoad(false);});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, load, state.isLoggedIn]);

  if(ownerName === null && location.pathname !== "/"){handleProjects();}

  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <section className="container">
      <Layout style={{ height: "100vh" }}>
        <Header hidden={!isLoggedIn} className="clearfix" style={{ position: 'fixed', zIndex: 1, padding: 0, height: "5vh", lineHeight: "5vh", width: "100%", backgroundColor: "#f0f0f0" }}>
          <Menu mode="horizontal" theme="light"
            className="mainMenu" >
              <SubMenu style={{ float: "unset" }} key="SubMenu0" title={currentUser.isCurrentUser?currentUser.login:""} icon={
                currentUser.isCurrentUser?<Avatar style={{ transform: "scale(0.8)", marginBottom: "0.4vh" }} size="small" src={`${currentUser.avatarLink}`} ></Avatar>:<></>}>
                {currentUser.isCurrentUser&&<Menu.Item key="SubMenu4">
                <a href={"https://github.com/" + currentUser.login}>See on Github</a>
                </Menu.Item>}

              </SubMenu>
            <Menu.Item className='mainMenuItem' key="proj" onClick={() => handleProjects()}><span style={{ maxHeight: "1vh" }}>Projects</span></Menu.Item>
            <Menu.Item className='mainMenuItem' key="logout" onClick={() => handleLogout()} >Logout</Menu.Item>
          </Menu>
        </Header>
        <Content className="content">
          <Layout className="site-layout-background" style={{ /*padding: ownerName === "" ? '':'24px 0' */ }}>
            <Sider hidden={ownerName === ""} theme="light" collapsedWidth={40} style={{ marginTop: "5vh", height: 'auto', backgroundColor: "white", borderColor: "transparent" }} onCollapse={() => setIsCollapsed(!isCollapsed)} collapsible={true} collapsed={isCollapsed} className="site-layout-background" width={200}>
              <Menu
                mode="inline"
                style={{ position: "fixed", width: isCollapsed ? 40 : 200 }}
                defaultSelectedKeys={[selectedSiderKey]}
              >
                {/*<Menu.Item key="1" icon={<ProjectOutlined />}>
                  <span>Project Details</span></Menu.Item>
                */}<Menu.Item key="ProductBacklog" onClick={() => handlePBacklog()} icon={<DatabaseOutlined />}>
                  <span>Product Backlog</span></Menu.Item>
                  {<Menu.Item key="ActiveSprint" onClick={() => handleActiveSprint()} disabled={activeSprintNumber===-1} icon={<ProjectOutlined />}>
                  <span>Active Sprint</span></Menu.Item>
                }
              </Menu>
            </Sider>
            <Content style={ownerName === "" ? {} : { padding: '0 50px' }}>
              <div style={{ minHeight: "90vh", margin: 0 }}>
                {ownerName !== "" && <PageHeader className="pageHeader"
                  title={<div style={{ fontWeight: "bold", lineHeight: 1.25, paddingTop: 0, marginTop: 0, }}>{sprintID && sprintID !== "0" && sprintPage && sprintPage.title && Number(sprintID)===sprintPage.sprintNumber?sprintPage.title: location.pathname.includes("Sprint")?"":"Product Backlog"}</div>}
                  breadcrumb={<Breadcrumb style={{ marginTop: 0, marginBottom: 0, }} itemRender={ItemRender} routes={routes(ownerName, sprintID, location)} />}
                >
                </PageHeader>}
                <AppRouter />
              </div>
              <Footer hidden={!isLoggedIn} style={{ margin: 0, lineHeight: "5vh !important", padding: 0, textAlign: 'center', height: "5vh", verticalAlign: "bottom" }}>
                {<a
                  href="http://github.com/ScrumHub/ScrumHub"
                  target="_blank"
                  rel="noreferrer"
                  className="GithubFooter"
                >
                  <GithubOutlined style={{ marginLeft: "5px" }} />
                  {" ScrumHub"}
                </a>}{"  © Created in 2021"}

              </Footer>
            </Content>

          </Layout>
        </Content>

      </Layout>
    </section>
  );
}

export default Main;