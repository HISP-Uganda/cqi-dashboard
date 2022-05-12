import { useQuery } from "react-query";
import { fromPairs } from "lodash";
import { useDataEngine } from "@dhis2/app-runtime";

import {
  changeIndicatorGroup,
  changeIndicatorGroupIndex,
  changeIndicatorIndex,
  changeIndicators,
  changeOu,
  changeIndicatorGroups,
  changeIndicator,
  changeColumns,
  changeTotal,
  changeInitialPrograms,
  changeInitialUnits,
  changeOus,
  changeLevels,
} from "./Events";
import { getRule } from "./utils/common";

export function useUserOrgUnit() {
  const engine = useDataEngine();
  const query = {
    me: {
      resource: "me.json",
      params: {
        fields: "organisationUnits[id,name,leaf]",
      },
    },
  };
  return useQuery<any, Error>("userOrganisations", async () => {
    const {
      me: { organisationUnits },
    }: any = await engine.query(query);
    changeOu(organisationUnits.map(({ id }: any) => id));
    return organisationUnits.map((unit: any) => {
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

export function usePrograms() {
  const engine = useDataEngine();
  return useQuery<any, Error>(
    "programs",
    async () => {
      const {
        programs: { programs },
      }: any = await engine.query({
        programs: {
          resource: "programs.json",
          params: {
            paging: false,
            fields: "id,name,trackedEntityType,withoutRegistration",
          },
        },
      });
      return programs.filter((p: any) => !p.withoutRegistration);
    },
    {}
  );
}

export function useProgram(currentProgram: string) {
  const engine = useDataEngine();
  return useQuery<any, Error>(["single-program", currentProgram], async () => {
    if (currentProgram) {
      const {
        program: { programTrackedEntityAttributes },
      }: any = await engine.query({
        program: {
          resource: `programs/${currentProgram}.json`,
          params: {
            fields:
              "programTrackedEntityAttributes[id,displayInList,trackedEntityAttribute[id,optionSetValue,name]]",
          },
        },
      });
      changeColumns(programTrackedEntityAttributes);
      return true;
    }
    changeColumns([]);
    return true;
  });
}

export function useProgramAttributes(program: string) {
  const engine = useDataEngine();
  return useQuery<any, Error>(["program-attributes", program], async () => {
    const { prog } = await engine.query({
      prog: {
        resource: `programs/${program}.json`,
        params: {
          fields:
            "selectIncidentDatesInFuture,selectEnrollmentDatesInFuture,incidentDateLabel,enrollmentDateLabel,programTrackedEntityAttributes[id,name,mandatory,valueType,displayInList,sortOrder,allowFutureDate,trackedEntityAttribute[id,name,generated,pattern,unique,valueType,orgunitScope,optionSetValue,displayFormName,optionSet[options[code,name]]]]",
        },
      },
    });
    return prog;
  });
}

export function useProgramStages(program: string) {
  const engine = useDataEngine();
  return useQuery<any, Error>(["program-stages", program], async () => {
    const { prog }: any = await engine.query({
      prog: {
        resource: `programs/${program}.json`,
        params: {
          fields: "programStages[id,name]",
        },
      },
    });
    return prog.programStages;
  });
}

export function useStage(stage: string) {
  const engine = useDataEngine();
  return useQuery<any, Error>(["stage", stage], async () => {
    const { stageData }: any = await engine.query({
      stageData: {
        resource: `programStages/${stage}.json`,
        params: {
          fields:
            "sortOrder,programStageDataElements[compulsory,dataElement[id,name,formName,optionSetValue,valueType,optionSet[options[code,name]]]]",
        },
      },
    });

    const processedColumns = stageData.programStageDataElements.map(
      (des: any) => {
        const {
          compulsory,
          dataElement: {
            id,
            formName,
            name,
            valueType,
            optionSetValue,
            optionSet,
          },
        } = des;
        let rule: any = {
          type: getRule(valueType),
          message: `Please Input ${formName || name}!`,
        };
        if (compulsory) {
          rule = { ...rule, required: true };
        }
        return {
          title: formName || name,
          dataIndex: id,
          key: id,
          editable: true,
          inputType: valueType,
          optionSetValue: optionSetValue,
          compulsory: compulsory,
          rules: [rule],
          options: optionSetValue ? optionSet.options : null,
        };
      }
    );
    const columns = [
      {
        title: "Registration Date",
        dataIndex: "eventDate",
        key: "eventDate",
        editable: true,
        inputType: "DATE",
        optionSetValue: false,
        compulsory: true,
        rules: [
          {
            required: true,
            type: "date",
            message: `Please Input event date!`,
          },
        ],
        options: null,
      },
      ...processedColumns,
    ];
    return { ...stageData, columns };
  });
}

export function useOptionSet(optionSet: string) {
  const engine = useDataEngine();
  return useQuery<any, Error>(
    ["optionSet", optionSet],
    async () => {
      const {
        optionSet: { options },
      }: any = await engine.query({
        optionSet: {
          resource: `optionSets/${optionSet}`,
          params: {
            fields: "options[id,code,name]",
          },
        },
      });
      return options;
    },
    {}
  );
}

export function useOption(code: string) {
  const engine = useDataEngine();
  return useQuery<any, Error>(
    ["option", code],
    async () => {
      if (code) {
        const {
          option: { options },
        }: any = await engine.query({
          option: {
            resource: "options",
            params: {
              fields: "name",
              filter: `code:eq:${code}`,
            },
          },
        });
        if (options.length === 1) {
          return options[0].name;
        }
      }
      return "";
    },
    {}
  );
}

export function useEventOptions(
  programStage: string,
  dataElements: string,
  dataElement: string = "",
  search: string = ""
) {
  const engine = useDataEngine();

  return useQuery<any, Error>(
    ["eventOptions", programStage, dataElement, search, dataElements],
    async () => {
      let params: any = {
        ouMode: "ALL",
        dataElement: `${dataElements}`,
        programStage,
      };
      if (!!search && !!dataElement) {
        params = {
          ...params,
          filter: `${dataElement}:IN:${search}`,
        };
      }
      const { events } = await engine.query({
        events: {
          resource: "events/query.json",
          params,
        },
      });
      return events;
    }
  );
}

export function useEvents(stage: string, tei: string, indicator: string = "") {
  const engine = useDataEngine();

  return useQuery<any, Error>(["events", stage, tei, indicator], async () => {
    let query: any = {
      events: {
        resource: "events.json",
        params: {
          programStage: stage,
          trackedEntityInstance: tei,
          fields: "*",
        },
      },
    };

    if (indicator) {
      query = {
        ...query,
        indicatorInfo: {
          resource: `events/${indicator}.json`,
          params: {
            programStage: stage,
            trackedEntityInstance: tei,
          },
        },
      };
    }
    const { events, ...others }: any = await engine.query(query);
    if (indicator) {
      const { indicatorInfo } = others;
      const de = indicatorInfo.dataValues.find(
        (dv: any) => dv.dataElement === "kToJ1rk0fwY"
      );
      return { ...events, title: de?.value };
    }
    return events;
  });
}

export function useUserUnits() {
  const engine = useDataEngine();
  const query = {
    me: {
      resource: "me.json",
      params: {
        fields: "organisationUnits[id,name,leaf]",
      },
    },
    events: {
      resource: "events/query.json",
      params: {
        ouMode: "ALL",
        dataElement: "kToJ1rk0fwY,kuVtv8R9n8q",
        programStage: "vPQxfsUQLEy",
      },
    },
    levels: {
      resource: "organisationUnitLevels",
      params: {
        fields: "id,name,level",
        order: "level:asc",
        paging: "false",
      },
    },
    options: {
      resource: "optionSets/uKIuogUIFgl",
      params: {
        fields: "options[id,code,name]",
      },
    },
    programs: {
      resource: "programs.json",
      params: {
        paging: false,
        fields: "id,name,trackedEntityType,withoutRegistration",
      },
    },
  };

  return useQuery<any, Error>(["initial data"], async () => {
    const {
      me: { organisationUnits },
      events: { headers, rows },
      options: { options },
      programs: { programs },
      levels: { organisationUnitLevels },
    }: any = await engine.query(query);
    const index = headers.findIndex(
      (header: any) => header.name === "kToJ1rk0fwY"
    );
    const groupIndex = headers.findIndex(
      (header: any) => header.name === "kuVtv8R9n8q"
    );
    const availableUnits = organisationUnits.map((unit: any) => {
      return {
        id: unit.id,
        pId: unit.pId || "",
        value: unit.id,
        title: unit.name,
        isLeaf: unit.leaf,
      };
    });
    const availablePrograms = programs.filter(
      (p: any) => !p.withoutRegistration
    );
    changeInitialUnits(availableUnits);
    changeOus(organisationUnits.map((ou: any) => ou.id));
    changeInitialPrograms(availablePrograms);
    changeIndicatorGroups(options);
    changeIndicatorGroup(options[0].code);
    changeIndicatorGroupIndex(groupIndex);
    changeOu(organisationUnits[0].id);
    changeIndicatorIndex(index);
    changeIndicators(rows);
    changeLevels(organisationUnitLevels);
    const currentIndicator = rows.find(
      (row: any) => row[groupIndex] === options[0].code
    );
    if (currentIndicator) {
      changeIndicator(currentIndicator[0]);
    }
    return [];
  });
}

export function useAnalyticsStructure(
  organisationUnits: string,
  periods: string
) {
  const engine = useDataEngine();
  const params = [
    {
      param: "dimension",
      value: `ou:${organisationUnits}`,
    },
    {
      param: "dimension",
      value: `pe:${periods}`,
    },
    {
      param: "skipData",
      value: true,
    },
  ];

  const allParams = params
    .map((s: any) => {
      return `${s.param}=${s.value}`;
    })
    .join("&");
  const query = {
    structure: {
      resource: `analytics.json?${allParams}`,
    },
  };

  return useQuery<any, Error>(
    ["analyticsStructure", ...organisationUnits, ...periods],
    async () => {
      const { structure }: any = await engine.query(query);
      return structure;
    }
  );
}

export function useAnalytics(
  program: string,
  searchParam: string,
  search: string,
  numeratorDataElement: string,
  denominatorDataElement: string,
  organisationUnits: string,
  periods: string,
  filterBy: string,
  aggregationType: string = "SUM",
  hierarchyMeta = false,
  showHierarchy = false
) {
  const engine = useDataEngine();

  let params = [
    {
      param: "aggregationType",
      value: aggregationType,
    },
    {
      param: `filter`,
      value: `${searchParam}:EQ:${search}`,
    },
    {
      param: "hierarchyMeta",
      value: hierarchyMeta,
    },
    {
      param: "showHierarchy",
      value: showHierarchy,
    },
  ];

  if (filterBy === "orgUnit") {
    params = [
      ...params,
      {
        param: "filter",
        value: `ou:${organisationUnits}`,
      },
    ];
  } else {
    params = [
      ...params,
      {
        param: "dimension",
        value: `ou:${organisationUnits}`,
      },
    ];
  }

  if (filterBy === "period") {
    params = [
      ...params,
      {
        param: "filter",
        value: `pe:${periods}`,
      },
    ];
  } else {
    params = [
      ...params,
      {
        param: "dimension",
        value: `pe:${periods}`,
      },
    ];
  }

  const numeratorProps = [
    ...params,
    {
      param: "value",
      value: numeratorDataElement,
    },
  ];

  const denominatorProps = [
    ...params,
    {
      param: "value",
      value: denominatorDataElement,
    },
  ];

  const numParams = numeratorProps
    .map((s: any) => {
      return `${s.param}=${s.value}`;
    })
    .join("&");
  const denParams = denominatorProps
    .map((s: any) => {
      return `${s.param}=${s.value}`;
    })
    .join("&");
  return useQuery<any, Error>(
    [
      "analytics",
      program,
      searchParam,
      search,
      numeratorDataElement,
      denominatorDataElement,
      organisationUnits,
      periods,
      filterBy,
      aggregationType,
    ],
    async () => {
      if (periods && organisationUnits) {
        const query = {
          numerator: {
            resource: `analytics/events/aggregate/${program}?${numParams}`,
          },
          denominator: {
            resource: `analytics/events/aggregate/${program}?${denParams}`,
          },
        };
        const { numerator, denominator }: any = await engine.query(query);
        if (filterBy === "period" || filterBy === "orgUnit") {
          const groupedNumerator = fromPairs(numerator.rows);
          const groupedDenominator = fromPairs(denominator.rows);
          const dimensions =
            filterBy === "period"
              ? numerator.metaData.dimensions.ou
              : numerator.metaData.dimensions.pe;

          const processed = dimensions.map((dimension: string) => {
            const num = groupedNumerator[dimension] || "-";
            const den = groupedDenominator[dimension] || "-";
            let ind = "-";
            if (den !== "-" && num !== "-") {
              ind = Number((Number(num) * 100) / Number(den)).toFixed(1);
            }
            return [
              dimension,
              {
                numerator: num,
                denominator: den,
                indicator: ind,
                display: numerator.metaData.items[dimension].name,
              },
            ];
          });
          return fromPairs(processed);
        } else {
          const groupedNumerator = fromPairs(
            numerator.rows.map((r: any[]) => [`${r[0]}${r[1]}`, r[2]])
          );
          const groupedDenominator = fromPairs(
            denominator.rows.map((r: any[]) => [`${r[0]}${r[1]}`, r[2]])
          );

          const ous = numerator.metaData.dimensions.ou.map((ou: string) => {
            return {
              id: ou,
              name: numerator.metaData.items[ou].name,
              level:
                String(numerator.metaData.ouHierarchy[ou]).split("/").length +
                2,
            };
          });

          const pes = numerator.metaData.dimensions.pe.map((pe: string) => {
            return {
              id: pe,
              name: numerator.metaData.items[pe].name,
            };
          });
          let all = [];
          for (const ou of numerator.metaData.dimensions.ou) {
            let obj = {};
            for (const pe of numerator.metaData.dimensions.pe) {
              const num = groupedNumerator[`${ou}${pe}`] || "-";
              const den = groupedDenominator[`${ou}${pe}`] || "-";
              let ind = "-";
              if (den === undefined || num === undefined) {
                ind = "-";
              } else if (den !== "-" && num !== "-") {
                ind = Number((Number(num) * 100) / Number(den)).toFixed(1);
              }
              obj = {
                ...obj,
                [pe]: { numerator: num, denominator: den, indicator: ind },
              };
            }
            all = [...all, [ou, obj]];
          }
          return {
            data: fromPairs(all),
            ous,
            pes,
          };
        }
      }
      return {
        data: {},
        ous: [],
        pes: [],
      };
    }
  );
}

export function useInstances(
  ou: string,
  program: string,
  page: number,
  pageSize: number
) {
  const engine = useDataEngine();
  return useQuery<any, Error>(
    ["tracked entity instances", ou, program, page, pageSize],
    async () => {
      if (program && ou) {
        const {
          instances: {
            headers,
            rows,
            metaData: {
              pager: { total },
            },
          },
        }: any = await engine.query({
          instances: {
            resource: "trackedEntityInstances/query.json",
            params: {
              page,
              program,
              totalPages: true,
              pageSize,
              ou,
            },
          },
        });
        changeTotal(total);
        return rows.map((r: string[]) => {
          return fromPairs(
            headers.map(({ name }: any, i: number) => [name, r[i]])
          );
        });
      }
      return [];
    }
  );
}

export function useEventAndOption(
  event: string,
  programStage: string,
  dataElement: string
) {
  const engine = useDataEngine();
  return useQuery<any, Error>(
    ["events", event, programStage, dataElement],
    async () => {
      const {
        events: { headers, rows },
      }: any = await engine.query({
        events: {
          resource: "events/query.json",
          params: {
            programStage,
            event,
            dataElement,
          },
        },
      });
      const index = headers.findIndex(
        (column: any) => column.name === dataElement
      );
      if (rows.length > 0 && index !== -1) {
        return rows[0][index];
      }
      return "";
    }
  );
}
