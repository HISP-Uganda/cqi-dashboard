import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useStore } from "effector-react";
import EllipsisTooltip from "ellipsis-tooltip-react-chan";
import { dashboards } from "../Store";
import OUCountTd from "./OUCountTd";

export default function OrgUnitCount({
    metadata,
    ou,
    indicatorGroup,
    indicator,
}: {
    ou: string;
    metadata: any;
    indicatorGroup?: string;
    indicator?: string;
}) {
    const store = useStore(dashboards);
    const availableIndicators = store.indicators.filter((row: any) => {
        if (indicatorGroup && indicator) {
            return (
                row.kuVtv8R9n8q === indicatorGroup && row.event === indicator
            );
        }
        if (indicatorGroup) {
            return row.kuVtv8R9n8q === indicatorGroup;
        }
        return true;
    });
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
                        Indicator
                    </Th>
                    {metadata.metaData.dimensions.pe.map((ou: string) => (
                        <Th
                            textColor="black"
                            bgColor="blue.50"
                            key={ou}
                            colSpan={3}
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
                {availableIndicators.map((indicator) => (
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
                            <EllipsisTooltip>
                                {indicator.kToJ1rk0fwY}
                            </EllipsisTooltip>
                        </Td>
                        {metadata.metaData.dimensions.pe.map((pe: string) => (
                            <OUCountTd
                                pe={pe}
                                indicator={indicator.event}
                                ou={ou}
                            />
                        ))}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}
