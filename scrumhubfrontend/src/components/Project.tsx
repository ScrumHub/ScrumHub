import { useContext, useEffect, useState } from 'react';
import { Avatar, Badge, Button, Dropdown, Input, Space, } from 'antd';
import 'antd/dist/antd.css';
import { IAddPBI, IFilters,  IPeopleList, IProductBacklogItem, IProductBacklogList, ISprint, State } from '../appstate/stateInterfaces';
import { AuthContext } from '../App';
import { useSelector } from 'react-redux';
import { DownOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';
import { ProductBacklog } from './ProductBacklog';
import { MenuWithFilters, MenuWithPeople, MenuWithSorting, updateStringList } from './utility/LoadAnimations';
import { store } from '../appstate/store';
import * as Actions from '../appstate/actions';
import React from 'react';
import { AddPBIPopup } from './popups/AddPBIPopup';
import { AddSprintPopup } from './popups/AddSprintPopup';
import { initAddPBI, initSprint } from '../appstate/initStateValues';
import { initFilterMenu, initFilterSortInfo } from './utility/commonInitValues';
const { Search } = Input;

export function Project() {
  const { state } = useContext(AuthContext);
  const { token } = state;
  const pbiPage = useSelector((appState: State) => appState.pbiPage as IProductBacklogList);
  const [initialRefresh, setInitialRefresh] = useState(true);
  const [infos, setInfos] = useState(initFilterSortInfo);
  const [filterMenu, setFilterMenu] = useState(initFilterMenu);
  const [filterPBI, setFiltersPBI] = useState<IFilters>({ nameFilter: [], peopleFilter: [] });
  const [inputPplFilter, setInputPplFilter] = useState("");
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const currentUser = useSelector((appState: State) => appState.currentUser);
  const people = useSelector((appState: State) => appState.people as IPeopleList);
  const [isAddPBI, setIsAddPBI] = useState(false);
  const [isAddSprint, setIsAddSprint] = useState(false);
  const error = useSelector((appState: State) => appState.error);

  const addPBI = (pbi: IAddPBI) => {
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
          sprint: { "title":sprint.title,"finishDate":sprint.finishDate, "goal": sprint.goal, "pbIs": ids }
        }) //filters
      );
    } catch (err) {
      console.error("Failed to add the sprint: ", err);
    } finally {
        setIsAddSprint(false);
    }
  };
  const updatePplFilter = (items: string[]) => {
    setFiltersPBI({ ...filterPBI, peopleFilter: items });
  };
  const updateInputPplFilter = (e: { target: { value: string; }; }) => {
      setInputPplFilter(e.target.value);
  };
  const onSearch = (value: string) => { setFiltersPBI({ ...filterPBI, nameFilter: [value.toLowerCase()] }); };
  useEffect(() => {
    if (state.isLoggedIn &&(ownerName !== "" || initialRefresh)) {
      setInitialRefresh(false);
      try {
        store.dispatch(
          Actions.fetchPeopleThunk({
            ownerName: ownerName as string,
            token: token,
          })
        );
      } catch (err) {
        console.error("Failed to fetch people: ", err);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerName, initialRefresh]);
  return (
    <>
      <div style={{ marginTop: "0.25%", marginBottom: "1%" }}>
        <Space wrap direction="horizontal" split={true} onMouseLeave={()=>setFilterMenu(initFilterMenu)}
          style={{transform: "scale(0.96)", marginTop: 0, marginBottom: "0.25%", display:"flex",}}>
          <Button onClick={() => { setIsAddSprint(true); }}>{"Create Sprint"}</Button>
          <Button onClick={() => { setIsAddPBI(true); }}>{"Add Product Backlog Item"}</Button>
          <Search onMouseEnter={()=>setFilterMenu(initFilterMenu)} placeholder="Input backlog item name" onSearch={onSearch} enterButton />
          <Dropdown.Button
            placement="bottomCenter"
            style={{ color: "#1890ff" }}
            visible={filterMenu.filterMenuVisible}
            overlay={<MenuWithFilters openKeys={filterMenu.openKeys} setOpenKeys={function (keys:string[]):void{setFilterMenu({...filterMenu, openKeys:keys});}}
              onVisibilityChange={function (flag:boolean):void{setFilterMenu(initFilterMenu);}} 
              itemSelected={function (items: any): void {setFilterMenu({...filterMenu, filterMenuVisible:true});setInfos({...infos, filteredInfo:items}); }} filteredInfo={infos.filteredInfo}/>}
            buttonsRender={([leftButton, rightButton]) => [
              <></>,
              React.cloneElement(<Button type="primary" onMouseEnter={()=>{setFilterMenu({...filterMenu, filterMenuVisible:true});}} icon={<FilterOutlined style={{ color: "white" }}></FilterOutlined>}>Filter</Button>),
            ]} >

          </Dropdown.Button>
          <Dropdown.Button

            placement="bottomCenter"
            style={{ color: "#1890ff" }}
            overlay={<MenuWithSorting itemSelected={function (items: any): void { setInfos({...infos, sortedInfo:items}); }} sortedInfo={infos.sortedInfo}/>}
            // eslint-disable-next-line no-empty-pattern
            buttonsRender={([]) => [
              <></>,
              React.cloneElement(<Button onMouseEnter={()=>setFilterMenu(initFilterMenu)} type="primary" icon={<DownOutlined prefix='Sort' style={{ color: "white" }}></DownOutlined>}>{"Sort"}</Button>),
            ]} >

          </Dropdown.Button>
          <Dropdown.Button
            placement="bottomCenter"
            style={{ color: "#1890ff" }}
            overlay={<MenuWithPeople itemSelected={function (items: string[]): void { updatePplFilter(items); }} people={people} peopleFilter={filterPBI.peopleFilter} inputFilter={inputPplFilter}/>}
            // eslint-disable-next-line no-empty-pattern
            buttonsRender={([]) => [
              <></>,
              React.cloneElement(<Input type="search" prefix={<UserOutlined style={{ color: "#1890ff" }} />} placeholder="Input user login" style={{ width: 160 }} onChange={updateInputPplFilter} />),
            ]} >

          </Dropdown.Button>

          {currentUser.isCurrentUser &&
          <div onClick={()=>{updatePplFilter(updateStringList(filterPBI.peopleFilter, currentUser.login))}} style={{cursor:"pointer",boxShadow:filterPBI.peopleFilter.includes(currentUser.login)?"white 0px 0px 0.1px 0.05em":"",
            borderRadius: "50%" }}>
            
           <Badge  status={"success"} style={{borderColor:"transparent"}} dot={filterPBI.peopleFilter.includes(currentUser.login)}>
             <Avatar  src={`${currentUser.avatarLink}`} >
</Avatar></Badge>
          
          </div>
          }
        </Space>

        <ProductBacklog sortSelected={function (items: any): void {setInfos({...infos, sortedInfo:items}); }} itemSelected={function (items: number[]): void {setInfos({...infos, filteredInfo:{complete:infos.filteredInfo.complete, pbiPriority:items}}); }} 
        sortedInfo={infos.sortedInfo} filteredInfo={infos.filteredInfo} peopleFilter={filterPBI.peopleFilter} nameFilter={filterPBI.nameFilter} />
        {isAddSprint && <AddSprintPopup error={error.erorMessage} data={initSprint} visible={isAddSprint}
          onCreate={function (values: any): void { addSprint(values); }}
          onCancel={() => { setIsAddSprint(false); }} pbiData={pbiPage.list} />}
        {isAddPBI && <AddPBIPopup data={initAddPBI} visible={isAddPBI}
          onCreate={function (values: any): void { addPBI(values) }}
          onCancel={() => { setIsAddPBI(false); }} />}

      </div>

    </>
  );
}
