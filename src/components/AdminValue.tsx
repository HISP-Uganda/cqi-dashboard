import { Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useSQLViewMetadata } from "../Queries";
import { $availableIndicators, dashboards } from "../Store";

export default function AdminValue({
    ou,
    pe,
    indicatorGroup,
    indicator,
    metadata,
}: {
    ou: string;
    pe: string;
    metadata: any;
    indicator?: string;
    indicatorGroup?: string;
}) {
    const availableIndicators = useStore($availableIndicators);
    const store = useStore(dashboards);
    const { isLoading, isError, isSuccess, error, data } = useSQLViewMetadata({
        program: "vMfIVFcRWlu",
        id: "Pf9i8qhrd5X",
        unit: ou,
        period: pe,
        indicatorGroup,
        indicator,
        countUnits: store.countUnits,
    });
    if (isError) return <pre>{JSON.stringify(error)}</pre>;
    if (isLoading) return <Spinner />;
    if (isSuccess && data)
        return (
            <Table>
                <Thead position="sticky" top={0} left={0} zIndex={10}>
                    <Tr>
                        <Th
                            textColor="white"
                            rowSpan={2}
                            w="30vw"
                            maxW="30vw"
                            minWidth="30vw"
                            position="sticky"
                            left="0"
                            bgColor="blue.800"
                        >
                            Organisation
                        </Th>
                        {metadata.metaData.dimensions.pe.map((ou: string) => (
                            <Th
                                textColor="black"
                                bgColor="blue.50"
                                key={ou}
                                colSpan={store.countUnits ? 1 : 3}
                                textAlign="center"
                            >
                                {metadata.metaData.items[ou].name}
                            </Th>
                        ))}
                    </Tr>

                    <Tr>
                        {metadata.metaData.dimensions.pe.map((ou: string) => (
                            <>
                                <Th
                                    textColor="black"
                                    bgColor="blue.50"
                                    key={`${ou}t`}
                                    textAlign="center"
                                >
                                    Total
                                </Th>
                                <Th
                                    textColor="black"
                                    bgColor="blue.50"
                                    key={`${ou}r`}
                                    textAlign="center"
                                >
                                    Running
                                </Th>
                                <Th
                                    textColor="black"
                                    bgColor="blue.50"
                                    key={`${ou}c`}
                                    textAlign="center"
                                >
                                    Completed
                                </Th>
                            </>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {!store.countUnits &&
                        metadata.metaData.dimensions.ou.map((row: string) => (
                            <Tr key={row}>
                                <Td
                                    fontSize="md"
                                    w="30vw"
                                    maxW="30vw"
                                    minWidth="30vw"
                                    position="sticky"
                                    left="0"
                                    bg="blue.50"
                                >
                                    {metadata.metaData.items[row].name}
                                </Td>
                                {metadata.metaData.dimensions.pe.map(
                                    (pe: string) => {
                                        const running =
                                            data["0"]?.[pe]?.[row] ?? 0;
                                        const completed =
                                            data["1"]?.[pe]?.[row] ?? 0;
                                        let total =
                                            Number(running) + Number(completed);
                                        return (
                                            <>
                                                <Td
                                                    key={`${row}${pe}t`}
                                                    textAlign="center"
                                                >
                                                    {total}
                                                </Td>
                                                <Td
                                                    key={`${row}${pe}r`}
                                                    textAlign="center"
                                                >
                                                    {data["0"]?.[pe]?.[row] ??
                                                        0}
                                                </Td>
                                                <Td
                                                    key={`${row}${pe}c`}
                                                    textAlign="center"
                                                >
                                                    {data["1"]?.[pe]?.[row] ??
                                                        0}
                                                </Td>
                                            </>
                                        );
                                    }
                                )}
                            </Tr>
                        ))}

                    {store.countUnits &&
                        availableIndicators.map((indicator) => (
                            <Tr key={indicator.event}>
                                <Td
                                    fontSize="md"
                                    w="30vw"
                                    maxW="30vw"
                                    minWidth="30vw"
                                    position="sticky"
                                    left="0"
                                    bg="blue.50"
                                >
                                    {indicator.event}
                                </Td>
                                {metadata.metaData.dimensions.pe.map(
                                    (pe: string) => (
                                        <Td>Working</Td>
                                    )
                                )}
                            </Tr>
                        ))}
                </Tbody>
            </Table>
        );
    return null;
}
