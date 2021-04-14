import { useStore } from "effector-react";
import { FC } from "react";
import { dashboards } from "../Store";
import Indicator from "./Indicator";
import OptionSet from "./OptionSet";
import OuTreeDialog from "./OuTreeDialog";
import PeriodDialog from "./PeriodDialog";

export interface HeaderProps {
}
const VisualizationHeader: FC<HeaderProps> = () => {
  const store = useStore(dashboards)
  return (
    <div style={{ display: 'flex', width: '70%' }}>
      {store.url !== 'indicators' && <>
        <OptionSet optionSet="uKIuogUIFgl" />
        <Indicator
          search={store.indicatorGroup}
          programStage="vPQxfsUQLEy"
          dataElement="kuVtv8R9n8q"
          dataElements="kToJ1rk0fwY"
        />
      </>}
      {store.url === 'indicators' && <div style={{ padding: 10 }}>
        <OuTreeDialog />
      </div>}
      <div style={{ padding: 10 }}>
        <PeriodDialog />
      </div>
    </div>
  )
}

export default VisualizationHeader
