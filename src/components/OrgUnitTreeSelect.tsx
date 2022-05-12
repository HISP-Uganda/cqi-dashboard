import { useDataEngine } from "@dhis2/app-runtime";
import { TreeSelect } from "antd";
import { useStore } from "effector-react";
import { flatten, uniqBy } from "lodash";
import { FC } from "react";
import { changeInitialUnits } from "../Events";
import { dashboards } from "../Store";

const OrgUnitTreeSelect: FC<{
  multiple?: boolean;
  value: any;
  onChange: (value: any) => void;
}> = ({ multiple = false, value, onChange }) => {
  const store = useStore(dashboards);
  const engine = useDataEngine();
  const onLoadData = async (parent: any) => {
    try {
      const {
        units: { organisationUnits },
      }: any = await engine.query({
        units: {
          resource: "organisationUnits.json",
          params: {
            filter: `id:in:[${parent.id}]`,
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
              pId: parent.id,
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
      changeInitialUnits(
        uniqBy([...store.organisations, ...flatten(found)], "id")
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TreeSelect
      allowClear={true}
      treeDataSimpleMode
      multiple={multiple}
      size="large"
      style={{ width: "100%" }}
      value={value}
      listHeight={700}
      dropdownStyle={{ overflow: "auto" }}
      placeholder="Please select health centre"
      onChange={onChange}
      loadData={onLoadData}
      treeData={store.organisations}
    />
  );
};

export default OrgUnitTreeSelect;
