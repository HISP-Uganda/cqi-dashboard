import {
    Box,
    Button,
    Input,
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
import { FC, ChangeEvent, useEffect, useState } from "react";
import {
    changeFilterBy,
    changeIndicator,
    changeIndicatorGroup,
    changeOus,
} from "../Events";
import { useAnalyticsStructure } from "../Queries";
import { dashboards, indicatorForGroup, orgUnits, periods } from "../Store";
import IndicatorGroup from "./IndicatorGroup";
import OrganisationLevel from "./OrganisationLevel";
import OrgUnitTreeSelect from "./OrgUnitTreeSelect";
import PeriodPicker from "./PeriodPicker";

import TableIndicator from "./TableIndicator";
interface AllIndicatorsProps {
    rows: any[];
    dataElementIndex: number;
}

const AllIndicators: FC<AllIndicatorsProps> = ({ rows, dataElementIndex }) => {
    console.log(rows[0]);
    const store = useStore(dashboards);
    const [indicator, setIndicator] = useState<string>("");
    const units = useStore(orgUnits);
    const pes = useStore(periods);
    const orgUnits$ = useStore(orgUnits);
    const indicators = useStore(indicatorForGroup);

    const onIndicatorGroupChange = (value: string) => {
        changeIndicatorGroup(value);
        changeIndicator(indicators[0][0]);
    };
    const { data, isError, isLoading, error, isSuccess } =
        useAnalyticsStructure(units, pes);
    return (
        <Stack bg="white" p="5px">
            <Stack
                w="100%"
                // textColor="white"
                direction="row"
                spacing="30px"
                h="48px"
                maxH="48px"
                minH="48px"
                alignItems="center"
            >
                <Stack direction="row" zIndex="10000" alignItems="center">
                    <Text>Program Area</Text>
                    <Box w="300px">
                        <IndicatorGroup
                            value={store.indicatorGroup}
                            onChange={onIndicatorGroupChange}
                        />
                    </Box>
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Text>Organisation</Text>
                    <OrgUnitTreeSelect
                        multiple={true}
                        value={store.ous}
                        onChange={changeOus}
                    />
                </Stack>
                <OrganisationLevel />

                <PeriodPicker />

                {store.filterBy === "period" ? (
                    <Button onClick={() => changeFilterBy("orgUnit")}>
                        Filter By OrgUnits
                    </Button>
                ) : (
                    <Button onClick={() => changeFilterBy("period")}>
                        Filter By Period
                    </Button>
                )}
                <Input
                    value={indicator}
                    placeholder='Search Indicator'
                    w="20%"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setIndicator(e.target.value)}
                />
            </Stack>
            <Box w="100%">
                <Box
                    position="relative"
                    overflow="auto"
                    // whiteSpace="nowrap"
                    h="calc(100vh - 184px)"
                    w="100%"
                // zIndex={2000}
                >
                    {isLoading && <Spinner />}
                    {isSuccess && (
                        <Table variant="unstyled">
                            <Thead
                                // bg="blue.800"
                                position="sticky"
                                top={0}
                                left={0}
                                zIndex={10}
                            // boxShadow="0 2px 2px -1px rgba(0, 0, 0, 0.4)"
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
                                                    colSpan={3}
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
                                                    colSpan={3}
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
                                                <>
                                                    <Th
                                                        textColor="black"
                                                        bgColor="yellow"
                                                        key={pe}
                                                        textAlign="center"
                                                    >
                                                        N
                                                    </Th>
                                                    <Th
                                                        textColor="black"
                                                        bgColor="yellow"
                                                        key={pe}
                                                        textAlign="center"
                                                    >
                                                        D
                                                    </Th>
                                                    <Th
                                                        textColor="black"
                                                        bgColor="yellow"
                                                        key={pe}
                                                        textAlign="center"
                                                    >
                                                        %
                                                    </Th>
                                                </>
                                            )
                                        )}
                                    {store.filterBy === "period" &&
                                        data.metaData.dimensions.ou.map(
                                            (ou: string) => (
                                                <>
                                                    <Th
                                                        textColor="black"
                                                        bgColor="yellow"
                                                        key={ou}
                                                        textAlign="center"
                                                    >
                                                        N
                                                    </Th>
                                                    <Th
                                                        textColor="black"
                                                        bgColor="yellow"
                                                        key={ou}
                                                        textAlign="center"
                                                    >
                                                        D
                                                    </Th>
                                                    <Th
                                                        textColor="black"
                                                        bgColor="yellow"
                                                        key={ou}
                                                        textAlign="center"
                                                    >
                                                        %
                                                    </Th>
                                                </>
                                            )
                                        )}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {rows.slice(0, 10).map((row: any) => (
                                    <Tr key={row[0]}>
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
                                                {row[dataElementIndex]}
                                            </EllipsisTooltip>
                                        </Td>
                                        {store.filterBy === "orgUnit" &&
                                            data.metaData.dimensions.pe.map(
                                                (pe: string) => (
                                                    <TableIndicator
                                                        key={`${pe}${row[0]}`}
                                                        search={row[0]}
                                                        what={pe}
                                                    />
                                                )
                                            )}
                                        {store.filterBy === "period" &&
                                            data.metaData.dimensions.ou.map(
                                                (ou: string) => (
                                                    <TableIndicator
                                                        key={`${ou}${row[0]}`}
                                                        search={row[0]}
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
