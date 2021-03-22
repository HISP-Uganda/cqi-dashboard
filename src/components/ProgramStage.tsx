import { FC, useEffect, useState } from "react"
import { useQuery } from "react-query";
import { useD2 } from "../Context";
import { getRule } from "../utils/common";
import EditableTable from "./EditableTable";
import MultipleEvents from "./MultipleEvents";

type ProgramStageProps = {
  stage: string;
  tei: string;
}
const ProgramStage: FC<ProgramStageProps> = ({ stage, tei }) => {
  const d2 = useD2();
  const api = d2.Api.getApi();
  const [columns, setColumns] = useState<any[]>([]);
  const { isLoading,
    isError,
    error,
    data
  } = useQuery<any, Error>(
    ["programStages", stage],
    () => fetchStage(),
    { keepPreviousData: true }
  );

  const fetchStage = async () => {
    return await api.get(`programStages/${stage}.json`, {
      fields: "programStageDataElements[compulsory,dataElement[id,name,formName,optionSetValue,valueType,optionSet[options[code,name]]]]"
    });
  }

  useEffect(() => {
    if (data) {
      const processedColumns = data.programStageDataElements.map((des: any) => {
        const { compulsory, dataElement: { id, formName, name, valueType, optionSetValue, optionSet } } = des;
        let rule: any = { type: getRule(valueType), message: `Please Input ${formName || name}!`, };
        if (compulsory) {
          rule = { ...rule, required: true }
        }
        return {
          title: formName || name,
          dataIndex: id,
          key: id,
          editable: true,
          inputType: valueType,
          optionSetValue: optionSetValue,
          compulsory: compulsory,
          rules: [rule],
          options: optionSetValue ? optionSet.options : null
        }
      });
      setColumns(processedColumns);

    }
  }, [data])

  if (isLoading) {
    return <div>Is Loading</div>
  }

  if (isError) {
    return <div>{JSON.stringify(error)}</div>
  }

  return (
    // <EditableTable columns={columns} tei={tei} stage={stage} />
    <MultipleEvents />
  )
}

export default ProgramStage

