import { Spinner } from "@chakra-ui/react";
import { fromPairs } from "lodash";
import { Column, Project } from "../interfaces";
import { useStage } from "../Queries";
import EditableTable from "./EditableTable";
import MultipleEvents from "./MultipleEvents";
import NormalForm from "./NormalForm";

type ProgramStageProps = {
    tei: string;
    stageData: any[];
    stage: string;
    project: Partial<Project>;
};

const ProgramStage = ({
    tei,
    stage,
    stageData,
    project,
}: ProgramStageProps) => {
    const { isLoading, isError, isSuccess, error, data } = useStage(stage);

    const findDisplay = ({
        columns,
        sortOrder,
    }: {
        columns: Column[];
        sortOrder: any;
    }) => {
        if (sortOrder === 1) {
            return (
                <EditableTable
                    stageData={stageData}
                    columns={columns}
                    tei={tei}
                    stage={stage}
                    project={project}
                />
            );
        }
        if (sortOrder === 2) {
            return (
                <MultipleEvents
                    stageData={stageData.map(
                        ({ dataValues, ...others }: any) => {
                            return {
                                ...others,
                                ...fromPairs(
                                    dataValues.map((dv: any) => {
                                        return [
                                            dv.dataElement,
                                            [
                                                "rVZlkzOwWhi",
                                                "RgNQcLejbwX",
                                            ].indexOf(dv.dataElement) !== -1
                                                ? Number(dv.value)
                                                : dv.value,
                                        ];
                                    })
                                ),
                            };
                        }
                    )}
                    stage={stage}
                    tei={tei}
                    project={project}
                />
            );
        }

        return (
            <NormalForm
                stage={stage}
                tei={tei}
                stageData={stageData.map(({ dataValues, ...others }: any) => {
                    return {
                        ...others,
                        ...fromPairs(
                            dataValues.map((dv: any) => {
                                return [dv.dataElement, dv.value];
                            })
                        ),
                    };
                })}
                project={project}
            />
        );
    };

    if (isLoading) return <Spinner />;

    if (isSuccess) return findDisplay(data);

    return <div>{error.message}</div>;
};

export default ProgramStage;
