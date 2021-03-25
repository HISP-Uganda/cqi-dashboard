import { Input, Table } from 'antd';
import { useState } from 'react';
import Plot from "react-plotly.js";

const MultipleEvents = () => {
  const [data, setData] = useState([{
    'id': 'Numerator',
    '1': undefined,
    '2': undefined,
    '3': undefined,
    '4': undefined,
    '5': undefined,
    '6': undefined,
    '7': undefined,
    '8': undefined,
    '9': undefined,
    '10': undefined,
    '11': undefined,
    '12': undefined,
  }, {
    'id': 'Denominator',
    '1': undefined,
    '2': undefined,
    '3': undefined,
    '4': undefined,
    '5': undefined,
    '6': undefined,
    '7': undefined,
    '8': undefined,
    '9': undefined,
    '10': undefined,
    '11': undefined,
    '12': undefined,
  }, {
    'id': '%',
    '1': undefined,
    '2': undefined,
    '3': undefined,
    '4': undefined,
    '5': undefined,
    '6': undefined,
    '7': undefined,
    '8': undefined,
    '9': undefined,
    '10': undefined,
    '11': undefined,
    '12': undefined,
  }]);

  const changeIndicator = (key: string, row: number) => (e: any) => {
    let newState = [
      ...data.slice(0, row),
      { ...data[row], [key]: e.target.value },
      ...data.slice(row + 1)
    ];

    const numerator = data[0][key]
    const denominator = data[1][key]

    if (numerator && denominator) {
      console.log(numerator,denominator)
      const indicator = numerator * 100 / denominator;
      const newIndicatorValue = { ...data[2], [key]: indicator };
      newState = [...data.slice(0, 2), newIndicatorValue]
    }

    setData(newState);
  }

  const columns: any[] = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '1',
      dataIndex: '1',
      key: '1',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('1', index) : null} disabled={index === 2} />
    },
    {
      title: '2',
      dataIndex: '2',
      key: '2',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('2', index) : null} disabled={index === 2} />
    },
    {
      title: '3',
      dataIndex: '3',
      key: '3',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('3', index) : null} disabled={index === 2} />
    },
    {
      title: '4',
      dataIndex: '4',
      key: '4',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('4', index) : null} disabled={index === 2} />
    },
    {
      title: '5',
      dataIndex: '5',
      key: '5',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('5', index) : null} disabled={index === 2} />
    },
    {
      title: '6',
      dataIndex: '6',
      key: '6',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('6', index) : null} disabled={index === 2} />
    },
    {
      title: '7',
      dataIndex: '7',
      key: '7',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('7', index) : null} disabled={index === 2} />
    },
    {
      title: '8',
      dataIndex: '8',
      key: '8',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('8', index) : null} disabled={index === 2} />
    },
    {
      title: '9',
      dataIndex: '9',
      key: '9',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('9', index) : null} disabled={index === 2} />
    },
    {
      title: '10',
      dataIndex: '10',
      key: '10',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('10', index) : null} disabled={index === 2} />
    },
    {
      title: '11',
      dataIndex: '11',
      key: '11',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('11', index) : null} disabled={index === 2} />
    },
    {
      title: '12',
      dataIndex: '12',
      key: '12',
      align: 'center',
      render: (text: string, record: any, index: number) => <Input style={{ textAlign: 'center' }} value={text} onChange={index !== 2 ? changeIndicator('12', index) : null} disabled={index === 2} />
    },
  ]


  return (
    <div>
      <div style={{ height: 300, marginBottom: 20, paddingLeft: 60 }}>
        <Plot
          data={[
            {
              x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
              y: Object.values(data[2]),
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" },
            }
          ]}
          layout={{
            autosize: true,
            title: "Graph",
            legend: {
              orientation: "h",
              yanchor: "bottom",
              y: 1,
              xanchor: "right",
              x: 1,
            },
            margin: {
              pad: 5,
              r: 0,
              t: 100,
              l: 40,
              b: 20,
            },
            xaxis: {
              showgrid: false,
              zeroline: false,
              // rangemode: "tozero",
            },
            yaxis: {
              showgrid: true,
              zeroline: true,
              gridcolor: "LightGray",
              zerolinecolor: "black",
              rangemode: "tozero",
            },
          }}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
          config={{ displayModeBar: false }}
        />
      </div>
      <div>
        <Table showHeader={false} columns={columns} dataSource={data} bordered rowKey="id" pagination={false} />
      </div>
    </div>
  )
}

export default MultipleEvents
