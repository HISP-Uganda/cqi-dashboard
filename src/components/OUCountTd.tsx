import { Spinner, Td } from "@chakra-ui/react";
import { useCountFacilities } from "../Queries";

export default function OUCountTd({
    ou,
    pe,
    indicator,
}: {
    ou: string;
    pe: string;
    indicator: string;
}) {
    const { isLoading, isError, isSuccess, error, data } = useCountFacilities({
        program: "vMfIVFcRWlu",
        unit: ou,
        period: pe,
        indicator,
    });
    if (isError) return <pre>{JSON.stringify(error)}</pre>;
    if (isLoading)
        return (
            <Td textAlign="center" colSpan={3}>
                <Spinner size="xs" />
            </Td>
        );
    if (isSuccess && data)
        return (
            <>
                <Td textAlign="center">{data.total}</Td>
                <Td textAlign="center">{data.running}</Td>
                <Td textAlign="center">{data.completed}</Td>
            </>
        );
    return null;
}
