import { ChangeEvent, ChangeEventHandler, FC, useEffect, useState } from "react";
import { Select } from '@chakra-ui/react'
import { useD2 } from "../Context"
import { useEventOptions } from "../Queries";
import { changeIndicator } from "../Events";
import { useStore } from "effector-react";
import { dashboards } from "../Store";

interface IndicatorProps {
  programStage: string;
  dataElement: string;
  search: string;
  dataElements: string
}

const Indicator: FC<IndicatorProps> = ({ search, programStage, dataElement, dataElements }) => {
  const store = useStore(dashboards)
  const d2 = useD2();
  const [dataElementIndex, setDataElementIndex] = useState<number | null>(null)
  const { data, isError, isLoading, isSuccess, error } = useEventOptions(d2, programStage, dataElements, dataElement, search);
  const onIndicatorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    changeIndicator(e.target.value)
  }

  useEffect(() => {
    if (search && data && data.rows.length > 0) {
      setDataElementIndex(data.headers.findIndex((header: any) => header.name === dataElements))
      changeIndicator(data.rows[0][dataElementIndex])
    }
  }, [data, search])

  return (
    <>
      {isError && <div>{error.message}</div>}
      {isLoading && <div>Loading</div>}
      {isSuccess && <div style={{ padding: 10, width: '100%' }}>
        <Select style={{ width: "100%" }} value={store.indicator} onChange={onIndicatorChange}>
          {data.rows.map((row: any) => <option key={row[0]} value={row[dataElementIndex]}>{row[dataElementIndex]}</option>)}
        </Select>
      </div>}
    </>
  )

}

export default Indicator
