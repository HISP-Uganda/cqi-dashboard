import { Box } from '@chakra-ui/layout';
import { Button, Card, Pagination, Table } from 'antd';
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { useD2 } from "../Context";
import ColumnDrawer from './ColumnDrawer';
import OrgUnitTreeSelect from './OrgUnitTreeSelect';
import ProgramSelect from './ProgramSelect';
import { changeCurrentProject } from '../Events'

const TrackedEntityInstances = () => {
  const d2 = useD2();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const { url } = useRouteMatch();
  const [orgUnit, setOrgUnit] = useState<string>(params.get("ou"));
  const [program, setProgram] = useState<string>(params.get('program'));
  const [trackedEntityType, setTrackedEntityType] = useState<string>(params.get('trackedEntityType'))
  const [columns, setColumns] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [indexes, setIndexes] = useState<[number, number, number, number]>([7, 8, 9, 14]);
  const history = useHistory();
  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
  } = useQuery<any, Error>(
    ["trackedEntityInstances", page, orgUnit, program, pageSize],
    () => fetchInstances(page, orgUnit, program, pageSize),
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (program) {
      params.append('program', program);
    }
    if (orgUnit) {
      params.append('ou', orgUnit);
    }
    history.push({ search: params.toString(), pathname: url })
  }, [program, orgUnit, history])

  const add = () => {
    const params = new URLSearchParams();
    if (program && orgUnit) {
      params.append('program', program);
      params.append('ou', orgUnit);
      params.append('trackedEntityType', trackedEntityType);
    }
    history.push({ search: params.toString(), pathname: `${url}/add` })
  }

  useEffect(() => {
    if (data && params.get('program') === 'vMfIVFcRWlu') {
      const startDateIndex = data.headers.findIndex((h: any) => h.name === 'y3hJLGjctPk');
      const endDateIndex = data.headers.findIndex((h: any) => h.name === 'iInAQ40vDGZ');
      const frequencyIndex = data.headers.findIndex((h: any) => h.name === 'WQcY6nfPouv');
      const indicatorIndex = data.headers.findIndex((h: any) => h.name === 'kHRn35W3Gq4');
      console.log(indicatorIndex);
      setIndexes([startDateIndex, endDateIndex, frequencyIndex, indicatorIndex]);
    }
  }, [data])

  const handleChange = async (value: string) => {
    setColumns([]);
    const [trackedEntityType, program] = value.split(',');
    setProgram(program);
    setTrackedEntityType(trackedEntityType);
  };

  const handleOrgUnitChange = (unit: string) => {
    setOrgUnit(unit);
  };

  const fetchInstances = async (page: number, ou: string, program: string, pageSize: number) => {
    const api = d2.Api.getApi();
    if (program && ou) {
      return await api.get("trackedEntityInstances/query.json", {
        page,
        program,
        totalPages: true,
        pageSize,
        ou,
      });
    }
    return null;
  }

  const onChange = (p: number, ps: number) => {
    setPage(p);
    if (ps !== pageSize) {
      setPageSize(ps);
      setPage(1);
    }
  }

  const head = <div style={{ display: 'flex' }}>
    <div style={{ width: '34%' }}>
      <OrgUnitTreeSelect selectedOrgUnit={orgUnit} setSelectedOrgUnit={handleOrgUnitChange} />
    </div>
    <div style={{ width: '34%', paddingLeft: 5, paddingRight: 5 }}>
      <ProgramSelect selectedValue={program && trackedEntityType ? `${trackedEntityType},${program}` : ''} handleChange={handleChange} />
    </div>
    <div style={{ width: '32%', marginLeft: 'auto', textAlign: 'right' }}><Button size="large" onClick={() => add()}>Add</Button></div>
  </div>

  if (isError) {
    return <div>
      {head}
      {error.message}
    </div>
  }
  if (isLoading) {
    return <div>Is Loading</div>
  }

  return (
    <Box m="5px" bg="white" p="10px">
      {head}
      {data && <Box mt="10px">
        <Card title="QI projects" extra={<ColumnDrawer program={program} setColumns={setColumns} headers={data.headers} />} bodyStyle={{ padding: 0 }}>
          <Table
            tableLayout="auto"
            loading={isFetching}
            rowKey={(record: any) => record[0]}
            columns={columns}
            dataSource={data.rows}
            pagination={false}
            rowClassName={(record, index: number) => index % 2 === 0 ? 'even' : 'odd'}
            onRow={(record: any[]) => {
              const pms = new URLSearchParams(search);
              if (program === 'vMfIVFcRWlu') {
                pms.append('start', record[indexes[0]]);
                pms.append('end', record[indexes[1]]);
                pms.append('frequency', record[indexes[2]]);
                pms.append('indicator', record[indexes[3]]);
              }
              return {
                onClick: () => {
                  changeCurrentProject([record[indexes[0]], record[indexes[1]], record[indexes[2]]])
                  history.push({ search: pms.toString(), pathname: `/instances/${record[0]}` })
                },
              };
            }}
          />
        </Card>
        <Box m="5px"><Pagination current={page} onChange={onChange} total={data.metaData.pager.total} pageSize={pageSize} showSizeChanger={true} /></Box>
      </Box>}
    </Box>
  )
}

export default TrackedEntityInstances
