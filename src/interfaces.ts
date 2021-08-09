export interface Store {
  loading: boolean;
  url: string;
  indicator: string;
  indicatorGroup: string;
  indicatorGroups: any[];
  period: any[];
  filterBy: string;
  ou: any[];
  indicators: any[];
  indicatorIndex?: number;
  indicatorGroupIndex?: number;
  currentProjectStartDate?: string;
  currentProjectEndDate?: string;
  currentProjectFrequency?: string;
}


export interface ProgramSetting {
  program: string;
}