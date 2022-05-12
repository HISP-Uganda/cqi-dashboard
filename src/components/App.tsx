import { Box, Flex, Stack } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import {
  createHashHistory,
  MakeGenerics,
  Outlet,
  parseSearchWith,
  ReactLocation,
  Router,
  stringifySearchWith
} from "@tanstack/react-location";
import { useUserUnits } from "../Queries";

import { routes } from "../routes";
import { decodeFromBinary, encodeToBinary } from "../utils";
import Menus from "./Menus";

type LocationGenerics = MakeGenerics<{
  LoaderData: {};
}>;

const history = createHashHistory();
const location = new ReactLocation<LocationGenerics>({
  history,
  parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  stringifySearch: stringifySearchWith((value) =>
    encodeToBinary(JSON.stringify(value))
  ),
});

const App = () => {
  const { isError, isLoading, error, isSuccess } = useUserUnits();
  return (
    <Stack p="10px">
      {isLoading && (
        <Flex
          w="100%"
          alignItems="center"
          justifyContent="center"
          h="calc(100vh - 48px)"
        >
          <Spinner />
        </Flex>
      )}
      {isSuccess && (
        <Router location={location} routes={routes}>
          <Stack h="calc(100vh - 48px)">
            <Menus />
            <Outlet />
          </Stack>
        </Router>
      )}

      {isError && <Box>{error.message}</Box>}
    </Stack>
  );
};

export default App;
