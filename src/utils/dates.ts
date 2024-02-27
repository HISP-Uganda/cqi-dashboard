import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

export const quarterly = (dateTimeUnit: Date) => {
    return dayjs(dateTimeUnit).format("YYYY[Q]Q");
};
export const monthly = (dateTimeUnit: Date) => {
    return dayjs(dateTimeUnit).format("YYYYMM");
};
export const daily = (dateTimeUnit: Date) => {
    return dayjs(dateTimeUnit).format("YYYYMMDD");
};
export const yearly = (dateTimeUnit: Date) => {
    return dayjs(dateTimeUnit).format("YYYY");
};
export const weekly = (dateTimeUnit: Date) => {
    return dayjs(dateTimeUnit).format("YYYY[W]W");
};
export const weeklySaturday = (dateTimeUnit: Date) => {
    // const w1 = dayjs(dateTimeUnit).isoWeek(1);
    // const w2 = dayjs(dateTimeUnit).isoWeek(6);
    // console.log(w1);
    // console.log(w2);
};
export const quarterlyNovember = (dateTimeUnit: Date) => {
    switch (dateTimeUnit.getMonth() + 1) {
        case 11:
        case 12:
        case 1:
            return dateTimeUnit.getFullYear() + "NovQ1";
        case 2:
        case 3:
        case 4:
            return dateTimeUnit.getFullYear() - 1 + "NovQ2";
        case 5:
        case 6:
        case 7:
            return dateTimeUnit.getFullYear() - 1 + "NovQ3";
        case 8:
        case 9:
        case 10:
            return dateTimeUnit.getFullYear() - 1 + "NovQ4";
    }
};
export const sixMonthlyApril = (dateTimeUnit: Date) => {
    switch (dateTimeUnit.getMonth() + 1) {
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            return dateTimeUnit.getFullYear() + "AprilS1";
        case 10:
        case 11:
        case 12:
        case 1:
        case 2:
        case 3:
            return dateTimeUnit.getFullYear() + "AprilS2";
    }
};
export const sixMonthlyNovember = (dateTimeUnit: Date) => {
    switch (dateTimeUnit.getMonth() + 1) {
        case 11:
        case 12:
        case 1:
        case 2:
        case 3:
        case 4:
            return dateTimeUnit.getFullYear() + "NovS1";
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            return dateTimeUnit.getFullYear() + "NovS2";
    }
};

const getDHIS2Dates = (dateTimeUnit: Date) => {
    return {
        quarterly: quarterly(dateTimeUnit),
        quarterlyNovember: quarterlyNovember(dateTimeUnit),
        daily: daily(dateTimeUnit),
        monthly: monthly(dateTimeUnit),
        yearly: yearly(dateTimeUnit),
        sixMonthlyNovember: sixMonthlyNovember(dateTimeUnit),
        sixMonthlyApril: sixMonthlyApril(dateTimeUnit),
        weekly: weekly(dateTimeUnit),
    };
};
