import { PeriodDimension } from "@dhis2/analytics";
import { useState } from "react";
import { Item, PickerProps } from "../interfaces";

const PeriodPicker = ({ selectedPeriods, onChange }: PickerProps) => {
  const [periods, setPeriods] = useState<Item[]>(selectedPeriods);
  return (
    <PeriodDimension
      onSelect={({ items }: { items: { id: string; name: string }[] }) => {
        setPeriods(items);
        onChange(items);
      }}
      selectedPeriods={periods}
    />
  );
};

export default PeriodPicker;
