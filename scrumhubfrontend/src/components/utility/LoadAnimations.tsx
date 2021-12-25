import { CheckCircleOutlined, CheckOutlined, CloseCircleOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';
import { Avatar, Button, Menu, Popover, Skeleton, Space } from "antd";
import MenuItem from "antd/lib/menu/MenuItem";
import { useState } from "react";
import { IPerson } from "../../appstate/stateInterfaces";
import "../Home.css";

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

export function MenuWithPeople(props: any) {
    const ppl = props.people && props.people.list && props.people.list.length > 0 ? props.people.list : [] as IPerson[];
    const [nameList, setList] = useState([] as string[]);

    const handleList = (item: IPerson) => {
        if (!nameList || nameList.length < 1) { setList([item.login]); props.itemSelected([item.login]); }
        else {
            const list = nameList.includes(item.login) ? nameList.filter((name: string) => name !== item.login) : nameList.concat(item.login);
            setList(list);
            props.itemSelected(list);
        }

    };

    return (<Menu className="peopleMenu">{ppl.map((item: IPerson) => {
        return (
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

export function MenuWithPeopleSave(props: any) {
    const ppl = props.people && props.people.list && props.people.list.length > 0 ? props.people.list : [] as IPerson[];
    const [nameList, setList] = useState(props.taskPeople.map((item:IPerson)=>{return(item.login)}));

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

