import { Box } from "@chakra-ui/layout";
import { Tabs } from "antd";
import { useStore } from "effector-react";
import { useProgramStages } from "../Queries";
import { dashboards } from "../Store";
import ProgramStage from "./ProgramStage";

const { TabPane } = Tabs;
const TrackedEntityInstance = () => {
  const store = useStore(dashboards);
  const { isLoading, isError, error, isSuccess, data } = useProgramStages(
    store.program
  );
  return (
    <Box bg="white" p="10px">
      {isLoading && <div>Loading</div>}
      {isSuccess && (
        <Tabs type="card">
          {data.map((stage: any) => (
            <TabPane tab={stage.name} key={stage.id}>
              <ProgramStage stage={stage.id} tei={store.instance} />
            </TabPane>
          ))}
        </Tabs>
      )}
      {isError && <div>{error.message}</div>}
    </Box>
  );
};

export default TrackedEntityInstance;
