import { Button, HStack, Spacer, Stack, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { Select } from "antd";
import { useStore } from "effector-react";
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
import PeriodDialog from "./PeriodDialog";

const { Option } = Select;

const Menus = () => {
  const navigate = useNavigate();

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
  const handleClick = (to: string) => {
    changeUrl(to);
    navigate({ to });
  };
  return (
    <Stack>
      <Stack direction="row" spacing="10px">
        <Button
          onClick={() => handleClick("/")}
          colorScheme={store.url === "/" ? "blue" : "gray"}
        >
          Home
        </Button>
        <Button
          onClick={() => handleClick("/data-entry")}
          colorScheme={store.url === "/data-entry" ? "blue" : "gray"}
        >
          Data Entry
        </Button>
        <Button
          onClick={() => handleClick("/layered-dashboard")}
          colorScheme={store.url === "/layered-dashboard" ? "blue" : "gray"}
        >
          Layered Dashboard
        </Button>
        <Button
          onClick={() => handleClick("/indicators")}
          colorScheme={store.url === "/indicators" ? "blue" : "gray"}
        >
          All Indicators
        </Button>
        <Spacer />
        {["/", "/analytics", "/layered-dashboard", "/indicators"].indexOf(
          store.url
        ) !== -1 && (
          <Button onClick={() => onToggle()} colorScheme="red">
            Filters
          </Button>
        )}
      </Stack>
      {isOpen && store.url !== "/data-entry" && (
        <HStack spacing="20px">
          {store.url !== "/indicators" && (
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
              <Option key={level.id} value={`LEVEL-${level.level}`}>
                {level.name}
              </Option>
            ))}
          </Select>
          <PeriodDialog />
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
        </HStack>
      )}
    </Stack>
  );
};

export default Menus;
