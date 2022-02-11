import {
  Button,
  HStack,
  Select,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChangeEvent, FC } from "react";
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
import { HeaderProps } from "./VisualizationHeader";

const Navigation: FC<HeaderProps> = () => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const store = useStore(dashboards);
  const indicators = useStore(indicatorForGroup);
  const onIndicatorGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
    changeIndicatorGroup(e.target.value);
    changeIndicator(indicators[0][0]);
  };

  const onLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    changeLevel(e.target.value);
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
          <Button onClick={() => onToggle()}>Filters</Button>
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
              <option key={level.id} value={`LEVEL-${level.level}`}>
                {level.name}
              </option>
            ))}
          </Select>
          <PeriodDialog />
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
