import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import { PeriodDimension } from "@dhis2/analytics";
import { useStore } from "effector-react";
import { useState } from "react";
import { changePeriod } from "../Events";
import { dashboards } from "../Store";
const PeriodDialog = () => {
  const store = useStore(dashboards)
  const [selectedPeriods, setSelectedPeriods] = useState<any[]>(store.period);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const onOk = () => {
    changePeriod(selectedPeriods);
    onClose()
  };

  const onSelect = ({ items }: any) => {
    setSelectedPeriods(items);
  };

  return (
    <>
      <Box style={{ paddingRight: 10 }}>
        <Button onClick={onOpen} size="sm">
          Select period
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Period</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PeriodDimension
              selectedPeriods={selectedPeriods}
              onSelect={onSelect}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={() => onOk()}>OK</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default PeriodDialog;
