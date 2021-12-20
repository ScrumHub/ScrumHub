import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Menu, Popover, Skeleton } from "antd";
import MenuItem from "antd/lib/menu/MenuItem";
import { IPeopleList, IPerson } from "../../appstate/stateInterfaces";
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
        <p style={{"textAlign":"center"}}>{"Administrator permission needed\n"}<br/>{"to add to ScrumHub!"}</p>
    </div>
);

export function CantAddToShButton() {
    return <Popover content={content}><Button disabled={true} style={{  width:"80%" }}>
        <span>{<CloseCircleOutlined disabled={true} />}{" Cannot Add"}</span></Button></Popover>
}

export function InShButton() {
    return <Button disabled={true} className="cardButton" >
        <span>{<CheckCircleOutlined disabled={true} />}
            {" In ScrumHub"}</span></Button>
}

export function MenuWithPeople(people: IPeopleList) {
    const ppl = people && people.list && people.list.length > 0 ? people.list:[] as IPerson[];
    return (<Menu>{ppl.map((item: IPerson) => {
      return (
        <MenuItem key={item.login}>
            <span>
            <Avatar src={`${item.avatarLink}`} ></Avatar>
          <a href={"https://github.com/"+item.login}>{" "+item.login as string}</a>
            </span>
        </MenuItem>);
    })
    }</Menu>);
  }
  /*<Avatar.Group>
      <Avatar src="https://joeschmoe.io/api/v1/random" />
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Tooltip title="Ant User" placement="top">
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
      </Tooltip>
      <Avatar style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} />
    </Avatar.Group>*/