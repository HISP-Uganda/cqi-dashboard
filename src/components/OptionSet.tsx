import { ChangeEvent, FC, useEffect } from "react";
import { Select } from '@chakra-ui/react'
import { useD2 } from "../Context"
import { useOptionSet } from "../Queries";
import { useStore } from "effector-react";
import { dashboards } from "../Store";
import { changeIndicatorGroup } from "../Events";

interface OptionSetProps {
  optionSet: string;
}
const OptionSet: FC<OptionSetProps> = ({ optionSet }) => {
  const store = useStore(dashboards);
  const d2 = useD2();
  const { data, isError, isLoading, error, isSuccess } = useOptionSet(d2, optionSet);

  const onIndicatorGroupChange = (e:ChangeEvent<HTMLSelectElement>)=>{
    changeIndicatorGroup(e.target.value);
  }

  useEffect(() => {
    if (data) {
      changeIndicatorGroup(data[0].code)
    }
  }, [data])

  return (
    <>
      {isLoading && <div>Loading</div>}
      {isSuccess && <div style={{ padding: 10, width: '100%' }}>
        <Select style={{ width: "100%" }} value={store.indicatorGroup} onChange={onIndicatorGroupChange}>
          {data.map((option: any) => <option key={option.id} value={option.code}>{option.name}</option>)}
        </Select>
      </div>}
      {isError && <div>{error.message}</div>}
    </>
  )
}

export default OptionSet
