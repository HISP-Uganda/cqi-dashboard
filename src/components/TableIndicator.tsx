import { Td, Center } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useStore } from "effector-react";
import { FC } from "react";
import { useD2 } from "../Context"
import { useAnalytics } from "../Queries";
import { dashboards, orgUnits, periods } from "../Store";
import { colors } from "../utils/common";

interface TableIndicatorProps {
  search: string;
  what: string
}

const TableIndicator: FC<TableIndicatorProps> = ({ search, what }) => {
  const d2 = useD2();
  const store = useStore(dashboards)
  const units = useStore(orgUnits);
  const pes = useStore(periods)
  const { data, isError, isLoading, error, isSuccess } = useAnalytics(d2, "vMfIVFcRWlu", "kHRn35W3Gq4", search, "rVZlkzOwWhi", "RgNQcLejbwX", units, pes, store.filterBy)
  return (
    <>
      {isLoading && <Td textAlign="center"><Spinner size="xs" /></Td>}
      {isSuccess && <Td bg={colors(data[what].indicator)} textAlign="center"> {data[what].indicator !== '-' ? `${data[what].indicator}%` : data[what].indicator} </Td>}
      {isError && <Td>{error.message}</Td>}
    </>
  )
}

export default TableIndicator
