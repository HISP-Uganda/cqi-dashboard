import {
    Box,
    Button,
    Spinner,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import EllipsisTooltip from "ellipsis-tooltip-react-chan";
import { FC, useRef, useState } from "react";
import { utils, writeFile } from "xlsx";
import {
    changeFilterBy,
    changeIndicator,
    changeIndicatorGroup,
    changeOus,
} from "../Events";
import { useAnalyticsStructure } from "../Queries";
import {
    $selectedIndicators,
    dashboards,
    indicatorForGroup,
    orgUnits,
    periods,
} from "../Store";
import IndicatorGroup from "./IndicatorGroup";
import OrganisationLevel from "./OrganisationLevel";
import OrgUnitTreeSelect from "./OrgUnitTreeSelect";
import PeriodPicker from "./PeriodPicker";

import TableIndicator from "./TableIndicator";
interface AllIndicatorsProps {
    indicators: any[];
}

const AllIndicators: FC<AllIndicatorsProps> = () => {
    const store = useStore(dashboards);
    const units = useStore(orgUnits);
    const pes = useStore(periods);
    const tbl = useRef(null);
    const selectedIndicators = useStore($selectedIndicators);
    const onIndicatorGroupChange = (value: string) => {
        changeIndicatorGroup(value);
        // changeIndicator(indicators[0][0]);
    };
    const { data, isError, isLoading, error, isSuccess } =
        useAnalyticsStructure(units, pes);
    return (
        <Stack p="5px" flex={1} spacing="0">
            <Stack flex={1} bg="white" p="5px">
                <Stack direction="row" flex={1}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        flex={1}
                        zIndex={10000}
                    >
                        <Text color="#0b72ef" fontWeight="bold">
                            Program Area
                        </Text>
                        <IndicatorGroup
                            value={store.indicatorGroup}
                            onChange={onIndicatorGroupChange}
                        />
                    </Stack>

                    <Stack direction="row">
                        {store.filterBy === "period" ? (
                            <Button
                                colorScheme="green"
                                onClick={() => changeFilterBy("orgUnit")}
                                size="sm"
                            >
                                Filter By OrgUnits
                            </Button>
                        ) : (
                            <Button
                                colorScheme="teal"
                                onClick={() => changeFilterBy("period")}
                                size="sm"
                            >
                                Filter By Period
                            </Button>
                        )}
                        <Button
                            colorScheme="blue"
                            onClick={() => {
                                const wb = utils.table_to_book(tbl.current);
                                writeFile(wb, "Table.xlsx");
                            }}
                            size="sm"
                        >
                            Download Indicators
                        </Button>
                    </Stack>
                </Stack>

                <Stack direction="row" alignItems="center" flex={1}>
                    <Stack direction="row" flex={1} alignItems="center">
                        <Text color="#0b72ef" fontWeight="bold">
                            Organisation
                        </Text>
                        <Box flex={1}>
                            <OrgUnitTreeSelect
                                multiple={true}
                                value={store.ous}
                                onChange={changeOus}
                            />
                        </Box>
                    </Stack>
                    <Stack
                        direction="row"
                        flex={1}
                        alignItems="center"
                        zIndex={1000}
                    >
                        <Text color="#0b72ef" fontWeight="bold">
                            Level
                        </Text>
                        <OrganisationLevel />
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        <Text color="#0b72ef" fontWeight="bold">
                            Period
                        </Text>
                        <PeriodPicker />
                    </Stack>
                </Stack>
            </Stack>
            <Box w="100%" bg="white">
                <Box
                    position="relative"
                    overflow="auto"
                    h="calc(100vh - 190px)"
                    w="100%"
                    whiteSpace="nowrap"
                >
                    {isLoading && <Spinner />}
                    {isSuccess && (
                        <Table variant="unstyled">
                            <Thead
                                position="sticky"
                                top={0}
                                left={0}
                                zIndex={10}
                            >
                                <Tr>
                                    <Th
                                        textColor="white"
                                        rowSpan={2}
                                        w="30vw"
                                        maxW="30vw"
                                        minWidth="30vw"
                                        position="sticky"
                                        left="0"
                                        bgColor="blue.800"
                                    >
                                        Indicator
                                    </Th>
                                    {store.filterBy === "orgUnit" &&
                                        data.metaData.dimensions.pe.map(
                                            (pe: string) => (
                                                <Th
                                                    textColor="black"
                                                    key={pe}
                                                    textAlign="center"
                                                    bgColor="blue.50"
                                                >
                                                    {
                                                        data.metaData.items[pe]
                                                            .name
                                                    }
                                                </Th>
                                            )
                                        )}
                                    {store.filterBy === "period" &&
                                        data.metaData.dimensions.ou.map(
                                            (ou: string) => (
                                                <Th
                                                    textColor="black"
                                                    bgColor="blue.50"
                                                    key={ou}
                                                    textAlign="center"
                                                >
                                                    {
                                                        data.metaData.items[ou]
                                                            .name
                                                    }
                                                </Th>
                                            )
                                        )}
                                </Tr>
                                <Tr>
                                    {store.filterBy === "orgUnit" &&
                                        data.metaData.dimensions.pe.map(
                                            (pe: string) => (
                                                <Th
                                                    textColor="black"
                                                    bgColor="gray.200"
                                                    key={pe}
                                                    textAlign="center"
                                                >
                                                    %
                                                </Th>
                                            )
                                        )}
                                    {store.filterBy === "period" &&
                                        data.metaData.dimensions.ou.map(
                                            (ou: string) => (
                                                <Th
                                                    textColor="black"
                                                    bgColor="yellow"
                                                    key={ou}
                                                    textAlign="center"
                                                >
                                                    %
                                                </Th>
                                            )
                                        )}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {selectedIndicators.map((row: any) => (
                                    <Tr key={row.event}>
                                        <Td
                                            fontSize="md"
                                            w="30vw"
                                            maxW="30vw"
                                            minWidth="30vw"
                                            position="sticky"
                                            left="0"
                                            bg="blue.50"
                                        >
                                            <EllipsisTooltip>
                                                {row["kToJ1rk0fwY"]}
                                            </EllipsisTooltip>
                                        </Td>
                                        {store.filterBy === "orgUnit" &&
                                            data.metaData.dimensions.pe.map(
                                                (pe: string) => (
                                                    <TableIndicator
                                                        key={`${pe}${row.event}`}
                                                        search={row.event}
                                                        what={pe}
                                                    />
                                                )
                                            )}
                                        {store.filterBy === "period" &&
                                            data.metaData.dimensions.ou.map(
                                                (ou: string) => (
                                                    <TableIndicator
                                                        key={`${ou}${row.event}`}
                                                        search={row.event}
                                                        what={ou}
                                                    />
                                                )
                                            )}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )}
                </Box>
            </Box>
            {isError && <div>{error.message}</div>}
        </Stack>
    );
};

export default AllIndicators;
