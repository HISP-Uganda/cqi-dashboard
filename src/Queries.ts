import { useDataEngine } from "@dhis2/app-runtime";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { chunk, fromPairs, groupBy, orderBy, set, setWith, uniq } from "lodash";
import { Subject } from "rxjs";

const subject = new Subject<number>();

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});

import { db } from "./db";
import {
  changeAnalyticsPeriods,
  changeColumns,
  changeIndicatorGroups,
  changeIndicators,
  changeInitialPrograms,
  changeLevels,
  changeOu,
  changeOus,
  changeTotal,
} from "./Events";
import { Column, Project } from "./interfaces";
import { convertParent } from "./utils";
import { getRule } from "./utils/common";

export const makeSQLQuery = async (
  engine: any,
  id: string,
  query: string,
  name: string
) => {
  const sqlQuery = {
    description: name,
    type: "QUERY",
    id,
    sqlQuery: query,
    sharing: {
      public: "rwrw----",
    },
    name,
    cacheStrategy: "NO_CACHE",
  };

  const mutation: any = {
    type: "create",
    resource: `metadata`,
    data: { sqlViews: [sqlQuery] },
  };
  await engine.mutate(mutation);
};

export const generateOuCountData = async ({
  program,
  indicator,
  period,
  unit,
  level,
  engine,
}: Partial<{
  program: string;
  indicator: any[];
  unit: string;
  level: string;
  period: string[];
  engine: any;
}>) => {
  if (program && unit && period && period.length > 0) {
    let dimensions: string[] = [
      "dimension=eZrfD4QnQfl",
      "dimension=kHRn35W3Gq4",
    ];

    let ous: string[] = [unit];
    if (level) {
      ous = [...ous, `LEVEL-${level}`];
    }
    dimensions = [...dimensions, `dimension=ou:${ous.join(";")}`];

    const finalData: {
      [key: string]: {
        [key: string]: {
          total: number;
          completed: number;
          running: number;
        };
      };
    } = {};

    for (const currentIndicators of chunk(indicator, 25)) {
      const queries = fromPairs(
        period.map((p) => [
          p,
          {
            resource: `analytics/enrollments/query/${program}?${[
              ...dimensions,
              ...[
                `filter=kHRn35W3Gq4:IN:${currentIndicators
                  ?.map((i) => i.event)
                  .join(";")}`,
                `filter=pe:${p}`,
              ],
            ].join("&")}`,
          },
        ])
      );

      const data: any = await engine.query(queries);

      for (const [key, { headers, rows }] of Object.entries<any>(data)) {
        const ouIndex = headers.findIndex(
          (header: any) => header.name === "ou"
        );
        const completeIndex = headers.findIndex(
          (header: any) => header.name === "eZrfD4QnQfl"
        );
        const indicatorIndex = headers.findIndex(
          (header: any) => header.name === "kHRn35W3Gq4"
        );
        const groupedData = groupBy(rows, (r) => r[indicatorIndex]);

        for (const [i, currentRows] of Object.entries(groupedData)) {
          const total = uniq(
            currentRows.map((row: string[]) => row[ouIndex])
          ).length;
          const completed = uniq(
            currentRows
              .filter((row: string[]) => row[completeIndex] === "1")
              .map((row: string[]) => row[ouIndex])
          ).length;

          set(finalData, `${i}.pe${key}`, {
            total,
            completed,
            running: total - completed,
          });
        }
      }
    }
    return finalData;
  }
  return {};
};

export const useCountFacilities = ({
  program,
  indicator,
  period,
  unit,
  level,
}: Partial<{
  program: string;
  indicator: any[];
  unit: string;
  level: string;
  period: string[];
}>) => {
  const engine = useDataEngine();
  return useQuery<any, Error>(
    ["count-facilities", program, indicator, period, unit, level],
    async () => {
      return generateOuCountData({
        program,
        indicator,
        period,
        unit,
        level,
        engine,
      });
    }
  );
};

export const getDataByProjects = async ({
  period,
  unit,
  indicator,
  indicatorGroup,
  level,
  program,
  engine,
}: {
  period: string;
  indicator?: string;
  indicatorGroup?: string;
  unit: string;
  level?: string;
  program: string;
  engine: any;
}) => {
  let dimensions: string[] = [
    `dimension=pe:${period}`,
    "dimension=eZrfD4QnQfl",
  ];

  let ous: string[] = [unit];
  let filters: string[] = [];
  if (indicatorGroup && indicator) {
    filters = [...filters, `filter=kHRn35W3Gq4:EQ:${indicator}`];
  } else if (indicatorGroup) {
    filters = [...filters, `filter=TG1QzFgGTex:EQ:${indicatorGroup}`];
  }
  if (level) {
    ous = [...ous, `LEVEL-${level}`];
  }
  dimensions = [...dimensions, `dimension=ou:${ous.join(";")}`];

  const {
    data: { rows },
  }: any = await engine.query({
    data: {
      resource: `analytics/events/aggregate/${program}?${[
        ...dimensions,
        ...filters,
        "showHierarchy=true",
        "outputType=TRACKED_ENTITY_INSTANCE",
      ].join("&")}`,
    },
  });

  let obj = {};
  for (const row of rows) {
    const k = row
      .slice(0, row.length - 1)
      .map((a: string) => {
        if (a) {
          return `[${a}]`;
        }
        return "[0]";
      })
      .join("");
    setWith(obj, k, row[row.length - 1], Object);
  }
  return obj;
};

export const useSQLViewMetadata = ({
  program,
  indicator,
  indicatorGroup,
  period,
  unit,
  level,
  periodType,
}: Partial<{
  program: string;
  id: string;
  indicator: string;
  unit: string;
  indicatorGroup: string;
  level: string;
  period: string;
  periodType: string;
}>) => {
  const engine = useDataEngine();
  return useQuery<any, Error>(
    [
      "sql-view-metadata",
      program,
      indicator,
      indicatorGroup,
      period,
      unit,
      level,
      periodType,
    ],
    async () => {
      if (program && unit && period) {
        const data = await getDataByProjects({
          program,
          indicator,
          indicatorGroup,
          period,
          unit,
          level,
          engine,
        });
        return data;
      }
      return {};
    }
  );
};

export function usePrograms() {
  const engine = useDataEngine();
  return useQuery<any, Error>(
    ["programs"],
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
      changeColumns([
        {
          id: "ouPath",
          displayInList: true,
          trackedEntityAttribute: {
            id: "path",
            name: "Organisation Path",
            optionSetValue: false,
          },
        },
        ...programTrackedEntityAttributes,
      ]);
      return true;
    }
    changeColumns([]);
    return true;
  });
}

export function useProgramAttributes(
  program: string,
  tei: string,
  isNew: boolean
) {
  const engine = useDataEngine();
  return useQuery<{ program: any; instance: any }, Error>(
    ["program-attributes", program, tei, isNew],
    async () => {
      let queries: { [k: string]: any } = {
        prog: {
          resource: `programs/${program}.json`,
          params: {
            fields:
              "selectIncidentDatesInFuture,selectEnrollmentDatesInFuture,incidentDateLabel,enrollmentDateLabel,programTrackedEntityAttributes[id,name,mandatory,valueType,displayInList,sortOrder,allowFutureDate,trackedEntityAttribute[id,name,generated,pattern,unique,valueType,orgunitScope,optionSetValue,displayFormName,optionSet[options[code,name]]]]",
          },
        },
      };

      if (!isNew && tei) {
        queries = {
          ...queries,
          instance: {
            resource: "trackedEntityInstances/query.json",
            params: { trackedEntityInstance: tei, program },
          },
        };
      }
      let { prog, instance }: any = await engine.query(queries);
      const all = fromPairs<{
        valueType: string;
        optionSetValue: boolean;
        options: Array<{ code: string; name: string }>;
      }>(
        prog.programTrackedEntityAttributes.map(
          ({
            trackedEntityAttribute: {
              id,
              valueType,
              optionSetValue,
              optionSet,
            },
          }: any) => [
            id,
            {
              valueType,
              optionSetValue,
              options: optionSetValue ? optionSet.options : [],
            },
          ]
        )
      );

      if (instance) {
        const { rows, headers } = instance;
        const obj: any[] = rows.map((r: string[]) => {
          return fromPairs(
            headers.map(({ name }: any, i: number) => {
              if (
                all[name]?.valueType === "DATE" ||
                all[name]?.valueType === "DATETIME"
              ) {
                return [name, dayjs(r[i])];
              }
              if (all[name]?.optionSetValue) {
                console.log(r[i]);
                const val = all[name].options.find((a) => a.code === r[i]);
                if (val) {
                  return [name, { label: val.name, value: val.code }];
                }
              }
              return [name, r[i]];
            })
          );
        });

        return { program: prog, instance: obj[0] };
      }
      return { program: prog, instance: {} };
    }
  );
}

export function useProgramStages(program: string, tei: string) {
  const engine = useDataEngine();
  return useQuery<
    {
      programStages: any[];
      stageData: { [key: string]: any[] };
      project: Partial<Project>;
    },
    Error
  >(["program-stages", program, tei], async () => {
    const {
      prog: { programStages },
      trackedEntityInstance: {
        enrollments,
        attributes,
        orgUnit,
        trackedEntityInstance,
        ...rest
      },
    }: any = await engine.query({
      prog: {
        resource: `programs/${program}.json`,
        params: {
          fields: "programStages[id,name]",
        },
      },
      trackedEntityInstance: {
        resource: `trackedEntityInstances/${tei}`,
        params: {
          fields: "*",
          program,
        },
      },
    });
    const stageData = groupBy(
      enrollments.flatMap(({ events }: any) => events),
      "programStage"
    );
    const project: Partial<Project> = fromPairs([
      ...attributes.map(({ attribute, value }: any) => [attribute, value]),
      ["ou", orgUnit],
      ["instance", trackedEntityInstance],
    ]);
    return {
      programStages,
      stageData,
      project,
    };
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
        const column: Column = {
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
        return column;
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

  return useQuery<any[], Error>(
    ["eventOptions", programStage, dataElement, search, dataElements],
    async () => {
      let params: any = {
        ouMode: "ALL",
        dataElement: `${dataElements}`,
        programStage,
        skipPaging: "true",
      };
      if (!!search && !!dataElement) {
        params = {
          ...params,
          filter: `${dataElement}:IN:${search}`,
          skipPaging: "true",
        };
      }
      const {
        events: { headers, rows },
      }: any = await engine.query({
        events: {
          resource: "events/query.json",
          params,
        },
      });

      return rows.map((row: string[]) => {
        return fromPairs(row.map((r, index) => [headers[index].name, r]));
      });
    }
  );
}

export async function fetchTrackedEntityInstance(engine: any, tei: string) {
  let query: any = {
    trackedEntityInstance: {
      resource: `trackedEntityInstances/${tei}.json`,
      params: {
        fields: "*",
      },
    },
  };
  const { trackedEntityInstance }: any = await engine.query(query);
  return trackedEntityInstance;
}

export async function useTrackedEntityInstance(tei: string) {
  const engine = useDataEngine();
  return useQuery<any, Error>(["tracked entity instances", tei], async () => {
    return fetchTrackedEntityInstance(engine, tei);
  });
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

const fetchOrganisations = async (engine: any) => {
  let allOrganisationUnits: any[] = [];

  let total = 1;
  let page = 0;

  do {
    const {
      units: { organisationUnits },
    }: any = await engine.query({
      units: {
        resource: "organisationUnits.json",
        params: {
          fields: "id,name,leaf,path,parent",
          withinUserHierarchy: "true",
          pageSize: 500,
          page: ++page,
        },
      },
    });
    total = organisationUnits.length;
    allOrganisationUnits = allOrganisationUnits.concat(organisationUnits);
    subject.next(page);
  } while (total > 1);
  return allOrganisationUnits;
};

export function useUserUnits() {
  const engine = useDataEngine();
  const query = {
    me: {
      resource: "me.json",
      params: {
        fields:
          "organisationUnits[id,name],teiSearchOrganisationUnits,dataViewOrganisationUnits",
      },
    },

    events: {
      resource: "events/query.json",
      params: {
        ouMode: "ALL",
        programStage: "vPQxfsUQLEy",
        includeAllDataElements: "true",
        skipPaging: "true",
      },
    },
    levels: {
      resource: "organisationUnitLevels",
      params: {
        fields: "id,name,level",
        order: "level:asc",
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

  return useQuery<{ searchOu: string; orgUnitName: string }, Error>(
    ["initial data"],
    async () => {
      const {
        me: { organisationUnits },
        events: { headers, rows },
        options: { options },
        programs: { programs },
        levels: { organisationUnitLevels },
      }: any = await engine.query(query);

      const indicators = rows.map((row: string[]) => {
        return fromPairs(row.map((r, index) => [headers[index].name, r]));
      });

      const units = await db.organisations.count();
      if (units === 0) {
        const units = await fetchOrganisations(engine);
        await db.organisations.bulkPut(units);
      }
      const availablePrograms = programs.filter(
        (p: any) => !p.withoutRegistration
      );
      changeOus(organisationUnits.map((ou: any) => ou.id));
      changeInitialPrograms(availablePrograms);
      changeIndicatorGroups(options);
      // changeIndicatorGroup(options[0].code);
      changeOu(organisationUnits[0].id);
      changeIndicators(indicators);
      changeLevels(organisationUnitLevels);
      const currentIndicator = indicators.find(
        (row: any) => row.kuVtv8R9n8q === options[0].code
      );
      if (currentIndicator) {
        // changeIndicator(currentIndicator.event);
      }
      return {
        searchOu: organisationUnits?.[0].id || "",
        orgUnitName: organisationUnits?.[0].name,
      };
    }
  );
}

export const getNalyticsStructure = async (
  engine: any,
  periods: string,
  organisationUnits: string
) => {
  let params = [
    {
      param: "dimension",
      value: `pe:${periods}`,
    },
    {
      param: "skipData",
      value: true,
    },
  ];

  if (organisationUnits) {
    params = [
      {
        param: "dimension",
        value: `ou:${organisationUnits}`,
      },
      ...params,
    ];
  }

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

  const { structure }: any = await engine.query(query);
  return structure;
};

export function useAnalyticsStructure(
  periods: string,
  organisationUnits?: string
) {
  const engine = useDataEngine();

  return useQuery<any, Error>(
    ["analyticsStructure", organisationUnits, periods],
    async () => {
      if (organisationUnits && periods) {
        const structure = await getNalyticsStructure(
          engine,
          periods,
          organisationUnits
        );
        changeAnalyticsPeriods(structure.metaData.dimensions.pe);
        return structure;
      }
      return { metaData: { dimensions: { ou: [], pe: [] } } };
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
      param: "hierarchyMeta",
      value: hierarchyMeta,
    },
    {
      param: "showHierarchy",
      value: showHierarchy,
    },
  ];

  if (search) {
    params = [
      ...params,
      {
        param: `filter`,
        value: `${searchParam}:EQ:${search}`,
      },
    ];
  }

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
              const d = Number(den);
              const n = Number(num);
              if (d !== 0) {
                ind = Number((n * 100) / d).toFixed(1);
              } else {
                ind = "0";
              }
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
          let all: any[] = [];
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
                [pe]: {
                  numerator: num,
                  denominator: den,
                  indicator: ind,
                },
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

export const fetchInstances = async (
  engine: any,
  search: Partial<{
    ou: string;
    program: string;
    page: number;
    pageSize: number;
    ouMode: string;
    programStartDate: string;
    programEndDate: string;
    trackedEntityType: string;
    query: string;
    onlyCompleted: boolean;
  }>
) => {
  const { ou, program, trackedEntityType, query, ...rest } = search;

  if ((ou && program) || (ou && trackedEntityType)) {
    let params: { [key: string]: any } = rest;

    if (program) {
      params = { ...params, ou, program, totalPages: true };
    } else if (trackedEntityType) {
      params = {
        ...params,
        ou,
        trackedEntityType,
        totalPages: true,
      };
    }
    if (query) {
      params = { ...params, query: `LIKE:${query}` };
    }

    if (search.onlyCompleted) {
      params = { ...params, filter: `eZrfD4QnQfl:eq:true` };
    }
    const {
      instances: {
        trackedEntityInstances,
        pager: { total },
      },
    }: any = await engine.query({
      instances: {
        resource: "trackedEntityInstances",
        params: { ...params, fields: "*" },
      },
    });

    const allOrganizations = uniq(
      trackedEntityInstances.map(({ orgUnit }: any) => orgUnit)
    );
    const {
      data: { organisationUnits },
    } = await engine.query({
      data: {
        resource: "organisationUnits.json",
        params: {
          filter: `id:in:[${allOrganizations.join(",")}]`,
          fields:
            "id,name,parent[id,name,parent[id,name,parent[id,name,parent[id,name]]]]",
        },
      },
    });

    const facilities = fromPairs(
      organisationUnits.map(({ id, name, parent }: any) => {
        return [id, [name, ...convertParent(parent, [])].reverse().join("/")];
      })
    );

    changeTotal(total);
    return trackedEntityInstances.map(({ attributes, ...rest }: any) => {
      const currentAttributes = fromPairs(
        attributes.map(({ attribute, value }: any) => [attribute, value])
      );
      const events = rest.enrollments.flatMap(({ events }: any) => {
        return events.flatMap(({ dataValues, eventDate, ...e }: any) => {
          if (e.programStage === "eB7oMPVRytu") {
            return {
              eventDate,
              ...fromPairs(
                dataValues.map(({ dataElement, value }: any) => [
                  dataElement,
                  value,
                ])
              ),
            };
          }
          return [];
        });
      });
      return {
        ...rest,
        ...currentAttributes,
        path: facilities[rest.orgUnit],
        events: orderBy(events, "eventDate"),
      };
    });
  }
  return [];
};

export function useInstances(
  search: Partial<{
    ou: string;
    program: string;
    page: number;
    pageSize: number;
    ouMode: string;
    programStartDate: string;
    programEndDate: string;
    trackedEntityType: string;
  }>
) {
  const engine = useDataEngine();
  return useQuery<any, Error>(
    ["tracked entity instances", ...Object.values(search)],
    async () => {
      return fetchInstances(engine, search);
    }
  );
}

export function useEventAndOption(event: string, programStage: string) {
  const engine = useDataEngine();
  return useQuery<any, Error>(["events", event, programStage], async () => {
    const {
      events: { headers, rows },
    }: any = await engine.query({
      events: {
        resource: "events/query.json",
        params: {
          programStage,
          event,
          includeAllDataElements: true,
        },
      },
    });

    const all = rows.map((row: string[]) =>
      fromPairs(row.map((r, index) => [headers[index].name, r]))
    );
    return all[0];
  });
}
export function useEvent(programStage: string, event?: string) {
  const engine = useDataEngine();
  return useQuery<any, Error>(["events", event, programStage], async () => {
    if (event) {
      const {
        events: { headers, rows },
      }: any = await engine.query({
        events: {
          resource: "events/query.json",
          params: {
            programStage,
            event,
            includeAllDataElements: "true",
          },
        },
      });

      const processed = rows.map((row: string[]) =>
        fromPairs(row.map((r, i) => [headers[i].name, r]))
      );
      if (processed.length > 0) {
        return processed[0];
      }
    }
    return {};
  });
}
