import { Button, Stack, Spacer, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { dashboards } from "../Store";

const Menus = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const store = useStore(dashboards);
  return (
    <Stack direction="row" spacing="10px">
      <Button onClick={() => navigate({ to: "/" })}>Home</Button>
      <Button onClick={() => navigate({ to: "/data-entry" })}>
        Data Entry
      </Button>
      <Button onClick={() => navigate({ to: "/layered-dashboard" })}>
        Layered Dashboard
      </Button>
      <Button onClick={() => navigate({ to: "/indicators" })}>
        All Indicators
      </Button>
      <Spacer />
      <Button onClick={() => onToggle()}>Filters</Button>
    </Stack>
  );
};

export default Menus;
