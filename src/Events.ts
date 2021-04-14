import { dashboardsDomain } from './Domains';
export const changePeriod = dashboardsDomain.createEvent<any[]>("change period");
export const changeIndicator = dashboardsDomain.createEvent<string>('set current indicator');
export const changeIndicatorGroup = dashboardsDomain.createEvent<string>('set current indicator group');
export const changeUrl = dashboardsDomain.createEvent<string>('url');
export const changeOu = dashboardsDomain.createEvent<any[]>("change ou");
