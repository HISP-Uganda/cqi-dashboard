import { Center, Stack } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useEffect, useState } from "react";
import { useEventOptions } from "../../Queries";
import AllIndicators from "../AllIndicators";

const Indicators = () => {
  const [dataElementIndex, setDataElementIndex] = useState<number>(0);
  const { data, isError, isLoading, error, isSuccess } = useEventOptions(
    "vPQxfsUQLEy",
    "kToJ1rk0fwY"
  );
  useEffect(() => {
    if (!!data) {
      setDataElementIndex(
        data.headers.findIndex((header: any) => header.name === "kToJ1rk0fwY")
      );
    }
  }, [data]);
  return (
    <Stack
      bg="white"
      h="calc(100vh - 106px)"
      alignItems="center"
      justifyContent="center"
    >
      {isLoading && <Spinner />}
      {isSuccess && (
        <AllIndicators dataElementIndex={dataElementIndex} rows={data.rows} />
      )}
      {isError && <Center className="biggest-height">{error.message}</Center>}
    </Stack>
  );
};

export default Indicators;
