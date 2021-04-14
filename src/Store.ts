import { subMonths } from 'date-fns'

import { dashboardsDomain } from './Domains';
import {
  changeIndicator,
  changeIndicatorGroup,
  changePeriod,
  changeUrl
} from "./Events";
import { Store } from './types';

export const dashboards = dashboardsDomain.createStore<Store>({ url: '', indicator: '', ou: [], indicatorGroup: '', period: ['LAST_3_MONTHS'] })
  .on(changeIndicator, (state, indicator: string) => {
    return { ...state, indicator }
  })
  .on(changeIndicatorGroup, (state, indicatorGroup: string) => {
    return { ...state, indicatorGroup }
  })
  .on(changePeriod, (state, period: any[]) => {
    return { ...state, period }
  })
  .on(changeUrl, (state, url: string) => {
    return { ...state, url }
  });


