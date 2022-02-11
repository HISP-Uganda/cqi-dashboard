export interface Project {
  startDate?: string;
  endDate?: string;
  frequency?: string;
  indicator?: string;
}
export interface Store {
  loading: boolean;
  url: string;
  indicator: string;
  indicatorGroup: string;
  indicatorGroups: any[];
  period: any[];
  filterBy: string;
  ou: string;
  ous: any[];
  total: number;
  columns: string[];
  program: string;
  trackedEntityType: string;
  indicators: any[];
  indicatorIndex?: number;
  indicatorGroupIndex?: number;
  project: Project;
  organisations: any[];
  programs: any[];
  dataEntryPage: string;
  programEntity: string;
  instance: string;
  level: string;
  levels: any[];
}
export interface ColumnProps {
  id: string;
  value: boolean;
}
