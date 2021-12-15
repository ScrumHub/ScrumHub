import { Skeleton } from "antd";

export default function SkeletonList(props:any) {
    return (<>
        <section className="card" style={{ width: "85%", }} key={0} >
            <Skeleton loading={props.loading} active /></section>
        <section className="card" style={{ width: "85%", }} key={1} >
            <Skeleton loading={props.loading} active /></section>
        <section className="card" style={{ width: "85%", }} key={2} >
            <Skeleton loading={props.loading} active /></section>
        <section className="card" style={{ width: "85%", }} key={3} >
            <Skeleton loading={props.loading} active /></section>
    </>);

}