import { Avatar, Breadcrumb, Layout, Menu, message, PageHeader } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import 'antd/dist/antd.css';
import { DatabaseOutlined, GithubOutlined, ProjectOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { AppRouter } from '../Approuter';
import { store } from '../appstate/store';
import * as Actions from '../appstate/actions';
import './Main.css';
import './ProductBacklog.css';
import { useSelector } from 'react-redux';
import { ISprint, IState } from '../appstate/stateInterfaces';
import { routes } from './utility/BodyRowsAndColumns';
import { clearLocalStorage, clearProjectLocalStorage, isMessageValid } from './utility/commonFunctions';
import { ItemRender } from './utility/LoginAndMainHandlers';
import { isNull } from 'lodash';
const { Header, Footer, Content, Sider } = Layout;
const { SubMenu } = Menu;

export function Main(props: any) {
  const isLoggedIn = useSelector((appState: IState) => appState.loginState.isLoggedIn);
  const token = useSelector((appState: IState) => appState.loginState.token);
  const error = useSelector((appState: IState) => appState.error);
  const currentUser = useSelector((appState: IState) => appState.currentUser);
  const activeSprintNumber = useSelector((appState: IState) => appState.activeSprintNumber);
  const sprintPage = useSelector((appState: IState) => appState.openSprint as ISprint);
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") : "";
  const sprintID = localStorage.getItem("sprintID") ? localStorage.getItem("sprintID") as string : "";
  const [load, setLoad] = useState(false);
  const [logout, setLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (logout || (!isLoggedIn)) {
      setLogout(false);
      store.dispatch(Actions.logout());
      clearLocalStorage();
      if (!isLoggedIn) { navigate("/login", { replace: true }); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, isLoggedIn]);
  const handleLogout = () => { setLogout(true); }
  const handleProjects = () => {
    if (location.pathname !== "/") {
      store.dispatch(Actions.clearProject());
      clearProjectLocalStorage();
      navigate("/", { replace: true });
      //store.dispatch(clearReposList());
    }
  }
  const [selectedSiderKey, setSelectedSiderKey] = useState('2');
  const handlePBacklog = () => {
    if (ownerName && ownerName !== "") {
      const newPath = `/${ownerName.split("/")[0]}/${ownerName.split("/")[1]}`;
      if (location.pathname !== newPath) {
        setSelectedSiderKey('ProductBacklog');
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
        store.dispatch(Actions.fetchPeopleThunk({ ownerName, token }));
        navigate(newPath, { replace: true });
      }
    }
  }
  useEffect(() => {
    if (error.hasError && isMessageValid(error.erorMessage)) {
      message.error(error.erorMessage, 2);
      store.dispatch(Actions.clearError());
    }
  }, [error]);
  useEffect(() => {
    if (isLoggedIn && !currentUser.isCurrentUser && !load) {
      setLoad(true);
      store.dispatch(
        Actions.getCurrentUserThunk({
          token: token,
        })
      ).then((response: any) => { if (response.payload && response.payload.code === 0) { message.error(response.payload.response.message, 2); handleLogout(); } else { setLoad(false); } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, load, isLoggedIn]);
  let stop = true, y_pos = -1, old_pos = -1, down = false,start=false;
  document.ondragover = () => { };
  document.ondragenter = () => { };
  const scroll = (step:number) => {
    var elmnt = document.getElementById("scrollableDiv");
    if (!isNull(elmnt)) {
      if (y_pos > 1 * window.innerHeight / 2 && y_pos > old_pos && down) {elmnt.scrollTop += step;}
      else if (y_pos <= 9 * window.outerHeight / 10 &&y_pos <= old_pos && down) {elmnt.scrollTop -= step;}
      start = true;
    }
  }
  function handleMouseDragOver(event:any) {
    event = event || window.event;
    if (event.clientY !== y_pos && down) {
      stop = false;
      y_pos = event.clientY;
    }
  }
  function handleMouseDragEnter(event:any) {
    event = event || window.event;
    if (old_pos === -1) { old_pos = event.clientY; }
  }
  const handleDragEnter = (e:any) => {
    document.ondragenter = handleMouseDragEnter;
    document.ondragover = handleMouseDragOver;
  }
  const handleDragOver = (e:any) => {
    down = true;
    scroll(5);
  }

  const handleDragLeave = (e:any) => {
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
    if(!start && stop){
    return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stop, start]);
  if (location.pathname === "/" && ownerName) { clearProjectLocalStorage(); }
  if (ownerName === null && location.pathname !== "/") { handleProjects(); }
  return (
    <section id="parentSection" className="container" >
      <Layout id="scrollableDiv" onDragStart={handleDragEnter} onDragOver={handleDragOver} onDragEnd={handleDragLeave} className={'scrollDiv'}>
        {!location.pathname.includes("login")&&<Header  className="clearfix" style={{ position: 'fixed', zIndex: 100, padding: 0, height: "5vh", lineHeight: "5vh", width: "100%", backgroundColor: "#f0f0f0" }}>
          <Menu mode="horizontal" theme="light" className="mainMenu" >
            <SubMenu style={{ float: "unset" }} key="SubMenu0" title={currentUser.isCurrentUser ? currentUser.login : ""} icon={
              currentUser.isCurrentUser ? <Avatar style={{ transform: "scale(0.8)", marginBottom: "0.4vh" }} size="small" src={`${currentUser.avatarLink}`} ></Avatar> : <></>}>
              {currentUser.isCurrentUser && <Menu.Item key="SubMenu4">
                <a href={"https://github.com/" + currentUser.login}>See on Github</a>
              </Menu.Item>}
            </SubMenu>
            <Menu.Item className='mainMenuItem' key="proj" onClick={() => handleProjects()}><span style={{ maxHeight: "1vh" }}>Projects</span></Menu.Item>
            <Menu.Item className='mainMenuItem' key="logout" onClick={() => handleLogout()} >Logout</Menu.Item>
          </Menu>
        </Header>}
        <Content className="content">
          <Layout className="site-layout-background">
          {!location.pathname.includes("login")&&<Sider hidden={location.pathname.includes("login") || ownerName === ""} theme="light" collapsedWidth={40} style={{ marginTop: "5vh", height: 'auto', backgroundColor: "white", borderColor: "transparent" }} onCollapse={() => setIsCollapsed(!isCollapsed)} collapsible={true} collapsed={isCollapsed} className="site-layout-background" width={200}>
              <Menu mode="inline" style={{ position: "fixed", width: isCollapsed ? 40 : 200 }} defaultSelectedKeys={[selectedSiderKey]}>
                {/*<Menu.Item key="1" icon={<ProjectOutlined />}>
                  <span>Project Details</span></Menu.Item>
                */}<Menu.Item key="ProductBacklog" onClick={() => handlePBacklog()} icon={<DatabaseOutlined />}>
                  <span>Product Backlog</span></Menu.Item>
                <Menu.Item key="ActiveSprint" onClick={() => handleActiveSprint()} disabled={activeSprintNumber === -1} icon={<ProjectOutlined />}>
                  <span>Active Sprint</span></Menu.Item>
              </Menu>
            </Sider>}
            <Content style={location.pathname.includes("login")||ownerName === "" ? {} : { padding: '0 50px' }}>
              <div style={{ minHeight: "90vh", margin: 0, }}>
                {ownerName !== "" && <PageHeader className="pageHeader"
                  title={<div style={{ fontWeight: "bold", lineHeight: 1.25, paddingTop: 0, marginTop: 0, }}>{sprintID && sprintID !== "0" && sprintPage && sprintPage.title && Number(sprintID) === sprintPage.sprintNumber ? sprintPage.title : location.pathname.includes("sprint") ? "" : "Product Backlog"}</div>}
                  breadcrumb={<Breadcrumb style={{ marginTop: 0, marginBottom: 0, }} itemRender={ItemRender} routes={routes(ownerName, sprintID, location)} />}
                >
                </PageHeader>}
                <AppRouter />
              </div>
              <Footer className={location.pathname.includes("login")?"loginFooter":"mainFooter"}>

                <a
                  href="http://github.com/ScrumHub/ScrumHub"
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