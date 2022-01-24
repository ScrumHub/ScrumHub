import { CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';
import { Avatar, Button, Menu, Popover, Skeleton, Space, Tag } from "antd";
import MenuItem from "antd/lib/menu/MenuItem";
import { useState } from "react";
import { IFilters, IPerson } from "../../appstate/stateInterfaces";
import "../Home.css";
import { isArrayValid, isNameFilterValid } from "./commonFunctions";
import { useEffect } from "react";
import SubMenu from "antd/lib/menu/SubMenu";
import { backlogColors, backlogPriorities } from "./BodyRowsAndColumns";
import { initFilteredInfo } from "./commonInitValues";

export default function SkeletonList(props: any) {
    const number = props.number ? props.number : 0;
    const loading = props.loading !== null ? props.loading : true;
    return (<>
        {Array.from(Array(number).keys()).map((i: number) => {
            return <section className="card" style={{ width: props.width ? "100%" : "85%", }} key={i} >
                <Skeleton loading={loading} active /></section>
        })
        }
    </>);
}

export const content = (
    <div>
        <p></p>
        <p style={{ textAlign: "center" }}>{"Administrator permission needed\n"}<br />{"to add to ScrumHub!"}</p>
    </div>
);

export function CantAddToShButton() {
    return <Popover content={content}><Button disabled={true} style={{ width: "80%" }}>
        <span>{<CloseCircleOutlined disabled={true} />}{" Cannot Add"}</span></Button></Popover>
}

export function InShButton() {
    return <Button disabled={true} className="cardButton" >
        <span>{<CheckCircleOutlined disabled={true} />}
            {" In ScrumHub"}</span></Button>
}

export const updateStringList = (items: string[], item: string) => {
    if (!items || items.length < 1) { return ([item]); }
    else {
        const list = items.includes(item) ? items.filter((name: string) => name !== item) : items.concat(item);
        return (list);
    }
};

export function MenuWithPeople(props: any) {
    const ppl = props.people && props.people.list && props.people.list.length > 0 ? props.people.list : [] as IPerson[];
    const [nameList, setList] = useState([] as string[]);

    const inputFilter = isNameFilterValid(props.inputFilter) ? props.inputFilter : "";
    const handleList = (item: IPerson) => {
        if (!nameList || nameList.length < 1) { setList([item.login]); props.itemSelected([item.login]); }
        else {
            const list = nameList.includes(item.login) ? nameList.filter((name: string) => name !== item.login) : nameList.concat(item.login);
            setList(list);
            props.itemSelected(list);
        }
    };
    useEffect(() => {
        setList(props.peopleFilter);

    }, [props.peopleFilter]);

    return (<Menu hidden={!isNameFilterValid(props.inputFilter)} className="peopleMenu">{ppl.map((item: IPerson) => {
        return ((item.login.startsWith(inputFilter) || nameList.includes(item.login)) &&
            <MenuItem key={item.login} onClick={() => { handleList(item); }}>
                <Space>
                    <Avatar src={`${item.avatarLink}`} ></Avatar>
                    {" "}
                    <div style={{ minWidth: "10vw" }} >{" " + item.login as string}</div>


                    {nameList && nameList.length > 0 && nameList.includes(item.login) ? <CheckOutlined /> : <></>}
                </Space>

            </MenuItem>);
    })
    }</Menu >);
}

export function MenuWithSorting(props: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [sortedInfo, setSortedInfo] = useState([] as IFilters);
    const handleList = (item: any) => {
        if (item.columnKey === props.sortedInfo.columnKey && item.order === props.sortedInfo.order) {
            props.itemSelected({ columnKey: "", order: "" })
        }
        else { props.itemSelected(item); }
    };
    useEffect(() => {
        setSortedInfo(props.sortedInfo);
    }, [props.sortedInfo]);
    return (<Menu hidden={!props.sortedInfo} className="peopleMenu" selectedKeys={[]}>
        <MenuItem key={"pbiPriorityDesc"} onClick={() => { handleList({ columnKey: "pbiPriority", order: "descend" }); }}>
            <Space>
                <div style={{ minWidth: "6vw" }} >{"Priority"}</div>
                <SortDescendingOutlined />
            </Space>
        </MenuItem>
        <MenuItem key={"pbiPriorityAsc"} onClick={() => { handleList({ columnKey: "pbiPriority", order: "ascend" }); }}>
            <Space>
                <div style={{ minWidth: "6vw" }} >{"Priority"}</div>
                <SortAscendingOutlined />
            </Space>
        </MenuItem>
        <MenuItem key={"sprintDesc"} onClick={() => { handleList({ columnKey: "isCompleted", order: "descend" }); }}>
            <Space>
                <div style={{ minWidth: "6vw" }} >{"Sprint"}</div>
                <SortDescendingOutlined />
            </Space>
        </MenuItem>
        <MenuItem key={"sprintAsc"} onClick={() => { handleList({ columnKey: "isCompleted", order: "ascend" }); }}>
            <Space>
                <div style={{ minWidth: "6vw" }} >{"Sprint"}</div>
                <SortAscendingOutlined />
            </Space>

        </MenuItem>
        <MenuItem key={"clear"} onClick={() => { handleList({ columnKey: "", order: "" }); }}>
            <Space>
                <div style={{ minWidth: "6vw" }} >{"Clear Sorting"}</div>
            </Space>

        </MenuItem>
    </Menu >);
}

export function MenuWithFilters(props: any) {
    const [filteredInfo, setFilteredInfo] = useState(initFilteredInfo);
    const handleList = (item: any) => {
        if (!filteredInfo) { props.itemSelected(initFilteredInfo); }
        else if (typeof (item.complete) !== "undefined" && filteredInfo) {
            if (isArrayValid(filteredInfo.complete)) {
                props.itemSelected({
                    ...filteredInfo, complete: filteredInfo.complete.includes(item.complete) ?
                        filteredInfo.complete.filter((num: number) => num !== item.complete) : filteredInfo.complete.concat(item.complete)
                })
            }
            else {
                props.itemSelected({ ...filteredInfo, complete: [item.complete] });
            }
        }
        else if (typeof (item.pbiPriority) !== "undefined" && filteredInfo) {
            if (isArrayValid(filteredInfo.pbiPriority)) {
                props.itemSelected({
                    ...filteredInfo, pbiPriority: filteredInfo.pbiPriority.includes(item.pbiPriority) ?
                        filteredInfo.pbiPriority.filter((num: number) => num !== item.pbiPriority) : filteredInfo.pbiPriority.concat(item.pbiPriority)
                })
            }
            else {
                props.itemSelected({ ...filteredInfo, pbiPriority: [item.pbiPriority] });
            }
        }
    };
    useEffect(() => {
        if (props.filteredInfo) {setFilteredInfo(props.filteredInfo);  }
    }, [props.filteredInfo]);
    return (props.filteredInfo &&
        <Menu onMouseLeave={() => { props.onVisibilityChange(false); }}
            defaultOpenKeys={[]} selectedKeys={[]}
            mode="vertical"
            openKeys={props.openKeys}
            className="peopleMenu">
            <SubMenu onTitleMouseEnter={() => { props.setOpenKeys(["sprintComplete"]); }} title="Sprint Completeness" key="sprintComplete">
                <MenuItem key={"completed"} onClick={() => { props.setOpenKeys(["sprintComplete"]); handleList({ complete: 1 }); }}>
                    <Space style={{ minWidth: "8.5vw" }}>
                        <div style={{ minWidth: "7vw" }} >{"Complete"}</div>
                        {filteredInfo && isArrayValid(filteredInfo.complete) && filteredInfo.complete.includes(1) ? <CheckOutlined /> : <></>}
                    </Space>
                </MenuItem>
                <MenuItem key={"not_completed"} onClick={() => { props.setOpenKeys(["sprintComplete"]); handleList({ complete: 0 }); }}>
                    <Space style={{ minWidth: "8.5vw" }}>
                        <div style={{ minWidth: "7vw" }} >{"Not Complete"}</div>
                        {filteredInfo && isArrayValid(filteredInfo.complete) && filteredInfo.complete.includes(0) ? <CheckOutlined /> : <></>}
                    </Space>
                </MenuItem>
            </SubMenu>
            <SubMenu onTitleMouseEnter={() => { props.setOpenKeys(["pbiPriority"]); }} title="Backlog Item Priority" key="pbiPriority">
                {backlogPriorities.map((item, key) => {
                    return (<MenuItem key={"priority" + key} onClick={() => { handleList({ "pbiPriority": key }); }}>
                        <Space style={{ minWidth: "6vw" }}>
                            <div style={{ minWidth: "4.5vw", alignSelf: "start" }} ><Tag color={backlogColors[key]}>{backlogPriorities[key]}</Tag></div>
                            {filteredInfo && isArrayValid(filteredInfo.pbiPriority) && filteredInfo.pbiPriority.includes(key) ? <CheckOutlined /> : <></>}
                        </Space>
                    </MenuItem>)
                })}
            </SubMenu>
            <MenuItem key={"clear"} onMouseEnter={() => { props.setOpenKeys([]); }} onClick={() => { props.itemSelected(initFilteredInfo) }}>
                <Space>
                    <div style={{ minWidth: "7vw" }} >{"Clear All Filters"}</div>
                </Space>

            </MenuItem>
        </Menu >);
}


export function PBIMenuWithPeople(props: any) {
    const ppl = props.people && props.people.list && props.people.list.length > 0 ? props.people.list : [] as IPerson[];
    const [nameList, setList] = useState(props.taskPeople.map((item: IPerson) => { return (item.login) }));
    const handleList = (item: IPerson) => {
        if (!nameList || nameList.length < 1) { setList([item.login]); props.itemSelected(item.login); }
        else {
            const list = nameList.includes(item.login) ? nameList.filter((name: string) => name !== item.login) : nameList.concat(item.login);
            setList(list);
            props.itemSelected(item.login);
        }
    };
    return (<div><Menu className="peopleMenu">{ppl.map((item: IPerson) => {
        return (
            <MenuItem key={item.login} onClick={() => { handleList(item); }}>
                <Space style={{ width: "14vw" }}>
                    <Avatar src={`${item.avatarLink}`} ></Avatar>
                    {" "}
                    <div style={{ width: "8vw" }} >{" " + item.login as string}</div>
                    {nameList && nameList.length > 0 && nameList.includes(item.login) ? <CheckOutlined /> : <></>}
                </Space>
            </MenuItem>);
    })
    }
    </Menu >
    </div>);
}

export function PBIMenuWithPriorities(props:any) {
    const val = typeof(props.priority)==="number" && props.priority < backlogPriorities.length ? props.priority : -1;
    const handleList = (item: number) => {
        if (item < backlogPriorities.length) { props.itemSelected(item); }
    };
    return (<div><Menu className="peopleMenu">{backlogPriorities.map((item:string, key:number) => {
        return (
            <MenuItem key={"pbiPrior"+item} onClick={() => { handleList(key); }}>
                <Space>
                <Tag style={{ cursor: "pointer" }} color={backlogColors[key%3]}>{backlogPriorities[key % 3]}</Tag>
                    <CheckOutlined hidden={key!==val || val<0} />
                </Space>
            </MenuItem>);
    })
    }
    </Menu >
    </div>);
}
