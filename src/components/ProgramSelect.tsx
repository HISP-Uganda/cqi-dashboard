import { Select } from "antd";
import { useStore } from "effector-react";
import {
    changeProgram,
    changeProgramEntity,
    changeTrackedEntityType,
} from "../Events";
import { dashboards } from "../Store";

const { Option } = Select;

const ProgramSelect = ({
    handleChange,
    trackedEntityType,
    program,
    onClear,
}: {
    handleChange: (value: string) => void;
    trackedEntityType: string;
    program: string;
    onClear: () => void;
}) => {
    const store = useStore(dashboards);
    return (
        <Select
            style={{ width: "100%" }}
            value={
                trackedEntityType && program
                    ? `${trackedEntityType},${program}`
                    : undefined
            }
            onChange={handleChange}
            placeholder="Select program"
            size="large"
            allowClear
            onClear={() => onClear()}
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
