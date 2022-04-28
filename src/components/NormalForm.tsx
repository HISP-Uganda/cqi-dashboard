import { Input } from "antd";
import { Form, Space } from "antd";
import { Textarea, Stack, Flex, Button, Text, Box, Center } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { useEvents } from "../Queries";
import { useMutation, useQueryClient } from "react-query";
import { useDataEngine } from "@dhis2/app-runtime";
import moment from "moment";
import { generateUid } from "../utils/uid";
import { useStore } from "effector-react";
import { dashboards } from "../Store";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

interface TableProps {
  tei: string;
  stage: string;
}

const NormalForm: FC<TableProps> = ({ tei, stage }) => {
  const [observedEffects, setObservedEffects] = useState<string>("");
  const [performanceTrends, setPerformanceTrends] = useState<string>("");
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

  const [display, setDisplay] = useState(false);
  const { isLoading, isError, error, data } = useEvents(stage, tei);
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

  useEffect(() => {
    if (data && data.events.length > 0) {
      setEvent({
        ...event,
        eventDate: data.events[0].eventDate,
        event: data.events[0].event,
      });
      data.events[0].dataValues.forEach((d: any) => {
        if (d.dataElement === "gB9GbPqeAzv") {
          setEvent({ ...event, gB9GbPqeAzv: d.value });
        }
        if (d.dataElement === "EF7Cwwpegv1") {
          setEvent({ ...event, EF7Cwwpegv1: d.value });
        }
      });
    }
  }, [data]);

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
  };

  return (
    <Box ml="12px" mr="48px">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <Stack direction="row" spacing={50} mb="30px" width="100%">
        <Box width="100%">
          <Text fontSize="xl">Other Observed Effects</Text>
          <Textarea
            rows={8}
            mb="48px"
            placeholder="Enter Observed Effects Here"
            size="sm"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setObservedEffects(e.target.value)
            }
            value={observedEffects}
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
              setPerformanceTrends(e.target.value)
            }
            value={performanceTrends}
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
          //  onClick={() => setDisplay(false)}
        >
          Cancel
        </Button>
      </Stack>
      <Center><Text fontSize='lg'>Summary Observations</Text></Center>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Other Observed Effects</Th>
              <Th>Performance Trends</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td >kjrnkjrkjrkj</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td >30.48</Td>
            </Tr>
            <Tr>
              <Td>yards</Td>
              <Td >0.91444</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NormalForm;
