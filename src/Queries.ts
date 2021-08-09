import { useQuery } from "react-query";
import { fromPairs } from 'lodash'
import { changeIndicatorGroup, changeIndicatorGroupIndex, changeIndicatorIndex, changeIndicators, changeOu, changeIndicatorGroups, changeIndicator } from "./Events";
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
        fields: "id,name,trackedEntityType,withoutRegistration",
      });
      return programs.filter((p: any) => !p.withoutRegistration);
    },
    {}
  );
}

export function useProgramAttributes(d2: any, program: string) {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(
    ["programAttributes", program],
    async () => {
      return await api.get(`programs/${program}.json`, {
        fields: "selectIncidentDatesInFuture,selectEnrollmentDatesInFuture,incidentDateLabel,enrollmentDateLabel,programTrackedEntityAttributes[id,name,mandatory,valueType,displayInList,sortOrder,allowFutureDate,trackedEntityAttribute[id,name,generated,pattern,unique,valueType,orgunitScope,optionSetValue,displayFormName,optionSet[options[code,name]]]]"
      });
    }
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
    {}
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
    {}
  );
}

export function useEvents(d2: any, stage: string, tei: string, indicator: string = '') {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(["events", stage, tei, indicator], async () => {
    let requests = [
      api.get(`events.json`, {
        programStage: stage,
        trackedEntityInstance: tei
      }),
    ]

    if (indicator) {
      requests = [
        ...requests,
        api.get(`events/${indicator}.json`, {
          programStage: stage,
          trackedEntityInstance: tei
        }),
      ]
    }
    if (indicator) {
      const [events, indicatorInfo] = await Promise.all(requests);
      const de = indicatorInfo.dataValues.find((dv: any) => dv.dataElement === 'kToJ1rk0fwY');
      return { ...events, title: de?.value }
    }
    const [events] = await Promise.all(requests);
    return events;
  });
}

export function useUserUnits(d2: any) {
  const api = d2.Api.getApi();
  let params: any = {
    ouMode: 'ALL',
    dataElement: 'kToJ1rk0fwY,kuVtv8R9n8q',
    programStage: 'vPQxfsUQLEy',
  }
  return useQuery<any, Error>(["userUnits"], async () => {
    const [units, { headers, rows }, { options }] = await Promise.all([
      d2.currentUser.getOrganisationUnits({ fields: 'id,name,path' }),
      api.get(`events/query.json`, params),
      api.get(`optionSets/uKIuogUIFgl`, {
        fields: "options[id,code,name]",
      })
    ]);
    const processed = units.toArray();
    const index = headers.findIndex((header: any) => header.name === 'kToJ1rk0fwY');
    const groupIndex = headers.findIndex((header: any) => header.name === 'kuVtv8R9n8q');
    changeIndicatorGroups(options)
    changeIndicatorGroup(options[0].code)
    changeIndicatorGroupIndex(groupIndex);
    changeOu(processed);
    changeIndicatorIndex(index);
    changeIndicators(rows);

    const currentIndicator = rows.find((row: any) => row[groupIndex] === options[0].code);
    if (currentIndicator) {
      changeIndicator(currentIndicator[0])
    }
    return [];
  });
}

export function useAnalyticsStructure(d2: any, organisationUnits: string, periods: string) {
  const api = d2.Api.getApi();
  const params = [{
    param: 'dimension',
    value: `ou:${organisationUnits}`,
  }, {
    param: 'dimension',
    value: `pe:${periods}`,
  }, {
    param: 'skipData',
    value: true,
  }];

  const allParams = params.map((s: any) => {
    return `${s.param}=${s.value}`;
  }).join("&")

  return useQuery<any, Error>(["analyticsStructure", ...organisationUnits, ...periods], async () => {
    return await api.get(`analytics.json?${allParams}`);
  });
}

export function useAnalytics(
  d2: any,
  program: string,
  searchParam: string,
  search: string,
  numeratorDataElement: string,
  denominatorDataElement: string,
  organisationUnits: string,
  periods: string,
  filterBy: string,
  aggregationType: string = 'SUM',
  hierarchyMeta = false,
  showHierarchy = false,
) {
  const api = d2.Api.getApi();
  let params = [{
    param: 'aggregationType',
    value: aggregationType,
  }, {
    param: `filter`,
    value: `${searchParam}:EQ:${search}`,
  }, {
    param: 'hierarchyMeta',
    value: hierarchyMeta,
  }, {
    param: 'showHierarchy',
    value: showHierarchy,
  }];

  if (filterBy === 'orgUnit') {
    params = [...params, {
      param: 'filter',
      value: `ou:${organisationUnits}`,
    }]
  } else {
    params = [...params, {
      param: 'dimension',
      value: `ou:${organisationUnits}`,
    }]
  }

  if (filterBy === 'period') {
    params = [...params, {
      param: 'filter',
      value: `pe:${periods}`,
    }]
  } else {
    params = [...params, {
      param: 'dimension',
      value: `pe:${periods}`,
    }]
  }

  const numeratorProps = [...params, {
    param: 'value',
    value: numeratorDataElement,
  },]

  const denominatorProps = [...params, {
    param: 'value',
    value: denominatorDataElement,
  },]

  const numParams = numeratorProps.map((s: any) => {
    return `${s.param}=${s.value}`;
  }).join("&")
  const denParams = denominatorProps.map((s: any) => {
    return `${s.param}=${s.value}`;
  }).join("&")
  return useQuery<any, Error>([
    "analytics",
    program,
    searchParam,
    search,
    numeratorDataElement,
    denominatorDataElement,
    organisationUnits,
    periods,
    filterBy,
    aggregationType
  ], async () => {
    const [numerator, denominator] = await Promise.all([api.get(`analytics/events/aggregate/${program}?${numParams}`), api.get(`analytics/events/aggregate/${program}?${denParams}`)]);
    if (filterBy === 'period' || filterBy === 'orgUnit') {
      const groupedNumerator = fromPairs(numerator.rows);
      const groupedDenominator = fromPairs(denominator.rows);
      const dimensions = filterBy === 'period' ? numerator.metaData.dimensions.ou : numerator.metaData.dimensions.pe;

      const processed = dimensions.map((dimension: string) => {
        const num = groupedNumerator[dimension] || '-';
        const den = groupedDenominator[dimension] || '-';
        let ind = '-';
        if (den !== '-' && num !== '-') {
          ind = Number(Number(num) * 100 / Number(den)).toFixed(1)
        }
        return [dimension, { numerator: num, denominator: den, indicator: ind, display: numerator.metaData.items[dimension].name }]
      });
      return fromPairs(processed);
    } else {
      const groupedNumerator = fromPairs(numerator.rows.map((r: any[]) => [`${r[0]}${r[1]}`, r[2]]));
      const groupedDenominator = fromPairs(denominator.rows.map((r: any[]) => [`${r[0]}${r[1]}`, r[2]]));

      const ous = numerator.metaData.dimensions.ou.map((ou: string) => {
        return {
          id: ou,
          name: numerator.metaData.items[ou].name,
          level: String(numerator.metaData.ouHierarchy[ou]).split('/').length + 2
        }
      });

      const pes = numerator.metaData.dimensions.pe.map((pe: string) => {
        return {
          id: pe,
          name: numerator.metaData.items[pe].name
        }
      });
      let all = [];
      for (const ou of numerator.metaData.dimensions.ou) {
        let obj = {}
        for (const pe of numerator.metaData.dimensions.pe) {
          const num = groupedNumerator[`${ou}${pe}`] || '-';
          const den = groupedDenominator[`${ou}${pe}`] || '-';
          let ind = '-';
          if (den === undefined || num === undefined) {
            ind = '-';
          } else if (den !== '-' && num !== '-') {
            ind = Number(Number(num) * 100 / Number(den)).toFixed(1)
          }
          obj = { ...obj, [pe]: { numerator: num, denominator: den, indicator: ind } }
        }
        all = [...all, [ou, obj]]
      }
      return {
        data: fromPairs(all),
        ous,
        pes
      };
    }
  });
}
