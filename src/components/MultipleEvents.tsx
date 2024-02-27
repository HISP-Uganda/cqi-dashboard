import {
    Box,
    Button,
    Spacer,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tr,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";
import { useStore } from "effector-react";
import moment, { Moment } from "moment";
import { ChangeEvent, FC, useState } from "react";
import Plot from "react-plotly.js";
import { Project, RunChart } from "../interfaces";
import { useEvent } from "../Queries";
import { dashboards } from "../Store";
import { reviewPeriodString } from "../utils/common";
import { generateUid } from "../utils/uid";

interface MultipleProps {
    tei: string;
    stage: string;
    title?: string;
    stageData: Array<Partial<RunChart>>;
    project: Partial<Project>;
}

function disabledDate(current: Moment | null): boolean {
    if (!current) return false;

    const currentDate = moment().endOf("day");

    // Disable all dates in the future
    return current.isAfter(currentDate);
}

const MultipleEvents: FC<MultipleProps> = ({
    tei,
    stageData,
    stage,
    title,
    project,
}) => {
    const { isLoading, isError, data, error, isSuccess } = useEvent(
        "vPQxfsUQLEy",
        project.kHRn35W3Gq4
    );
    const [events, setEvents] = useState<Array<Partial<RunChart>>>(
        () => stageData
    );
    const store = useStore(dashboards);
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

    const add = () => {
        const event: Partial<RunChart> = {
            event: generateUid(),
            trackedEntityInstance: tei,
            program: store.program,
            programStage: stage,
            orgUnit: project.ou,
            eventDate: undefined,
            rVZlkzOwWhi: undefined,
            RgNQcLejbwX: undefined,
        };
        setEvents((prev) => [...prev, event]);
    };

    const changeIndicator = (
        event: string,
        value: string | number | undefined | null,
        option: "rVZlkzOwWhi" | "RgNQcLejbwX" | "eventDate"
    ) =>
        setEvents((prev) =>
            prev.map((p) => {
                if (p.event === event) {
                    return { ...p, [option]: value };
                }
                return p;
            })
        );

    const onBlur =
        (event: Partial<RunChart>) =>
        async (e: ChangeEvent<HTMLInputElement>) => {
            e.persist();
            const { rVZlkzOwWhi, RgNQcLejbwX, ...rest } = event;

            const dataValues = [
                {
                    dataElement: "rVZlkzOwWhi",
                    value: rVZlkzOwWhi || "",
                },
                {
                    dataElement: "RgNQcLejbwX",
                    value: RgNQcLejbwX || "",
                },
            ];
            await mutateAsync({ ...rest, dataValues });
        };

    const display = (e: Partial<RunChart>) => {
        if (e.rVZlkzOwWhi === 0) {
            return 0;
        }
        if (e.RgNQcLejbwX && e.rVZlkzOwWhi) {
            return Intl.NumberFormat("en-GB", {
                notation: "standard",
                style: "percent",
            }).format(e.rVZlkzOwWhi / e.RgNQcLejbwX);
        }

        return "-";
    };
    if (isError) return <pre>{JSON.stringify(error)}</pre>;
    if (isLoading) return <Text>Loading</Text>;
    if (isSuccess)
        return (
            <Stack>
                <Box
                    style={{
                        height: "100%",
                        marginBottom: 20,
                        paddingLeft: 60,
                    }}
                    flex={1}
                >
                    <Plot
                        data={[
                            {
                                x: events.map((e, index) => String(index)),
                                y: Object.values(
                                    events.map((e) => {
                                        if (e.RgNQcLejbwX && e.rVZlkzOwWhi) {
                                            return String(
                                                (e.rVZlkzOwWhi * 100) /
                                                    e.RgNQcLejbwX
                                            );
                                        }
                                        return "-";
                                    })
                                ),
                                type: "scatter",
                                mode: "lines+markers",
                                marker: { color: "red" },
                            },
                        ]}
                        layout={{
                            autosize: true,
                            title,
                            legend: {
                                orientation: "h",
                                yanchor: "bottom",
                                y: 1,
                                xanchor: "right",
                                x: 1,
                            },
                            margin: {
                                pad: 5,
                                r: 0,
                                t: 50,
                                l: 40,
                                b: 20,
                            },
                            xaxis: {
                                showgrid: false,
                                zeroline: false,
                                type: "category",
                            },
                            yaxis: {
                                showgrid: true,
                                zeroline: true,
                                gridcolor: "LightGray",
                                zerolinecolor: "black",
                                rangemode: "tozero",
                            },
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                        config={{ displayModeBar: false }}
                    />
                </Box>
                <Stack>
                    <TableContainer>
                        <Table variant="simple">
                            <Tbody>
                                <Tr>
                                    <Td w="60px">Review Period</Td>
                                    {events.map((e) => (
                                        <Td key={e.event} textAlign="center">
                                            <DatePicker
                                                picker={
                                                    reviewPeriodString(
                                                        project.WQcY6nfPouv
                                                    ).toLowerCase() as
                                                        | "time"
                                                        | "date"
                                                        | "week"
                                                        | "month"
                                                        | "quarter"
                                                        | "year"
                                                        | undefined
                                                }
                                                disabledDate={(current) =>
                                                    disabledDate(
                                                        moment(current.date())
                                                    )
                                                }
                                                value={
                                                    e.eventDate
                                                        ? dayjs(e.eventDate)
                                                        : undefined
                                                }
                                                onChange={(value) =>
                                                    changeIndicator(
                                                        e.event || "",
                                                        value
                                                            ? value.toISOString()
                                                            : undefined,
                                                        "eventDate"
                                                    )
                                                }
                                            />
                                        </Td>
                                    ))}
                                </Tr>
                                <Tr>
                                    <Td w="60px">Numerator</Td>
                                    {events.map((e) => (
                                        <Td key={e.event} textAlign="center">
                                            <InputNumber
                                                min={0}
                                                style={{ textAlign: "center" }}
                                                value={e.rVZlkzOwWhi}
                                                onChange={(value) =>
                                                    changeIndicator(
                                                        e.event || "",
                                                        value,
                                                        "rVZlkzOwWhi"
                                                    )
                                                }
                                                onBlur={onBlur(e)}
                                            />
                                        </Td>
                                    ))}
                                </Tr>
                                <Tr>
                                    <Td w="60px">Denominator</Td>
                                    {events.map((e) => (
                                        <Td key={e.event} textAlign="center">
                                            <InputNumber
                                                min={0}
                                                style={{ textAlign: "center" }}
                                                value={e.RgNQcLejbwX}
                                                onChange={(value) =>
                                                    changeIndicator(
                                                        e.event || "",
                                                        value,
                                                        "RgNQcLejbwX"
                                                    )
                                                }
                                                onBlur={onBlur(e)}
                                            />
                                        </Td>
                                    ))}
                                </Tr>
                                <Tr>
                                    <Td w="60px">%</Td>
                                    {events.map((e) => (
                                        <Td key={e.event} textAlign="center">
                                            {display(e)}
                                        </Td>
                                    ))}
                                </Tr>
                                <Tr>
                                    <Td w="60px">
                                        <Text fontSize="lg">
                                            Numerator Name
                                        </Text>
                                        {data["WI6Qp8gcZFX"]}
                                    </Td>
                                    <Td w="60px">
                                        <Text fontSize="lg">
                                            Denominator Name
                                        </Text>
                                        {data["krwzUepGwj7"]}
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                    <Stack direction="row">
                        <Spacer />
                        <Box>
                            <Button onClick={add}>Add Review</Button>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        );
    return null;
};

export default MultipleEvents;
