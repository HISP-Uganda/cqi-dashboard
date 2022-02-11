import TrackedEntityInstances from "./TrackedEntityInstances";
import TrackedEntityInstanceForm from "./TrackedEntityInstanceForm";
import { dashboards } from "../Store";
import { useStore } from "effector-react";
import TrackedEntityInstance from "./TrackedEntityInstance";

const DataEntry = () => {
  const store = useStore(dashboards);
  const display = {
    list: <TrackedEntityInstances />,
    form: <TrackedEntityInstanceForm />,
    instance: <TrackedEntityInstance />,
  };
  return display[store.dataEntryPage];
};

export default DataEntry;
