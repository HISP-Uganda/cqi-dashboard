import { Input, Table } from 'antd';
import { parseISO, format, isValid } from 'date-fns';
import { fromPairs } from 'lodash';
import { FC, useEffect, useState } from 'react';
import Plot from "react-plotly.js";
import { useMutation, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import { useD2 } from '../Context';
import { useEvents } from '../Queries';
import { generateUid } from '../utils/uid';
import DatePicker from './DatePicker';

interface MultipleProps {
  tei: string;
  stage: string;
}


const MultipleEvents: FC<MultipleProps> = ({ tei, stage }) => {
  const d2 = useD2();
  const api = d2.Api.getApi();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const queryClient = useQueryClient();
  const [currentData, setCurrentData] = useState<any[]>([]);
  const addEvent = async (event: any) => {
    return await api.post(`events.json`, event);
  }

  const { mutateAsync } = useMutation(addEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["events", stage, tei])
    },
  })


  const [data, setData] = useState([
    {
      'id': 'Review Month',
      '0': undefined,
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
    },
    {
      'id': 'Numerator',
      '0': undefined,
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
      '0': undefined,
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
      '0': undefined,
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
    let eventDate = data[0]
    let numerator = data[1];
    let denominator = data[2];
    let indicator = data[3];
    if (row === 0) {
      eventDate = { ...eventDate, [key]: format(e, "yyyy-MM-dd") }
    } else if (row === 1) {
      numerator = { ...numerator, [key]: Number(e.target.value) }
    } else if (row === 2) {
      denominator = { ...denominator, [key]: Number(e.target.value) }
    }
    const num = numerator[key]
    const den = denominator[key]

    if (num && den) {
      const ind = Number(Number(num * 100 / den).toFixed(1));
      indicator = { ...indicator, [key]: ind }
    }
    setData([eventDate, numerator, denominator, indicator]);
  }

  const onBlur = (key: string) => async (e: any) => {
    const x = currentData.find((pd: any) => pd.ef2RxnUK9ac === key);

    let currentEventDate = data[0][key]
    console.log(currentEventDate);
    let numerator = data[1][key];
    let denominator = data[2][key];

    let event = null;

    const dataValues = [{
      dataElement: 'rVZlkzOwWhi', value: numerator
    }, {
      dataElement: 'RgNQcLejbwX', value: denominator
    }, {
      dataElement: 'ef2RxnUK9ac', value: key
    }];

    if (x) {
      const { rVZlkzOwWhi, RgNQcLejbwX, ef2RxnUK9ac, eventDate, ...others } = x;

      if (rVZlkzOwWhi !== numerator || RgNQcLejbwX !== denominator) {
        event = {
          ...others,
          dataValues
        }
      }
    } else {
      event = {
        event: generateUid(),
        currentEventDate,
        programStage: stage,
        trackedEntityInstance: tei,
        program: params.get('program'),
        orgUnit: params.get('ou'),
        dataValues
      }
    }
    // if (numerator && denominator) {
    //   await mutateAsync(event);
    // }
  }

  const display = (text: string, index: number, column: string) => {
    if (index === 0) {
      let parsedDate = parseISO(text);
      if (!isValid(parsedDate)) {
        parsedDate = undefined
      }
      return <DatePicker picker="month" value={parsedDate} suffixIcon={null} onChange={changeIndicator(column, index)} onBlur={onBlur(column)} />
    }
    return <Input
      style={{ textAlign: 'center' }}
      value={text} onChange={index !== 3 ? changeIndicator(column, index) : null}
      onBlur={index !== 3 ? onBlur(column) : null}
      disabled={index === 3}
    />
  }

  const columns: any[] = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '0',
      dataIndex: '0',
      key: '0',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '0')
    },
    {
      title: '1',
      dataIndex: '1',
      key: '1',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '1')
    },
    {
      title: '2',
      dataIndex: '2',
      key: '2',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '2')
    },
    {
      title: '3',
      dataIndex: '3',
      key: '3',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '3')
    },
    {
      title: '4',
      dataIndex: '4',
      key: '4',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '4')
    },
    {
      title: '5',
      dataIndex: '5',
      key: '5',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '5')
    },
    {
      title: '6',
      dataIndex: '6',
      key: '6',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '6')
    },
    {
      title: '7',
      dataIndex: '7',
      key: '7',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '7')
    },
    {
      title: '8',
      dataIndex: '8',
      key: '8',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '8')
    },
    {
      title: '9',
      dataIndex: '9',
      key: '9',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '9')
    },
    {
      title: '10',
      dataIndex: '10',
      key: '10',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '10')
    },
    {
      title: '11',
      dataIndex: '11',
      key: '11',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '11')
    },
    {
      title: '12',
      dataIndex: '12',
      key: '12',
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, '12')
    },
  ]

  const {
    isLoading,
    isError,
    error,
    data: fetchedData
  } = useEvents(d2, stage, tei);

  useEffect(() => {
    if (fetchedData) {
      let eventDate = data[0]
      let numerator = data[1];
      let denominator = data[2];
      let indicator = data[3];
      const processedData = fetchedData.events.map(({ dataValues, ...others }: any) => {
        return {
          ...others,
          ...fromPairs(dataValues.map((dv: any) => [dv.dataElement, dv.value]))
        }
      });
      setCurrentData(processedData);
      for (let i = 0; i <= 12; i++) {
        const x = processedData.find((pd: any) => pd.ef2RxnUK9ac === i.toString());
        if (x) {
          const num = x.rVZlkzOwWhi;
          const den = x.RgNQcLejbwX;
          const month = x.ef2RxnUK9ac;
          const eDate = x.eventDate;
          eventDate = { ...eventDate, [month]: eDate }
          numerator = { ...numerator, [month]: num }
          denominator = { ...denominator, [month]: den }
          indicator = { ...indicator, [month]: Number((num * 100 / den).toFixed(1)) }
          setData([eventDate, numerator, denominator, indicator])
        }
      }
    }
  }, [fetchedData])

  if (isLoading) {
    return <div>Is Loading</div>
  }

  if (isError) {
    return <div>{error.message}</div>
  }

  return (
    <div>
      <div style={{ height: '100%', marginBottom: 20, paddingLeft: 60 }}>
        <Plot
          data={[
            {
              x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
              y: Object.values(data[2]),
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" },
            }
          ]}
          layout={{
            autosize: true,
            title: "Progress",
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
              t: 50,
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
