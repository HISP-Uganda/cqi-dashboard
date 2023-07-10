import {
    Box,
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
import { useStore } from "effector-react";
import { changeIndicator, changeIndicatorGroup, changeOus } from "../../Events";
import { useAnalytics } from "../../Queries";
import { dashboards, indicatorForGroup, orgUnits, periods } from "../../Store";
import { colors } from "../../utils/common";
import Indicator from "../Indicator";
import IndicatorGroup from "../IndicatorGroup";
import OrganisationLevel from "../OrganisationLevel";
import OrgUnitTreeSelect from "../OrgUnitTreeSelect";
import PeriodPicker from "../PeriodPicker";
const Layered = () => {
    const store = useStore(dashboards);
    const orgUnits$ = useStore(orgUnits);
    const indicators = useStore(indicatorForGroup);

    const onIndicatorGroupChange = (value: string) => {
        changeIndicatorGroup(value);
        changeIndicator(indicators[0][0]);
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
        <Stack bgColor="white" p="5px">
            <Stack
                spacing="30px"
                flex={1}
            >
                <Stack direction="row" flex={1} spacing="40px">
                    <Stack direction="row" zIndex="10000" flex={1} >
                        <Text fontSize="xl"
                            color="#0b72ef"
                            p="2px"
                            fontWeight="bold">Program Area</Text>
                        <Box flex={1}>
                            <IndicatorGroup
                                value={store.indicatorGroup}
                                onChange={onIndicatorGroupChange}
                            />
                        </Box>
                    </Stack>
                    {/* <Spacer /> */}
                    <Stack direction="row" flex={1}>
                        <Text fontSize="xl"
                            color="#0b72ef"
                            p="2px"
                            fontWeight="bold">Indicator</Text>
                        <Box flex={1}>
                            <Indicator />
                        </Box>
                    </Stack>
                </Stack>

                <Stack direction="row" alignItems="center" flex={1}>
                    <Stack direction="row" alignItems="center" w="34vw">
                        <Text fontSize="xl"
                            color="#0b72ef"
                            p="2px"
                            fontWeight="bold">Organisation
                        </Text>
                        <Box flex={1}>
                            <OrgUnitTreeSelect
                                multiple={true}
                                value={store.ous}
                                onChange={changeOus}
                            />
                        </Box>
                    </Stack>
                    <Stack direction="row" w="33vw">
                        <Text fontSize="xl"
                            color="#0b72ef"
                            p="2px"
                            fontWeight="bold"
                        >
                            Organisation Level
                        </Text>
                        <OrganisationLevel />
                    </Stack>
                    <Stack direction="row" w="34vw">
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
            <Box w="100%">
                <Box
                    position="relative"
                    overflow="auto"
                    whiteSpace="nowrap"
                    h="calc(100vh - 184px)"
                    w="100%"
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
                                                    ? `${data.data[ou.id][
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
            </Box>
            {isError && <div>{error.message}</div>}
        </Stack>
    );
};

export default Layered;
