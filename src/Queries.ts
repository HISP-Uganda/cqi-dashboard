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


export function useOptionSet(d2: any, optionSet: string) {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(
    ["optionSet", optionSet],
    async () => {
      const { options } = await api.get(`optionSets/${optionSet}`, {
        fields: "options[id,code,name]",
      });
      return options;
    },
    { retryDelay: 1000 }
  );
}

export function useEventOptions(d2: any, programStage: string, dataElements: string, dataElement: string = "", search: string = "") {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(
    ["eventOptions", programStage, dataElement, search, dataElements],
    async () => {
      let params: any = {
        ouMode: 'ALL',
        dataElement: `${dataElements}`,
        programStage,
      }
      if (!!search && !!dataElement) {
        params = {
          ...params,
          filter: `${dataElement}:IN:${search}`
        }
      }
      return await api.get(`events/query.json`, params);
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

export function useAnalytics(d2: any, program: string, searchDataElement: string, indicators: string[], dataElement: string, organisationUnits: string[], periods: string[], aggregationType: string = 'SUM') {
  const api = d2.Api.getApi();
  const params = [{
    param: 'dimension',
    value: `ou:${organisationUnits.join(';')}`,
  }, {
    param: 'dimension',
    value: `pe:${periods.join(';')}`,
  }, {
    param: 'value',
    value: dataElement,
  }, {
    param: 'aggregationType',
    value: aggregationType,
  }, {
    filter: `${searchDataElement}:IN:${indicators.join(';')}`,
    value: aggregationType,
  }];

  const allParams = params.map((s: any) => {
    return encodeURIComponent(s.param) + "=" + encodeURIComponent(s.value);
  }).join("&")
  return useQuery<any, Error>(["analytics", program, indicators, dataElement, ...organisationUnits, ...periods, aggregationType], async () => {
    return await api.get(`analytics/events/aggregate/${program}?${allParams}`);
  });
}
