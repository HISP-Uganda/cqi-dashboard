import { Select } from "antd";
import { useStore } from "effector-react";
import { changeProgram, changeProgramEntity, changeTrackedEntityType } from "../Events";
import { dashboards } from "../Store";

const { Option } = Select;

const ProgramSelect = () => {
  const store = useStore(dashboards);
  const handleChange = (value: string) => {
    changeProgramEntity(value);
    if (value) {
      const [trackedEntityType, program] = value.split(",");
      changeTrackedEntityType(trackedEntityType);
      changeProgram(program);
    } else {
      changeTrackedEntityType("");
      changeProgram("");
    }
  };
  return (
    <Select
      size="large"
      style={{ width: "100%" }}
      value={store.programEntity}
      onChange={handleChange}
    >
      {store.programs.map((p: any) => (
        <Option
          key={`${p.trackedEntityType.id},${p.id}`}
          value={`${p.trackedEntityType.id},${p.id}`}
        >
          {p.name}
        </Option>
      ))}
    </Select>
  );
};

export default ProgramSelect;
