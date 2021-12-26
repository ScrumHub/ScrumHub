import { useContext, useState } from 'react';
import { Alert, Avatar, Button, Divider, Dropdown, Input, Space, } from 'antd';
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
import { AddPBIPopup } from './popups/AddPBIPopup';
import { AddSprintPopup } from './popups/AddSprintPopup';
import { useIsMounted } from './utility/commonFunctions';
const { Search } = Input;

export default function Project() {
  const { state } = useContext(AuthContext);
  const { token } = state;
  const loading = useSelector((appState: State) => appState.loading as boolean);
  const pbiPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
  const [filterPBI, setFiltersPBI] = useState<IFilters>({ nameFilter: "", peopleFilter: [] });
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const currentUser = useSelector((appState: State) => appState.currentUser);
  const people = useSelector((appState: State) => appState.people as IPeopleList);
  const [isAddPBI, setIsAddPBI] = useState(false);
  const [isAddSprint, setIsAddSprint] = useState(false);
  const error = useSelector((appState: State) => appState.error);
  const isMounted = useIsMounted();

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
        setIsAddPBI(false);
    }
  };

  const addSprint = (sprint: ISprint) => {
    const ids = sprint.backlogItems.map((value: IProductBacklogItem) => { return ((value.isInSprint ? value.id.toString() : "")) }).filter((x: string) => x !== "");
    try {
      store.dispatch(
        Actions.addSprintThunk({
          token: token as string,
          ownerName: ownerName as string,
          sprint: { "number": sprint.sprintNumber, "goal": sprint.goal, "pbIs": ids }
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
  const updatePplFilter = (items: IPerson[]) => {
    if(isMounted()){
    setFiltersPBI({...filterPBI, peopleFilter:items});
  
    }
  };
  const onSearch = (value: string) => { setFiltersPBI({ ...filterPBI, nameFilter: value.toLowerCase() }); };
  if (!state.isLoggedIn) { return <Navigate to="/login" />; }
  return (
    <>
      <div style={{marginBottom: "1%" }}>
      {error.hasError && <Alert type="error" message={error.erorMessage} banner closable />}
        <Space direction="horizontal"
          style={{ marginLeft: "2%", marginRight: "2%", marginTop: 0, marginBottom: "1%" }}>
          <Button onClick={() => { setIsAddSprint(true); }}>{"Create Sprint"}</Button>
          <Button onClick={() => { setIsAddPBI(true);}}>{"Add Product Backlog Item"}</Button>
          <Search placeholder="Input backlog item name" onSearch={onSearch} enterButton />

        </Space>
        <Divider type="vertical" />
        <Space direction="horizontal"
          style={{ /*float:"right",*/marginLeft: "2%", marginRight: "2%", marginTop: 0, marginBottom: "1%", alignItems: "flex-end" }}>
          <Dropdown.Button
            placement="bottomCenter"
            style={{ color: "#1890ff" }}
            overlay={<MenuWithPeople itemSelected={function (items: IPerson[]): void { updatePplFilter(items); }} visible={true} people={people}/>}
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

        <BacklogTableWithSprints peopleFilter={filterPBI.peopleFilter} nameFilter={filterPBI.nameFilter}/>
        {isAddSprint &&  <AddSprintPopup error={error.erorMessage} data={initSprint} visible={isAddSprint}
          onCreate={function (values: any): void { addSprint(values); }}
          onCancel={() => { setIsAddSprint(false); }} pbiData={pbiPage.list} />}
        {isAddPBI && <AddPBIPopup data={initAddPBI} visible={isAddPBI}
          onCreate={function (values: any): void { addPBI(values) }}
          onCancel={() => { setIsAddPBI(false); }} />}

      </div>

    </>
  );
}