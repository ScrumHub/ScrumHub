import { BorderOutlined, CheckCircleOutlined, CheckOutlined, CheckSquareOutlined, CloseCircleOutlined, CloseSquareOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
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

export default function SkeletonList(props: any) {
    const number = props.number ? props.number : 0;
    const loading = props.loading !== null ? props.loading : true;
    return (<>
        {Array.from(Array(number).keys()).map((i: number) => {
            return <section className="card" style={{ width: "85%", }} key={i} >
                <Skeleton loading={loading} active /></section>
        })
        }
    </>);

}

export const content = (
    <div>
        <p></p>
        <p style={{ "textAlign": "center" }}>{"Administrator permission needed\n"}<br />{"to add to ScrumHub!"}</p>
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

    return (isNameFilterValid(props.inputFilter) && <Menu className="peopleMenu">{ppl.map((item: IPerson) => {
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
    return (props.sortedInfo && <Menu className="peopleMenu">
        <MenuItem key={"pbiPriorityDesc"} onClick={() => { handleList({ columnKey: "pbiPriority", order: "descend" }); }}>
            <Space>
                <div style={{ minWidth: "6vw" }} >{"Priority"}</div>
                <SortDescendingOutlined disabled={sortedInfo && sortedInfo.columnKey && sortedInfo.columnKey.includes("pbiPriority") &&
                    sortedInfo.order && sortedInfo.order.includes("descend")} />
            </Space>
        </MenuItem>
        <MenuItem key={"pbiPriorityAsc"} onClick={() => { handleList({ columnKey: "pbiPriority", order: "ascend" }); }}>
            <Space>
                <div style={{ minWidth: "6vw" }} >{"Priority"}</div>
                <SortAscendingOutlined disabled={sortedInfo && sortedInfo.columnKey && sortedInfo.columnKey.includes("pbiPriority") &&
                    sortedInfo.order && sortedInfo.order.includes("ascend")} />
            </Space>

        </MenuItem>
        <MenuItem key={"sprintDesc"} onClick={() => { handleList({ columnKey: "sprintNumber", order: "descend" }); }}>
            <Space>
                <div style={{ minWidth: "6vw" }} >{"Sprint"}</div>
                <SortDescendingOutlined disabled={sortedInfo && sortedInfo.columnKey && sortedInfo.columnKey.includes("sprintNumber") &&
                    sortedInfo.order && sortedInfo.order.includes("descend")} />
            </Space>
        </MenuItem>
        <MenuItem key={"sprintAsc"} onClick={() => { handleList({ columnKey: "sprintNumber", order: "ascend" }); }}>
            <Space>
                <div style={{ minWidth: "6vw" }} >{"Sprint"}</div>
                <SortAscendingOutlined disabled={sortedInfo && sortedInfo.columnKey && sortedInfo.columnKey.includes("sprintNumber") &&
                    sortedInfo.order && sortedInfo.order.includes("ascend")} />
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
    const [filteredInfo, setFilteredInfo] = useState({ complete: -1, pbiPriorities: [] as number[] } as IFilters);
    const handleList = (item: any) => {
        if (!filteredInfo) { props.itemSelected({ complete: -1, pbiPriorities: [] as number[] }); }
        else if (typeof(item.complete)!=="undefined" && filteredInfo) {
            props.itemSelected({ ...filteredInfo, complete: filteredInfo.complete!==null && filteredInfo.complete === item.complete ? -1 : item.complete });
        }
        else if (item.pbiPriorities && filteredInfo) {
            if (isArrayValid(filteredInfo.pbiPriorities)) {
                console.log(item);
                props.itemSelected({
                    ...filteredInfo, pbiPriorities: filteredInfo.pbiPriorities.includes(item.pbiPriorities) ?
                        filteredInfo.pbiPriorities.filter((num: number) => num !== item.pbiPriorities) : filteredInfo.pbiPriorities.concat(item.pbiPriorities)
                })
            }
            else {
                props.itemSelected({ ...filteredInfo, pbiPriorities: [item.pbiPriorities] });
            }
        }
    };
    useEffect(() => {
        if(props.filteredInfo.complete && props.filteredInfo.pbiPriorities){
        setFilteredInfo(props.filteredInfo);
        }
    }, [props.filteredInfo]);
    console.log(props.filteredInfo);
    return (props.filteredInfo && <Menu className="peopleMenu">
        <SubMenu title="Sprint Completeness">
            <MenuItem key={"completed"} onClick={() => { handleList({ complete: 1 }); }}>
                <Space>
                    <div style={{ minWidth: "7vw" }} >{"Complete"}</div>
                    {filteredInfo &&  filteredInfo.complete === 1 ? <CheckOutlined /> : <></>}
                </Space>
            </MenuItem>
            <MenuItem key={"not_completed"} onClick={() => { handleList({ complete: 0 }); }}>
                <Space>
                    <div style={{ minWidth: "7vw" }} >{"Not Complete"}</div>
                    {filteredInfo &&  filteredInfo.complete === 0 ? <CheckOutlined /> : <></>}
                </Space>
            </MenuItem>
        </SubMenu>
        <SubMenu title="Backlog Item Priority">
            {backlogPriorities.map((item, key) => {
                return (<MenuItem key={"priority" + key} onClick={() => { handleList({ "pbiPriorities": key }); }}>
                    <Space>
                        <div style={{ minWidth: "4vw" }} ><Tag color={backlogColors[key]}>{backlogPriorities[key]}</Tag></div>
                        {filteredInfo && isArrayValid(filteredInfo.pbiPriorities) && filteredInfo.pbiPriorities.includes(key) ? <CheckOutlined /> : <></>}
                    </Space>
                </MenuItem>)
            })}
        </SubMenu>
        <MenuItem key={"clear"} onClick={() => { props.itemSelected({ complete: -1, pbiPriorities: [] as number[] }) }}>
            <Space>
                <div style={{ minWidth: "7vw" }} >{"Clear All Filters"}</div>
            </Space>

        </MenuItem>
    </Menu >);
}


export function MenuWithPeopleSave(props: any) {
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

