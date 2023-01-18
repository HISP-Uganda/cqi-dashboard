import { FC } from "react";
import { Spinner, Text } from "@chakra-ui/react";
import { useOption } from "../Queries";

const OptionDisplay: FC<{ code: string }> = ({ code }) => {
  const { isLoading, isSuccess, isError, data, error } = useOption(code);
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && <Text>{data}</Text>}
      {isError && <Text>{error.message}</Text>}
    </>
  );
};

export default OptionDisplay;
