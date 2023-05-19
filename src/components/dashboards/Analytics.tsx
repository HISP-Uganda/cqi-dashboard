import { Button, Stack, Text } from "@chakra-ui/react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Graph from "../Graph";
import PeriodPicker from "../PeriodPicker";
import { dashboards, indicatorForGroup } from "../../Store";
import { useStore } from "effector-react";
import OrgUnitTreeSelect from "../OrgUnitTreeSelect";
import {
    changeFilterBy,
    changeIndicator,
    changeIndicatorGroup,
    changeLevel,
    changeOus,
    changeUrl,
} from "../../Events";

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
        filterBy: "orgUnit",
        indicator: "VK1uxyAT5EU",
        title: "% of clients failing on treatment",
        yAxisTitle: "Clients failing on treatment(%)",
    },
    {
        i: "d",
        x: 11,
        y: 11,
        w: 6,
        h: 11,
        static: true,
        filterBy: "period",
        indicator: "A64EEs9MUqf",
        title: "% of patients diagnosed with TB that were initiated on TB treatment",
        yAxisTitle:
            "% of patients diagnosed with TB that were initiated on TB treatment",
    },
];
const Analytics = () => {
    const store = useStore(dashboards);

    return (
        <>
            <Stack direction="row" bg="white" h="60px" p="10px"
                alignContent="right"
                justifyContent="right"
                alignItems="right"
                justifyItems="right">

                <Stack direction="row">
                    <Text fontSize="xl"
                        color="#0b72ef"
                        p="2px"
                        fontWeight="bold"
                    >
                        Organisation Unit
                    </Text>
                    <OrgUnitTreeSelect
                        multiple={true}
                        value={store.ous}
                        onChange={changeOus}
                    />
                </Stack>
                <Stack direction="row">
                    <Text fontSize="xl"
                        color="#0b72ef"
                        p="2px"
                        fontWeight="bold"
                    >
                        Period
                    </Text>
                    <PeriodPicker />
                </Stack>

                <Button colorScheme="blue" w="10%">Download Indicators</Button>
            </Stack>
            <ResponsiveGridLayout
                isDraggable={false}
                isResizable={false}
                autoSize={false}
                rowHeight={40}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                containerPadding={[0, 0]}
                margin={[2, 2]}
                layouts={{ lg: layouts, md: [], sm: [], xs: [], xxs: [] }}
                className="layout"
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
        </>
    );
};

export default Analytics;
