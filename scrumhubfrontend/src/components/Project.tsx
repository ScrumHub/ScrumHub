import { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Dropdown, Input, Space, } from 'antd';
import 'antd/dist/antd.css';
import "./Project.css";
import { IAddBI, IFilters, IPeopleList, IBacklogItem, IBacklogItemList, ISprint, IState } from '../appstate/stateInterfaces';
import { useSelector } from 'react-redux';
import { DownOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';
import { ProductBacklog } from './ProductBacklog';
import { MenuWithFilters, MenuWithPeople, MenuWithSorting, updateStringList } from './utility/LoadAnimations';
import { store } from '../appstate/store';
import * as Actions from '../appstate/actions';
import React from 'react';
import { AddPBIPopup } from './popups/AddPBIPopup';
import { AddSprintPopup } from './popups/AddSprintPopup';
import { initAddPBI, initSprint } from '../appstate/stateInitValues';
import { initFilterMenu, initFilterSortInfo, initSortedInfo } from './utility/commonInitValues';
import { isArrayValid } from './utility/commonFunctions';
const { Search } = Input;

export const Project = React.memo((props: any) => {
  const isLoggedIn = useSelector((appState: IState) => appState.loginState.isLoggedIn);
  const token = useSelector((appState: IState) => appState.loginState.token);
  const pbiPage = useSelector((appState: IState) => appState.pbiPage as IBacklogItemList);
  const [initialRefresh, setInitialRefresh] = useState(true);
  const [infos, setInfos] = useState(initFilterSortInfo);
  const [filterMenu, setFilterMenu] = useState(initFilterMenu);
  const [filterPBI, setFiltersPBI] = useState<IFilters>({ nameFilter: [] as string[], peopleFilter: [] as string[] });
  const [inputPplFilter, setInputPplFilter] = useState("");
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : "";
  const currentUser = useSelector((appState: IState) => appState.currentUser);
  const people = useSelector((appState: IState) => appState.people as IPeopleList);
  const [isAddPBI, setIsAddPBI] = useState(false);
  const [isAddSprint, setIsAddSprint] = useState(false);
  const error = useSelector((appState: IState) => appState.error);

  const addPBI = (pbi: IAddBI) => {
    pbi.acceptanceCriteria = pbi.acceptanceCriteria.filter((value: any) => { return (typeof (value) === "string"); });
    try {
      store.dispatch(
        Actions.addPBIThunk({
          ownerName: ownerName,
          token: token,
          pbi: pbi
        }) 
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally {
      setIsAddPBI(false);
    }
  };

  const addSprint = (sprint: ISprint) => {
    const ids = sprint.backlogItems.map((value: IBacklogItem) => { return ((value.isInSprint ? value.id.toString() : "")) }).filter((x: string) => x !== "");
    try {
      store.dispatch(
        Actions.addSprintThunk({
          token: token as string,
          ownerName: ownerName as string,
          sprint: { "title": sprint.title, "finishDate": sprint.finishDate, "goal": sprint.goal, "pbIs": ids }
        })
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
  const onSearch = (value: string) => {setFiltersPBI({ ...filterPBI, nameFilter: value!==""?[value.toLowerCase()]:[] }); };
  useEffect(() => {
    if (isLoggedIn && (ownerName !== "" || initialRefresh)) {
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
    <div id="projectDiv" className='projectDiv' >
      <Space wrap direction="horizontal" split={true} onMouseLeave={() => setFilterMenu(initFilterMenu)}
        className='projectSpace' style={{marginBottom:"0.5%"}}>
        <Button type="primary" onClick={() => { setIsAddSprint(true); }}>{"Create Sprint"}</Button>
        <Button type="primary" onClick={() => { setIsAddPBI(true); }}>{"Add Product Backlog Item"}</Button>
        <Search autoComplete='on' onMouseEnter={() => setFilterMenu(initFilterMenu)} placeholder="Input Backlog Item name" onSearch={onSearch} enterButton />
        <Badge status={"error"} count={isArrayValid(infos.filteredInfo.complete)||isArrayValid(infos.filteredInfo.pbiPriority)?2:0} overflowCount={1} style={{ borderColor: "transparent", zIndex:20 }}><Dropdown.Button
          className='projectDropBtn'
          placement="bottomCenter"
          visible={filterMenu.filterMenuVisible}
          overlay={<MenuWithFilters openKeys={filterMenu.openKeys} setOpenKeys={function (keys: string[]): void { setFilterMenu({ ...filterMenu, openKeys: keys }); }}
            onVisibilityChange={function (flag: boolean): void { setFilterMenu(initFilterMenu); }}
            itemSelected={function (items: any): void { setFilterMenu({ ...filterMenu, filterMenuVisible: true }); setInfos({ ...infos, filteredInfo: items }); }} filteredInfo={infos.filteredInfo} />}
          buttonsRender={() => [<></>,
          React.cloneElement(<Button type="primary" onMouseEnter={() => { setFilterMenu({ ...filterMenu, filterMenuVisible: true }); }} icon={<FilterOutlined className='projectWhIcon'></FilterOutlined>}>Filter</Button>),
          ]} >
        </Dropdown.Button></Badge>
        <Badge status={"error"} count={infos.sortedInfo!==initSortedInfo?2:0} overflowCount={1} style={{ borderColor: "transparent", zIndex:20 }}>
        <Dropdown.Button
          className='projectDropBtn'
          placement="bottomCenter"
          overlay={<MenuWithSorting itemSelected={function (items: any): void { setInfos({ ...infos, sortedInfo: items }); }} sortedInfo={infos.sortedInfo} />}
          buttonsRender={() => [
            <></>,
            React.cloneElement(<Button onMouseEnter={() => setFilterMenu(initFilterMenu)} type="primary" icon={<DownOutlined prefix='Sort' className='projectWhIcon'></DownOutlined>}>{"Sort"}</Button>),
          ]} >
        </Dropdown.Button></Badge>
        <Dropdown.Button
          className='projectDropBtn'
          placement="bottomCenter"
          overlay={<MenuWithPeople itemSelected={function (items: string[]): void { updatePplFilter(items); }} people={people} peopleFilter={filterPBI.peopleFilter} inputFilter={inputPplFilter} />}
          buttonsRender={([a, b]) => [
            <></>,
            React.cloneElement(<Input type="search" prefix={<UserOutlined className='projectColIcon' />} placeholder="Input user login" className='projectInputPpl' onChange={updateInputPplFilter} />),
          ]} >
        </Dropdown.Button>
        {currentUser.isCurrentUser &&
          <div onClick={() => { updatePplFilter(updateStringList(filterPBI.peopleFilter, currentUser.login)) }} className={filterPBI.peopleFilter.includes(currentUser.login) ? 'projectCurUserShadowDiv' : 'projectCurUserDiv'}>
            <Badge status={"success"} style={{ borderColor: "transparent" }} dot={filterPBI.peopleFilter.includes(currentUser.login)}>
              <Avatar src={`${currentUser.avatarLink}`} >
              </Avatar></Badge>
          </div>
        }
      </Space>

      <ProductBacklog sortSelected={function (items: any): void { setInfos({ ...infos, sortedInfo: items }); }} itemSelected={function (items: number[]): void { setInfos({ ...infos, filteredInfo: { complete: infos.filteredInfo.complete, pbiPriority: items } }); }}
        sortedInfo={infos.sortedInfo} filteredInfo={infos.filteredInfo} peopleFilter={filterPBI.peopleFilter} nameFilter={filterPBI.nameFilter} />
      {isAddSprint && <AddSprintPopup error={error.erorMessage} data={initSprint} visible={isAddSprint}
        onCreate={function (values: any): void { addSprint(values); }}
        onCancel={() => { setIsAddSprint(false); }} pbiData={pbiPage.list} />}
      {isAddPBI && <AddPBIPopup data={initAddPBI} visible={isAddPBI}
        onCreate={function (values: any): void { addPBI(values) }}
        onCancel={() => { setIsAddPBI(false); }} />}

    </div>
  );
});
