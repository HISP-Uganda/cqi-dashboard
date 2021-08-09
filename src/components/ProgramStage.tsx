import { FC, useEffect, useState } from "react"
import { useQuery } from "react-query";
import { useD2 } from "../Context";
import { getRule } from "../utils/common";
import EditableTable from "./EditableTable";
import MultipleEvents from "./MultipleEvents";
import NormalForm from "./NormalForm";

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
    ["programStage", stage],
    () => fetchStage()
  );

  const fetchStage = async () => {
    return await api.get(`programStages/${stage}.json`, {
      fields: "sortOrder,programStageDataElements[compulsory,dataElement[id,name,formName,optionSetValue,valueType,optionSet[options[code,name]]]]"
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
      setColumns([{
        title: 'Registration Date',
        dataIndex: 'eventDate',
        key: 'eventDate',
        editable: true,
        inputType: 'DATE',
        optionSetValue: false,
        compulsory: true,
        rules: [{ required: true, type: 'date', message: `Please Input event date!`, }],
        options: null
      }, ...processedColumns]);

    }
  }, [data])

  if (isError) {
    return <div>{JSON.stringify(error)}</div>
  }

  if (isLoading) {
    return <div>Is Loading</div>
  }

  if (data && data.sortOrder === 1) {
    return <EditableTable columns={columns} tei={tei} stage={stage} />
  }

  if (data && data.sortOrder === 2) {
    return <MultipleEvents stage={stage} tei={tei} />
  }

  return <NormalForm />
}

export default ProgramStage

