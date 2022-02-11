import { Box } from "@chakra-ui/react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Graph from "../Graph";

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
    title:
      "% of Modification of anesthesia plan (after pre anesthesia assessment)",
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
    indicator: "ugfHTZ1AJyw",
    title:
      "% of clients who report having received the prescribed service package",
    yAxisTitle: "Clients prescribed to service package(%)",
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
    indicator: "Number of dashboards",
    title: "% of dashboards",
    yAxisTitle: "Dashboards(%)",
  },
];
const Analytics = () => {
  return (
    <ResponsiveGridLayout
      isDraggable={false}
      isResizable={false}
      autoSize={false}
      rowHeight={32}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      containerPadding={[5, 5]}
      margin={[5, 5]}
      layouts={{ lg: layouts, md: [], sm: [], xs: [], xxs: [] }}
      className="layout"
    >
      {layouts.map((l: any) => {
        return (
          <Box key={l.i}>
            <Graph
              indicator={l.indicator}
              filterBy={l.filterBy}
              title={l.title}
              yAxisTitle={l.yAxisTitle}
            />
          </Box>
        );
      })}
    </ResponsiveGridLayout>
  );
};

export default Analytics;
