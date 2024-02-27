import dayjs, { ManipulateType } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { Option } from "./interfaces";

dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

export function encodeToBinary(str: string): string {
    return btoa(
        encodeURIComponent(str).replace(
            /%([0-9A-F]{2})/g,
            function (match, p1) {
                return String.fromCharCode(parseInt(p1, 16));
            }
        )
    );
}
export function decodeFromBinary(str: string): string {
    return decodeURIComponent(
        Array.prototype.map
            .call(atob(str), function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );
}

export const createOption = (array: Array<string>): Array<Option> => {
    return array.map((value) => {
        return { label: value, value };
    });
};

export const createOptions2 = (
    array: Array<string>,
    array2: Array<string>
): Array<Option> => {
    return array.map((value, index) => {
        return { label: value, value: array2[index] };
    });
};

export const relativePeriods: { [key: string]: Option[] } = {
    DAILY: [
        { value: "TODAY", label: "Today" },
        { value: "YESTERDAY", label: "Yesterday" },
        { value: "LAST_3_DAYS", label: "Last 3 days" },
        { value: "LAST_7_DAYS", label: "Last 7 days" },
        { value: "LAST_14_DAYS", label: "Last 14 days" },
        { value: "LAST_30_DAYS", label: "Last 30 days" },
        { value: "LAST_60_DAYS", label: "Last 60 days" },
        { value: "LAST_90_DAYS", label: "Last 90 days" },
        { value: "LAST_180_DAYS", label: "Last 180 days" },
    ],
    WEEKLY: [
        { value: "THIS_WEEK", label: "This week" },
        { value: "LAST_WEEK", label: "Last week" },
        { value: "LAST_4_WEEKS", label: "Last 4 weeks" },
        { value: "LAST_12_WEEKS", label: "Last 12 weeks" },
        { value: "LAST_52_WEEKS", label: "Last 52 weeks" },
        { value: "WEEKS_THIS_YEAR", label: "Weeks this year" },
    ],
    BIWEEKLY: [
        { value: "THIS_BIWEEK", label: "This bi-week" },
        { value: "LAST_BIWEEK", label: "Last bi-week" },
        { value: "LAST_4_BIWEEKS", label: "Last 4 bi-weeks" },
    ],
    MONTHLY: [
        { value: "THIS_MONTH", label: "This month" },
        { value: "LAST_MONTH", label: "Last month" },
        { value: "LAST_3_MONTHS", label: "Last 3 months" },
        { value: "LAST_6_MONTHS", label: "Last 6 months" },
        { value: "LAST_12_MONTHS", label: "Last 12 months" },
        {
            value: "MONTHS_THIS_YEAR",
            label: "Months this year",
        },
    ],
    BIMONTHLY: [
        { value: "THIS_BIMONTH", label: "This bi-month" },
        { value: "LAST_BIMONTH", label: "Last bi-month" },
        {
            value: "LAST_6_BIMONTHS",
            label: "Last 6 bi-months",
        },
        {
            value: "BIMONTHS_THIS_YEAR",
            label: "Bi-months this year",
        },
    ],
    QUARTERLY: [
        { value: "THIS_QUARTER", label: "This quarter" },
        { value: "LAST_QUARTER", label: "Last quarter" },
        { value: "LAST_4_QUARTERS", label: "Last 4 quarters" },
        {
            value: "QUARTERS_THIS_YEAR",
            label: "Quarters this year",
        },
    ],
    SIXMONTHLY: [
        { value: "THIS_SIX_MONTH", label: "This six-month" },
        { value: "LAST_SIX_MONTH", label: "Last six-month" },
        {
            value: "LAST_2_SIXMONTHS",
            label: "Last 2 six-month",
        },
    ],
    FINANCIAL: [
        {
            value: "THIS_FINANCIAL_YEAR",
            label: "This financial year",
        },
        {
            value: "LAST_FINANCIAL_YEAR",
            label: "Last financial year",
        },
        {
            value: "LAST_5_FINANCIAL_YEARS",
            label: "Last 5 financial years",
        },
    ],
    YEARLY: [
        { value: "THIS_YEAR", label: "This year" },
        { value: "LAST_YEAR", label: "Last year" },
        { value: "LAST_5_YEARS", label: "Last 5 years" },
        { value: "LAST_10_YEARS", label: "Last 10 years" },
    ],
};
export const fixedPeriods = [
    "DAILY",
    "WEEKLY",
    "WEEKLYWED",
    "WEEKLYTHU",
    "WEEKLYSAT",
    "WEEKLYSUN",
    "BIWEEKLY",
    "MONTHLY",
    "BIMONTHLY",
    "QUARTERLY",
    "QUARTERLYNOV",
    "SIXMONTHLY",
    "SIXMONTHLYAPR",
    "SIXMONTHLYNOV",
    "YEARLY",
    "FYNOV",
    "FYOCT",
    "FYJUL",
    "FYAPR",
];

export const convertParent: any = (parent: any, found: string[]) => {
    found = [...found, parent.name];
    if (parent.parent) {
        return convertParent(parent.parent, found);
    }
    return found;
};

export const periodDBColumns = {
    DAILY: "daily",
    WEEKLY: "weekly",
    WEEKLYWED: "weeklywednesday",
    WEEKLYTHU: "weeklythursday",
    WEEKLYSAT: "weeklysaturday",
    WEEKLYSUN: "weeklysunday",
    BIWEEKLY: "biweekly",
    MONTHLY: "monthly",
    BIMONTHLY: "bimonthly",
    QUARTERLY: "quarterly",
    QUARTERLYNOV: "quarterlynov",
    SIXMONTHLY: "sixmonthly",
    SIXMONTHLYAPR: "sixmonthlyapr",
    SIXMONTHLYNOV: "sixmonthlynov",
    YEARLY: "yearly",
    FYNOV: "financialnov",
    FYOCT: "financialoct",
    FYJUL: "financialjuly",
    FYAPR: "financialapril",
};

/*
 * Get an array of last periods
 *
 * @param n the number to look back e.g n months back
 * @param periodType the type of periods. one of weeks, months, quarters, years
 * @paran includeCurrent whether to include current period. e.g if true last_3_months includes the current month
 * @return a list of relative periods
 */
const lastNPeriods = (
    n: number,
    periodType: ManipulateType,
    includeCurrent: boolean = false
) => {
    /*The momentjs fomarts for the periodsTypes*/
    const dateFormats: { [key: string]: string } = {
        days: "YYYYMMDD",
        weeks: "YYYY[W]W",
        months: "YYYYMM",
        years: "YYYY",
        quarters: "YYYY[Q]Q",
    };

    const periods = new Set<string>();
    /* toLocaleUpperCase() is added because of special treatment to quarters formating*/
    if (n === 0) {
        periods.add(dayjs().format(dateFormats[periodType]));
        return Array.from(periods);
    }
    for (let i = n; i >= 1; i--) {
        periods.add(
            dayjs().subtract(i, periodType).format(dateFormats[periodType])
        );
    }
    if (includeCurrent) {
        periods.add(dayjs().format(dateFormats[periodType]));
    }
    return Array.from(periods);
};

export const relativePeriods2: { [key: string]: string[] } = {
    TODAY: lastNPeriods(0, "days"),
    YESTERDAY: lastNPeriods(1, "days"),
    LAST_3_DAYS: lastNPeriods(3, "days"),
    LAST_7_DAYS: lastNPeriods(7, "days"),
    LAST_14_DAYS: lastNPeriods(14, "days"),
    LAST_30_DAYS: lastNPeriods(30, "days"),
    LAST_60_DAYS: lastNPeriods(60, "days"),
    LAST_90_DAYS: lastNPeriods(90, "days"),
    LAST_180_DAYS: lastNPeriods(180, "days"),
    THIS_WEEK: lastNPeriods(0, "weeks"),
    LAST_WEEK: lastNPeriods(1, "weeks"),
    LAST_4_WEEKS: lastNPeriods(4, "weeks"),
    LAST_12_WEEKS: lastNPeriods(12, "weeks"),
    LAST_52_WEEKS: lastNPeriods(52, "weeks"),
    WEEKS_THIS_YEAR: lastNPeriods(dayjs().isoWeek() - 1, "weeks", true),
    THIS_MONTH: lastNPeriods(0, "months"),
    LAST_MONTH: lastNPeriods(1, "months"),
    LAST_3_MONTHS: lastNPeriods(3, "months"),
    LAST_6_MONTHS: lastNPeriods(6, "months"),
    LAST_12_MONTHS: lastNPeriods(12, "months"),
    MONTHS_THIS_YEAR: lastNPeriods(dayjs().month(), "months", true),
    THIS_YEAR: lastNPeriods(0, "years"),
    LAST_YEAR: lastNPeriods(1, "years"),
    LAST_5_YEARS: lastNPeriods(5, "years"),
    LAST_10_YEARS: lastNPeriods(10, "years"),
    THIS_QUARTER: lastNPeriods(0, "months"),
    LAST_QUARTER: lastNPeriods(1 * 3, "months"),
    LAST_4_QUARTERS: lastNPeriods(4 * 3, "months"),
    QUARTERS_THIS_YEAR: lastNPeriods(
        (dayjs().quarter() - 1) * 3,
        "months",
        true
    ),
};
