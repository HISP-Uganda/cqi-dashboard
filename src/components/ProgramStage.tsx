import { Box } from "@chakra-ui/react";
import { FC } from "react";
import { useStage } from "../Queries";
import EditableTable from "./EditableTable";
import MultipleEvents from "./MultipleEvents";
import NormalForm from "./NormalForm";

type ProgramStageProps = {
  stage: string;
  tei: string;
};

const ProgramStage = ({ stage, tei }: ProgramStageProps) => {
  const { isLoading, isError, isSuccess, error, data } = useStage(stage);

  const findDisplay = ({ columns, sortOrder }: any) => {
    if (sortOrder === 1) {
      return <EditableTable columns={columns} tei={tei} stage={stage} />;
    }
    if (sortOrder === 2) {
      return <MultipleEvents stage={stage} tei={tei} />;
    }

    return <NormalForm stage={stage} tei={tei} />;
  };

  return (
    <Box>
      {isLoading && <div>Is Loading</div>}
      {isSuccess && findDisplay(data)}
      {isError && <div>{error.message}</div>}
    </Box>
  );
};

export default ProgramStage;
