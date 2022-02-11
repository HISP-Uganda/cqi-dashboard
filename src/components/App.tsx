import { Box, Center, Flex, Stack } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useStore } from "effector-react";
import { useUserUnits } from "../Queries";
import { dashboards } from "../Store";
import Analytics from "./dashboards/Analytics";
import Indicators from "./dashboards/Indicators";
import Layered from "./dashboards/Layered";
import DataEntry from "./DataEntry";
import Navigation from "./Navigation";

const pages = {
  dataEntry: <DataEntry />,
  layered: <Layered />,
  indicators: <Indicators />,
  analytics: <Analytics />,
};

const App = () => {
  const { isError, isLoading, error, isSuccess } = useUserUnits();
  const store = useStore(dashboards);
  return (
    <Box h="calc(100vh - 48px)">
      {isLoading && (
        <Flex
          h="calc(100vh - 48px)"
          alignItems="center"
          justifyContent="center"
          justifyItems="center"
        >
          <Spinner />
        </Flex>
      )}
      {isSuccess && (
        <Stack spacing="10px">
          <Navigation />
          {pages[store.url]}
        </Stack>
      )}
      {isError && <Center>{error.message}</Center>}
    </Box>
  );
};

export default App;
