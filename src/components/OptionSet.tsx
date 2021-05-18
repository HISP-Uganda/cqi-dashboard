import { Box, Select } from '@chakra-ui/react';
import { ChangeEvent, FC } from "react";
import { useD2 } from '../Context';
import { useOptionSet } from '../Queries';
interface OptionSetProps {
  optionSet: string;
  value: string | number | string[]
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}
const OptionSet: FC<OptionSetProps> = ({ optionSet, value, onChange }) => {
  const d2 = useD2();
  const { isLoading, isError, error, isSuccess, data } = useOptionSet(d2, optionSet);
  return (
    <>
      {isLoading && <Box>Loading</Box>}
      {isSuccess && <Select style={{ width: "100%" }} value={value} onChange={onChange}>
        {data.map((option: any) => <option key={option.id} value={option.code}>{option.name}</option>)}
      </Select>}
      {isError && <Box>{error.message}</Box>}
    </>
  )
}

export default OptionSet
