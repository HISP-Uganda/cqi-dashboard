import { Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";

const Menus = () => {
  const navigate = useNavigate();
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
    </Stack>
  );
};

export default Menus;
