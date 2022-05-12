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
  Spinner,
} from "@chakra-ui/react";
import { fromPairs } from "lodash";
import { useDataEngine } from "@dhis2/app-runtime";
import { useStore } from "effector-react";
import { useNavigate } from "@tanstack/react-location";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useEvents } from "../Queries";
import { dashboards } from "../Store";
import { generateUid } from "../utils/uid";
interface TableProps {
  tei: string;
  stage: string;
}
const NormalForm: FC<TableProps> = ({ tei, stage }) => {
  const navigate = useNavigate();
  const store = useStore(dashboards);
  const [event, setEvent] = useState<{
    eventDate: string;
    gB9GbPqeAzv: string;
    EF7Cwwpegv1: string;
    event: string;
  }>({
    eventDate: moment().format("YYYY-MM-DD"),
    gB9GbPqeAzv: "",
    EF7Cwwpegv1: "",
    event: generateUid(),
  });
  const engine = useDataEngine();
  const queryClient = useQueryClient();
  const addEvent = async (data: any) => {
    const mutation: any = {
      type: "create",
      resource: "events",
      data,
    };
    return await engine.mutate(mutation);
  };
  const { mutateAsync } = useMutation(addEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["events", stage, tei]);
    },
  });
  const save = async () => {
    const e = {
      event: event.event,
      eventDate: event.eventDate,
      programStage: stage,
      trackedEntityInstance: tei,
      program: store.program,
      orgUnit: store.ou,
      dataValues: [
        { dataElement: "gB9GbPqeAzv", value: event.gB9GbPqeAzv },
        { dataElement: "EF7Cwwpegv1", value: event.EF7Cwwpegv1 },
      ],
    };
    await mutateAsync(e);
    setEvent({
      eventDate: moment().format("YYYY-MM-DD"),
      gB9GbPqeAzv: "",
      EF7Cwwpegv1: "",
      event: generateUid(),
    });
  };
  const { isLoading, isError, isSuccess, error, data } = useEvents(stage, tei);
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEvent({ ...event, gB9GbPqeAzv: e.target.value })
            }
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEvent({ ...event, EF7Cwwpegv1: e.target.value })
            }
            value={event.EF7Cwwpegv1}
          />
        </Box>
      </Stack>
      <Stack direction="row" spacing={12} mb="60px">
        <Button onClick={() => save()} colorScheme="blue" variant="solid">
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
      {isLoading && <Spinner />}
      {isSuccess && (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Other Observed Effects</Th>
                <Th>Performance Trends</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.events
                .map(({ dataValues, ...others }: any) => {
                  return {
                    ...others,
                    ...fromPairs(
                      dataValues.map((dv: any) => [dv.dataElement, dv.value])
                    ),
                  };
                })
                .map((e) => (
                  <Tr>
                    <Td>{e["gB9GbPqeAzv"]}</Td>
                    <Td>{e["EF7Cwwpegv1"]}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      {isError && <div>{error.message}</div>}
    </Box>
  );
};
export default NormalForm;
