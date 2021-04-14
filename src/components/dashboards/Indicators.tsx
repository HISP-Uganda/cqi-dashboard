import { useStore } from "effector-react"
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react"
import { useD2 } from "../../Context";
import { useEventOptions, useEvents, useOptionSet } from "../../Queries";
import { dashboards } from "../../Store";
import { useState, useEffect } from "react";

const Indicators = () => {
  const store = useStore(dashboards);
  const d2 = useD2();
  const [dataElementIndex, setDataElementIndex] = useState<number | null>(null)
  const { data, isError, isLoading, error, isSuccess } = useEventOptions(d2, 'vPQxfsUQLEy', 'kToJ1rk0fwY');
  useEffect(() => {
    if (!!data) {
      setDataElementIndex(data.headers.findIndex((header: any) => header.name === 'kToJ1rk0fwY'))
    }
  }, [data])
  return (
    <div>
      {isLoading && <div>Loading</div>}
      {isSuccess && <div style={{ padding: 10, width: '100%' }}>
        <Table>
          <Thead>
            <Tr>
              <Th>Indicator</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.rows.map((row: any) =>
              <Tr>
                <Td>{row[dataElementIndex]}{JSON.stringify(store.ou)}</Td>
              </Tr>)}
          </Tbody>
        </Table>
      </div>}
      {isError && <div>{error.message}</div>}
    </div>
  )
}

export default Indicators
