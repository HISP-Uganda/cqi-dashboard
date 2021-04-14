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
import { OrgUnitDimension } from "@dhis2/analytics";
import { useStore } from "effector-react";
import { useState } from "react";
import { useD2 } from "../Context";
import { changeOu } from "../Events";
import { dashboards } from "../Store";

const OuTreeDialog = () => {
  const d2 = useD2()
  const store = useStore(dashboards);
  const [filters, setFilters] = useState<any[]>(store.ou);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSelectItems = ({ items }: any) => {
    setFilters(items);
  }

  const onDeselectItems = ({ itemIdsToRemove }) => {
    const newList = filters.filter((item: any) => !itemIdsToRemove.includes(item.id))
    setFilters(newList)
  }

  const onReorderItems = ({ itemIds }) => {
    const oldList = filters
    const reorderedList = itemIds.map((id: any) => oldList.find((item: any) => item.id === id));
    setFilters(reorderedList)
  }

  const onOk = () => {
    changeOu(filters);
    onClose()
  };

  return (
    <>
      <Box style={{ paddingRight: 10 }}>
        <Button onClick={onOpen}>
          Select OrgUnit
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Organisation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrgUnitDimension
              onSelect={onSelectItems}
              onDeselect={onDeselectItems}
              onReorder={onReorderItems}
              ouItems={filters}
              d2={d2}
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

export default OuTreeDialog;
