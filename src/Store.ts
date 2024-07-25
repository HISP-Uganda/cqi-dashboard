import { domain } from "./Domains";
import {
  changeProject,
  changeFilterBy,
  changeIndicator,
  changeIndicatorGroup,
  changeIndicatorGroupIndex,
  changeIndicatorGroups,
  changeIndicatorIndex,
  changeIndicators,
  changeOu,
  changeProgram,
  changeTrackedEntityType,
  changePeriod,
  changeUrl,
  changeColumns,
  changeTotal,
  addRemoveColumn,
  changeInitialPrograms,
  changeInitialUnits,
  changeDataEntryPage,
  changeProgramEntity,
  changeInstance,
  changeOus,
  changeLevels,
  changeLevel,
  addIndicator,
  changeAttribute,
  toggleCount,
  changeAnalyticsPeriods,
} from "./Events";
import { Period, Store } from "./interfaces";

export const dashboards = domain
  .createStore<Store>({
    url: "/",
    filterBy: "orgUnit",
    indicator: undefined,
    ou: "",
    ous: [],
    indicatorGroup: undefined,
    indicatorGroups: [],
    program: "vMfIVFcRWlu",
    trackedEntityType: "KSy4dEvpMWi",
    indicators: [],
    period: [
      {
        value: "THIS_YEAR",
        label: "This year",
        type: "relative",
      },
      {
        value: "LAST_YEAR",
        label: "Last year",
        type: "relative",
      },
    ],
    loading: false,
    columns: [],
    organisations: [],
    programs: [],
    total: 0,
    dataEntryPage: "list",
    programEntity: "KSy4dEvpMWi,vMfIVFcRWlu",
    instance: "",
    project: {},
    level: "",
    levels: [],
    descendants: [],
    indicatorIndex: -1,
    indicatorGroupIndex: -1,
    relativePeriodType: "YEARLY",
    fixedPeriodType: "MONTHLY",
    countUnits: false,
  })
  .on(changeIndicator, (state, indicator: string | undefined) => {
    return { ...state, indicator };
  })
  .on(changeIndicatorGroup, (state, indicatorGroup: string | undefined) => {
    if (indicatorGroup) {
      return { ...state, indicatorGroup };
    }
  })
  .on(changePeriod, (state, period: Period[]) => {
    return { ...state, period };
  })
  .on(changeOu, (state, ou) => {
    return { ...state, ou };
  })
  .on(changeOus, (state, ous) => {
    return { ...state, ous };
  })
  .on(changeUrl, (state, url: string) => {
    return { ...state, url };
  })
  .on(changeFilterBy, (state, filterBy: string) => {
    return { ...state, filterBy };
  })
  .on(changeIndicators, (state, indicators: any[]) => {
    return { ...state, indicators };
  })
  .on(changeIndicatorIndex, (state, indicatorIndex: number) => {
    return { ...state, indicatorIndex };
  })
  .on(changeIndicatorGroupIndex, (state, indicatorGroupIndex: number) => {
    return { ...state, indicatorGroupIndex };
  })
  .on(changeIndicatorGroups, (state, indicatorGroups: any[]) => {
    return { ...state, indicatorGroups };
  })
  .on(changeProject, (state, project) => {
    return {
      ...state,
      project,
    };
  })
  .on(changeProgram, (state, program) => {
    return {
      ...state,
      program,
    };
  })
  .on(changeTrackedEntityType, (state, trackedEntityType) => {
    return {
      ...state,
      trackedEntityType,
    };
  })
  .on(changeColumns, (state, columns) => {
    return {
      ...state,
      columns,
    };
  })
  .on(changeTotal, (state, total) => {
    return {
      ...state,
      total,
    };
  })
  .on(addRemoveColumn, (state, { id, value }) => {
    const columns = state.columns.map((column: any) => {
      if (id === column.trackedEntityAttribute.id) {
        return { ...column, displayInList: value };
      }
      return column;
    });
    return {
      ...state,
      columns,
    };
  })
  .on(changeInitialPrograms, (state, programs) => {
    return {
      ...state,
      programs,
    };
  })
  .on(changeInitialUnits, (state, organisations) => {
    return {
      ...state,
      organisations,
    };
  })
  .on(changeDataEntryPage, (state, dataEntryPage) => {
    return {
      ...state,
      dataEntryPage,
    };
  })
  .on(changeProgramEntity, (state, programEntity) => {
    return {
      ...state,
      programEntity,
    };
  })
  .on(changeInstance, (state, instance) => {
    return {
      ...state,
      instance,
    };
  })
  .on(changeLevels, (state, levels) => {
    return {
      ...state,
      levels,
    };
  })
  .on(changeLevel, (state, level) => {
    return {
      ...state,
      level,
    };
  })
  .on(
    changeAttribute,
    (state, { attribute, value }: { attribute: keyof Store; value: any }) => {
      return { ...state, [attribute]: value };
    }
  )
  .on(toggleCount, (state) => ({ ...state, countUnits: !state.countUnits }));

export const orgUnits = dashboards.map((state) => {
  if (state.level) {
    return `${state.ous.join(";")};${state.level}`;
  }
  return state.ous.join(";");
});

export const maxLevel = dashboards.map((state) => {
  if (state.ou.length > 0) {
    const ou: any = state.ou[state.ou.length - 1];
    return String(ou.path).split("/").length;
  }
  return 2;
});

export const periods = dashboards.map((state) => {
  return state.period.map((p: Period) => p.value).join(";");
});

export const allIndicators = dashboards.map((state) => {
  if (
    state.indicators &&
    state.indicatorIndex !== undefined &&
    state.indicatorIndex !== -1
  ) {
    return state.indicators.map((row: any[]) => [
      row[0],
      row[state.indicatorIndex],
    ]);
  }
  return [];
});

export const currentIndicator = dashboards.map((state) => {
  const indic = state.indicators.find((row: any) => row[0] === state.indicator);
  if (indic && state.indicatorIndex) {
    return indic[state.indicatorIndex];
  }
  return "";
});

export const indicatorForGroup = dashboards
  .map((state) => {
    return state.indicators.filter(
      (row: any) => row.kuVtv8R9n8q === state.indicatorGroup
    );
  })
  .on(addIndicator, (state, indicator) => {
    return [...state, indicator];
  });

export const $withOptionSet = dashboards.map((state) => {
  return state.columns
    .filter((column: any) => column.trackedEntityAttribute.optionSetValue)
    .map((column: any) => column.trackedEntityAttribute.id);
});

export const $selectedIndicators = dashboards.map((state) => {
  return state.indicators.filter((x) => {
    return state.indicatorGroup?.split(",").indexOf(x["kuVtv8R9n8q"]) !== -1;
  });
});

export const $availableIndicators = dashboards.map((state) => {
  if (state.indicatorGroup) {
    return state.indicators.filter(
      (row: any) => row.kuVtv8R9n8q === state.indicatorGroup
    );
  }
  return state.indicators;
});

export const $analyticsPeriods = domain
  .createStore<string[]>([])
  .on(changeAnalyticsPeriods, (_, payload) => payload);
