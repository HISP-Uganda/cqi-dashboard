import {
    Button,
    Input,
    Table,
    TableContainer,
    Tbody,
    Td,
    Textarea,
    Tfoot,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useMutation } from "@tanstack/react-query";
import { Checkbox, DatePicker, InputNumber, Select } from "antd";
import { Dayjs } from "dayjs";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import { ChangeEvent, useState } from "react";
import { ChangeWorkSheet, Column, Project } from "../interfaces";
import { dashboards } from "../Store";
import { generateUid } from "../utils/uid";

const { Option } = Select;

const dateFormat = Intl.DateTimeFormat("en-GB");

export default function Editable({
    data,
    columns,
    stage,
    tei,
    project,
}: {
    data: ChangeWorkSheet[];
    columns: Column[];
    stage: string;
    tei: string;
    project: Partial<Project>;
}) {
    const engine = useDataEngine();
    const store = useStore(dashboards);
    const [id, setId] = useState<string>("");
    console.log(data);
    const [events, setEvents] = useState<Partial<ChangeWorkSheet>[]>(
        () => data
    );

    const handleAdd = () => {
        const event = generateUid();
        const record: Partial<ChangeWorkSheet> = {
            event,
            programStage: stage,
            trackedEntityInstance: tei,
            program: store.program,
            orgUnit: project.ou,
            ...fromPairs(columns.map((c) => [c.dataIndex, ""])),
        };
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

    const { mutateAsync } = useMutation(addEvent);

    const activate = (record: Partial<ChangeWorkSheet>) => {
        setId(() => record.event || "");
    };

    const save = async (data: Partial<ChangeWorkSheet>) => {
        try {
            const { eventDate, ...withValues }: any = Object.entries(
                data
            ).reduce((a: any, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
            let event = Object.entries(withValues).reduce(
                (a: any, [k, v]) =>
                    columns.findIndex((c: any) => c.key === k) > -1
                        ? a
                        : ((a[k] = v), a),
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
        setId(() => "");
    };

    const handleChange = (
        col: Column,
        record: Partial<ChangeWorkSheet>,
        value: string | Dayjs | null
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
        let value = record[col.key];
        let otherDate = null;

        if (
            col.inputType === "DATE" ||
            (col.inputType === "DATETIME" && value)
        ) {
            const val = value as unknown as Dayjs;
            otherDate = val;
        }
        const Opts: any = {
            DATE: (
                <DatePicker
                    value={otherDate}
                    onChange={(val) => {
                        handleChange(col, record, val as unknown as Dayjs);
                    }}
                />
            ),
            DATETIME: (
                <DatePicker
                    value={otherDate}
                    onChange={(val) => {
                        handleChange(col, record, val as unknown as Dayjs);
                    }}
                />
            ),
            LONG_TEXT: (
                <Textarea
                    value={String(record[`${col.key}`])}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleChange(col, record, e.target.value)
                    }
                />
            ),
            NUMBER: (
                <InputNumber
                    value={String(record[`${col.key}`])}
                    onChange={(value) => handleChange(col, record, value || "")}
                />
            ),
            BOOLEAN: (
                <Checkbox value={record[`${col.key}`]} onChange={() => {}} />
            ),
        };
        if (col.optionSetValue) {
            return (
                <Select
                    value={record[`${col.key}`]}
                    onChange={(value) =>
                        handleChange(col, record, String(value || ""))
                    }
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
                    value={String(record[`${col.key}`])}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(col, record, e.target.value)
                    }
                />
            )
        );
    };

    const getTableCell = (col: Column, hold: Partial<ChangeWorkSheet>) => {
        if (
            ["DATE", "DATETIME"].indexOf(col.inputType) !== -1 &&
            !!hold[`${col.dataIndex}`]
        ) {
            let val = "";
            if (hold[`${col.dataIndex}`]) {
                const current: Dayjs = hold[
                    `${col.dataIndex}`
                ] as unknown as Dayjs;
                val = dateFormat.format(current.toDate());
            }
            return <Td key={col.key}>{val}</Td>;
        }
        return <Td key={col.key}>{String(hold[`${col.dataIndex}`])}</Td>;
    };

    return (
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
                                    <Td key={col.key}>
                                        {getInput2(col, hold)}
                                    </Td>
                                ))}
                                <Td>
                                    <Button onClick={() => save(hold)}>
                                        Save
                                    </Button>
                                </Td>
                            </Tr>
                        ) : (
                            <Tr key={hold.event}>
                                {columns.map((col) => getTableCell(col, hold))}
                                <Td>
                                    <Button onClick={() => activate(hold)}>
                                        Edit
                                    </Button>
                                </Td>
                            </Tr>
                        )
                    )}
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Td colSpan={columns.length + 1} textAlign="right">
                            <Button
                                colorScheme="green"
                                onClick={handleAdd}
                                style={{ marginBottom: 16 }}
                            >
                                Add Changes Worksheet
                            </Button>
                        </Td>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    );
}
