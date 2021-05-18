import { Checkbox, DatePicker, Input, InputNumber, Select } from "antd";
import { differenceInDays, differenceInMonths, differenceInWeeks, parseISO } from 'date-fns';
const { Option } = Select;

export const getFieldType = (valueType: string, optionSetValue: boolean) => {

  if (optionSetValue) {
    return 'select'
  }
  switch (valueType) {
    case 'DATE':
    case 'DATETIME':
      return 'date-picker'
    case 'LONG_TEXT':
      return 'textarea'
    default:
      return 'input'
  }
}

export const getRule = (valueType: string) => {
  switch (valueType) {
    case 'DATE':
    case 'DATETIME':
      return 'date'
    case 'NUMBER':
      return 'number'
    case 'EMAIL':
      return 'email'
    case 'INTEGER':
      return 'integer'
    case 'BOOLEAN':
      return 'boolean'
    default:
      return 'string'
  }
}

const getInput = (valueType: string, otherOptions: any = {}) => {
  const Opts = {
    DATE: <DatePicker {...otherOptions} />,
    DATETIME: <DatePicker {...otherOptions} />,
    LONG_TEXT: <Input.TextArea {...otherOptions} />,
    NUMBER: <InputNumber {...otherOptions} />,
    BOOLEAN: <Checkbox {...otherOptions} />,
    DEFAULT: <Input {...otherOptions} />
  }
  return Opts[valueType]
}

export const getField = (valueType: string, optionSetValue: boolean, options: any[] = [], otherOptions: any = {}) => {
  if (optionSetValue) {
    return <Select {...otherOptions}>
      {options.map((o: any) => <Option value={o.code} key={o.code}>{o.name}</Option>)}
    </Select>
  }
  return getInput(valueType, otherOptions);
}

export const calculateEventDays = (startDate: string, endDate: string, frequency: string) => {
  const Dates = {
    Daily: differenceInDays(parseISO(endDate), parseISO(startDate)),
    Weekly: differenceInWeeks(parseISO(endDate), parseISO(startDate)),
    Monthly: differenceInMonths(parseISO(endDate), parseISO(startDate))
  }
  return Dates[frequency] || Dates['Monthly'];
}

export const reviewPeriodString = (frequency: string) => {
  const Options = {
    Daily: 'Day',
    Weekly: 'Week',
    Monthly: 'Month'
  }
  return Options[frequency] || Options['Monthly']
}



export const colors = (value: string) => {
  if (value === '-') {
    return 'none';
  }
  if (value >= '0' && value < '50') {
    return 'red.300';
  }

  if (value >= '50' && value < '75') {
    return 'yellow.300';
  }
  if (value >= '75') {
    return 'green.300';
  }

  return 'red.400'
}
