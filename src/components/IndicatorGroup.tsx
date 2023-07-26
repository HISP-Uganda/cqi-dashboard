import { GroupBase, Select } from "chakra-react-select";
import { Box, Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { FC } from "react";
import { dashboards } from "../Store";
import { Option } from "../interfaces";
interface IndicatorGroupProps {
    value: string;
    onChange: (value: string) => void;
}

const IndicatorGroup: FC<IndicatorGroupProps> = ({ value, onChange }) => {
    const store = useStore(dashboards);
    const realValue = store.indicatorGroups.find((v: any) => v.code === value);
    return (
        <Box flex={1}>
            <Select<Option, false, GroupBase<Option>>
                focusBorderColor="blue.500"
                value={
                    realValue
                        ? { value: realValue.code, label: realValue.name }
                        : undefined
                }
                isClearable
                onChange={(e) => {
                    if (e?.value) {
                        onChange(e.value);
                    }
                }}
                options={store.indicatorGroups.map((o: any) => {
                    return {
                        label: o.name,
                        value: o.code,
                    };
                })}
                size="sm"
            />
        </Box>

        // <Select
        //     style={{ width: "100%", flex: 1 }}
        //     value={value}
        //     onChange={onChange}
        // >
        //     {store.indicatorGroups.map((option: any) => (
        //         <Option key={option.id} value={option.code}>
        //             {option.name}
        //         </Option>
        //     ))}
        // </Select>
    );
};

export default IndicatorGroup;
