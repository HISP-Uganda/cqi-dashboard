import {
  Button,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  Box,
} from "@chakra-ui/react";
import { Checkbox, DatePicker, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import { ChangeEvent, useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeWorkSheet, Column } from "../interfaces";
import { dashboards } from "../Store";
import { generateUid } from "../utils/uid";

const { Option } = Select;

export default function Editable({
  data,
  columns,
  stage,
  tei,
}: {
  data: ChangeWorkSheet[];
  columns: Column[];
  stage: string;
  tei: string;
}) {
  const engine = useDataEngine();
  const queryClient = useQueryClient();

  const store = useStore(dashboards);
  const [id, setId] = useState<string>("");
  const [events, setEvents] = useState<Partial<ChangeWorkSheet>[]>(() => data);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAdd = () => {
    const event = generateUid();
    const record: Partial<ChangeWorkSheet> = {
      event,
      programStage: stage,
      trackedEntityInstance: tei,
      program: store.program,
      orgUnit: store.project.ou,
      ...fromPairs(columns.map((c) => [c.dataIndex, ""])),
    };
    console.log(record);
    setEvents((prev) => [...prev, record]);
    setId(() => event);
  };

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

  const activate = (record: Partial<ChangeWorkSheet>) => {
    setId(() => record.event || "");
  };

  const save = async (data: Partial<ChangeWorkSheet>) => {
    setIsLoading(() => true);
    try {
      const { eventDate, ...withValues }: any = Object.entries(data).reduce(
        (a: any, [k, v]) => (v == null ? a : ((a[k] = v), a)),
        {}
      );
      let event = Object.entries(withValues).reduce(
        (a: any, [k, v]) =>
          columns.findIndex((c: any) => c.key === k) > -1 ? a : ((a[k] = v), a),
        {}
      );
      const dataElements = Object.entries(withValues).reduce(
        (a: any, [k, v]) =>
          columns.findIndex((c: any) => c.key === k) === -1
            ? a
            : ((a[k] = v), a),
        {}
      );
      const dataValues = Object.entries(dataElements).map(
        ([dataElement, value]) => {
          return {
            dataElement,
            value,
          };
        }
      );
      event = { ...event, dataValues, eventDate };
      await mutateAsync(event);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
    setIsLoading(() => false);
    setId(() => "");
  };

  const handleChange = (
    col: Column,
    record: Partial<ChangeWorkSheet>,
    value: string
  ) => {
    const processedEvents = events.map((event) => {
      if (event.event === record.event) {
        return { ...event, [col.key]: value };
      }
      return event;
    });
    setEvents(() => processedEvents);
  };

  const getInput2 = (col: Column, record: Partial<ChangeWorkSheet>) => {
    const Opts: any = {
      DATE: (
        <DatePicker
          value={record[`${col.key}`] ? dayjs(record[`${col.key}`]) : undefined}
          onChange={(_, dateString) => {
            handleChange(col, record, dateString);
          }}
        />
      ),
      DATETIME: (
        <DatePicker
          value={record[`${col.key}`] ? dayjs(record[`${col.key}`]) : undefined}
          onChange={(_, dateString) => {
            handleChange(col, record, dateString);
          }}
        />
      ),
      LONG_TEXT: (
        <Textarea
          value={record[`${col.key}`]}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleChange(col, record, e.target.value)
          }
        />
      ),
      NUMBER: (
        <InputNumber
          value={record[`${col.key}`]}
          onChange={(value) => handleChange(col, record, value || "")}
        />
      ),
      BOOLEAN: <Checkbox value={record[`${col.key}`]} onChange={() => {}} />,
    };
    if (col.optionSetValue) {
      return (
        <Select
          value={record[`${col.key}`]}
          onChange={(value) => handleChange(col, record, value || "")}
          style={{ width: "100%" }}
        >
          {col.options?.map((o: any) => (
            <Option value={o.code} key={o.code}>
              {o.name}
            </Option>
          ))}
        </Select>
      );
    }

    return (
      Opts[col.inputType] || (
        <Input
          value={record[`${col.key}`]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(col, record, e.target.value)
          }
        />
      )
    );
  };

  return (
    <Stack>
      <Box>
        <Button onClick={handleAdd} style={{ marginBottom: 16 }}>
          Add a row
        </Button>
      </Box>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              {columns.map((col) => (
                <Th key={col.key}>{col.title}</Th>
              ))}
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {events.map((hold) =>
              id === hold.event ? (
                <Tr key={hold.event}>
                  {columns.map((col) => (
                    <Td key={col.key}>{getInput2(col, hold)}</Td>
                  ))}
                  <Td>
                    <Button onClick={() => save(hold)}>Save</Button>
                  </Td>
                </Tr>
              ) : (
                <Tr key={hold.event}>
                  {columns.map((col) => (
                    <Td key={col.key}>{hold[`${col.dataIndex}`]}</Td>
                  ))}
                  <Td>
                    <Button onClick={() => activate(hold)}>Edit</Button>
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
