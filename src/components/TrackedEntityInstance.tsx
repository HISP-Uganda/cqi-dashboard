import { Box } from "@chakra-ui/layout";
import { useMatch } from "@tanstack/react-location";
import { Tabs } from "antd";
import { useStore } from "effector-react";
import { LocationGenerics } from "../interfaces";
import { useProgramStages } from "../Queries";
import { dashboards } from "../Store";
import ProgramStage from "./ProgramStage";

const TrackedEntityInstance = () => {
  const store = useStore(dashboards);
  const {
    params: { tei },
  } = useMatch<LocationGenerics>();
  const { isLoading, isError, error, isSuccess, data } = useProgramStages(
    store.program,
    tei
  );
  return (
    <Box bg="white" p="10px">
      {isLoading && <div>Loading</div>}
      {isSuccess && (
        <Tabs
          type="card"
          items={data.programStages.map((stage: any) => {
            return {
              label: stage.name,
              key: stage.id,
              children: (
                <ProgramStage
                  project={data.project}
                  stageData={data.stageData[stage.id] || []}
                  stage={stage.id}
                  tei={tei}
                />
              ),
            };
          })}
        />
      )}
      {isError && <div>{error.message}</div>}
    </Box>
  );
};

export default TrackedEntityInstance;
