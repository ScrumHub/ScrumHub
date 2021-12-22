import { useContext, useState } from 'react';
import { Alert, Avatar, Breadcrumb, Button, Divider, Dropdown, Input, PageHeader, Space, } from 'antd';
import 'antd/dist/antd.css';
import { IAddPBI, IFilters, initAddPBI, initSprint, IPeopleList, IPerson, IProductBacklogItem, IProductBacklogList, ISprint, State } from '../appstate/stateInterfaces';
import { AuthContext } from '../App';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import { BacklogTableWithSprints } from './BacklogTable';
import { MenuWithPeople } from './utility/LoadAnimations';
import { store } from '../appstate/store';
import * as Actions from '../appstate/actions';
import React from 'react';
import { CustomAddPopup } from './popups/CustomAddPopup';
import { CustomAddSprintPopup } from './popups/CustomAddSprintPopup';
import { useIsMounted } from './utility/commonFunctions';
const { Search } = Input;

function ItemRender(route: any, params: any[], routes: any[], paths: any[]) {
  return (<span key={route.breadcrumbName + route.path}>{route.breadcrumbName}</span>)
}

export default function Project() {
  const { state } = useContext(AuthContext);
  const { token } = state;
  const loading = useSelector((appState: State) => appState.loading as boolean);
  const pbiPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
  const [filterPBI, setFiltersPBI] = useState<IFilters>({ nameFilter: "", peopleFilter: [] });
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const error = useSelector((appState: State) => appState.error);
  const currentUser = useSelector((appState: State) => appState.currentUser);
  const people = useSelector((appState: State) => appState.people as IPeopleList);
  const [isAddPBI, setIsAddPBI] = useState(false);
  const [isAddSprint, setIsAddSprint] = useState(false);
  const [isHiddene, setIsHideden] = useState(false);
  const isMounted = useIsMounted();

  const routes = [
    {
      path: "",
      key: 0,
      breadcrumbName: window.location.href.split("/")[3],
    },
    {
      path: "Projects",
      key: 1,
      breadcrumbName: "Projects",
    },
    {
      path: "path",
      key: 2,
      breadcrumbName: window.location.href.split("/")[4].concat(" Project"),
    },
  ];

  const addPBI = (pbi: IAddPBI) => {
    //check if all elements of acceptanceCriteria array are defined
    pbi.acceptanceCriteria = pbi.acceptanceCriteria.filter((value: any) => { return (typeof (value) === "string"); });
    try {
      store.dispatch(
        Actions.addPBIThunk({
          ownerName: ownerName,
          token: token,
          pbi: pbi
        }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally {
      if (isMounted()) {
        setIsAddPBI(false);
      }
    }
  };

  const addSprint = (pbi: ISprint) => {
    const ids = pbi.backlogItems.map((value: IProductBacklogItem) => { return ((value.isInSprint ? value.id.toString() : "")) }).filter((x: string) => x !== "");
    try {
      store.dispatch(
        Actions.addSprintThunk({
          token: token as string,
          ownerName: ownerName as string,
          sprint: { "number": pbi.sprintNumber, "goal": pbi.goal, "pbIs": ids }
        }) //filters
      );
    } catch (err) {
      console.error("Failed to add the sprint: ", err);
    } finally {
      if (isMounted()) {
        setIsAddSprint(false);
      }
    }
  };
  const updatePplFilter = (item: IPerson) => {
    if(isMounted()){
    //filterPBI.peopleFilter.includes(item.login) ? 
    //setFiltersPBI({...filterPBI, peopleFilter:filterPBI.peopleFilter.filter((name:string)=>name ===item.login)}):
    //setFiltersPBI({...filterPBI, peopleFilter:filterPBI.peopleFilter.concat(item.login)});
  
    }
  };
  const onSearch = (value: any) => console.log(value);
console.log(filterPBI.peopleFilter);
  if (!state.isLoggedIn) { return <Navigate to="/login" />; }
  return (
    <>
      <div style={{ marginTop: "5vh", marginBottom: "1%" }}>
        {error.hasError && <Alert type="error" message={error.erorMessage} banner closable />}
        <PageHeader style={{ paddingLeft: "2%", marginBottom: 0, paddingBottom: 0 }}
          title={<div style={{ fontWeight: "bold", paddingTop: 0, marginTop: 0 }}>{"Product Backlog"}</div>}
          breadcrumb={<Breadcrumb style={{ marginTop: 0 }} itemRender={ItemRender} routes={routes} />}
        >
        </PageHeader>
        <Space direction="horizontal"
          style={{ marginLeft: "2%", marginRight: "2%", marginTop: 0, marginBottom: "1%" }}>
          <Button onClick={() => { Actions.clearPBIsList(); setIsAddSprint(true); }}>{"Create Sprint"}</Button>
          <Button onClick={() => { }/*setIsModal({ ...isModal, addPBI: true })*/}>{"Add Product Backlog Item"}</Button>
          <Search placeholder="input backlog item name" onSearch={onSearch} enterButton />

        </Space>
        <Divider type="vertical" />
        <Space direction="horizontal"
          style={{ /*float:"right",*/marginLeft: "2%", marginRight: "2%", marginTop: 0, marginBottom: "1%", alignItems: "flex-end" }}>

          <Dropdown.Button
            placement="bottomCenter"
            //filterOption={(input:string, option) =>
            // option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            //}        <Avatar icon={<UserOutlined />}/>
            //trigger={['click']}
            style={{ color: "#1890ff" }}
            overlay={<MenuWithPeople itemSelected={function (item: IPerson): void { updatePplFilter(item); }} visible={true} people={people}/>}
            buttonsRender={([leftButton, rightButton]) => [
              <Button className="peopleButton" style={{ cursor: "default" }} onClick={e => e.preventDefault()}><div className="ant-dropdown-link" onClick={e => e.preventDefault()}>

                People
              </div></Button>,
              React.cloneElement(<Button type="primary" icon={<UserOutlined style={{ color: "white", }} />}></Button>),
            ]} >
            
          </Dropdown.Button>
          {currentUser && <span>
            <Avatar src={`${currentUser.avatarLink}`} ></Avatar>
            {/*<a href={"https://github.com/"+currentUser.login}>{" "+currentUser.login as string}</a>
          */}
          </span>}
        </Space>

        <BacklogTableWithSprints />
        {isAddSprint && !loading && <CustomAddSprintPopup error={error.erorMessage} data={initSprint} visible={isAddSprint}
          onCreate={function (values: any): void { addSprint(values); }}
          onCancel={() => { setIsAddSprint(false); }} pbiData={pbiPage.list} />}
        {isAddPBI && <CustomAddPopup data={initAddPBI} visible={isAddPBI}
          onCreate={function (values: any): void { addPBI(values) }}
          onCancel={() => { setIsAddPBI(false); }} />}

      </div>

    </>
  );
}