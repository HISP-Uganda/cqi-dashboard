import React from "react";
import { Route } from "@tanstack/react-location";
import { Analytics, Indicators, Layered } from "./components/dashboards";
import Projects from "./components/Projects";
import TrackedEntityInstance from "./components/TrackedEntityInstance";
import TrackedEntityInstanceForm from "./components/TrackedEntityInstanceForm";
import TrackedEntityInstances from "./components/TrackedEntityInstances";
import { changeUrl } from "./Events";

export const routes: Route<any>[] = [
  {
    path: "/",
    element: <Analytics />,
    loader: async ({ params: { teamId } }) => {
      changeUrl("/");
      return {};
    },
  },
  {
    path: "/layered-dashboard",
    loader: async ({ params: { teamId } }) => {
      changeUrl("/layered-dashboard");
      return {};
    },
    children: [{ path: "/", element: <Layered /> }],
  },
  {
    path: "/indicators",
    loader: async ({ params: { teamId } }) => {
      changeUrl("/indicators");
      return {};
    },
    children: [{ path: "/", element: <Indicators /> }],
  },
  {
    path: "/data-entry",
    loader: async ({ params: { teamId } }) => {
      changeUrl("/data-entry");
      return {};
    },
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
      {
        path: "/projects",
        element: <Projects />,
        loader: async ({ params: { teamId } }) => {
          changeUrl("/data-entry/projects");
          return {};
        },
      },
    ],
  },
];
