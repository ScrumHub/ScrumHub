import { Skeleton } from "antd";

export default function SkeletonList(props:any) {
    const number = props.number? props.number:0;
    const loading = props.loading !== null ?props.loading:true;
    return (<>
    {Array.from(Array(number).keys()).map((i:number)=>{
        return <section className="card" style={{ width: "85%", }} key={i} >
            <Skeleton loading={loading} active /></section>
    })
}
    </>);

}

export const content = (
    <div>
        <p></p>
      <p>Administrator permission needed to add to ScrumHub!</p>
    </div>
  );