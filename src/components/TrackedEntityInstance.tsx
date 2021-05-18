import { Box } from '@chakra-ui/layout';
import { Tabs } from 'antd';
import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";
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
    isSuccess,
    data,
  } = useQuery<any, Error>(
    ["programs", params.get('program')],
    () => fetchProgramStages(),
  );

  const fetchProgramStages = async () => {
    const data = await api.get(`programs/${params.get('program')}.json`, {
      fields: "programStages[id,name]"
    });
    return data;
  }

  return (
    <Box bg="white" p="10px">
      {isLoading && <div>Loading</div>}
      {isSuccess && <div>
        {data && data.programStages && <Tabs type="card">
          {data.programStages.map((stage: any) => <TabPane tab={stage.name} key={stage.id}>
            <ProgramStage stage={stage.id} tei={tei} />
          </TabPane>)}
        </Tabs>}
      </div>}
      {isError && <div>{error.message}</div>}
    </Box>
  )
}

export default TrackedEntityInstance
