import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import TrackedEntityInstance from "./TrackedEntityInstance";
import TrackedEntityInstances from "./TrackedEntityInstances";
import TrackedEntityInstanceForm from './TrackedEntityInstanceForm'

const App = () => {
  return (
    <Router>
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
        <Redirect from="/" to="/tracker" />
      </Switch>
    </Router>
  );
};

export default App;
