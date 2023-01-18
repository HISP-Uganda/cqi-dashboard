import { Box, Spinner } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { FC } from "react";
import Plot from "react-plotly.js";
import { useAnalytics } from "../Queries";
import { orgUnits, periods } from "../Store";

interface GraphOptions {
  indicator: string;
  filterBy: string;
  title?: string;
}
const Graph: FC<GraphOptions> = ({ indicator, filterBy, title }) => {
  const periods$ = useStore(periods);
  const orgUnits$ = useStore(orgUnits);
  const { data, isError, isLoading, error, isSuccess } = useAnalytics(
    "vMfIVFcRWlu",
    "kHRn35W3Gq4",
    indicator,
    "rVZlkzOwWhi",
    "RgNQcLejbwX",
    orgUnits$,
    periods$,
    filterBy,
    "SUM",
    true,
    true
  );

  return (
    <>
      {isLoading && <Spinner />}

      {isSuccess && (
        <Plot
          data={[
            {
              x: Object.keys(data).map((x) => data[x].display),
              y: Object.keys(data).map((x) => data[x].indicator),
              type: "bar",
              mode: "lines+markers",
              marker: { color: "#add8e6" },
            },
          ]}
          layout={{
            title: {
              text: title,
            },
            autosize: true,
            // plot_bgcolor: "black",
            // paper_bgcolor: "black",
            // showlegend: true,
            legend: {
              orientation: "h",
              yanchor: "bottom",
              y: 1.02,
              xanchor: "right",
              x: 1,
            },
            xaxis: {
              automargin: true,
              showgrid: false,
              // title: "This is testing 1",
            },
            yaxis: {
              automargin: true,
              rangemode: "tozero",
              title: "Value",
            },
            margin: {
              pad: 0,
              t: 40,
              r: 0,
              b: 20,
              // l: 20
            },
          }}
          style={{ width: `100%`, height: `100%`, position: "absolute" }}
          config={{ displayModeBar: false }}
        />
      )}
      {isError && <Box>{error.message}</Box>}
    </>
  );
};

export default Graph;
