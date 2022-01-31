// Project.tsx
/**
 * @packageDocumentation
 */
import { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Dropdown, Input, Space, } from 'antd';
import 'antd/dist/antd.css';
import "./Project.css";
import { IFilters, IPeopleList, IBacklogItemList, IState, ISprintList } from '../appstate/stateInterfaces';
import { useSelector } from 'react-redux';
import { DownOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';
import { ProductBacklog } from './ProductBacklog';
import { MenuWithFilters, MenuWithPeople, MenuWithSorting, updateStringList } from './utility/LoadAnimations';
import { store } from '../appstate/store';
import * as Actions from '../appstate/actions';
import React from 'react';
import { AddPBIPopup } from './popups/AddPBIPopup';
import { AddSprintPopup } from './popups/AddSprintPopup';
import { initSprint } from '../appstate/stateInitValues';
import { initFilterMenu, initFilterSortInfo, initSortedInfo } from './utility/commonInitValues';
import { getOwnerNameLocation, isArrayValid } from './utility/commonFunctions';
import { ISortedInfo } from './utility/commonInterfaces';
import { addPBIToRepo, unassignPBIsFromSprint } from './utility/BacklogHandlers';
import { useLocation } from 'react-router';
const { Search } = Input;

/** Renders Product Backlog View*/
export const Project = React.memo((props: any) => {
  const isLoggedIn = useSelector((appState: IState) => appState.loginState.isLoggedIn);
  const loading = useSelector((appState: IState) => appState.sprintRequireRefresh || appState.reposRequireRefresh);
  const token = useSelector((appState: IState) => appState.loginState.token);
  const pbiPage = useSelector((appState: IState) => appState.pbiPage as IBacklogItemList);
  const sprintPage = useSelector((appState: IState) => appState.sprintPage as ISprintList);
  const [initialRefresh, setInitialRefresh] = useState(true);
  const [infos, setInfos] = useState(initFilterSortInfo);
  const [filterMenu, setFilterMenu] = useState(initFilterMenu);
  const [filterPBI, setFiltersPBI] = useState<IFilters>({ nameFilter: [] as string[], peopleFilter: [] as string[] });
  const [inputPplFilter, setInputPplFilter] = useState("");
  const location = useLocation();
  const ownerName = localStorage.getItem("ownerName") ? localStorage.getItem("ownerName") as string : getOwnerNameLocation(location.pathname);
  const currentUser = useSelector((appState: IState) => appState.currentUser);
  const people = useSelector((appState: IState) => appState.people as IPeopleList);
  const [isAddPBI, setIsAddPBI] = useState(false);
  const [isAddSprint, setIsAddSprint] = useState(false);
  const [finishLoad, setFinishLoad] = useState(false);
  const error = useSelector((appState: IState) => appState.error);
  
  const updatePplFilter = (items: string[]) => { setFiltersPBI({ ...filterPBI, peopleFilter: items }); };
  const updateInputPplFilter = (e: { target: { value: string; }; }) => { setInputPplFilter(e.target.value); };
  const onSearch = (value: string) => { setFiltersPBI({ ...filterPBI, nameFilter: value !== "" ? [value.toLowerCase()] : [] }); };
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
    <div id="projectDiv" className='projectDiv'>
      <Space wrap direction="horizontal" split={true} onMouseLeave={() => setFilterMenu(initFilterMenu)}
        className='projectSpace' style={{ marginBottom: "0.5%" }}>
        <Button loading={loading || finishLoad} type="primary" onClick={() => { setIsAddSprint(true); }}>{"Create Sprint"}</Button>
        <Button type="primary" onClick={() => { setIsAddPBI(true); }}>{"Add Product Backlog Item"}</Button>
        <Search autoComplete='on' onMouseEnter={() => setFilterMenu(initFilterMenu)} placeholder="Input Backlog Item name" onSearch={onSearch} enterButton />
        <Badge status={"error"} count={isArrayValid(infos.filteredInfo.complete) || isArrayValid(infos.filteredInfo.pbiPriority) ? 2 : 0}
          overflowCount={1} style={{ borderColor: "transparent", zIndex: 20 }}>
          <Dropdown.Button
            className='projectDropBtn'
            placement="bottomCenter"
            visible={filterMenu.filterMenuVisible}
            overlay={<MenuWithFilters openKeys={filterMenu.openKeys}
              setOpenKeys={function (keys: string[]): void { setFilterMenu({ ...filterMenu, openKeys: keys }); }}
              onVisibilityChange={function (flag: boolean): void { setFilterMenu(initFilterMenu); }}
              itemSelected={function (items: any): void {
                setFilterMenu({ ...filterMenu, filterMenuVisible: true });
                setInfos({ ...infos, filteredInfo: items });
              }}
              filteredInfo={infos.filteredInfo} />}
            buttonsRender={() => [<></>,
            React.cloneElement(<Button type="primary" onMouseEnter={() => { setFilterMenu({ ...filterMenu, filterMenuVisible: true }); }}
              icon={<FilterOutlined className='projectWhIcon'></FilterOutlined>}>Filter</Button>),
            ]} >
          </Dropdown.Button>
        </Badge>
        <Badge status={"error"} count={infos.sortedInfo !== initSortedInfo ? 2 : 0} overflowCount={1} style={{ borderColor: "transparent", zIndex: 20 }}>
          <Dropdown.Button
            className='projectDropBtn'
            placement="bottomCenter"
            overlay={<MenuWithSorting itemSelected={function (items: any): void { setInfos({ ...infos, sortedInfo: items }); }}
              sortedInfo={infos.sortedInfo} />}
            buttonsRender={() => [<></>,
            React.cloneElement(<Button onMouseEnter={() => setFilterMenu(initFilterMenu)} type="primary"
              icon={<DownOutlined prefix='Sort' className='projectWhIcon'></DownOutlined>}>{"Sort"}</Button>),
            ]} >
          </Dropdown.Button></Badge>
        <Dropdown.Button
          className='projectDropBtn'
          placement="bottomCenter"
          overlay={<MenuWithPeople itemSelected={function (items: string[]): void { updatePplFilter(items); }} people={people}
            peopleFilter={filterPBI.peopleFilter} inputFilter={inputPplFilter} />}
          buttonsRender={([a, b]) => [
            <></>,
            React.cloneElement(<Input type="search" prefix={<UserOutlined className='projectColIcon' />}
              placeholder="Input user login" className='projectInputPpl' onChange={updateInputPplFilter} />),
          ]} >
        </Dropdown.Button>
        {currentUser.isCurrentUser &&
          <div onClick={() => { updatePplFilter(updateStringList(filterPBI.peopleFilter, currentUser.login)) }}
            className={filterPBI.peopleFilter.includes(currentUser.login) ? 'projectCurUserShadowDiv' : 'projectCurUserDiv'}>
            <Badge status={"success"} style={{ borderColor: "transparent" }} dot={filterPBI.peopleFilter.includes(currentUser.login)}>
              <Avatar src={`${currentUser.avatarLink}`} />
            </Badge>
          </div>}
      </Space>
      <ProductBacklog sortSelected={function (items: ISortedInfo): void { setInfos({ ...infos, sortedInfo: items }); }}
        itemSelected={function (items: number[]):
          void { setInfos({ ...infos, filteredInfo: { complete: infos.filteredInfo.complete, pbiPriority: items } }); }}
        sortedInfo={infos.sortedInfo} filteredInfo={infos.filteredInfo} peopleFilter={filterPBI.peopleFilter}
        nameFilter={filterPBI.nameFilter} />
      {isAddSprint && <AddSprintPopup error={error.erorMessage} data={initSprint} visible={isAddSprint}
        onCreate={function (sprint: any): void { 
          unassignPBIsFromSprint(sprint,setIsAddSprint,sprintPage, token,ownerName, setFinishLoad); }}
        onCancel={() => { setIsAddSprint(false); }} pbiData={pbiPage && isArrayValid(pbiPage.list)?pbiPage.list:[]} sprintData={sprintPage && isArrayValid(sprintPage.list)?sprintPage.list:[]} />}
      {isAddPBI && <AddPBIPopup visible={isAddPBI}
        onCreate={function (values: any): void { addPBIToRepo(values, ownerName, token, setIsAddPBI) }}
        onCancel={() => { setIsAddPBI(false); }} />}
    </div>
  );
});
