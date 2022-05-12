import {
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  List,
  ListItem,
  Spinner,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChangeEvent, useRef } from "react";
import { MdFilterList } from "react-icons/md";
import { addRemoveColumn } from "../Events";
import { useProgram } from "../Queries";
import { dashboards } from "../Store";

const ColumnDrawer = () => {
  const store = useStore(dashboards);
  const btnRef = useRef<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading, isError, isSuccess, data, error } = useProgram(
    store.program
  );

  return (
    <Stack direction="row" spacing={4}>
      {isLoading && <Spinner />}
      {isSuccess && (
        <>
          <Button leftIcon={<MdFilterList />} onClick={onOpen}>
            Show columns
          </Button>
          <Drawer
            size="sm"
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Choose Columns</DrawerHeader>
              <DrawerBody>
                <List spacing={3}>
                  {store.columns.map((c: any) => (
                    <ListItem key={c.trackedEntityAttribute.id}>
                      <Checkbox
                        isChecked={c.displayInList}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          addRemoveColumn({
                            value: e.target.checked,
                            id: c.trackedEntityAttribute.id,
                          })
                        }
                      >
                        {c.trackedEntityAttribute.name}
                      </Checkbox>
                    </ListItem>
                  ))}
                </List>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
      {isError && <div>{error.message}</div>}
    </Stack>
  );
};

export default ColumnDrawer;
