import {
  Center,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Box,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { FC } from "react";
import { useAnalyticsStructure } from "../Queries";
import { dashboards, orgUnits, periods } from "../Store";
import TableIndicator from "./TableIndicator";
interface AllIndicatorsProps {
  rows: any[];
  dataElementIndex: number;
}

const AllIndicators: FC<AllIndicatorsProps> = ({ rows, dataElementIndex }) => {
  const store = useStore(dashboards);
  const units = useStore(orgUnits);
  const pes = useStore(periods);
  const { data, isError, isLoading, error, isSuccess } = useAnalyticsStructure(
    units,
    pes
  );
  return (
    <Box bg="white">
      {isLoading && (
        <Center className="biggest-height">
          <Spinner />
        </Center>
      )}
      {isSuccess && (
        <VStack className="biggest-height" bg="white" overflow="auto">
          <Table size="sm">
            <Thead
              bg="blue.800"
              position="sticky"
              top={0}
              boxShadow="0 2px 2px -1px rgba(0, 0, 0, 0.4)"
            >
              <Tr>
                <Th textColor="white">Indicator</Th>
                {store.filterBy === "orgUnit" &&
                  data.metaData.dimensions.pe.map((pe: string) => (
                    <Th textColor="white" key={pe} textAlign="center">
                      {data.metaData.items[pe].name}
                    </Th>
                  ))}
                {store.filterBy === "period" &&
                  data.metaData.dimensions.ou.map((ou: string) => (
                    <Th textColor="white" key={ou} textAlign="center">
                      {data.metaData.items[ou].name}
                    </Th>
                  ))}
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row: any) => (
                <Tr key={row[0]}>
                  <Td fontSize="md">{row[dataElementIndex]}</Td>
                  {store.filterBy === "orgUnit" &&
                    data.metaData.dimensions.pe.map((pe: string) => (
                      <TableIndicator
                        key={`${pe}${row[0]}`}
                        search={row[0]}
                        what={pe}
                      />
                    ))}
                  {store.filterBy === "period" &&
                    data.metaData.dimensions.ou.map((ou: string) => (
                      <TableIndicator
                        key={`${ou}${row[0]}`}
                        search={row[0]}
                        what={ou}
                      />
                    ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      )}
      {isError && <div>{error.message}</div>}
    </Box>
  );
};

export default AllIndicators;
