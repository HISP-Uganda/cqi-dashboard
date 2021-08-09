import { dashboardsDomain } from './Domains';
import {
  changeCurrentProject,
  changeFilterBy,
  changeIndicator,
  changeIndicatorGroup,
  changeIndicatorGroupIndex,
  changeIndicatorGroups,
  changeIndicatorIndex,
  changeIndicators,
  changeOu,
  changePeriod,
  changeUrl
} from "./Events";
import { Store } from './interfaces';

export const dashboards = dashboardsDomain.createStore<Store>({
  url: '/analytics',
  filterBy: 'period',
  indicator: '',
  ou: [],
  indicatorGroup: '',
  indicatorGroups: [],
  indicators: [],
  period: [{ id: "LAST_3_MONTHS", name: "Last 3 months" }],
  loading: false
})
  .on(changeIndicator, (state, indicator: string) => {
    return { ...state, indicator }
  })
  .on(changeIndicatorGroup, (state, indicatorGroup: string) => {
    return { ...state, indicatorGroup }
  })
  .on(changePeriod, (state, period: any[]) => {
    return { ...state, period }
  })
  .on(changeOu, (state, ou: any[]) => {
    return { ...state, ou }
  })
  .on(changeUrl, (state, url: string) => {
    return { ...state, url }
  })
  .on(changeFilterBy, (state, filterBy: string) => {
    return { ...state, filterBy }
  })
  .on(changeIndicators, (state, indicators: any[]) => {
    return { ...state, indicators }
  })
  .on(changeIndicatorIndex, (state, indicatorIndex: number) => {
    return { ...state, indicatorIndex }
  })
  .on(changeIndicatorGroupIndex, (state, indicatorGroupIndex: number) => {
    return { ...state, indicatorGroupIndex }
  })
  .on(changeIndicatorGroups, (state, indicatorGroups: any[]) => {
    return { ...state, indicatorGroups }
  }).on(changeCurrentProject, (state, data: [string, string, string]) => {
    const [currentProjectStartDate, currentProjectEndDate, currentProjectFrequency] = data;
    return { ...state, currentProjectStartDate, currentProjectEndDate, currentProjectFrequency }
  });

export const orgUnits = dashboards.map((state) => {
  return state.ou.map((o: any) => {
    return o.id
  }).join(';')
});

export const maxLevel = dashboards.map((state) => {
  if (state.ou.length > 0) {
    const ou = state.ou[state.ou.length - 1]
    return String(ou.path).split('/').length
  }
  return 2
});

export const periods = dashboards.map((state) => {
  return state.period.map((p: any) => p.id).join(';')
});


export const allIndicators = dashboards.map((state) => {
  if (state.indicators && state.indicatorIndex && state.indicatorIndex !== -1) {
    return state.indicators.map((row: any) => [row[0], row[state.indicatorIndex]])
  }
  return []
});

export const currentIndicator = dashboards.map((state) => {
  const indic = state.indicators.find((row: any) => row[0] === state.indicator);
  if (indic) {
    return indic[state.indicatorIndex];
  }
  return "";
});

export const indicatorForGroup = dashboards.map((state) => {
  if (state.indicators && state.indicatorGroupIndex && state.indicatorGroupIndex !== -1) {
    return state.indicators.filter((row: any) => row[state.indicatorGroupIndex] === state.indicatorGroup).map((row: any) => [row[0], row[state.indicatorIndex]])
  }
  return []
});
