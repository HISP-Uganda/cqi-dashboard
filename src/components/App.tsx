import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import {
    createHashHistory,
    Outlet,
    parseSearchWith,
    ReactLocation,
    Route,
    Router,
    stringifySearchWith,
} from "@tanstack/react-location";
import { changeUrl } from "../Events";
import {
    fetchInstances,
    fetchTrackedEntityInstance,
    useUserUnits,
} from "../Queries";
import { Analytics, Indicators, Layered } from "./dashboards";
import Projects from "./Projects";
import TrackedEntityInstance from "./TrackedEntityInstance";
import TrackedEntityInstanceForm from "./TrackedEntityInstanceForm";
import TrackedEntityInstances from "./TrackedEntityInstances";

import { useDataEngine } from "@dhis2/app-runtime";
import { QueryClient } from "@tanstack/react-query";
import { LocationGenerics } from "../interfaces";
import { decodeFromBinary, encodeToBinary } from "../utils";
import Menus from "./Menus";

const history = createHashHistory();
const location = new ReactLocation<LocationGenerics>({
    history,
    parseSearch: parseSearchWith((value) =>
        JSON.parse(decodeFromBinary(value))
    ),
    stringifySearch: stringifySearchWith((value) =>
        encodeToBinary(JSON.stringify(value))
    ),
});

const App = () => {
    const { isError, isLoading, error, isSuccess, data } = useUserUnits();
    const engine = useDataEngine();
    const queryClient = new QueryClient();

    const routes: Route<LocationGenerics>[] = [
        {
            path: "/",
            element: <Analytics />,
            loader: async () => {
                changeUrl("/");
                return {};
            },
        },
        {
            path: "/layered-dashboard",
            loader: async () => {
                changeUrl("/layered-dashboard");
                return {};
            },
            children: [{ path: "/", element: <Layered /> }],
        },
        {
            path: "/indicators",
            loader: async () => {
                changeUrl("/indicators");
                return {};
            },
            children: [{ path: "/", element: <Indicators /> }],
        },
        {
            path: "/data-entry",
            loader: async () => {
                changeUrl("/data-entry");
                return {};
            },
            children: [
                {
                    path: "/",
                    element: <TrackedEntityInstances />,
                    loader: ({ search }) => {
                        return (
                            queryClient.getQueryData([
                                "tracked entity instances",
                                ...Object.values(search),
                            ]) ??
                            queryClient
                                .fetchQuery(
                                    [
                                        "tracked entity instances",
                                        ...Object.values(search),
                                    ],
                                    () => fetchInstances(engine, search)
                                )
                                .then(() => ({}))
                        );
                    },
                    pendingElement: async () => (
                        <Flex
                            w="100%"
                            alignItems="center"
                            justifyContent="center"
                            h="calc(100vh - 48px)"
                        >
                            <Spinner />
                        </Flex>
                    ),
                    pendingMs: 100, // 2 seconds
                },
                {
                    path: "/tracked-entity-form",
                    element: <TrackedEntityInstanceForm />,
                },
                {
                    path: "/projects",
                    element: <Projects />,
                    loader: async () => {
                        changeUrl("/data-entry/projects");
                        return {};
                    },
                },
                {
                    path: ":tei",
                    element: <TrackedEntityInstance />,
                    loader: ({ params: { tei } }) =>
                        queryClient.getQueryData([
                            "tracked entity instances",
                            tei,
                        ]) ??
                        queryClient.fetchQuery(
                            ["tracked entity instances", tei],
                            () => fetchTrackedEntityInstance(engine, tei)
                        ),
                },
            ],
        },
    ];
    return (
        <Stack bg="gray.300" h="calc(100vh - 48px)">
            {isLoading && (
                <Flex
                    w="100%"
                    alignItems="center"
                    justifyContent="center"
                    h="100%"
                >
                    <Spinner />
                </Flex>
            )}
            {isSuccess && (
                <Router location={location} routes={routes}>
                    <Stack h="calc(100vh - 48px)" spacing="2px">
                        <Menus searchOu={data.searchOu} />
                        <Outlet />
                    </Stack>
                </Router>
            )}
            {isError && <Box>{error.message}</Box>}
        </Stack>
    );
};

export default App;
