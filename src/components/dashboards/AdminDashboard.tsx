import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useState } from "react";
import { changeOus, toggleCount } from "../../Events";
import { dashboards } from "../../Store";
import { relativePeriods2 } from "../../utils";
import AdminAnalytics from "../AdminAnalytics";
import Indicator from "../Indicator";
import IndicatorGroup from "../IndicatorGroup";
import OrganisationLevel from "../OrganisationLevel";
import OrgUnitTreeSelect from "../OrgUnitTreeSelect";
import PeriodPicker from "../PeriodPicker";
const AdminDashboard = () => {
    const store = useStore(dashboards);
    const [indicator, setIndicator] = useState<string | undefined>();
    const [indicatorGroup, setIndicatorGroup] = useState<string | undefined>();
    const onIndicatorGroupChange = (value: string | undefined) => {
        setIndicatorGroup(() => value);
        setIndicator(() => undefined);
    };
    const realPeriods = store.period.flatMap((p) => {
        if (p.type === "relative") {
            return relativePeriods2[p.value];
        }
        return p.value;
    });
    return (
        <Stack p="5px" spacing="0">
            <Stack
                direction="row"
                alignItems="center"
                flex={1}
                p="15px"
                bgColor="white"
            >
                <Stack
                    direction="row"
                    zIndex="10000"
                    alignItems="center"
                    flex={1}
                >
                    <Text color="#0b72ef" fontWeight="bold">
                        Program Area
                    </Text>
                    <Box flex={1}>
                        <IndicatorGroup
                            value={indicatorGroup}
                            onChange={onIndicatorGroupChange}
                        />
                    </Box>
                </Stack>
                <Stack
                    direction="row"
                    flex={1}
                    alignItems="center"
                    zIndex="10000"
                >
                    <Text color="#0b72ef" fontWeight="bold">
                        Indicator
                    </Text>
                    <Indicator
                        indicatorGroup={indicatorGroup}
                        value={indicator}
                        onChange={(value) => setIndicator(() => value)}
                    />
                </Stack>
            </Stack>
            <Stack direction="row" p="15px" bgColor="white">
                <Stack direction="row" alignItems="center" flex={1}>
                    <Text color="#0b72ef" fontWeight="bold">
                        Organisation Unit
                    </Text>
                    <OrgUnitTreeSelect
                        multiple={true}
                        value={store.ous}
                        onChange={changeOus}
                    />
                </Stack>
                {!store.countUnits && (
                    <Stack
                        direction="row"
                        alignItems="center"
                        flex={1}
                        zIndex="9000"
                    >
                        <Text color="#0b72ef" fontWeight="bold">
                            Level
                        </Text>
                        <OrganisationLevel />
                    </Stack>
                )}
                <Stack direction="row" alignItems="center" flex={1}>
                    <Text color="#0b72ef" fontWeight="bold">
                        Period
                    </Text>
                    <PeriodPicker fixed={true} />
                </Stack>
                <Button onClick={() => toggleCount()}>
                    {store.countUnits ? "Count Projects" : "Count Facilities"}
                </Button>
            </Stack>

            <AdminAnalytics
                period={realPeriods}
                units={store.ous}
                level={store.level}
                indicator={indicator}
                indicatorGroup={indicatorGroup}
            />
        </Stack>
    );
};

export default AdminDashboard;
