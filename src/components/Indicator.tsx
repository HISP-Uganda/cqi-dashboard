import React from "react";

import { changeIndicator } from "../Events";
import { dashboards, indicatorForGroup } from "../Store";

import { GroupBase, Select } from "chakra-react-select";

import { useStore } from "effector-react";
import { FC } from "react";
import {
    LocationGenerics,
    Option,
    ProjectField,
    QIProject,
} from "../interfaces";

const Indicator = () => {
    const store = useStore(dashboards);
    const indicator4Group = useStore(indicatorForGroup);
    const onIndicatorChange = (value: string) => {
        changeIndicator(value);
    };

    const realValue = indicator4Group.find(
        (v: any) => v[0] === store.indicator
    );

    return (
        <Select<Option, false, GroupBase<Option>>
            value={
                realValue
                    ? { value: realValue[0], label: realValue[1] }
                    : undefined
            }
            isClearable
            onChange={(e) => {
                if (e?.value) {
                    changeIndicator(e.value);
                }
            }}
            options={indicator4Group.map((o: any) => {
                return {
                    label: o[1],
                    value: o[0],
                };
            })}
            // size="sm"
        />
    );
};

export default Indicator;
