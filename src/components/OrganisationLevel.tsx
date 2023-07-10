import { Box, Stack, Text } from "@chakra-ui/react";

import { changeLevel } from "../Events";
import { dashboards } from "../Store";

import { GroupBase, Select } from "chakra-react-select";

import { useStore } from "effector-react";
import { Option } from "../interfaces";

export default function OrganisationLevel() {
    const store = useStore(dashboards);

    const levels: Option[] = store.levels.map((level: any) => {
        return { label: level.name, value: `LEVEL-${level.level}` };
    });
    const realValue = levels.find((v) => v.value === store.indicator);

    return (
        <Stack direction="row" alignItems="center" zIndex={100} flex={1}>
            <Box flex={1}>
                <Select<Option, false, GroupBase<Option>>
                    value={realValue}
                    isClearable
                    onChange={(e) => {
                        if (e?.value) {
                            changeLevel(e.value);
                        }
                    }}
                    options={levels}
                // size="sm"
                />
            </Box>
        </Stack>
    );
}
