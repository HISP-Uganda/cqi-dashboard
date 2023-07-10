import { Option } from "./interfaces";

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
