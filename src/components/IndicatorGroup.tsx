import React from "react";
import { Select } from "antd";
import { useStore } from "effector-react";
import { FC } from "react";
import { dashboards } from "../Store";

interface IndicatorGroupProps {
  value: string;
  onChange: (value: string) => void;
}
const { Option } = Select;

const IndicatorGroup: FC<IndicatorGroupProps> = ({ value, onChange }) => {
  const store = useStore(dashboards);
  return (
    <Select style={{ width: "100%" }} value={value} onChange={onChange}>
      {store.indicatorGroups.map((option: any) => (
        <Option key={option.id} value={option.code}>
          {option.name}
        </Option>
      ))}
    </Select>
  );
};

export default IndicatorGroup;
