import { Box, Stack, Text } from "@chakra-ui/react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useStore } from "effector-react";
import { useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { changeOus } from "../../Events";
import { dashboards } from "../../Store";
import Graph from "../Graph";
import OrganisationLevel from "../OrganisationLevel";
import OrgUnitTreeSelect from "../OrgUnitTreeSelect";
import PeriodPicker from "../PeriodPicker";
const ResponsiveGridLayout = WidthProvider(Responsive);

const layouts = [
    {
        i: "a",
        x: 0,
        y: 0,
        w: 6,
        h: 11,
        static: true,
        filterBy: "orgUnit",
        indicator: "lxDACmdTDsX",
        title: "% of Modification of anesthesia plan (after pre anesthesia assessment)",
        yAxisTitle: "Modification of anesthesia plan(%)",
    },
    {
        i: "b",
        x: 6,
        y: 0,
        w: 6,
        h: 11,
        static: true,
        filterBy: "period",
        indicator: "IhRCi2CtJ2o",
        title: "% of clients attaining VL suppression",
        yAxisTitle: "% of clients attaining VL suppression",
    },
    {
        i: "c",
        x: 0,
        y: 11,
        w: 6,
        h: 11,
        static: true,
        filterBy: "period",
        indicator: "uzGKjRbMUsE",
        title: "% of HIV+ patients on ART who have missed their scheduled appointments in the reporting period",
        yAxisTitle:
            "% of HIV+ patients on ART who have missed their scheduled appointments in the reporting period",
    },
    {
        i: "d",
        x: 11,
        y: 11,
        w: 6,
        h: 11,
        static: true,
        filterBy: "orgUnit",
        indicator: "VK1uxyAT5EU",
        title: "% of clients failing on treatment",
        yAxisTitle: "Clients failing on treatment(%)",
    },
    {
        i: "e",
        x: 0,
        y: 22,
        w: 6,
        h: 11,
        static: true,
        filterBy: "orgUnit",
        indicator: "W1Rp3iv7ZuV",
        title: "TB Defaulter rate",
        yAxisTitle: "TB Defaulter rate",
    },
    {
        i: "f",
        x: 11,
        y: 22,
        w: 6,
        h: 11,
        static: true,
        filterBy: "period",
        indicator: "Wcb8ZgHAN3a",
        title: "TB Transfer out rate",
        yAxisTitle: "TB Transfer out rate",
    },
    {
        i: "g",
        x: 0,
        y: 33,
        w: 6,
        h: 11,
        static: true,
        filterBy: "period",
        indicator: "XmIxXHdi5gN",
        title: "% of child deaths that occur during child birth or immediately after birth",
        yAxisTitle:
            "% of child deaths that occur during child birth or immediately after birth",
    },
    {
        i: "h",
        x: 11,
        y: 33,
        w: 6,
        h: 11,
        static: true,
        filterBy: "orgUnit",
        indicator: "IT1dzrw61Rq",
        title: "% of service providers trained in family planning and reproductive health",
        yAxisTitle:
            "% of service providers trained in family planning and reproductive health",
    },
    {
        i: "j",
        x: 0,
        y: 44,
        w: 6,
        h: 11,
        static: true,
        filterBy: "orgUnit",
        indicator: "OYXUlCeYvI0",
        title: "% of babies born to HIV positive mothers who have received a standard ARV regimen at birth in a given quarter",
        yAxisTitle:
            "% of babies born to HIV positive mothers who have received a standard ARV regimen at birth in a given quarter",
    },
    {
        i: "k",
        x: 11,
        y: 44,
        w: 6,
        h: 11,
        static: true,
        filterBy: "period",
        indicator: "E5QoZ13hM4L",
        title: "% of HIV positive mothers found to be undernourished and receive therapeutic or",
        yAxisTitle:
            "% of HIV positive mothers found to be undernourished and receive therapeutic or",
    },
];
const Analytics = () => {
    const store = useStore(dashboards);
    const [indicator, setIndicator] = useState<string>("");
    const [indicatorGroup, setIndicatorGroup] = useState<string>("");
    // const { show, hideAll } = useContextMenu<any>({
    //     id: MENU_ID,
    // });

    function handleItemClick({ event, props, triggerEvent, data }: any) {
        console.log(event, props, triggerEvent, data);
    }

    // function displayMenu(e: any) {
    //     // put whatever custom logic you need
    //     // you can even decide to not display the Menu
    //     show({
    //         event: e,
    //     });
    // }
    return (
        <Stack p="5px">
            <Stack direction="row" bg="white" p="20px">
                <Stack
                    direction="row"
                    alignItems="center"
                    flex={1}
                    // onContextMenu={displayMenu}
                >
                    <Text color="#0b72ef" fontWeight="bold">
                        Organisation
                    </Text>
                    <OrgUnitTreeSelect
                        multiple={true}
                        value={store.ous}
                        onChange={changeOus}
                    />
                </Stack>
                <Stack direction="row" alignItems="center" flex={1}>
                    <Text color="#0b72ef" fontWeight="bold">
                        Level
                    </Text>
                    <OrganisationLevel />
                </Stack>
                <Stack direction="row" alignItems="center" flex={1}>
                    <Text color="#0b72ef" fontWeight="bold">
                        Period
                    </Text>
                    <Box flex={1}>
                        <PeriodPicker />
                    </Box>
                </Stack>

                {/* <Menu id={MENU_ID}>
                    <Item onClick={handleItemClick}>Item 1</Item>
                    <Item onClick={handleItemClick}>Item 2</Item>
                    <Separator />
                    <Item disabled>Disabled</Item>
                    <Separator />
                    <Submenu label="Submenu">
                        <Item onClick={handleItemClick}>Sub Item 1</Item>
                        <Item onClick={handleItemClick}>Sub Item 2</Item>
                    </Submenu>
                </Menu> */}
                {/* <Stack
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
                            onChange={(value) => setIndicatorGroup(() => value)}
                        />
                    </Box>
                </Stack>
                <Stack direction="row" alignItems="center" flex={1}>
                    <Text color="#0b72ef" fontWeight="bold">
                        Indicator
                    </Text>
                    <Box flex={1}>
                        <Indicator
                            indicatorGroup={indicatorGroup}
                            value={indicator}
                            onChange={(value) => setIndicator(() => value)}
                        />
                    </Box>
                </Stack> */}
            </Stack>
            <ResponsiveGridLayout
                isDraggable={false}
                isResizable={false}
                autoSize={false}
                rowHeight={40.1}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                containerPadding={[0, 2]}
                margin={[2, 2]}
                layouts={{ lg: layouts, md: [], sm: [], xs: [], xxs: [] }}
                className="layout"
                style={{ padding: 0, margin: 0 }}
            >
                {layouts.map((l: any) => {
                    return (
                        <Stack
                            key={l.i}
                            alignItems="center"
                            justifyContent="center"
                            p="0"
                            m="0"
                        >
                            <Graph
                                indicator={l.indicator}
                                filterBy={l.filterBy}
                                title={l.title}
                            />
                        </Stack>
                    );
                })}
            </ResponsiveGridLayout>
        </Stack>
    );
};

export default Analytics;
