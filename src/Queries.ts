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


export function useEvents(d2: any, stage: string, tei: string) {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(["events", stage, tei], async () => {
    return await api.get(`events.json`, {
      programStage: stage,
      trackedEntityInstance: tei
    });
  });
}
