import { InputNumber, Table } from 'antd';
import { format, isValid, parseISO } from 'date-fns';
import { useStore } from 'effector-react';
import { fromPairs, range } from 'lodash';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import Plot from "react-plotly.js";
import { useMutation, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import { useD2 } from '../Context';
import { useEvents } from '../Queries';
import { dashboards } from '../Store';
import { calculateEventDays, reviewPeriodString } from '../utils/common';
import { generateUid } from '../utils/uid';
import DatePicker from './DatePicker';

interface MultipleProps {
  tei: string;
  stage: string;
  title?: string;
}


const MultipleEvents: FC<MultipleProps> = ({ tei, stage, title }) => {
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
  });

  const length = calculateEventDays(params.get('start'), params.get('end'), params.get('frequency'));
  const defaultArray = range(0, length);
  const defaultValues = fromPairs(defaultArray.map((val: number) => [val.toString(), '']));
  const defaultColumns = defaultArray.map((val: number) => {
    const stringVal = val.toString();
    return {
      title: stringVal,
      dataIndex: stringVal,
      key: stringVal,
      align: 'center',
      render: (text: string, record: any, index: number) => display(text, index, stringVal)
    }
  });

  const [data, setData] = useState([
    {
      'id': `Review ${reviewPeriodString(params.get('frequency'))}`,
      ...defaultValues
    },
    {
      'id': 'Numerator',
      ...defaultValues
    }, {
      'id': 'Denominator',
      ...defaultValues
    }, {
      'id': '%',
      ...defaultValues
    }]);

  const changeIndicator = (key: string, row: number) => (e: any) => {
    let eventDate = data[0]
    let numerator = data[1];
    let denominator = data[2];
    let indicator = data[3];
    if (row === 0) {
      eventDate = { ...eventDate, [key]: format(e, "yyyy-MM-dd") }
    } else if (row === 1) {
      numerator = { ...numerator, [key]: Number(e) }
    } else if (row === 2) {
      denominator = { ...denominator, [key]: Number(e) }
    }
    const num = numerator[key]
    const den = denominator[key];
    if (num >= 0 && den !== 0) {
      const ind = Number(Number(num * 100 / den).toFixed(1));
      indicator = { ...indicator, [key]: ind }
      setData([eventDate, numerator, denominator, indicator]);
    } else if (den === 0) {
      indicator = { ...indicator, [key]: '-' }
      setData([eventDate, numerator, denominator, indicator]);
    }
  }

  const onBlur = (key: string) => async (e: ChangeEvent<HTMLInputElement>) => {
    const x = currentData.find((pd: any) => pd.ef2RxnUK9ac === key);
    e.persist()
    let currentEventDate = data[0][key]
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
      if (rVZlkzOwWhi !== numerator || RgNQcLejbwX !== denominator || currentEventDate !== format(parseISO(eventDate), 'yyyy-MM-dd')) {
        event = {
          ...others,
          eventDate: currentEventDate,
          dataValues
        }
      }
    } else {
      event = {
        event: generateUid(),
        eventDate: currentEventDate,
        programStage: stage,
        trackedEntityInstance: tei,
        program: params.get('program'),
        orgUnit: params.get('ou'),
        dataValues
      }
    }
    if (numerator && denominator && currentEventDate) {
      await mutateAsync(event);
    }
  }

  const display = (text: string, index: number, column: string) => {
    if (index === 0) {
      let parsedDate = parseISO(text);
      if (!isValid(parsedDate)) {
        parsedDate = undefined
      }
      return <DatePicker picker={reviewPeriodString(params.get('frequency')).toLowerCase()} value={parsedDate} suffixIcon={null} onChange={changeIndicator(column, index)} onBlur={onBlur(column)} />
    }
    return <InputNumber
      min="0"
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
    ...defaultColumns
  ]

  const {
    isLoading,
    isError,
    error,
    data: fetchedData
  } = useEvents(d2, stage, tei, params.get('indicator'));

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
      for (let i of defaultArray) {
        const x = processedData.find((pd: any) => pd.ef2RxnUK9ac === i.toString());
        if (x) {
          const num = Number(x.rVZlkzOwWhi);
          const den = Number(x.RgNQcLejbwX);
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
              x: defaultArray,
              y: Object.values(data[3]),
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" },
            }
          ]}
          layout={{
            autosize: true,
            title: fetchedData.title,
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
