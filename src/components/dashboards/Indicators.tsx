import { Center } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useEffect, useState } from "react";
import { useD2 } from "../../Context";
import { useEventOptions } from "../../Queries";
import AllIndicators from "../AllIndicators";

const Indicators = () => {
  const d2 = useD2();
  const [dataElementIndex, setDataElementIndex] = useState<number | null>(null)
  const { data, isError, isLoading, error, isSuccess } = useEventOptions(d2, 'vPQxfsUQLEy', 'kToJ1rk0fwY');
  useEffect(() => {
    if (!!data) {
      setDataElementIndex(data.headers.findIndex((header: any) => header.name === 'kToJ1rk0fwY'))
    }
  }, [data])
  return (
    <>
      {isLoading && <Center className="biggest-height"><Spinner /></Center>}
      {isSuccess && <AllIndicators dataElementIndex={dataElementIndex} rows={data.rows} />}
      {isError && <Center className="biggest-height">{error.message}</Center>}
    </>
  )
}

export default Indicators
