import { useQuery } from "react-query";
export function useUserOrgUnit(d2: any) {
  return useQuery<any, Error>("userOrganisations", async () => {
    const units = await d2.currentUser.getOrganisationUnits();
    return units.toArray().map((unit: any) => {
      return {
        id: unit.id,
        pId: unit.pId || "",
        value: unit.id,
        title: unit.name,
        isLeaf: unit.leaf,
      };
    });
  });
}
export function useTrackedEntityInstances(d2: any, program: string, ou: string, page: number = 1) {
  const api = d2.Api.getApi();
  return []
}

export function usePrograms(d2: any) {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(
    "programs",
    async () => {
      const { programs } = await api.get("programs", {
        paging: false,
        fields: "id,name",
      });

      return programs;
    },
    { retryDelay: 1000 }
  );
}
