import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  HStack,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChangeEvent, FC } from "react";
import {
  changeFilterBy,
  changeIndicator,
  changeIndicatorGroup,
  changeLevel,
  changeOus,
} from "../Events";
import { dashboards, indicatorForGroup } from "../Store";
import Indicator from "./Indicator";
import IndicatorGroup from "./IndicatorGroup";
import OrgUnitTreeSelect from "./OrgUnitTreeSelect";
import OuTreeDialog from "./OuTreeDialog";
import PeriodDialog from "./PeriodDialog";
export interface HeaderProps {}
const VisualizationHeader: FC<HeaderProps> = () => {
  const store = useStore(dashboards);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const indicators = useStore(indicatorForGroup);
  const onIndicatorGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
    changeIndicatorGroup(e.target.value);
    changeIndicator(indicators[0][0]);
  };

  const onLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    changeLevel(e.target.value);
  };
  return (
    <>
      <Button onClick={onOpen}>Filters</Button>
      {/* <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerBody px="3px" py="10px" m="0">
              
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer> */}

      
    </>
  );
};

export default VisualizationHeader;
