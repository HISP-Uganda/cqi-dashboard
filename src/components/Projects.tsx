import { useState } from "react";

import {
    Pagination,
    PaginationContainer,
    PaginationNext,
    PaginationPage,
    PaginationPageGroup,
    PaginationPrevious,
    PaginationSeparator,
    usePagination,
} from "@ajna/pagination";
import {
    Box,
    Button,
    Center,
    Heading,
    Input,
    Select,
    Spacer,
    Spinner,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Tabs, TabList, TabPanels, Tab, TabPanel
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { DatePicker } from "antd";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import moment from "moment";
import * as XLSX from "xlsx";
import IndicatorGroup from "./IndicatorGroup";
import OrgUnitTreeSelect from "./OrgUnitTreeSelect";
import OrganisationLevel from "./OrganisationLevel";
import PeriodPicker from "./PeriodPicker";
import {
    changeOu,
    changeFilterBy,
    changeIndicator,
    changeIndicatorGroup,
    changeOus,
    changeProgram,
    changeProgramEntity,
    changeProject,
    changeTrackedEntityType,
} from "../Events";
import { useInstances } from "../Queries";
import { $withOptionSet, allIndicators, dashboards, indicatorForGroup } from "../Store";
import { withAttributesAsEvent } from "../utils/common";
import ColumnDrawer from "./ColumnDrawer";
import DisplayEvent from "./DisplayEvent";
import OptionDisplay from "./OptionDisplay";
import ProgramSelect from "./ProgramSelect";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { LocationGenerics } from "../interfaces";
import Summaries from "./Summaries";
import Units from "./Units";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;

const { RangePicker } = DatePicker;

const Projects = () => {
    const store = useStore(dashboards);
    const navigate = useNavigate<LocationGenerics>();
    const engine = useDataEngine();
    const search = useSearch<LocationGenerics>();
    const indicators = useStore(indicatorForGroup);
    const [selectedDates, setSelectedDates] = useState<any>([
        moment().startOf("year"),
        moment().endOf("year"),
    ]);
    const [downloading, setDownloading] = useState<boolean>(false);
    const availableIndicators = useStore(allIndicators);
    const onIndicatorGroupChange = (value: string) => {
        changeIndicatorGroup(value);
        changeIndicator(indicators[0][0]);
    };
    const withOptionSet = useStore($withOptionSet);
    const {
        pages,
        pagesCount,
        currentPage,
        setCurrentPage,
        isDisabled,
        pageSize,
        setPageSize,
    } = usePagination({
        total: store.total,
        limits: {
            outer: OUTER_LIMIT,
            inner: INNER_LIMIT,
        },
        initialState: {
            pageSize: 20,
            currentPage: 1,
        },
    });

    const [realSearch, setRealSearch] = useState<Partial<{
        ou: string;
        program: string;
        trackedEntityType: string;
        trackedEntityInstance: string;
        ouSearch: string;
        page: number;
        pageSize: number;
        ouMode: string;
        programStartDate: string;
        programEndDate: string;
        isNew: boolean;
        query: string;
    }>>({ ...search, ouMode: "ALL", program: "vMfIVFcRWlu", ou: "akV6429SUqu", query: "" })

    const { isLoading, isError, isSuccess, error, data } = useInstances(realSearch);

    // const { isLoading, isError, isSuccess, error, data } = useInstances(
    //   store.ou,
    //   store.program,
    //   currentPage,
    //   pageSize,
    //   "DESCENDANTS",
    //   selectedDates[0].format("YYYY-MM-DD"),
    //   selectedDates[1].format("YYYY-MM-DD")
    // );

    const handlePageChange = (nextPage: number) => {
        setCurrentPage(nextPage);
    };

    const handlePageSizeChange = (event: any) => {
        const pageSize = Number(event.target.value);
        setPageSize(pageSize);
        setCurrentPage(1);
    };

    const display = (record: any, a: string) => {
        if (withOptionSet.indexOf(a) !== -1) {
            return <OptionDisplay code={record[a]} />;
        }
        const withEvent = withAttributesAsEvent(a);
        if (withEvent) {
            return (
                <DisplayEvent
                    programStage={withEvent.programStage}
                    dataElement={withEvent.dataElement}
                    event={record[a]}
                />
            );
        }
        return record[a];
    };

    const handleChange = (value: string) => {
        changeProgramEntity(value);
        if (value) {
            const [trackedEntityType, program] = value.split(",");
            changeTrackedEntityType(trackedEntityType);
            changeProgram(program);
            navigate({
                search: (old) => ({ ...old, program, trackedEntityType }),
                replace: true,
            });
        } else {
            changeTrackedEntityType("");
            changeProgram("");
        }
    };

    const changeOu = (ou: string | string[] | undefined) => {
        if (Array.isArray(ou)) {
            navigate({
                search: (old) => ({ ...old, ou: ou.join(",") }),
                replace: true,
            });
        } else {
            navigate({
                search: (old) => ({ ...old, ou }),
                replace: true,
            });
        }
    };

    const download = async () => {
        setDownloading(true);
        const processedIndicators = fromPairs(availableIndicators);
        let params: { [key: string]: any } = {
            // skipPaging: "true",
            ouMode: "ALL", program: "vMfIVFcRWlu",
            //ou: store.ou,
            // programStartDate: selectedDates[0].format("YYYY-MM-DD"),
            // programEndDate: selectedDates[1].format("YYYY-MM-DD"),
        };

        const {
            instances: { headers, rows },
            optionSet: { options },
        }: any = await engine.query({
            instances: {
                resource: "trackedEntityInstances/query.json",
                params,
            },
            optionSet: {
                resource: `optionSets/uKIuogUIFgl`,
                params: {
                    fields: "options[id,code,name]",
                },
            },
        });
        //console.log(rows)
        const indicatorGroups = fromPairs(
            options.map((o: any) => [o.code, o.name])
        );
        const onIndicatorGroupChange = (value: string) => {
            changeIndicatorGroup(value);
            changeIndicator(indicators[0][0]);
        };
        const index = headers.findIndex((h: any) => h.name === "kHRn35W3Gq4");
        const pIndex = headers.findIndex((h: any) => h.name === "TG1QzFgGTex");

        const all = [
            headers.map((h: any) => h.column),
            ...rows.map((h: string[]) => {
                return h.map((v, i) => {
                    if (i === index) {
                        return processedIndicators[v];
                    }
                    if (i === pIndex) {
                        return indicatorGroups[v];
                    }
                    return v;
                });
            }),
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(all);
        XLSX.utils.book_append_sheet(wb, ws, "export");
        XLSX.writeFile(wb, "export.xlsx");
        setDownloading(false);
    };
    return (
        <Stack>
            <Tabs bg="white" isFitted >
                <TabList >
                    {/* <Tab fontSize="2.0vh" fontWeight="semibold" color="gray.700"
                        _selected={{ color: 'white', bg: 'blue.500' }}
                    >
                        Summaries
                    </Tab> */}
                    {/* <Tab fontSize="2.0vh" fontWeight="semibold" color="gray.700"
                        _selected={{ color: 'white', bg: 'blue.500' }}
                    >
                        Projects
                    </Tab> */}
                    {/* <Tab fontSize="2.0vh" fontWeight="semibold" color="gray.700"
                        _selected={{ color: 'white', bg: 'blue.500' }}
                    >
                        Units
                    </Tab> */}
                </TabList>

                <TabPanels>
                    {/* <TabPanel>
                        <Summaries />
                    </TabPanel> */}
                    <TabPanel>
                        <Stack bg="white" p="5px">
                            <Stack
                                spacing="30px"
                                flex={1}
                            >
                                <Stack direction="row" flex={1}>
                                    <Text fontSize="xl"
                                        color="#0b72ef"
                                        p="2px"
                                        fontWeight="bold">Program Area
                                    </Text>
                                    <Box w="50%">
                                        <IndicatorGroup
                                            value={store.indicatorGroup}
                                            onChange={onIndicatorGroupChange}
                                        />
                                    </Box>
                                    <Spacer />
                                    <Input placeholder='Search Project' w="50%" value={realSearch.query} onChange={(e) => setRealSearch((prev) => {
                                        e.preventDefault()
                                        console.log(e.target?.value)
                                        return { ...prev, query: e.target?.value }
                                    })} />
                                    <Spacer />
                                    <Stack direction="row">
                                        <Button colorScheme="green"
                                            onClick={() => download()} isLoading={downloading}
                                        >
                                            Download Projects
                                        </Button>
                                        <ColumnDrawer />
                                    </Stack>
                                </Stack>

                                <Stack direction="row" alignItems="center" flex={1}>
                                    <Stack direction="row" alignItems="center" flex={1}>
                                        <Text fontSize="xl"
                                            color="#0b72ef"
                                            p="2px"
                                            fontWeight="bold">Organisation
                                        </Text>
                                        <Box flex={1}>
                                            <OrgUnitTreeSelect
                                                multiple={false}
                                                value={store.ous || undefined}
                                                onChange={changeOus}
                                            />

                                            {/* <OrgUnitTreeSelect
                                multiple={false}
                                value={search.ou || undefined}
                                onChange={changeOu}
                            /> */}
                                        </Box>
                                    </Stack>
                                    <Stack direction="row" w="33vw">

                                        <Text fontSize="xl"
                                            color="#0b72ef"
                                            p="2px"
                                            fontWeight="bold"
                                        >
                                            Tool
                                        </Text>
                                        <ProgramSelect
                                            program={search.program || ""}
                                            trackedEntityType={search.trackedEntityType || ""}
                                            handleChange={handleChange}
                                        />
                                    </Stack>
                                    <Stack direction="row">
                                        <Text fontSize="xl"
                                            color="#0b72ef"
                                            p="2px"
                                            fontWeight="bold"
                                        >
                                            Period
                                        </Text>
                                        <PeriodPicker />
                                    </Stack>
                                </Stack>
                            </Stack>
                            {isLoading && (
                                <Stack
                                    alignItems="center"
                                    justifyItems="center"
                                    justifyContent="center"
                                    alignContent="center"
                                    h="calc(100vh - 106px)"
                                >
                                    <Spinner />
                                </Stack>
                            )}
                            <Box overflow="auto" border="3px solid gray" h="800px">
                                {isSuccess && (
                                    <Table
                                        variant="striped"
                                        colorScheme="gray"
                                        textTransform="none"
                                    >
                                        <Thead>
                                            <Tr py={1}>
                                                {store.columns
                                                    .filter((s: any) => s.displayInList)
                                                    .map((column: any) => (
                                                        <Th
                                                            key={
                                                                column.trackedEntityAttribute.id
                                                            }
                                                            minW="200px"
                                                        >
                                                            <Heading
                                                                as="h6"
                                                                size="xs"
                                                                textTransform="none"
                                                            >
                                                                {
                                                                    column
                                                                        .trackedEntityAttribute
                                                                        .name
                                                                }
                                                            </Heading>
                                                        </Th>
                                                    ))}
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {data.map((record: any) => (
                                                <Tr key={record.instance}>
                                                    {store.columns
                                                        .filter((s: any) => s.displayInList)
                                                        .map((column: any) => (
                                                            <Td
                                                                key={`${record.instance}${column.trackedEntityAttribute.id}`}
                                                            >
                                                                {display(
                                                                    record,
                                                                    column
                                                                        .trackedEntityAttribute
                                                                        .id
                                                                )}
                                                            </Td>
                                                        ))}
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                )}
                            </Box>
                            {isError && <div>{error.message}</div>}

                            <Pagination
                                pagesCount={pagesCount}
                                currentPage={currentPage}
                                isDisabled={isDisabled}
                                onPageChange={handlePageChange}
                            >
                                <PaginationContainer
                                    align="center"
                                    justify="space-between"
                                    p={4}
                                    w="full"
                                >
                                    <PaginationPrevious
                                        _hover={{
                                            bg: "yellow.400",
                                        }}
                                        bg="yellow.300"
                                    >
                                        <Text>Previous</Text>
                                    </PaginationPrevious>
                                    <PaginationPageGroup
                                        isInline
                                        align="center"
                                        separator={
                                            <PaginationSeparator
                                                onClick={() =>
                                                    console.warn("I'm clicking the separator")
                                                }
                                                bg="blue.300"
                                                fontSize="sm"
                                                w={14}
                                                jumpSize={11}
                                            />
                                        }
                                    >
                                        {pages.map((page: number) => (
                                            <PaginationPage
                                                w={14}
                                                bg="red.300"
                                                key={`pagination_page_${page}`}
                                                page={page}
                                                fontSize="sm"
                                                _hover={{
                                                    bg: "green.300",
                                                }}
                                                _current={{
                                                    bg: "green.300",
                                                    fontSize: "sm",
                                                    w: 14,
                                                }}
                                            />
                                        ))}
                                    </PaginationPageGroup>
                                    <PaginationNext
                                        _hover={{
                                            bg: "yellow.400",
                                        }}
                                        bg="yellow.300"
                                    >
                                        <Text>Next</Text>
                                    </PaginationNext>
                                </PaginationContainer>
                            </Pagination>
                            <Center w="full">
                                <Text>Records per page</Text>
                                <Select
                                    ml={3}
                                    onChange={handlePageSizeChange}
                                    w={40}
                                    value={pageSize}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="150">150</option>
                                    <option value="200">200</option>
                                </Select>
                            </Center>
                        </Stack>
                    </TabPanel>
                    {/* <TabPanel>
                        <Units />
                    </TabPanel> */}
                </TabPanels>
            </Tabs>
        </Stack>

    );
};

export default Projects;
