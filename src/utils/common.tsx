import { DatePicker, Input, InputNumber, Select, Checkbox } from "antd";
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

export const getField = (valueType: string, optionSetValue: boolean, options: any[] = []) => {
  if (optionSetValue) {
    return <Select>
      {options.map((o: any) => <Option value={o.code} key={o.code}>{o.name}</Option>)}
    </Select>
  }
  switch (valueType) {
    case 'DATE':
    case 'DATETIME':
      return <DatePicker />
    case 'LONG_TEXT':
      return <Input.TextArea />
    case 'NUMBER':
      return <InputNumber />
    case 'BOOLEAN':
      return <Checkbox />
    default:
      return <Input />
  }

}
