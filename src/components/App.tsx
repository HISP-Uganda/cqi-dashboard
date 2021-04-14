import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import Analytics from "./dashboards/Analytics";
import Indicators from "./dashboards/Indicators";
import Layered from "./dashboards/Layered";
import Navigation from "./Navigation";
import TrackedEntityInstance from "./TrackedEntityInstance";
import TrackedEntityInstanceForm from './TrackedEntityInstanceForm';
import TrackedEntityInstances from "./TrackedEntityInstances";


const App = () => {

  return (
    <Router>
      <div style={{ }}>
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
          <Route path="/analytics">
            <Analytics />
          </Route>
          <Route path="/layered">
            <Layered />
          </Route>
          <Route path="/indicators">
            <Indicators />
          </Route>
          <Redirect from="/" to="/analytics" />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
