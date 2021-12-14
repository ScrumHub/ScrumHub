import { CheckOutlined, StopOutlined } from "@ant-design/icons";

export const pbiColumns = [
    {
      key: "0",
      title: 'Name',
      colSpan: 2,
      dataIndex: 'name',
      align: 'center' as const,
      render: (text: string) => { return ({ children: text, props: { colSpan: 2 } }) },
      fixed: 'left' as const,
    },
    {
      key: "1",
      title: 'Story Points',
      dataIndex: 'expectedTimeInHours',
      render: (val: number) => val === 0 ? "" : val,
      align: 'center' as const,
    },
    {
      key: "2",
      title: 'Sprint',
      dataIndex: 'sprintNumber',
      align: 'center' as const,
    },
    {
      key: "3",
      title: 'Real Time',
      dataIndex: 'realTime',
      align: 'center' as const,
    },
    {
      key: "4",
      title: 'Priority',
      dataIndex: 'priority',
      align: 'center' as const,
    },
    {
      key: "5",
      colSpan: 2,
      title: 'Acceptance Criteria',
      dataIndex: 'acceptanceCriteria',
      align: 'center' as const,
      render: (record: string[]) => {
        return ({
          children:
            <div style={{ verticalAlign: "center", alignItems: "center", textAlign: "center" }}>{
              record.map((value: string, index: number) => { return (<p key={index} style={{ margin: "auto", marginTop: "5%", marginBottom: "5%" }}>{value}</p>) })
            }
            </div>,
          props: { colSpan: 2 }
        })
      }
    },
    {
      key: "6",
      title: 'Finished',
      dataIndex: 'finished',
      render: (finishValue: boolean) => finishValue ? <CheckOutlined /> : <StopOutlined />,
      align: 'center' as const,
  
    }
  ];

 export const sprintColumns = [
    {
      key: "0",
      title: 'Name',
      colSpan:1,
      dataIndex: 'name',
      align: 'center' as const,
      render:  (text: string) => {return ({ children: text,props: { colSpan: 1 }})},
      fixed: 'left' as const,
    },
    {
      key: "1",
      title: 'Story Points',
      dataIndex: 'expectedTimeInHours',
      align: 'center' as const,
    },
    {
      key: "3",
      title: 'Real Time',
      dataIndex: 'realTime',
      align: 'center' as const,
    },
    {
      key: "4",
      title: 'Priority',
      dataIndex: 'priority',
      align: 'center' as const,
    },
    {
      key: "5",
      colSpan: 2,
      title: 'Acceptance Criteria',
      dataIndex: 'acceptanceCriteria',
      align: 'center' as const,
      render: (record: string[]) => {
        return ({
          children:
            <div style={{ verticalAlign: "center", alignItems: "center", textAlign: "center" }}>{
              record.map((value: string, index: number) => { return (<p key={index} style={{ margin: "auto", marginTop: "5%", marginBottom: "5%" }}>{value}</p>) })
            }
            </div>,
          props: { colSpan: 2 }
        })
      }
    },
    {
      key: "6",
      title: 'Finished',
      dataIndex: 'finished',
      render: (finishValue: boolean) => finishValue ? <CheckOutlined /> : <StopOutlined />,
      align: 'center' as const,
    }
  
  ];