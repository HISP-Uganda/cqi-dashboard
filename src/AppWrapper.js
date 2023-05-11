import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "./theme";
import App from "./components/App";

import "./index.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const AppWrapper = () => (
    <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </QueryClientProvider>
);

export default AppWrapper;
