import {
    Box,
    Button,
    IconButton,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { generateFixedPeriods } from "@dhis2/multi-calendar-dates";
import { DatePicker } from "antd";
import { GroupBase, Select } from "chakra-react-select";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useStore } from "effector-react";
import EllipsisTooltip from "ellipsis-tooltip-react-chan";
import { useEffect, useState } from "react";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { changeAttribute, changePeriod } from "../Events";
import {
    FixedPeriod,
    FixedPeriodType,
    Option,
    Period,
    RelativePeriodType,
} from "../interfaces";
import { dashboards } from "../Store";
import { createOptions2, fixedPeriods, relativePeriods } from "../utils";
const { RangePicker } = DatePicker;

const rangePresets: {
    label: string;
    value: [Dayjs, Dayjs];
}[] = [
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];

const relativePeriodTypeOptions = createOptions2(
    [
        "Days",
        "Weeks",
        "Bi-Weeks",
        "Months",
        "Bi-Months",
        "Quarters",
        "Six-Months",
        "Financial-Years",
        "Years",
    ],
    Object.keys(relativePeriods)
);

const fixedPeriodTypeOptions = createOptions2(
    [
        "Daily",
        "Weekly",
        "Weekly (Start Wednesday)",
        "Weekly (Start Thursday)",
        "Weekly (Start Saturday)",
        "Weekly (Start Sunday)",
        "Bi-Weekly",
        "Monthly",
        "Bi-Monthly",
        "Quarterly",
        "Quarterly-November",
        "Six-Monthly",
        "Six-Monthly-April",
        "Six-Monthly-November",
        "Yearly",
        "Financial-Year (Start November)",
        "Financial-Year (Start October)",
        "Financial-Year (Start July)",
        "Financial-Year (Start April)",
    ],
    fixedPeriods
);

const PeriodPicker = ({
    fixed = false,
    relative = false,
    range = true,
}: Partial<{
    fixed: boolean;
    relative: boolean;
    range: boolean;
}>) => {
    const store = useStore(dashboards);
    const { isOpen, onToggle } = useDisclosure();

    const [relativePeriodType, setRelativePeriodType] =
        useState<RelativePeriodType>("YEARLY");
    const [fixedPeriodType, setFixedPeriodType] =
        useState<FixedPeriodType>("MONTHLY");

    const [selectedPeriods, setSelectedPeriods] = useState<Array<Period>>(
        store.period
    );
    const availableRelativePeriods = relativePeriods[relativePeriodType].filter(
        ({ value }) => {
            return !selectedPeriods.find(({ value: val }) => val === value);
        }
    );
    const [availableFixedPeriods, setAvailableFixedPeriods] = useState<
        Array<FixedPeriod>
    >([]);
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [year, setYear] = useState<number>(dayjs().year());

    useEffect(() => {
        setAvailableFixedPeriods(
            generateFixedPeriods({
                year,
                calendar: "iso8601",
                periodType: fixedPeriodType,
                locale: "en",
            }).filter(
                ({ id }) => !selectedPeriods.find(({ value }) => value === id)
            )
        );
    }, [fixedPeriodType, year, selectedPeriods]);

    return (
        <Stack position="relative" flex={1}>
            <Button
                onClick={onToggle}
                // maxW="500px"
                w="300px"
                // flex={1}
                size="sm"
                variant="outline"
                _hover={{ backgroundColor: "none" }}
            >
                <EllipsisTooltip>
                    {store.period.map((i) => i.label).join(", ")}
                </EllipsisTooltip>
            </Button>

            {isOpen && (
                <Stack
                    position="absolute"
                    top="36px"
                    zIndex={100}
                    backgroundColor="white"
                    boxShadow="xl"
                    minW="800px"
                    minH="660px"
                    maxH="660px"
                    right={0}
                >
                    <Stack direction="row" p="5px">
                        <Stack
                            w="55%"
                            borderColor="gray.200"
                            borderStyle="solid"
                            borderWidth="1px"
                        >
                            <Tabs onChange={(index) => setTabIndex(index)}>
                                <TabList>
                                    <Tab>Relative Periods</Tab>
                                    <Tab>Fixed Periods</Tab>
                                    {/* {range && (
                                        <Tab fontSize="xs">Date Range</Tab>
                                    )} */}
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <Stack spacing="20px">
                                            <Stack>
                                                <Text>Period Type</Text>
                                                <Select<
                                                    Option,
                                                    false,
                                                    GroupBase<Option>
                                                >
                                                    isClearable
                                                    onChange={(e) => {
                                                        setRelativePeriodType(
                                                            () =>
                                                                (e?.value as RelativePeriodType) ||
                                                                "MONTHLY"
                                                        );
                                                        changeAttribute({
                                                            attribute:
                                                                "relativePeriodType",
                                                            value: e?.value,
                                                        });
                                                    }}
                                                    value={relativePeriodTypeOptions.find(
                                                        ({ value }) =>
                                                            value ===
                                                            relativePeriodType
                                                    )}
                                                    options={
                                                        relativePeriodTypeOptions
                                                    }
                                                    size="sm"
                                                />
                                            </Stack>
                                            <Stack>
                                                {availableRelativePeriods.map(
                                                    ({ label, value }) => (
                                                        <Text
                                                            key={value}
                                                            cursor="pointer"
                                                            onClick={() =>
                                                                setSelectedPeriods(
                                                                    (prev) => [
                                                                        ...selectedPeriods,
                                                                        {
                                                                            label,
                                                                            value,
                                                                            type: "relative",
                                                                        },
                                                                    ]
                                                                )
                                                            }
                                                        >
                                                            {label}
                                                        </Text>
                                                    )
                                                )}
                                            </Stack>
                                        </Stack>
                                    </TabPanel>

                                    <TabPanel>
                                        <Stack>
                                            <Stack direction="row">
                                                <Stack flex={1}>
                                                    <Text>Period Type</Text>
                                                    <Select<
                                                        Option,
                                                        false,
                                                        GroupBase<Option>
                                                    >
                                                        isClearable
                                                        onChange={(e) => {
                                                            setFixedPeriodType(
                                                                () =>
                                                                    (e?.value as FixedPeriodType) ||
                                                                    "MONTHLY"
                                                            );
                                                            changeAttribute({
                                                                attribute:
                                                                    "fixedPeriodType",
                                                                value: e?.value,
                                                            });
                                                            console.log(
                                                                e?.value
                                                            );
                                                        }}
                                                        value={fixedPeriodTypeOptions.find(
                                                            ({ value }) =>
                                                                value ===
                                                                fixedPeriodType
                                                        )}
                                                        options={
                                                            fixedPeriodTypeOptions
                                                        }
                                                        size="sm"
                                                    />
                                                </Stack>
                                                <Stack w="100px">
                                                    <Text>Year</Text>

                                                    <NumberInput
                                                        size="sm"
                                                        min={1900}
                                                        value={year}
                                                        onChange={(_, val) => {
                                                            setYear(() => val);
                                                        }}
                                                    >
                                                        <NumberInputField />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </Stack>
                                            </Stack>
                                            <Stack overflow="auto" maxH="400px">
                                                {availableFixedPeriods.map(
                                                    (val) => (
                                                        <Text
                                                            key={val.id}
                                                            cursor="pointer"
                                                            onClick={() =>
                                                                setSelectedPeriods(
                                                                    (prev) => [
                                                                        ...prev,
                                                                        {
                                                                            value: val.id,
                                                                            label: val.name,
                                                                            type: "fixed",
                                                                        },
                                                                    ]
                                                                )
                                                            }
                                                        >
                                                            {val.name}
                                                        </Text>
                                                    )
                                                )}
                                            </Stack>
                                        </Stack>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Stack>
                        <Stack
                            w="10%"
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}
                        >
                            <IconButton
                                aria-label="Search database"
                                icon={<BiArrowToRight />}
                                onClick={() => {
                                    const others: Period[] =
                                        tabIndex === 0
                                            ? availableRelativePeriods.map(
                                                  (val) => {
                                                      const opt: Period = {
                                                          ...val,
                                                          type: "relative",
                                                      };
                                                      return opt;
                                                  }
                                              )
                                            : tabIndex === 1
                                            ? availableFixedPeriods.map(
                                                  ({
                                                      id,
                                                      name,
                                                      startDate,
                                                      endDate,
                                                  }) => {
                                                      return {
                                                          value: id,
                                                          label: name,
                                                          startDate,
                                                          endDate,
                                                          type: "fixed",
                                                      };
                                                  }
                                              )
                                            : [];
                                    setSelectedPeriods((prev) => [
                                        ...prev,
                                        ...others,
                                    ]);
                                }}
                            />

                            <IconButton
                                aria-label="Search database"
                                icon={<BiArrowToLeft />}
                                onClick={() => setSelectedPeriods(() => [])}
                            />
                            {/* <Button>1</Button>
                            <Button
                                onClick={() => setSelectedPeriods(() => [])}
                            >
                                3
                            </Button> */}
                        </Stack>
                        <Stack
                            w="35%"
                            borderColor="gray.200"
                            borderStyle="solid"
                            borderWidth="1px"
                        >
                            <Tabs>
                                <TabList>
                                    <Tab fontSize="xs">Selected Periods</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <Stack overflow="auto" h="530px">
                                            {selectedPeriods.map(
                                                ({ value, label }) => (
                                                    <Text
                                                        key={value}
                                                        cursor="pointer"
                                                        onClick={() =>
                                                            setSelectedPeriods(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (v) =>
                                                                            v.value !==
                                                                            value
                                                                    )
                                                            )
                                                        }
                                                    >
                                                        {label}
                                                    </Text>
                                                )
                                            )}
                                        </Stack>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Stack>
                    </Stack>
                    <Box px="5px" alignSelf="flex-end" mb="-5px">
                        <Button
                            onClick={() => {
                                onToggle();
                                changePeriod(selectedPeriods);
                            }}
                        >
                            Update
                        </Button>
                    </Box>
                </Stack>
            )}
        </Stack>
    );
};

export default PeriodPicker;
