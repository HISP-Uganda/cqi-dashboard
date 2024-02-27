import {
    Box,
    Button,
    Center,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate } from "@tanstack/react-location";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "effector-react";
import React, { FC, useState } from "react";
import { Observation, Project } from "../interfaces";
import { dashboards } from "../Store";
import { generateUid } from "../utils/uid";
interface TableProps {
    tei: string;
    stage: string;
    stageData: Array<Partial<Observation>>;
    project: Partial<Project>;
}
const NormalForm: FC<TableProps> = ({ stageData, tei, stage, project }) => {
    const navigate = useNavigate();
    const store = useStore(dashboards);
    const [event, setEvent] = useState<Partial<Observation>>(() => {
        return {
            trackedEntityInstance: tei,
            programStage: stage,
            orgUnit: project.ou,
            program: store.program,
            eventDate: new Date().toISOString(),
            gB9GbPqeAzv: "",
            EF7Cwwpegv1: "",
            event: generateUid(),
        };
    });
    const [events, setEvents] = useState<Partial<Observation>[]>(
        () => stageData
    );
    const engine = useDataEngine();
    const addEvent = async (data: any) => {
        const mutation: any = {
            type: "create",
            resource: "events",
            data,
        };
        return await engine.mutate(mutation);
    };
    const { mutateAsync } = useMutation(addEvent);
    const save = async () => {
        const { gB9GbPqeAzv, EF7Cwwpegv1, ...rest } = event;
        await mutateAsync({
            ...rest,
            dataValues: [
                { dataElement: "gB9GbPqeAzv", value: gB9GbPqeAzv },
                { dataElement: "EF7Cwwpegv1", value: EF7Cwwpegv1 },
            ],
        });
        setEvents((prev) => [...prev, event]);
        setEvent(() => {
            return {
                eventDate: new Date().toISOString(),
                gB9GbPqeAzv: "",
                EF7Cwwpegv1: "",
                event: generateUid(),
            };
        });
    };
    return (
        <Box ml="12px" mr="48px">
            <Stack direction="row" spacing={50} mb="30px" width="100%">
                <Box width="100%">
                    <Text fontSize="xl">Other Observed Effects</Text>
                    <Textarea
                        rows={8}
                        mb="48px"
                        placeholder="Enter Observed Effects Here"
                        size="sm"
                        onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                            e.persist();
                            setEvent((ex) => {
                                return { ...ex, gB9GbPqeAzv: e.target.value };
                            });
                        }}
                        value={event.gB9GbPqeAzv}
                    />
                </Box>
                <Box width="100%">
                    <Text fontSize="xl">Performance Trends</Text>
                    <Textarea
                        rows={8}
                        mb="48px"
                        placeholder="Enter Performance Trends Here"
                        size="sm"
                        onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                            e.persist();
                            setEvent((ex) => {
                                return { ...ex, EF7Cwwpegv1: e.target.value };
                            });
                        }}
                        value={event.EF7Cwwpegv1}
                    />
                </Box>
            </Stack>
            <Stack direction="row" spacing={12} mb="60px">
                <Button
                    onClick={() => save()}
                    colorScheme="blue"
                    variant="solid"
                >
                    Save
                </Button>
                <Button
                    colorScheme="red"
                    variant="solid"
                    onClick={() => navigate({ to: "/data-entry" })}
                >
                    Cancel
                </Button>
            </Stack>
            <Center>
                <Text fontSize="lg">Summary Observations</Text>
            </Center>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Other Observed Effects</Th>
                            <Th>Performance Trends</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {events.map((e) => (
                            <Tr key={e.event}>
                                <Td>{e.gB9GbPqeAzv}</Td>
                                <Td>{e.EF7Cwwpegv1}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};
export default NormalForm;
