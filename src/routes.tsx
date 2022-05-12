import { Route } from "@tanstack/react-location";
import { Analytics, Indicators, Layered } from "./components/dashboards";
import DataEntry from "./components/DataEntry";
import TrackedEntityInstance from "./components/TrackedEntityInstance";
import TrackedEntityInstanceForm from "./components/TrackedEntityInstanceForm";
import TrackedEntityInstances from "./components/TrackedEntityInstances";

export const routes: Route<any>[] = [
  {
    path: "/",
    element: <Analytics />,
  },
  {
    path: "/layered-dashboard",
    children: [{ path: "/", element: <Layered /> }],
  },
  {
    path: "/indicators",
    children: [{ path: "/", element: <Indicators /> }],
  },
  {
    path: "/data-entry",
    children: [
      { path: "/", element: <TrackedEntityInstances /> },
      {
        path: "/tracked-entity-instance",
        element: <TrackedEntityInstance />,
      },
      {
        path: "/tracked-entity-form",
        element: <TrackedEntityInstanceForm />,
      },
    ],
  },
];
