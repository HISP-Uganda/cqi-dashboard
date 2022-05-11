import { Select } from "antd";
import { useStore } from "effector-react";
import { changeIndicator } from "../Events";
import { dashboards, indicatorForGroup } from "../Store";

const Indicator = () => {
  const store = useStore(dashboards);
  const indicator4Group = useStore(indicatorForGroup);
  const onIndicatorChange = (value: string) => {
    changeIndicator(value);
  };

  const { Option } = Select;

  return (
    <Select value={store.indicator} onChange={onIndicatorChange} >
      {indicator4Group.map((row: any) => (
        <Option key={row[0]} value={row[0]}>
          {row[1]}
        </Option>
      ))}
    </Select>
  );
};

export default Indicator;
