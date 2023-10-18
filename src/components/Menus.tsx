import { Drawer, Space } from "antd";

import {
    Box,
    Button,
    Spacer,
    Stack,
    Image,
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

const Menus = ({ searchOu, orgUnitName }: { searchOu: string, orgUnitName: string }) => {
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
            "ou-name": string
        }> = {}
    ) => {
        changeUrl(to);
        navigate({ to, search });
    };
    return (
        <Stack
            h="48px"
            minH="48px"
            maxH="48px"
            justifyContent="center"
            bg="white"
        >
            <Stack direction="row" spacing="10px" alignItems="center" px="5px">
                <Image
                    boxSize="40px"
                    objectFit="cover"
                    src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/Coat_of_arms_of_Uganda.svg"
                    alt="CQI"
                />
                <Text
                    fontSize="2.7vh"
                    // textTransform="uppercase"
                    color="red.500"
                    fontWeight="bold"
                >
                    Continuous Quality Improvement (CQI) Database
                </Text>
                <Spacer />
                <Stack direction="row" alignItems="center">
                    <Button
                        size="sm"
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
                                "ou-name": orgUnitName
                            })
                        }
                        colorScheme={
                            store.url === "/data-entry" ? "blue" : "gray"
                        }
                        size="sm"
                    >
                        Data Entry
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleClick("/layered-dashboard")}
                        colorScheme={
                            store.url === "/layered-dashboard" ? "blue" : "gray"
                        }
                    >
                        Layered Dashboard
                    </Button>

                    <Button
                        size="sm"
                        onClick={() => handleClick("/indicators")}
                        colorScheme={
                            store.url === "/indicators" ? "blue" : "gray"
                        }
                    >
                        All Indicators
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleClick("/data-entry/projects")}
                        colorScheme={
                            store.url === "/data-entry/projects"
                                ? "blue"
                                : "gray"
                        }
                    >
                        Projects
                    </Button>
                </Stack>
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
                            <Indicator
                                value={store.indicator}
                                indicatorGroup={store.indicator}
                                onChange={(val: string) => changeIndicator(val)}
                            />
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
