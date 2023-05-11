import { fromPairs } from "lodash";
import { FC } from "react";
import { ChangeWorkSheet, Column, Project } from "../interfaces";
import Editable from "./Editable";
interface TableProps {
    columns: Column[];
    tei: string;
    stage: string;
    stageData: any[];
    project: Partial<Project>;
}

const EditableTable: FC<TableProps> = ({
    tei,
    stage,
    columns,
    stageData,
    project,
}) => {
    return (
        <Editable
            data={stageData.map(({ dataValues, ...others }: any) => {
                const worksheet: ChangeWorkSheet = {
                    ...others,
                    ...fromPairs(
                        dataValues.map((dv: any) => [dv.dataElement, dv.value])
                    ),
                };
                return worksheet;
            })}
            columns={columns}
            stage={stage}
            tei={tei}
            project={project}
        />
    );
};

export default EditableTable;
