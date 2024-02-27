import { Box, Spacer, Stack } from "@chakra-ui/layout";
import { Button, Text } from "@chakra-ui/react";
import { useMatch, useSearch } from "@tanstack/react-location";
import { Tabs } from "antd";
import { useStore } from "effector-react";
import { LocationGenerics } from "../interfaces";
import { useProgramStages } from "../Queries";
import { dashboards } from "../Store";
import ProgramStage from "./ProgramStage";

const TrackedEntityInstance = () => {
    const store = useStore(dashboards);
    const search = useSearch<LocationGenerics>();
    const {
        params: { tei },
    } = useMatch<LocationGenerics>();
    const { isLoading, isError, error, isSuccess, data } = useProgramStages(
        store.program,
        tei
    );
    return (
        <Box bg="white" p="10px" flex={1}>
            {isLoading && <div>Loading</div>}
            {isSuccess && (
                <Stack>
                    <Stack w="100%" direction="row">
                        <Stack w="100%" direction="row">
                            <Text
                                fontSize="3xl"
                                backgroundColor="gray.200"
                                color="blue.600"
                            >
                                {search["ou-name"]}
                            </Text>
                        </Stack>
                        <Stack w="100%" direction="row">
                            <Spacer />
                            <Button>Mark Project As Complete</Button>
                        </Stack>
                    </Stack>
                    <Tabs
                        type="card"
                        items={data.programStages.map((stage: any) => {
                            return {
                                label: stage.name,
                                key: stage.id,
                                children: (
                                    <ProgramStage
                                        project={data.project}
                                        stageData={
                                            data.stageData[stage.id] || []
                                        }
                                        stage={stage.id}
                                        tei={tei}
                                    />
                                ),
                            };
                        })}
                    />
                </Stack>
            )}
            {isError && <div>{error.message}</div>}
        </Box>
    );
};

export default TrackedEntityInstance;
