import { Select } from "antd";
import { useStore } from "effector-react";
import { FC } from "react";
import { changeIndicator } from "../Events";
import { dashboards, indicatorForGroup } from "../Store";

interface IndicatorProps {}

const Indicator: FC<IndicatorProps> = () => {
  const store = useStore(dashboards);
  const indicator4Group = useStore(indicatorForGroup);
  const onIndicatorChange = (value: string) => {
    changeIndicator(value);
  };

  const { Option } = Select;

  return (
    <Select value={store.indicator} onChange={onIndicatorChange} size="large">
      {indicator4Group.map((row: any) => (
        <option key={row[0]} value={row[0]}>
          {row[1]}
        </option>
      ))}
    </Select>
  );
};

export default Indicator;
