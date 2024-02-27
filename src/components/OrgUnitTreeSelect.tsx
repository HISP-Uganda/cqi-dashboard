import { Box } from "@chakra-ui/react";
import { TreeSelect } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import { FC } from "react";
import { db } from "../db";

const OrgUnitTreeSelect: FC<{
    multiple?: boolean;
    value: string | string[] | undefined;
    onChange: (value: string | string[] | undefined) => void;
}> = ({ multiple = false, value, onChange }) => {
    const organisations = useLiveQuery(() => db.organisations.toArray());
    return (
        <Box flex={1}>
            <TreeSelect<string | string[] | undefined>
                allowClear={true}
                treeDataSimpleMode
                showCheckedStrategy="SHOW_ALL"
                showSearch={true}
                multiple={multiple}
                style={{ width: "100%" }}
                value={value}
                listHeight={700}
                dropdownStyle={{
                    overflow: "auto",
                    minWidth: "350px",
                }}
                placeholder="Please select organisation unit"
                onChange={onChange}
                treeData={organisations
                    ?.map(({ id, name, parent, leaf }) => ({
                        id,
                        title: name,
                        pId: parent ? parent.id : "",
                        value: id,
                        isLeaf: leaf,
                    }))
                    .sort((a, b) => a.title.localeCompare(b.title))}
                size="middle"
            />
        </Box>
    );
};

export default OrgUnitTreeSelect;
