import { useDataEngine } from "@dhis2/app-runtime";
import { TreeSelect } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import { flatten } from "lodash";
import { FC } from "react";
import { db } from "../db";

const OrgUnitTreeSelect: FC<{
    multiple?: boolean;
    value: string | string[] | undefined;
    onChange: (value: string | string[] | undefined) => void;
}> = ({ multiple = false, value, onChange }) => {
    const organisations = useLiveQuery(() => db.organisations.toArray());
    const engine = useDataEngine();
    const onLoadData = async ({ id, children }: any) => {
        if (children) {
            return;
        }
        try {
            const {
                units: { organisationUnits },
            }: any = await engine.query({
                units: {
                    resource: "organisationUnits.json",
                    params: {
                        filter: `id:in:[${id}]`,
                        paging: "false",
                        order: "shortName:desc",
                        fields: "children[id,name,path,leaf]",
                    },
                },
            });
            const found = organisationUnits.map((unit: any) => {
                return unit.children
                    .map((child: any) => {
                        return {
                            id: child.id,
                            pId: id,
                            value: child.id,
                            title: child.name,
                            isLeaf: child.leaf,
                        };
                    })
                    .sort((a: any, b: any) => {
                        if (a.title > b.title) {
                            return 1;
                        }
                        if (a.title < b.title) {
                            return -1;
                        }
                        return 0;
                    });
            });
            await db.organisations.bulkPut(flatten(found));
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <TreeSelect<string | string[] | undefined>
            allowClear={true}
            treeDataSimpleMode
            multiple={multiple}
            style={{ width: "100%" }}
            value={value}
            listHeight={700}
            dropdownStyle={{ overflow: "auto" }}
            placeholder="Please select organisation unit"
            onChange={onChange}
            loadData={onLoadData}
            treeData={organisations}
        />
    );
};

export default OrgUnitTreeSelect;
