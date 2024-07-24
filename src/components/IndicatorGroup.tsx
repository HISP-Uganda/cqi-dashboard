import { Box } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { FC } from "react";
import { Option } from "../interfaces";
import { dashboards } from "../Store";
interface IndicatorGroupProps {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    isMulti?: boolean;
}

const IndicatorGroup: FC<IndicatorGroupProps> = ({
    value,
    onChange,
    isMulti = false,
}) => {
    const store = useStore(dashboards);

    const options = store.indicatorGroups.map((o: any) => {
        return {
            label: o.name,
            value: o.code,
        };
    });
    const realValue = isMulti
        ? options.filter((v: any) => value?.split(",").indexOf(v.value) !== -1)
        : options.find((v: any) => v.value === value);

    if (isMulti) {
        return (
            <Box flex={1}>
                <Select<Option, true, GroupBase<Option>>
                    focusBorderColor="blue.500"
                    value={realValue}
                    isClearable
                    onChange={(e) => {
                        onChange(e?.map((a) => a.value).join(","));
                    }}
                    options={options}
                    size="sm"
                    isMulti
                />
            </Box>
        );
    }
    return (
        <Box flex={1}>
            <Select<Option, false, GroupBase<Option>>
                focusBorderColor="blue.500"
                value={realValue}
                isClearable
                onChange={(e) => {
                    onChange(e?.value);
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
