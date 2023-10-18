import {
  Button,
  HStack,
  Spacer,
  Stack,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { Select } from "antd";
import { useStore } from "effector-react";
import React, { FC } from "react";
import {
  changeFilterBy,
  changeIndicator,
  changeIndicatorGroup,
  changeLevel,
  changeOus,
  changeUrl,
} from "../Events";
import { dashboards, indicatorForGroup } from "../Store";
import Indicator from "./Indicator";
import IndicatorGroup from "./IndicatorGroup";
import OrgUnitTreeSelect from "./OrgUnitTreeSelect";
import PeriodPicker from "./PeriodPicker";
import { HeaderProps } from "./VisualizationHeader";

const { Option } = Select;

const Navigation: FC<HeaderProps> = () => {
  const { isOpen, onToggle } = useDisclosure();
  const store = useStore(dashboards);
  const indicators = useStore(indicatorForGroup);
  const onIndicatorGroupChange = (value: string) => {
    changeIndicatorGroup(value);
    changeIndicator(indicators[0][0]);
  };

  const onLevelChange = (value: string) => {
    changeLevel(value);
  };
  const handleClick = (url: string) => {
    changeUrl(url);
  };
  return (
    <Stack>
      <Stack
        alignItems="center"
        direction="row"
        bg="blackAlpha.300"
        h="48px"
        px="5px"
      >
        <Button onClick={() => handleClick("analytics")} colorScheme="blue">
          Home
        </Button>
        <Button onClick={() => handleClick("dataEntry")}>Data Entry</Button>
        <Button onClick={() => handleClick("analytics")}>Analytics</Button>
        <Button onClick={() => handleClick("layered")}>
          Layered Dashboard
        </Button>
        <Button onClick={() => handleClick("indicators")}>
          All Indicators
        </Button>
        <Spacer />
        {["analytics", "layered", "indicators"].indexOf(store.url) !== -1 && (
          <Button onClick={() => onToggle()} colorScheme="blue">Filters</Button>
        )}
      </Stack>

      {isOpen && store.url !== "dataEntry" && (
        <HStack spacing="20px">
          {store.url !== "indicators" && (
            <>
              <IndicatorGroup
                value={store.indicatorGroup}
                onChange={onIndicatorGroupChange}
              />
              <Indicator />
            </>
          )}

          <Stack direction="row">
            <Text>Organisation Unit</Text>
            <OrgUnitTreeSelect
              multiple={true}
              value={store.ous}
              onChange={changeOus}
            />
          </Stack>
          <Select
            style={{ width: "100%" }}
            value={store.level}
            onChange={onLevelChange}
            size="large"
          >
            {store.levels.map((level: any) => (
              <Option key={level.id} value={`LEVEL-${level.level}`}>
                {level.name}
              </Option>
            ))}
          </Select>
          {/* <PeriodPicker /> */}
          {store.url === "indicators" && (
            <>
              {store.filterBy === "period" ? (
                <Button onClick={() => changeFilterBy("orgUnit")} w="300px">
                  Filter By OrgUnits
                </Button>
              ) : (
                <Button onClick={() => changeFilterBy("period")} w="300px">
                  Filter By Period
                </Button>
              )}
            </>
          )}
        </HStack>
      )}

    </Stack>
  );
};

export default Navigation;
