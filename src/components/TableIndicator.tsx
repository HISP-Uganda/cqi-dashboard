import { Td } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useStore } from "effector-react";
import { FC } from "react";
import { useAnalytics } from "../Queries";
import { dashboards, orgUnits, periods } from "../Store";
import { colors } from "../utils/common";

interface TableIndicatorProps {
    search: string;
    what: string;
}

const TableIndicator: FC<TableIndicatorProps> = ({ search, what }) => {
    const store = useStore(dashboards);
    const units = useStore(orgUnits);
    const pes = useStore(periods);
    const { data, isError, isLoading, error, isSuccess } = useAnalytics(
        "vMfIVFcRWlu",
        "kHRn35W3Gq4",
        search,
        "rVZlkzOwWhi",
        "RgNQcLejbwX",
        units,
        pes,
        store.filterBy
    );
    return (
        <>
            {isLoading && (
                <Td textAlign="center" colSpan={3}>
                    <Spinner size="xs" />
                </Td>
            )}
            {isSuccess && (
                <>
                    {/* <Td textAlign="center">{data[what].numerator}</Td>
                    <Td textAlign="center">{data[what].denominator}</Td> */}
                    <Td bg={colors(data[what].indicator)} textAlign="center">
                        {data[what].indicator !== "-"
                            ? `${data[what].indicator}%`
                            : data[what].indicator}
                    </Td>
                </>
            )}
            {isError && <Td colSpan={3}>{error.message}</Td>}
        </>
    );
};

export default TableIndicator;
