import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useState } from "react";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import { changeOus, toggleCount } from "../../Events";
import { $analyticsPeriods, allIndicators, dashboards } from "../../Store";
import { relativePeriods2 } from "../../utils";
import AdminAnalytics from "../AdminAnalytics";
import Indicator from "../Indicator";
import IndicatorGroup from "../IndicatorGroup";
import OrganisationLevel from "../OrganisationLevel";
import OrgUnitTreeSelect from "../OrgUnitTreeSelect";
import PeriodPicker from "../PeriodPicker";
import {
  generateOuCountData,
  getDataByProjects,
  getNalyticsStructure,
} from "../../Queries";
import { useDataEngine } from "@dhis2/app-runtime";
import { setWith } from "lodash";

interface OrgUnit {
  id: string;
  name: string;
  level: number;
  parent?: {
    name: string;
  };
}

const AdminDashboard = () => {
  const store = useStore(dashboards);
  const engine = useDataEngine();
  const [indicator, setIndicator] = useState<string | undefined>();
  const analyticsPeriods = useStore($analyticsPeriods);
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

  const downloadData = async () => {
    if (store.countUnits) {
      const availableIndicators = store.indicators.filter((row: any) => {
        if (indicatorGroup && indicator) {
          return row.kuVtv8R9n8q === indicatorGroup && row.event === indicator;
        }
        if (indicatorGroup) {
          return row.kuVtv8R9n8q === indicatorGroup;
        }
        return true;
      });

      const generatedData = await generateOuCountData({
        program: "vMfIVFcRWlu",
        indicator: availableIndicators,
        period: analyticsPeriods,
        unit: store.ous.join(";"),
        level: store.level,
        engine,
      });

      const processedData = availableIndicators.map((e) => {
        return [
          e.kToJ1rk0fwY,
          ...analyticsPeriods.flatMap((p) => [
            generatedData[e.event]?.[`pe${p}`]?.total ?? 0,
            generatedData[e.event]?.[`pe${p}`]?.running ?? 0,
            generatedData[e.event]?.[`pe${p}`]?.completed ?? 0,
          ]),
        ];
      });

      let ws = utils.aoa_to_sheet([
        ["", ...analyticsPeriods.flatMap((p) => [p, p, p])],
        [
          "",
          ...analyticsPeriods.flatMap(() => ["Total", "Running", "Completed"]),
        ],
        ...processedData,
      ]);

      const merge = [
        { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 0, c: 6 } },
      ];
      ws["!merges"] = merge;
      var wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Testing");
      var wbout = write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        `download.xlsx`
      );
    } else {
      let organisationUnits = store.ous;
      if (store.level) {
        organisationUnits = [...organisationUnits, store.level];
      }
      try {
        const structure = await getNalyticsStructure(
          engine,
          realPeriods.join(";"),
          organisationUnits.join(";")
        );
        const data: any = await getDataByProjects({
          program: "vMfIVFcRWlu",
          engine,
          indicator,
          indicatorGroup,
          period: realPeriods.join(";"),
          unit: organisationUnits.join(";"),
          level: store.level,
        });

        const processedData = structure.metaData.dimensions.ou.map(
          (row: string) => {
            return [
              structure.metaData.items[row].name,
              ...analyticsPeriods.flatMap((p) => {
                const running = data["0"]?.[p]?.[row] ?? 0;
                const completed = data["1"]?.[p]?.[row] ?? 0;
                let total = Number(running) + Number(completed);
                return [total, running, completed];
              }),
            ];
          }
        );

        let ws = utils.aoa_to_sheet([
          ["", ...analyticsPeriods.flatMap((p) => [p, p, p])],
          [
            "",
            ...analyticsPeriods.flatMap(() => [
              "Total",
              "Running",
              "Completed",
            ]),
          ],
          ...processedData,
        ]);

        const merge = [
          { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },
          { s: { r: 0, c: 4 }, e: { r: 0, c: 6 } },
        ];
        ws["!merges"] = merge;
        var wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Testing");
        var wbout = write(wb, { bookType: "xlsx", type: "array" });
        saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          `data.xlsx`
        );
      } catch (error: any) {
        console.log(error?.message);
      }
    }
  };

  const fetchOrgUnits = async (
    ous: string[],
    level: string
  ): Promise<OrgUnit[] | null> => {
    const query = {
      ou: {
        resource: "organisationUnits",
        params: {
          fields: "id,name,level,parent[name]",
          filter: `path:like:${ous.join(";")}`,
          level: level,
          paging: false,
        },
      },
    };

    try {
      const response: any = await engine.query(query);
      if (
        response &&
        response.ou &&
        Array.isArray(response.ou.organisationUnits)
      ) {
        return response.ou.organisationUnits as OrgUnit[];
      }
      return null;
    } catch (error) {
      console.error("Error fetching organisation units:", error);
      return null;
    }
  };

  return (
    <Stack p="5px" spacing="0" overflow="auto">
      <Stack
        direction="row"
        alignItems="center"
        flex={1}
        p="15px"
        bgColor="white"
      >
        <Stack direction="row" zIndex="10000" alignItems="center" flex={1}>
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
        <Stack direction="row" flex={1} alignItems="center" zIndex="10000">
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
        <Stack direction="row" alignItems="center" flex={1} zIndex="9000">
          <Text color="#0b72ef" fontWeight="bold">
            Level
          </Text>
          <OrganisationLevel />
        </Stack>
        <Stack direction="row" alignItems="center" flex={1}>
          <Text color="#0b72ef" fontWeight="bold">
            Period
          </Text>
          <PeriodPicker fixed={true} />
        </Stack>
        <Button onClick={() => toggleCount()}>
          {store.countUnits ? "Count by Projects" : "Count by Org.Units"}
        </Button>
        <Button onClick={() => downloadData()}>Download</Button>
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
