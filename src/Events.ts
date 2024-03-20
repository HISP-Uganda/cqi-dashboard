import { domain } from "./Domains";
import { ColumnProps, Project, Store } from "./interfaces";
export const changePeriod = domain.createEvent<any[]>();
export const changeIndicator = domain.createEvent<string | undefined>();
export const changeIndicatorGroup = domain.createEvent<string | undefined>();
export const changeUrl = domain.createEvent<string>();
export const changeDataEntryPage = domain.createEvent<string>();
export const changeProgramEntity = domain.createEvent<string>();
export const changeFilterBy = domain.createEvent<string>();
export const changeOu = domain.createEvent<string>();
export const changeProgram = domain.createEvent<string>();
export const changeTrackedEntityType = domain.createEvent<string>();
export const changeIndicators = domain.createEvent<any[]>();
export const changeIndicatorGroups = domain.createEvent<any[]>();
export const changeIndicatorIndex = domain.createEvent<number>();
export const changeIndicatorGroupIndex = domain.createEvent<number>();
export const changeProject = domain.createEvent<Partial<Project>>();
export const addRemoveColumn = domain.createEvent<ColumnProps>();
export const changeColumns = domain.createEvent<any[]>();
export const changeTotal = domain.createEvent<number>();
export const changeInitialUnits = domain.createEvent<any[]>();
export const changeInitialPrograms = domain.createEvent<any[]>();
export const changeInstance = domain.createEvent<string>();
export const changeOus = domain.createEvent<any>();
export const changeLevels = domain.createEvent<any[]>();
export const changeLevel = domain.createEvent<string>();
export const addIndicator = domain.createEvent<any>();
export const changeAttribute = domain.createEvent<{
    attribute: keyof Store;
    value: any;
}>();

export const toggleCount = domain.createEvent<void>();

export const changeAnalyticsPeriods = domain.createEvent<string[]>();
