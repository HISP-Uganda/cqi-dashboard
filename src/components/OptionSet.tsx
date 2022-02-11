import { Box, Select } from "@chakra-ui/react";
import { ChangeEvent, FC } from "react";
import { useOptionSet } from "../Queries";
interface OptionSetProps {
  optionSet: string;
  value: string | number | string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}
const OptionSet: FC<OptionSetProps> = ({ optionSet, value, onChange }) => {
  const { isLoading, isError, error, isSuccess, data } =
    useOptionSet(optionSet);
  return (
    <>
      {isLoading && <Box>Loading</Box>}
      {isSuccess && (
        <Select style={{ width: "100%" }} value={value} onChange={onChange}>
          {data.map((option: any) => (
            <option key={option.id} value={option.code}>
              {option.name}
            </option>
          ))}
        </Select>
      )}
      {isError && <Box>{error.message}</Box>}
    </>
  );
};

export default OptionSet;
