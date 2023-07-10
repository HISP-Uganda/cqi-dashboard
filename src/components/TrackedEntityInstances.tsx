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
    Checkbox,
} from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";

import {
    changeIndicatorGroup,
    changeInstance,
    changeProgram,
    changeProgramEntity,
    changeProject,
    changeTrackedEntityType,
} from "../Events";
import { LocationGenerics } from "../interfaces";
import { useInstances } from "../Queries";
import { $withOptionSet, dashboards } from "../Store";
import { withAttributesAsEvent } from "../utils/common";
import { generateUid } from "../utils/uid";
import ColumnDrawer from "./ColumnDrawer";
import DisplayEvent from "./DisplayEvent";
import OptionDisplay from "./OptionDisplay";
import OrgUnitTreeSelect from "./OrgUnitTreeSelect";
import ProgramSelect from "./ProgramSelect";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;

const TrackedEntityInstances = () => {
    const navigate = useNavigate<LocationGenerics>();
    const store = useStore(dashboards);
    const withOptionSet = useStore($withOptionSet);

    const search = useSearch<LocationGenerics>();

    const { isLoading, isError, isSuccess, error, data } = useInstances(search);

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
            pageSize: search.pageSize,
            currentPage: search.page || 1,
        },
    });

    const handlePageChange = (nextPage: number) => {
        setCurrentPage(nextPage);
        navigate({
            search: (old) => ({ ...old, page: nextPage }),
            replace: true,
        });
    };

    const handlePageSizeChange = (event: any) => {
        const pageSize = Number(event.target.value);

        navigate({
            search: (old) => ({ ...old, pageSize, page: 1 }),
            replace: true,
        });
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

    const add = () => {
        const trackedEntityInstance = generateUid();
        changeProject({
            TG1QzFgGTex: store.indicatorGroup,
            ou: search.ou,
            instance: trackedEntityInstance,
        });
        navigate({
            to: "/data-entry/tracked-entity-form",
            search: {
                ou: search.ou,
                trackedEntityType: search.trackedEntityType,
                program: search.program,
                isNew: true,
                trackedEntityInstance,
            },
        });
    };

    const edit = (instance: any) => {
        changeProject(instance);
        changeIndicatorGroup(instance.TG1QzFgGTex);
        navigate({
            to: "/data-entry/tracked-entity-form",
            search: {
                isNew: false,
                program: search.program,
                ou: instance.ou,
                trackedEntityInstance: instance.instance,
            },
        });
    };
    const onRowClick = (instance: any) => {
        changeProject(instance);
        changeInstance(instance.instance);
        navigate({ to: `/data-entry/${instance.instance}` });
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

    return (
        <Stack bg="white" p="5px" h="calc(100vh - 126px)">
            <Stack h="48px" direction="row">
                <Stack w="34%" direction="row" alignItems="center">
                    <Text>Organisation</Text>
                    <Box flex={1}>
                        <OrgUnitTreeSelect
                            multiple={false}
                            value={search.ou || undefined}
                            onChange={changeOu}
                        />
                    </Box>
                </Stack>
                <Stack w="50%" direction="row" alignItems="center">
                    <Text>Program</Text>
                    <Box flex={1}>
                        <ProgramSelect
                            program={search.program || ""}
                            trackedEntityType={search.trackedEntityType || ""}
                            handleChange={handleChange}
                            onClear={() => {
                                changeTrackedEntityType("");
                                changeProgram("");
                                navigate({
                                    search: (old) => ({
                                        ...old,
                                        trackedEntityType: undefined,
                                        program: undefined,
                                    }),
                                    replace: true,
                                });
                            }}
                        />
                    </Box>
                </Stack>
                <Spacer />
                <Stack direction="row" w="50%" spacing="10px">
                    <Checkbox>Only Completed Projects</Checkbox>
                    <Input
                        placeholder="Search Project"
                        flex={1}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.value) {
                                navigate({
                                    search: (old) => ({
                                        ...old,
                                        query: e.target.value,
                                    }),
                                    replace: true,
                                });
                            } else {
                                navigate({
                                    search: (old) => {
                                        if (old !== undefined) {
                                            const { query, ...rest } = old;
                                            return rest;
                                        }
                                        return {};
                                    },
                                    replace: true,
                                });
                            }
                        }}
                    />
                </Stack>
                <Stack direction="row">
                    <Button onClick={() => add()}>Add</Button>
                    <ColumnDrawer />
                </Stack>
            </Stack>
            {isLoading && (
                <Stack
                    alignItems="center"
                    justifyItems="center"
                    justifyContent="center"
                    alignContent="center"
                >
                    <Spinner />
                </Stack>
            )}

            {isSuccess && (
                <Box overflow="auto" border="3px solid gray">
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
                                <Th>Operations</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((record: any) => (
                                <Tr key={record.instance}>
                                    {store.columns
                                        .filter((s: any) => s.displayInList)
                                        .map((column: any) => (
                                            <Td
                                                fontSize="16px"
                                                cursor="pointer"
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
                                    <Td>
                                        <Stack direction="row">
                                            <Button
                                                onClick={() =>
                                                    onRowClick(record)
                                                }
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                onClick={() => edit(record)}
                                            >
                                                Edit
                                            </Button>
                                        </Stack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            )}
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
    );
};

export default TrackedEntityInstances;
