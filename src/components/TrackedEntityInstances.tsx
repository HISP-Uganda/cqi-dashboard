import { Button, Card, Pagination, Table } from 'antd';
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { useD2 } from "../Context";
import ColumnDrawer from './ColumnDrawer';
import OrgUnitTreeSelect from './OrgUnitTreeSelect';
import ProgramSelect from './ProgramSelect';

const TrackedEntityInstances = () => {
  const d2 = useD2();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const { url } = useRouteMatch();
  const [orgUnit, setOrgUnit] = useState<string>(params.get("ou"));
  const [program, setProgram] = useState<string>(params.get('program'));
  const [columns, setColumns] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const history = useHistory();
  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData
  } = useQuery<any, Error>(
    ["trackedEntityInstances", page, orgUnit, program, pageSize],
    () => fetchInstances(page, orgUnit, program, pageSize),
    { keepPreviousData: true }
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
    }
    history.push({ search: params.toString(), pathname: `${url}/add` })
  }

  const handleChange = async (value: string) => {
    setColumns([]);
    setProgram(value);
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
    <div style={{ width: '34%', padding: 5 }}>
      <OrgUnitTreeSelect selectedOrgUnit={orgUnit} setSelectedOrgUnit={handleOrgUnitChange} />
    </div>
    <div style={{ width: '34%', padding: 5 }}>
      <ProgramSelect selectedValue={program} handleChange={handleChange} />
    </div>
    <div style={{ width: '32%', padding: 5, marginLeft: 'auto', textAlign: 'right' }}><Button size="large" onClick={() => add()}>Add</Button></div>
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
    <div>
      {head}
      {data && <div style={{ padding: 5 }}>
        <Card title="Tracked Entity Instances" extra={<ColumnDrawer program={program} setColumns={setColumns} headers={data.headers} />} bodyStyle={{ padding: 0 }}>
          <Table
            tableLayout="auto"
            loading={isFetching}
            rowKey={(record: any) => record[0]}
            columns={columns}
            dataSource={data.rows}
            pagination={false}
            rowClassName={(record, index: number) => index % 2 === 0 ? 'even' : 'odd'}
            onRow={(record: any[]) => {
              return {
                onClick: () => {
                  history.push({ search: params.toString(), pathname: `/instances/${record[0]}` })
                },
              };
            }}
          />
        </Card>
        <div style={{ padding: 5, textAlign: 'right' }}><Pagination current={page} onChange={onChange} total={data.metaData.pager.total} pageSize={pageSize} showSizeChanger={true} /></div>
      </div>}
    </div>
  )
}

export default TrackedEntityInstances
