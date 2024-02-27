import { Box, Spinner } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useAnalyticsStructure } from "../Queries";
import { dashboards } from "../Store";
import AdminValue from "./AdminValue";
import OrgUnitCount from "./OrgUnitCount";

const AdminAnalytics = ({
    level,
    period,
    units,
    indicator,
    indicatorGroup,
}: {
    units: string[];
    period: string[];
    level: string;
    indicator?: string;
    indicatorGroup?: string;
}) => {
    let organisationUnits = units;
    if (level) {
        organisationUnits = [...organisationUnits, level];
    }
    const store = useStore(dashboards);
    const {
        isLoading,
        isError,
        isSuccess,
        error,
        data: data1,
    } = useAnalyticsStructure(period.join(";"), organisationUnits.join(";"));

    if (isError) return <pre>{JSON.stringify(error)}</pre>;
    if (isLoading) return <Spinner />;
    if (isSuccess)
        return (
            <Box w="100%" bg="white">
                <Box
                    position="relative"
                    overflow="auto"
                    h="calc(100vh - 190px)"
                    w="100%"
                    whiteSpace="nowrap"
                >
                    {store.countUnits ? (
                        <OrgUnitCount
                            ou={organisationUnits.join(";")}
                            metadata={data1}
                            indicatorGroup={indicatorGroup}
                            indicator={indicator}
                        />
                    ) : (
                        <AdminValue
                            ou={organisationUnits.join(";")}
                            pe={period.join(";")}
                            metadata={data1}
                            indicator={indicator}
                            indicatorGroup={indicatorGroup}
                        />
                    )}
                </Box>
            </Box>
        );
    return null;
};

export default AdminAnalytics;
