import { ChakraProvider } from "@chakra-ui/react";
import { D2Shim } from "@dhis2/app-runtime-adapter-d2";
import "antd/dist/antd.css";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./components/App";
import { D2Context } from "./Context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const d2Config = {};

const AppWrapper = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </QueryClientProvider>
);

export default AppWrapper;
