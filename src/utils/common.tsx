import { Checkbox, DatePicker, Input, InputNumber, Select } from "antd";
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  parseISO,
} from "date-fns";
const { Option } = Select;

export const getFieldType = (valueType: string, optionSetValue: boolean) => {
  if (optionSetValue) {
    return "select";
  }
  switch (valueType) {
    case "DATE":
    case "DATETIME":
      return "date-picker";
    case "LONG_TEXT":
      return "textarea";
    default:
      return "input";
  }
};

export const getRule = (valueType: string) => {
  switch (valueType) {
    case "DATE":
    case "DATETIME":
      return "date";
    case "NUMBER":
      return "number";
    case "EMAIL":
      return "email";
    case "INTEGER":
      return "integer";
    case "BOOLEAN":
      return "boolean";
    default:
      return "string";
  }
};

const getInput = (valueType: string, otherOptions: any = {}) => {
  const Opts = {
    DATE: <DatePicker {...otherOptions} />,
    DATETIME: <DatePicker {...otherOptions} />,
    LONG_TEXT: <Input.TextArea {...otherOptions} />,
    NUMBER: <InputNumber {...otherOptions} />,
    BOOLEAN: <Checkbox {...otherOptions} />,
  };
  return Opts[valueType] || <Input {...otherOptions} />;
};

export const getField = (
  valueType: string,
  optionSetValue: boolean,
  options: any[] = [],
  otherOptions: any = {}
) => {
  if (optionSetValue) {
    return (
      <Select {...otherOptions}>
        {options.map((o: any) => (
          <Option value={o.code} key={o.code}>
            {o.name}
          </Option>
        ))}
      </Select>
    );
  }
  return getInput(valueType, otherOptions);
};

export const calculateEventDays = (
  startDate: string,
  endDate: string,
  frequency: string
) => {
  const Dates = {
    Daily: differenceInDays(parseISO(endDate), parseISO(startDate)),
    Weekly: differenceInWeeks(parseISO(endDate), parseISO(startDate)),
    Monthly: differenceInMonths(parseISO(endDate), parseISO(startDate)),
  };

  console.log(Dates[frequency], startDate, endDate);
  return Dates[frequency] || Dates["Monthly"];
};

export const reviewPeriodString = (frequency: string) => {
  const Options = {
    Daily: "Day",
    Weekly: "Week",
    Monthly: "Month",
  };
  return Options[frequency] || Options["Monthly"];
};

export const colors = (value: string) => {
  if (value === "-") {
    return "none";
  }

  const valueFloat = parseFloat(value);

  if (valueFloat >= 0 && valueFloat < 50) {
    return "#A42626";
  }

  if (valueFloat >= 50 && valueFloat < 70) {
    return "#CC0000";
  }
  if (valueFloat >= 70 && valueFloat < 90) {
    return "#FFFF01";
  }
  if (valueFloat >= 90 && valueFloat < 95) {
    return "#62F091";
  }
  if (valueFloat >= 95 && valueFloat <= 100) {
    return "#109909";
  }

  return "none";
};

const allAttributesWithEvents = [
  {
    attribute: "kHRn35W3Gq4",
    dataElement: "kToJ1rk0fwY",
    programStage: "vPQxfsUQLEy",
  },
];

export const withAttributesAsEvent = (attribute: string) => {
  return allAttributesWithEvents.find(({ attribute: a }) => attribute === a);
};
