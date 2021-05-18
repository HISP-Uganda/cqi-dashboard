import { dashboardsDomain } from './Domains';
export const changePeriod = dashboardsDomain.createEvent<any[]>("change period");
export const changeIndicator = dashboardsDomain.createEvent<string>('set current indicator');
export const changeIndicatorGroup = dashboardsDomain.createEvent<string>('set current indicator group');
export const changeUrl = dashboardsDomain.createEvent<string>('url');
export const changeFilterBy = dashboardsDomain.createEvent<string>('filterBy');
export const changeOu = dashboardsDomain.createEvent<any[]>("change ou");
export const changeIndicators = dashboardsDomain.createEvent<any[]>('change current indicators')
export const changeIndicatorGroups = dashboardsDomain.createEvent<any[]>('change current indicators groups')
export const changeIndicatorIndex = dashboardsDomain.createEvent<number>('change current indicators index')
export const changeIndicatorGroupIndex = dashboardsDomain.createEvent<number>('change current indicator group index')
export const changeCurrentProject = dashboardsDomain.createEvent<[string, string, string]>('change current indicator group index')
