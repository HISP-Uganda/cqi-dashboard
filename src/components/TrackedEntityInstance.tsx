import { useQuery } from "react-query";
import { useParams, useLocation } from "react-router-dom";
import { Card, Tabs } from 'antd'
import { useD2 } from "../Context";
import ProgramStage from "./ProgramStage";
interface ParamTypes {
  tei: string,
}
const { TabPane } = Tabs
const TrackedEntityInstance = () => {
  const { tei } = useParams<ParamTypes>();
  const d2 = useD2();
  const api = d2.Api.getApi();
  const { search } = useLocation();
  const params = new URLSearchParams(search);


  const { isLoading,
    isError,
    error,
    data,
  } = useQuery(
    ["programs", params.get('program')],
    () => fetchProgramStages(),
  );

  const fetchProgramStages = async () => {
    const data = await api.get(`programs/${params.get('program')}.json`, {
      fields: "programStages[id,name]"
    });
    return data;
  }



  if (isError) {
    return <div>{JSON.stringify(error)}</div>
  }

  if (isLoading) {
    return <div>Is Loading</div>
  }

  return (
    <div>
      <Card title="">
        {data && data.programStages && <Tabs tabPosition="left">
          {data.programStages.map((stage: any) => <TabPane tab={stage.name} key={stage.id}>
            <ProgramStage stage={stage.id} tei={tei} />
          </TabPane>)}
        </Tabs>}
      </Card>
    </div>
  )


}

export default TrackedEntityInstance
