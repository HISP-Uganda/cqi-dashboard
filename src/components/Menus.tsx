import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
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

const Menus = () => {
  const navigate = useNavigate<LocationGenerics>();

  const { isOpen, onToggle, onClose } = useDisclosure();
  const store = useStore(dashboards);
  const indicators = useStore(indicatorForGroup);
  const onIndicatorGroupChange = (value: string) => {
    changeIndicatorGroup(value);
    changeIndicator(indicators[0][0]);
  };
  const [selectedPeriods, setSelectedPeriods] = useState<any[]>(store.period);
  const onOk = () => {
    changePeriod(selectedPeriods);
  };

  const onSelect = ({ items }: any) => {
    setSelectedPeriods(items);
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
    <Stack>
      <Stack direction="row" spacing="10px">
        <Button
          onClick={() => handleClick("/")}
          colorScheme={store.url === "/" ? "blue" : "gray"}
        >
          Home
        </Button>
        <Button
          onClick={() =>
            handleClick("/data-entry", {
              ou: store.ou,
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
        <Button
          onClick={() => handleClick("/data-entry/projects")}
          colorScheme={store.url === "/data-entry/projects" ? "blue" : "gray"}
        >
          Projects
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

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
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
                  <Option key={level.id} value={`LEVEL-${level.level}`}>
                    {level.name}
                  </Option>
                ))}
              </Select>

              <PeriodPicker
                selectedPeriods={selectedPeriods}
                onChange={onSelect}
              />
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {isOpen && store.url !== "/data-entry" && (
        <HStack spacing="20px"></HStack>
      )}
    </Stack>
  );
};

export default Menus;
