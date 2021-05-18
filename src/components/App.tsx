import { Box, Center } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import {
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { useD2 } from "../Context";
import { useUserUnits } from "../Queries";
import Analytics from "./dashboards/Analytics";
import Indicators from "./dashboards/Indicators";
import Layered from "./dashboards/Layered";
import Navigation from "./Navigation";
import TrackedEntityInstance from "./TrackedEntityInstance";
import TrackedEntityInstanceForm from './TrackedEntityInstanceForm';
import TrackedEntityInstances from "./TrackedEntityInstances";

const App = () => {
  const d2 = useD2();
  const { isError, isLoading, error, isSuccess } = useUserUnits(d2);
  return (
    <>
      {isLoading && <Center className="full-height"><Spinner /></Center>}
      {isSuccess && <Router>
        <Box className="full-height">
          <Navigation />
          <Switch>
            <Route path="/instances/:tei">
              <TrackedEntityInstance />
            </Route>
            <Route path="/tracker/add">
              <TrackedEntityInstanceForm />
            </Route>
            <Route path="/tracker">
              <TrackedEntityInstances />
            </Route>
            <Route path="/layered">
              <Layered />
            </Route>
            <Route path="/indicators">
              <Indicators />
            </Route>
            <Route exact path="/">
              <Analytics />
            </Route>
          </Switch>
        </Box>
      </Router>}
      {isError && <Center className="full-height">{error.message}</Center>}
    </>
  );
};

export default App;
