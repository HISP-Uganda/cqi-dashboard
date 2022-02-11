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
  <D2Shim d2Config={d2Config} i18nRoot="./i18n">
    {({ d2 }) => {
      if (!d2) {
        return null;
      }
      return (
        <QueryClientProvider client={queryClient}>
          <D2Context.Provider value={d2}>
            <ChakraProvider>
              <App />
            </ChakraProvider>
          </D2Context.Provider>
        </QueryClientProvider>
      );
    }}
  </D2Shim>
);

export default AppWrapper;
