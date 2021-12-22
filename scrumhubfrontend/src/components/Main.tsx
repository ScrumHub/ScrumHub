import { Avatar, Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { useContext } from 'react';
import 'antd/dist/antd.css';
import { FileOutlined, GithubOutlined, ProjectOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import AppRouter from '../Approuter';
import { AuthContext } from '../App';
import { store } from '../appstate/store';
import { clearReposList, clearState } from '../appstate/actions';
import config from '../configuration/config';
//@ts-ignore
import { useCookies } from "react-cookie";
import * as Actions from '../appstate/actions';
import './Main.css';
import { useSelector } from 'react-redux';
import { State } from '../appstate/stateInterfaces';
const { Header, Footer, Content, Sider } = Layout;
const { SubMenu } = Menu;



function Main(props: any) {
  const { state, dispatch: unAuth } = useContext(AuthContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies();
  const { isLoggedIn } = state;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const token = cookies[config.token];
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const [logout, setLogout] = useState(false);
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") : "";
  const currentUser = useSelector(
    (appState: State) => appState.currentUser
  );
  useEffect(() => {
    if (logout) {
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      //clearing local storage
      store.dispatch(clearState());
      removeCookie("token", { path: "/" });
      unAuth({
        type: "LOGOUT"
      });
      setLogout(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout]);


  const handleLogout = () => {
    setLogout(true);
  }

  const handleProjects = () => {
    store.dispatch(Actions.clearProject());
    localStorage.removeItem("ownerName");
    localStorage.removeItem("sprintID");
    if (location.pathname === "/") {
      console.log(location);
      store.dispatch(clearReposList());
    }
    navigate("/", { replace: true });
  }

  const [selectedSiderKey, setSelectedSiderKey] = useState('2');

  const handleSprints = () => {
    if (ownerName && ownerName !== "") {
      store.dispatch(clearState());
      setSelectedSiderKey('1');
      navigate(`/${ownerName.split("/")[0]}/${ownerName.split("/")[1]}/sprints`, { replace: true });
    }
  }
  const handlePBacklog = () => {
    if (ownerName && ownerName !== "") {
      store.dispatch(clearState());
      setSelectedSiderKey('2');
      navigate(`/${ownerName.split("/")[0]}/${ownerName.split("/")[1]}`, { replace: true });
    }
  }

  useEffect(() => {
    if(ownerName!==""){
      try {
        store.dispatch(
          Actions.fetchPeopleThunk({
            ownerName: ownerName as string,
            token: token,
          })
        );
      } catch (err) {
        console.error("Failed to fetch the pbis: ", err);
      }
    
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerName]);

  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <section className="container">
      <Layout style={{ height: "100vh" }}>
        <Header hidden={!isLoggedIn} className="clearfix" style={{ position: 'fixed', zIndex: 1, padding: 0, height: "5vh", lineHeight: "5vh", width: "100%", backgroundColor: "#f0f0f0" }}>
          <Menu mode="horizontal" theme="light"
            className="menu" >
              
            {currentUser!==null &&
            <SubMenu style={{float:"unset"}} key="0" title={currentUser?.login as string} icon={
                <Avatar style={{ transform:"scale(0.8)", marginBottom:"0.4vh"}} size="small" src={`${currentUser?.avatarLink}`} ></Avatar>}>
              <Menu.Item key="4">
              <a href={"https://github.com/" + currentUser?.login}>See on Github</a>
              </Menu.Item>
              
            </SubMenu>}
            <Menu.Item className='menuItem' key="proj" onClick={() => handleProjects()}><span style={{ maxHeight: "1vh" }}>Projects</span></Menu.Item>
            <Menu.Item className='menuItem' key="logout" onClick={() => handleLogout()} >Logout</Menu.Item>
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
                <Menu.Item key="1" icon={<ProjectOutlined />}>
                  <span>Project Details</span></Menu.Item>
                <Menu.Item key="2" onClick={() => handlePBacklog()} icon={<FileOutlined />}>
                  <span>Product Backlog</span></Menu.Item>
              </Menu>
            </Sider>
            <Content style={ownerName === "" ? {} : { padding: '0 50px' }}>
              <div style={{ minHeight: "90vh", margin: 0 }}>
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