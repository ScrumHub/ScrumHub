import { Layout, Menu} from 'antd';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import 'antd/dist/antd.css';
import { CarOutlined, FileOutlined, GithubOutlined, HourglassOutlined, PieChartOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import AppRouter from '../Approuter';
import { AuthContext } from '../App';
import { store } from '../appstate/store';
import { clearState } from '../appstate/actions';
import config from '../configuration/config';
import { useCookies } from "react-cookie";
import './Main.css';
const { Header, Footer, Content, Sider} = Layout;



function Main(props: any) {
  const { state, dispatch: unAuth } = useContext(AuthContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies();
  const { isLoggedIn } = state;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const token = cookies[config.token];
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const [logout, setLogout] = useState(false);
  const ownerName = localStorage.getItem("ownerName")?localStorage.getItem("ownerName"):"";
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
    store.dispatch(clearState());
    localStorage.removeItem("ownerName");
<<<<<<< HEAD
    localStorage.removeItem("sprintID");
=======
>>>>>>> 1fed599254bdb219c15c836716e38e42b8843ad9
    navigate("/", { replace: true });
  }

  const handleTeams = () => {
    store.dispatch(clearState());
    localStorage.removeItem("ownerName");
<<<<<<< HEAD
    localStorage.removeItem("sprintID");
    navigate("/teams", { replace: true });
  }

  const [selectedSiderKey, setSelectedSiderKey] = useState('2');

  const handleSprints = () => {
    if(ownerName && ownerName!==""){
    store.dispatch(clearState());
    setSelectedSiderKey('1');
    navigate(`/${ownerName.split("/")[0]}/${ownerName.split("/")[1]}/sprints`, { replace: true });
    }
  }
  const handlePBacklog = () => {
    if(ownerName && ownerName!==""){
    store.dispatch(clearState());
    setSelectedSiderKey('2');
    navigate(`/${ownerName.split("/")[0]}/${ownerName.split("/")[1]}`, { replace: true });
    }
  }

=======
    navigate("/teams", { replace: true });
  }

>>>>>>> 1fed599254bdb219c15c836716e38e42b8843ad9
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
            <Menu.Item key="proj" className="menu" onClick={()=> handleProjects()}>Projects</Menu.Item>
            <Menu.Item key="team" className="menu" onClick={()=> handleTeams()}>Teams</Menu.Item>
            <Menu.Item key="logout" onClick={() => handleLogout()} className="menu">Logout</Menu.Item>
          </Menu>
        </Header>
        <Content className="content">
          <Layout className="site-layout-background" style={{ padding: ownerName === "" ? '':'24px 0' }}>
<<<<<<< HEAD
          <Sider hidden={ownerName === ""} theme="dark" style={{height:'auto',backgroundColor:"white", borderColor:"transparent"}} collapsedWidth="0" onCollapse={()=>setIsCollapsed(!isCollapsed)} collapsible={true} collapsed={isCollapsed} className="site-layout-background" width={200}>
          <Menu
          mode="inline"
          defaultSelectedKeys={[selectedSiderKey]}
=======
          <Sider hidden={ownerName === ""} theme="dark" style={{backgroundColor:"white", borderColor:"transparent"}} collapsedWidth="0" onCollapse={()=>setIsCollapsed(!isCollapsed)} collapsible={true} collapsed={isCollapsed} className="site-layout-background" width={200}>
          <Menu
          mode="inline"
          defaultSelectedKeys={['2']}
>>>>>>> 1fed599254bdb219c15c836716e38e42b8843ad9
          style={{ height: 'auto' }}
          >
          <Menu.Item key="1"><FileOutlined />
              <span>Project Details</span></Menu.Item>
<<<<<<< HEAD
          <Menu.Item key="2" onClick={()=> handlePBacklog()}><FileOutlined />
              <span>Product Backlog</span></Menu.Item>
          <Menu.Item key="3" onClick={()=> handleSprints()}><FileOutlined />
              <span>Sprints List</span></Menu.Item>
          <Menu.Item key="4"><CarOutlined />
              <span>Roadmap</span></Menu.Item>
=======
          <Menu.Item key="2"><FileOutlined />
              <span>Product Backlog</span></Menu.Item>
          <Menu.Item key="3"><FileOutlined />
              <span>Sprint Backlog</span></Menu.Item>
          <Menu.Item key="4"><CarOutlined />
              <span>Sprint Backlog</span></Menu.Item>
>>>>>>> 1fed599254bdb219c15c836716e38e42b8843ad9
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
