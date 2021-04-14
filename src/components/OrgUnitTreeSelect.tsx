import { TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { flatten } from 'lodash'
import { useD2 } from "../Context";
import { useUserOrgUnit } from "../Queries";
import { useQueryClient } from "react-query";
type Unit = {
  id: string;
  name: string;
  path: string;
  leaf: boolean;
}
type Organisation = {
  children: Array<Unit>
}
type Response = {
  organisationUnits: Array<Organisation>
}
const OrgUnitTreeSelect = ({ selectedOrgUnit, setSelectedOrgUnit }) => {
  const [units, setUnits] = useState<any[]>([]);
  const d2 = useD2();
  const { data, isError, isLoading, error } = useUserOrgUnit(d2);
  const onLoadData = async (parent: any) => {
    try {
      const api = d2.Api.getApi();
      const { organisationUnits }: Response = await api.get("organisationUnits", {
        filter: `id:in:[${parent.id}]`,
        paging: "false",
        order: 'shortName:desc',
        fields: "children[id,name,path,leaf]",
      });
      const found = organisationUnits
        .map((unit: Organisation) => {
          return unit.children.map((child: Unit) => {
            return {
              id: child.id,
              pId: parent.id,
              value: child.id,
              title: child.name,
              isLeaf: child.leaf,
            };
          }).sort((a, b) => {
            if (a.title > b.title) {
              return 1;
            }
            if (a.title < b.title) {
              return -1;
            }
            return 0;
          });
        });
      setUnits([...units, ...flatten(found)]);
      // queryClient.setQueryData('units', (prevData: any) => {
      //   console.log(prevData)
      //   return units;
      // })
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (data && units.length === 0) {
      setUnits(data);
    }
  }, [data, units]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <TreeSelect
      allowClear={true}
      treeDataSimpleMode
      size="large"
      style={{ width: "100%" }}
      value={selectedOrgUnit}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="Please select health centre"
      onChange={setSelectedOrgUnit}
      loadData={onLoadData}
      treeData={units}
    />
  );
};

export default OrgUnitTreeSelect;
