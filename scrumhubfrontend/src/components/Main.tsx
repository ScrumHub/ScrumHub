import { Avatar, Breadcrumb, Layout, Menu, message, PageHeader } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import 'antd/dist/antd.css';
import { DatabaseOutlined, GithubOutlined, ProjectOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { AppRouter } from '../Approuter';
import { store } from '../appstate/store';
import * as Actions from '../appstate/actions';
import './Main.css';
import './ProductBacklog.css';
import { useSelector } from 'react-redux';
import { ISprint, IState } from '../appstate/stateInterfaces';
import { routes } from './tables/TableUtilities';
import { clearLocalStorage, clearProjectLocalStorage, getOwnerNameLocation, getSprintLocation, isMessageValid } from './utility/commonFunctions';
import { ItemRender } from './utility/LoginAndMainHandlers';
import { isNull } from 'lodash';
const { Header, Footer, Content, Sider } = Layout;
const { SubMenu } = Menu;

/**
 * @returns {Element} Main Component that contains header, footer, sidebar
 *  along with the routes to all other subviews
 */
export function Main(props: any) {
  const isLoggedIn = useSelector((appState: IState) => appState.loginState.isLoggedIn);
  const token = useSelector((appState: IState) => appState.loginState.token);
  const client_id = useSelector((appState: IState) => appState.loginState.client_id);
  const error = useSelector((appState: IState) => appState.error);
  const currentUser = useSelector((appState: IState) => appState.currentUser);
  const activeSprintNumber = useSelector((appState: IState) => appState.activeSprintNumber);
  const sprintPage = useSelector((appState: IState) => appState.openSprint as ISprint);
  const location = useLocation();
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : getOwnerNameLocation(location.pathname);
  const sprintID = localStorage.getItem("sprintID") ? Number(localStorage.getItem("sprintID")) : getSprintLocation(location.pathname);
  const [load, setLoad] = useState(false);
  const [hasError, setHasError] = useState(true);
  const [logout, setLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  message.config({ maxCount: 1 });
  useEffect(() => {
    if (logout || (!isLoggedIn)) {
      setLogout(false);
      store.dispatch(Actions.logout());
      clearLocalStorage();
      if (!isLoggedIn) { navigate("/login" ); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, isLoggedIn]);
  const handleLogout = () => { setLogout(true); }
  const handleProjects = () => {
    if (location.pathname !== "/") {
      store.dispatch(Actions.clearProject());
      clearProjectLocalStorage();
      navigate("/" );
    }
  }
  const [selectedSiderKey, setSelectedSiderKey] = useState(location.pathname.includes("active")?"ActiveSprint":"ProductBacklog");
  const handlePBacklog = () => {
    if (ownerName && ownerName !== "") {
      const newPath = `/${ownerName.split("/")[0]}/${ownerName.split("/")[1]}`;
      if (location.pathname !== newPath) {
        setSelectedSiderKey('ProductBacklog');
        navigate(newPath );
      }
    }
  }
  const handleActiveSprint = () => {
    if (ownerName && ownerName !== "" && activeSprintNumber !== -1) {
      const newPath = `/${ownerName.split("/")[0]}/${ownerName.split("/")[1]}/active-sprint/${activeSprintNumber}`;
      if (location.pathname !== newPath) {
        localStorage.setItem("sprintID", JSON.stringify(activeSprintNumber));
        setSelectedSiderKey('ActiveSprint');
        store.dispatch(Actions.fetchOneSprintThunk({ token: token, ownerName: ownerName, sprintNumber: Number(localStorage.getItem("sprintID")?localStorage.getItem("sprintID"):getSprintLocation(location.pathname)) }));
        navigate(newPath );
      }
    }
  }
  useEffect(() => {
    if (error.hasError && isMessageValid(error.erorMessage) && hasError) {
      setHasError(false);
      message.error(error.erorMessage, 2);
      if (error.erorMessage.includes("not found in ScrumHub") && location.pathname !== "/") {
        store.dispatch(Actions.clearError(localStorage.getItem("ownerName") as string));
        message.info("The repository name has changed and the repository is no longer in Scrumhub.", 5);
        handleProjects();
      } else if (error.erorMessage.includes("Bad credentials")) {
        store.dispatch(Actions.clearError(""));
        message.info("The scope of of authorization was changed. You need to login again", 2);
        setLogout(true);
      } else if (error.erorMessage.includes("Connection error")) {
        store.dispatch(Actions.clearError(""));
        setLogout(true);
      }
      else {
        store.dispatch(Actions.clearError(""));
      }
      setHasError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  useEffect(() => {
    if (isLoggedIn && !currentUser.isCurrentUser && !load && !location.pathname.includes("login")) {
      setLoad(true);
      store.dispatch(
        Actions.getCurrentUserThunk({
          token: token,
        })
      ).then((response: any) => { if (response.payload && response.payload.code === 0) { message.error(response.payload.response.message, 2); handleLogout(); } else { setLoad(false); } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, load, isLoggedIn, location]);
  let stop = true, y_pos = -1, old_pos = -1, down = false, start = false;
  document.ondragover = () => { };
  document.ondragenter = () => { };
  const scroll = (step: number) => {
    var elmnt = document.getElementById("scrollableDiv");
    if (!isNull(elmnt)) {
      if (y_pos < 1 * window.outerHeight / 6 && y_pos < old_pos && down) { elmnt.scrollTop -= step; }
      else if (y_pos > 3 * window.outerHeight / 4 && y_pos >= old_pos && down) { elmnt.scrollTop += step; }
      start = true;
    }
  }
  function handleMouseDragOver(event: any) {
    event = event || window.event;
    if (event.clientY !== y_pos && down) {
      stop = false;
      y_pos = event.clientY;
    }
  }
  function handleMouseDragEnter(event: any) {
    event = event || window.event;
    if (old_pos === -1) { old_pos = event.clientY; }
  }
  const handleDragEnter = (e: any) => {
    document.ondragenter = handleMouseDragEnter;
    document.ondragover = handleMouseDragOver;
  }
  const handleDragOver = (e: any) => {
    down = true;
    scroll(5);
  }

  const handleDragLeave = (e: any) => {
    down = false;
    start = false;
    stop = true;
    y_pos = -1;
    old_pos = -1;
    document.ondragover = () => { };
    document.ondragenter = () => { };
  }
  useEffect(() => {
    let timer;
    if (!stop && start) {
      timer = setTimeout(function () {
        scroll(5)
      }, 50
      );
    }
    if (!start && stop) {
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stop, start]);
  if (location.pathname === "/" && ownerName) { clearProjectLocalStorage(); }
  if (ownerName === null && location.pathname !== "/") { handleProjects(); }
  return (
    <section id="parentSection" className="container" >
      <Layout id="scrollableDiv" onDragStart={handleDragEnter} onDragOver={handleDragOver} onDragEnd={handleDragLeave} className={'scrollDiv'}>
        {!location.pathname.includes("login") &&
          <Header className="clearfix"
            style={{ position: 'fixed', zIndex: 100, padding: 0, height: "5vh", lineHeight: "5vh", width: "100%", backgroundColor: "#f0f0f0" }}>
            <Menu mode="horizontal" theme="light" className="mainMenu">
              <SubMenu popupOffset={[-18, 2]} key="SubMenu0" title={currentUser.isCurrentUser ? currentUser.login : ""} icon={
                currentUser.isCurrentUser ? <Avatar className='userAvatar' size="small" src={`${currentUser.avatarLink}`} ></Avatar> : <></>}>
                {currentUser.isCurrentUser && <Menu.Item key="SubMenu4">
                  <a href={"https://github.com/" + currentUser.login}>See on Github</a>
                </Menu.Item>}
              </SubMenu>
              <Menu.Item className='mainMenuItem' key="proj" onClick={() => handleProjects()}>
                <span style={{ maxHeight: "1vh" }}>Projects</span></Menu.Item>
              <SubMenu popupOffset={[-50, 2]} key="SubMenu1" title="Settings">
                <Menu.Item icon={<GithubOutlined />} key="sett">
                  <a href={`https://github.com/settings/connections/applications/${client_id}`}>
                    <span>{"Set Permissions "}</span> </a>
                </Menu.Item>
              </SubMenu>
              <Menu.Item className='mainMenuItem' key="logout" onClick={() => handleLogout()} >Logout</Menu.Item>
            </Menu>
          </Header>}
        <Content className="content">
          <Layout className="site-layout-background">
            {!location.pathname.includes("login") &&
              <Sider hidden={location.pathname.includes("login") || ownerName === ""} theme="light" collapsedWidth={40} width={200}
                style={{ marginTop: "5vh", height: 'auto', backgroundColor: "white", borderColor: "transparent" }}
                onCollapse={() => setIsCollapsed(!isCollapsed)} collapsible={true} collapsed={isCollapsed} className="site-layout-background">
                <Menu mode="inline" style={{ position: "fixed", width: isCollapsed ? 40 : 200 }} defaultSelectedKeys={[selectedSiderKey]}>
                  <Menu.Item key="ProductBacklog" onClick={() => handlePBacklog()} icon={<DatabaseOutlined />}>
                    <span>Product Backlog</span></Menu.Item>
                  <Menu.Item key="ActiveSprint" onClick={() => handleActiveSprint()} disabled={activeSprintNumber === -1}
                    icon={<ProjectOutlined />}>
                    <span>Active Sprint</span>
                  </Menu.Item>
                </Menu>
              </Sider>}
            <Content style={location.pathname.includes("login") || ownerName === "" ? {} : { padding: '0 50px' }}>
              <div style={{ minHeight: "90vh", margin: 0 }}>
                {ownerName !== "" && <PageHeader className="pageHeader"
                  title={<div className='contentTitle' >
                    {sprintID && sprintID !== -1 && sprintPage && sprintPage.title && Number(sprintID) === sprintPage.sprintNumber ?
                      sprintPage.title : location.pathname.includes("sprint") ? "" : "Product Backlog"}
                  </div>}
                  breadcrumb={<Breadcrumb className='contentBreadcrumb' itemRender={ItemRender} routes={routes(ownerName, sprintID.toString(), location)} />}
                >
                </PageHeader>}
                <AppRouter />
              </div>
              <Footer className={location.pathname.includes("login") ? "loginFooter" : "mainFooter"}>
                <a
                  href="https://github.com/ScrumHub/ScrumHub"
                  target="_blank"
                  rel="noreferrer"
                  className="GithubFooter"
                >
                  <GithubOutlined />
                  {" ScrumHub"}
                </a>{"  © Created in 2021  "}
                <a className="GithubFooter" href="https://www.flaticon.com/free-icons/agile">
                  {"Logo"}</a>
                {"  © Created by BomSymbols"}
              </Footer>
            </Content>
          </Layout>
        </Content>
      </Layout >
    </section >
  );
}
