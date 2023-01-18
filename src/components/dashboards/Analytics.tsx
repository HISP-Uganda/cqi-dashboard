import { Stack } from "@chakra-ui/react";
import React from "react";
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
    title:
      "% of patients diagnosed with TB that were initiated on TB treatment",
    yAxisTitle:
      "% of patients diagnosed with TB that were initiated on TB treatment",
  },
];
const Analytics = () => {
  return (
    <ResponsiveGridLayout
      isDraggable={false}
      isResizable={false}
      autoSize={false}
      rowHeight={40}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      containerPadding={[5, 5]}
      margin={[5, 5]}
      layouts={{ lg: layouts, md: [], sm: [], xs: [], xxs: [] }}
      className="layout"
    >
      {layouts.map((l: any) => {
        return (
          <Stack key={l.i} alignItems="center" justifyContent="center">
            <Graph
              indicator={l.indicator}
              filterBy={l.filterBy}
              title={l.title}
            />
          </Stack>
        );
      })}
    </ResponsiveGridLayout>
  );
};

export default Analytics;
