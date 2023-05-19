import { Drawer, Space } from "antd";

import {
    Box,
    Button,
    Spacer,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { DropdownButton } from "@dhis2/ui";
import { useNavigate } from "@tanstack/react-location";
import { Select } from "antd";
import { useStore } from "effector-react";
import { useState } from "react";
import {
    changeFilterBy,
    changeIndicator,
    changeIndicatorGroup,
    changeLevel,
    changeOus,
    changePeriod,
    changeUrl,
} from "../Events";
import { dashboards, indicatorForGroup } from "../Store";

import { LocationGenerics } from "../interfaces";
import Indicator from "./Indicator";
import IndicatorGroup from "./IndicatorGroup";
import OrgUnitTreeSelect from "./OrgUnitTreeSelect";
import PeriodPicker from "./PeriodPicker";

const { Option } = Select;

const Menus = ({ searchOu }: { searchOu: string }) => {
    const navigate = useNavigate<LocationGenerics>();
    const { isOpen, onToggle, onOpen, onClose } = useDisclosure();
    const store = useStore(dashboards);
    const indicators = useStore(indicatorForGroup);
    const onIndicatorGroupChange = (value: string) => {
        changeIndicatorGroup(value);
        changeIndicator(indicators[0][0]);
    };
    const [selectedPeriods, setSelectedPeriods] = useState<any[]>(
        () => store.period
    );
    const onOk = () => {
        changePeriod(selectedPeriods);
    };

    const onSelect = (data: any[]) => {
        setSelectedPeriods(data);
    };
    const onLevelChange = (value: string) => {
        changeLevel(value);
    };
    const handleClick = (
        to: string,
        search: Partial<{
            ou: string;
            program: string;
            trackedEntityType: string;
            page: number;
            pageSize: number;
            ouMode: string;
            programStartDate: string;
            programEndDate: string;
        }> = {}
    ) => {
        changeUrl(to);
        navigate({ to, search });
    };
    return (
        <Stack h="48px" minH="48px" maxH="48px" justifyContent="center">
            <Stack direction="row" spacing="10px">
                <Text
                    fontSize="3xl"
                    // textTransform="uppercase"
                    color="tomato"
                    fontWeight="bold"
                >
                    Continious Quality Improvement (CQI) Database
                </Text>
                <Spacer />
                <Button
                    onClick={() => handleClick("/")}
                    colorScheme={store.url === "/" ? "blue" : "gray"}
                >
                    Home
                </Button>
                <Button
                    onClick={() =>
                        handleClick("/data-entry", {
                            ou: searchOu,
                            program: "vMfIVFcRWlu",
                            trackedEntityType: "KSy4dEvpMWi",
                            page: 1,
                            pageSize: 10,
                            ouMode: "DESCENDANTS",
                        })
                    }
                    colorScheme={store.url === "/data-entry" ? "blue" : "gray"}
                >
                    Data Entry
                </Button>
                <Button
                    onClick={() => handleClick("/layered-dashboard")}
                    colorScheme={
                        store.url === "/layered-dashboard" ? "blue" : "gray"
                    }
                >
                    Layered Dashboard
                </Button>

                <Button
                    onClick={() => handleClick("/indicators")}
                    colorScheme={store.url === "/indicators" ? "blue" : "gray"}
                >
                    All Indicators
                </Button>
                <Button
                    onClick={() => handleClick("/data-entry/projects")}
                    colorScheme={
                        store.url === "/data-entry/projects" ? "blue" : "gray"
                    }
                >
                    Projects
                </Button>


                {/* <Spacer />
                {[
                    "/",
                    "/analytics",
                    "/layered-dashboard",
                    "/indicators",
                ].indexOf(store.url) !== -1 && (
                    <DropdownButton
                        primary
                        component={
                            <Stack
                                w="600px"
                                p="15px"
                                mt="7px"
                                bg="white"
                                boxShadow="2xl"
                                spacing="20px"
                                overflow="auto"
                                h="calc(100vh - 170px)"
                                zIndex={30000}
                            >
                                {store.url !== "/indicators" &&
                                    store.url !== "/" && (
                                        <>
                                            <Stack>
                                                <Text>Program Area</Text>
                                                <IndicatorGroup
                                                    value={store.indicatorGroup}
                                                    onChange={
                                                        onIndicatorGroupChange
                                                    }
                                                />
                                            </Stack>
                                            <Stack>
                                                <Text>Indicator</Text>
                                                <Indicator />
                                            </Stack>
                                        </>
                                    )}
                                <Stack>
                                    <Text>Organisation Unit</Text>
                                    <OrgUnitTreeSelect
                                        multiple={true}
                                        value={store.ous}
                                        onChange={changeOus}
                                    />
                                </Stack>
                                <Stack>
                                    <Text>Organisation Unit Level</Text>
                                    <Select
                                        style={{ width: "100%" }}
                                        value={store.level}
                                        onChange={onLevelChange}
                                    >
                                        {store.levels.map((level: any) => (
                                            <Option
                                                key={level.id}
                                                value={`LEVEL-${level.level}`}
                                            >
                                                {level.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Stack>
                                <Stack>
                                    <Text>Period</Text>
                                    <PeriodPicker
                                    // selectedPeriods={selectedPeriods}
                                    // onChange={onSelect}
                                    />
                                    <Button onClick={() => onOk()}>
                                        Add Period Filter
                                    </Button>
                                </Stack>
                                {store.url === "/indicators" && (
                                    <>
                                        {store.filterBy === "period" ? (
                                            <Button
                                                onClick={() =>
                                                    changeFilterBy("orgUnit")
                                                }
                                                w="300px"
                                                size="sm"
                                            >
                                                Filter By OrgUnits
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    changeFilterBy("period")
                                                }
                                                w="300px"
                                                size="sm"
                                            >
                                                Filter By Period
                                            </Button>
                                        )}
                                    </>
                                )}
                            </Stack>
                        }
                        name="buttonName"
                        value="buttonValue"
                    >
                        Filter
                    </DropdownButton>
                )} */}
            </Stack>

            <Drawer
                title="Drawer with extra actions"
                placement="right"
                width={500}
                onClose={onClose}
                open={isOpen}
                getContainer={false}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={onClose}>OK</Button>
                    </Space>
                }
            >
                <Stack spacing="20px">
                    {store.url !== "/indicators" && store.url !== "/" && (
                        <>
                            <IndicatorGroup
                                value={store.indicatorGroup}
                                onChange={onIndicatorGroupChange}
                            />
                            <Indicator />
                        </>
                    )}

                    <OrgUnitTreeSelect
                        multiple={true}
                        value={store.ous}
                        onChange={changeOus}
                    />
                    <Select
                        style={{ width: "100%" }}
                        value={store.level}
                        onChange={onLevelChange}
                    >
                        {store.levels.map((level: any) => (
                            <Option
                                key={level.id}
                                value={`LEVEL-${level.level}`}
                            >
                                {level.name}
                            </Option>
                        ))}
                    </Select>

                    <Box zIndex={10000}>
                        <PeriodPicker
                        // selectedPeriods={selectedPeriods}
                        // onChange={onSelect}
                        />
                    </Box>
                    {store.url === "/indicators" && (
                        <>
                            {store.filterBy === "period" ? (
                                <Button
                                    onClick={() => changeFilterBy("orgUnit")}
                                    w="300px"
                                    size="sm"
                                >
                                    Filter By OrgUnits
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => changeFilterBy("period")}
                                    w="300px"
                                    size="sm"
                                >
                                    Filter By Period
                                </Button>
                            )}
                        </>
                    )}
                </Stack>
            </Drawer>
        </Stack>
    );
};

export default Menus;
