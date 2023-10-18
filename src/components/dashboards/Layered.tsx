import {
    Box,
    Button,
    Center,
    Flex,
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
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useStore } from "effector-react";
import { changeIndicator, changeIndicatorGroup, changeOus, changeFilterBy } from "../../Events";
import { useAnalytics } from "../../Queries";
import { dashboards, indicatorForGroup, orgUnits, periods } from "../../Store";
import { colors } from "../../utils/common";
import { utils, writeFile } from "xlsx";
import Indicator from "../Indicator";
import IndicatorGroup from "../IndicatorGroup";
import OrganisationLevel from "../OrganisationLevel";
import OrgUnitTreeSelect from "../OrgUnitTreeSelect";
import PeriodPicker from "../PeriodPicker";
const Layered = () => {
    const store = useStore(dashboards);
    const orgUnits$ = useStore(orgUnits);
    const indicators = useStore(indicatorForGroup);
    const tbl = useRef(null);
    const onIndicatorGroupChange = (value: string) => {
        changeIndicatorGroup(value);
        changeIndicator(indicators[0].event);
    };
    const periods$ = useStore(periods);
    const { data, isError, isLoading, error, isSuccess } = useAnalytics(
        "vMfIVFcRWlu",
        "kHRn35W3Gq4",
        store.indicator,
        "rVZlkzOwWhi",
        "RgNQcLejbwX",
        orgUnits$,
        periods$,
        "all",
        "SUM",
        true,
        true
    );
    return (
        <Stack p="5px" spacing="0">
            <Stack
                direction="row"
                alignItems="center"
                flex={1}
                p="15px"
                bgColor="white"
            >
                <Stack
                    direction="row"
                    zIndex="10000"
                    alignItems="center"
                    flex={1}
                >
                    <Text color="#0b72ef" fontWeight="bold">
                        Program Area
                    </Text>
                    <Box flex={1}>
                        <IndicatorGroup
                            value={store.indicatorGroup}
                            onChange={onIndicatorGroupChange}
                        />
                    </Box>
                </Stack>
                <Stack
                    direction="row"
                    flex={1}
                    alignItems="center"
                    zIndex="10000"
                >
                    <Text color="#0b72ef" fontWeight="bold">
                        Indicator
                    </Text>
                    <Indicator
                        indicatorGroup={store.indicatorGroup}
                        value={store.indicator}
                        onChange={(value) => changeIndicator(value)}
                    />
                </Stack>
            </Stack>
            {isLoading && (
                <Flex
                    className="biggest-height"
                    alignItems="center"
                    justifyItems="center"
                    justifyContent="center"
                    alignContent="center"
                    h="calc(100vh - 126px)"
                >
                    <Center>
                        <Spinner />
                    </Center>
                </Flex>
            )}
            <Stack w="100%" px="5px" spacing="10px" bgColor="white">
                <Stack direction="row" p="15px">
                    <Stack direction="row" alignItems="center" flex={1}>
                        <Text color="#0b72ef" fontWeight="bold">
                            Organisation Unit
                        </Text>
                        <OrgUnitTreeSelect
                            multiple={true}
                            value={store.ous}
                            onChange={changeOus}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems="center"
                        flex={1}
                        zIndex="9000"
                    >
                        <Text color="#0b72ef" fontWeight="bold">
                            Organisation Unit Level
                        </Text>
                        <OrganisationLevel />
                    </Stack>
                    <Stack direction="row" alignItems="center" flex={1}>
                        <Text color="#0b72ef" fontWeight="bold">
                            Period
                        </Text>
                        <PeriodPicker />
                    </Stack>
                    <Spacer />
                    <Stack>
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => {
                                const wb = utils.table_to_book(tbl.current);
                                writeFile(wb, "Table.xlsx");
                            }}
                        >
                            Download Indicators
                        </Button>
                    </Stack>
                </Stack>
                <Box
                    position="relative"
                    overflow="auto"
                    whiteSpace="nowrap"
                    h="calc(100vh - 215px)"
                    w="100%"
                    ref={tbl}
                >
                    {isSuccess && (
                        <Table variant="unstyled">
                            <Thead>
                                <Tr>
                                    <Th
                                        // textColor="white"
                                        zIndex={10}
                                        position="sticky"
                                        w="300px"
                                        maxW="300px"
                                        minWidth="300px"
                                        bgColor="blue.400"
                                        left={0}
                                        top={0}
                                    >
                                        Location
                                    </Th>
                                    {data.pes.map((pe: any) => (
                                        <Th
                                            zIndex={5}
                                            position="sticky"
                                            // textColor="white"
                                            textAlign="center"
                                            bgColor="blue.100"
                                            top={0}
                                            key={pe.id}
                                        >
                                            {pe.name}
                                        </Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.ous.map((ou: any) => (
                                    <Tr key={ou.id}>
                                        <Td
                                            w="300px"
                                            maxW="300px"
                                            minWidth="300px"
                                            position="sticky"
                                            left="0"
                                            bg="blue.50"
                                        >
                                            {ou.name}
                                        </Td>
                                        {data.pes.map((pe: any) => (
                                            <Td
                                                bg={colors(
                                                    data.data[ou.id][pe.id][
                                                        "indicator"
                                                    ]
                                                )}
                                                textAlign="center"
                                                key={`${pe.id}${ou.id}`}
                                            >
                                                {data.data[ou.id][pe.id][
                                                    "indicator"
                                                ] !== "-"
                                                    ? `${
                                                          data.data[ou.id][
                                                              pe.id
                                                          ]["indicator"]
                                                      }%`
                                                    : data.data[ou.id][pe.id][
                                                          "indicator"
                                                      ]}
                                            </Td>
                                        ))}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )}
                </Box>
            </Stack>
            {isError && <div>{error.message}</div>}
        </Stack>
    );
};

export default Layered;
