import { changeTrackedEntityType } from "./Events";
// export interface Project {
//   startDate?: string;
//   endDate?: string;
//   frequency?: string;
//   indicator?: string;
//   orgUnit?: string;

import { MakeGenerics } from "@tanstack/react-location";
import { OptionBase } from "chakra-react-select";
import { fixedPeriods } from "./utils";

// }
export interface Store {
    loading: boolean;
    url: string;
    indicator: string;
    indicatorGroup: string;
    indicatorGroups: any[];
    period: Period[];
    filterBy: string;
    ou: string;
    ous: any[];
    total: number;
    columns: string[];
    program: string;
    trackedEntityType: string;
    indicators: any[];
    indicatorIndex: number;
    indicatorGroupIndex: number;
    project: Partial<Project>;
    organisations: any[];
    programs: any[];
    descendants: any[];
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
interface LastUpdatedByUserInfo {
    uid: string;
    firstName: string;
    surname: string;
    username: string;
}
export interface ChangeWorkSheet {
    storedBy: string;
    dueDate: string;
    program: string;
    href: string;
    event: string;
    programStage: string;
    programType: string;
    orgUnit: string;
    trackedEntityInstance: string;
    enrollment: string;
    enrollmentStatus: string;
    status: string;
    orgUnitName: string;
    eventDate: string;
    attributeCategoryOptions: string;
    lastUpdated: string;
    created: string;
    followup: string;
    deleted: string;
    attributeOptionCombo: string;
    // lastUpdatedByUserInfo: LastUpdatedByUserInfo;
    // createdByUserInfo: LastUpdatedByUserInfo;
    // notes: any[];
    // relationships: any[];
    f9bjMbi3j3j: string;
    vlcuyaFe8XA: string;
    TY4BoFr95UI: string;
    megrn75m57y: string;
    vj0HLP3eHbe: string;
}

export interface Column {
    title: string;
    dataIndex: keyof ChangeWorkSheet;
    key: keyof ChangeWorkSheet;
    editable: boolean;
    inputType: string;
    optionSetValue: boolean;
    compulsory: boolean;
    rules: any[];
    options: any[] | undefined | null;
}

export interface QIProject {
    y3hJLGjctPk: string;
    iInAQ40vDGZ: string;
    WQcY6nfPouv: string;
    pIl8z4w8msL: string;
    EvGGaaviqOn: string;
    WEudJ6nxlzz: string;
    TG1QzFgGTex: string;
    kHRn35W3Gq4: string;
    VWxBILfLC9s: string;
    eCbusIaigyj: string;
    rFSjQbZjJwF: string;
    AETf2xvUmc8: string;
}

export interface Project extends QIProject {
    instance: string;
    created: string;
    lastupdated: string;
    ou: string;
    ouname: string;
    te: string;
    inactive: string;
    potentialduplicate: string;
}

export interface ProjectField {
    name: string;
    id: keyof QIProject;
    valueType: string;
    optionSetValue: boolean;
    mandatory: boolean;
    options: any[] | undefined | null;
}

export interface Option extends OptionBase {
    label: string;
    value: string;
}

export interface Period extends Option {
    startDate?: string;
    endDate?: string;
    type: "fixed" | "relative" | "range";
}

export type Item = {
    id: string;
    name: string;
};

export type PickerProps = {
    selectedPeriods: Item[];
    onChange: (periods: Item[]) => void;
};

export type LocationGenerics = MakeGenerics<{
    LoaderData: {};
    Params: { tei: string };
    Search: {
        ou: string;
        program: string;
        trackedEntityType: string;
        trackedEntityInstance: string;
        ouSearch: string;
        page: number;
        pageSize: number;
        ouMode: string;
        programStartDate: string;
        programEndDate: string;
        isNew: boolean;
    };
}>;

export interface RunChart {
    program: string;
    event: string;
    programStage: string;
    orgUnit: string;
    trackedEntityInstance: string;
    enrollment: string;
    eventDate: string;
    deleted: boolean;
    rVZlkzOwWhi: number;
    RgNQcLejbwX: number;
}

export interface Observation {
    program: string;
    event: string;
    programStage: string;
    orgUnit: string;
    trackedEntityInstance: string;
    enrollment: string;
    eventDate: string;
    deleted: boolean;
    gB9GbPqeAzv: string;
    EF7Cwwpegv1: string;
}

export type RelativePeriodType =
    | "DAILY"
    | "WEEKLY"
    | "BIWEEKLY"
    | "WEEKS_THIS_YEAR"
    | "MONTHLY"
    | "BIMONTHLY"
    | "QUARTERLY"
    | "SIXMONTHLY"
    | "FINANCIAL"
    | "YEARLY";

export type FixedPeriodType =
    | "DAILY"
    | "WEEKLY"
    | "WEEKLYWED"
    | "WEEKLYTHU"
    | "WEEKLYSAT"
    | "WEEKLYSUN"
    | "BIWEEKLY"
    | "MONTHLY"
    | "BIMONTHLY"
    | "QUARTERLY"
    | "QUARTERLYNOV"
    | "SIXMONTHLY"
    | "SIXMONTHLYAPR"
    | "SIXMONTHLYNOV"
    | "YEARLY"
    | "FYNOV"
    | "FYOCT"
    | "FYJUL"
    | "FYAPR";

export type FixedPeriod = {
    id: string;
    iso?: string;
    name: string;
    startDate: string;
    endDate: string;
};
