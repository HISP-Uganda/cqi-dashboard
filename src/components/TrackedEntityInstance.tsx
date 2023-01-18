import { Box } from "@chakra-ui/layout";
import { Tabs } from "antd";
import { useStore } from "effector-react";
import { useProgramStages } from "../Queries";
import { dashboards } from "../Store";
import ProgramStage from "./ProgramStage";

const TrackedEntityInstance = () => {
  const store = useStore(dashboards);
  const { isLoading, isError, error, isSuccess, data } = useProgramStages(
    store.program
  );
  return (
    <Box bg="white" p="10px">
      {isLoading && <div>Loading</div>}
      {isSuccess && (
        <Tabs
          type="card"
          items={data.map((stage: any) => {
            return {
              label: stage.name,
              key: stage.id,
              children: <ProgramStage stage={stage.id} tei={store.instance} />,
            };
          })}
        />
      )}
      {isError && <div>{error.message}</div>}
    </Box>
  );
};

export default TrackedEntityInstance;
