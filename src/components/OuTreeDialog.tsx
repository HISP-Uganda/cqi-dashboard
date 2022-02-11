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
  useDisclosure,
} from "@chakra-ui/react";
import { OrgUnitDimension } from "@dhis2/analytics";
import { useConfig } from "@dhis2/app-runtime";
import { useD2 } from "@dhis2/app-runtime-adapter-d2";
import { useStore } from "effector-react";
import { useState } from "react";
import { changeInitialUnits } from "../Events";
import { dashboards } from "../Store";

const OuTreeDialog = () => {
  const { baseUrl, ...others } = useConfig();
  const config: any = {
    d2Config: {
      baseUrl: baseUrl + "/api",
    },
    onInitialized: (d2: any) => {
      console.log(d2);
    },
  };

  const { d2 } = useD2(config);
  const store = useStore(dashboards);
  const [filters, setFilters] = useState<any[]>(store.organisations);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSelectItems = ({ items }: any) => {
    setFilters(items);
  };

  const onDeselectItems = ({ itemIdsToRemove }) => {
    const newList = filters.filter(
      (item: any) => !itemIdsToRemove.includes(item.id)
    );
    setFilters(newList);
  };

  const onReorderItems = ({ itemIds }) => {
    const oldList = filters;
    const reorderedList = itemIds.map((id: any) =>
      oldList.find((item: any) => item.id === id)
    );
    setFilters(reorderedList);
  };

  const onOk = () => {
    changeInitialUnits(filters);
    onClose();
  };

  return (
    <>
      {!d2 && <div>Loading</div>}
      {!!d2 && (
        <>
          <Box style={{ paddingRight: 10 }}>
            <Button onClick={onOpen}>Select OrgUnit</Button>
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
                  displayNameProperty="name"
                  onReorder={onReorderItems}
                  ouItems={filters}
                  d2={d2}
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button colorScheme="blue" onClick={() => onOk()}>
                  OK
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default OuTreeDialog;
