import dayjs from "dayjs";
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
            data={stageData.map(
                ({
                    dataValues,
                    dueDate,
                    eventDate,
                    lastUpdated,
                    ...others
                }: any) => {
                    const computedDataValues = fromPairs(
                        dataValues.map((dv: any) => {
                            const column = columns.find(
                                (c) => c.key === dv.dataElement
                            );

                            if (
                                column &&
                                dv.value &&
                                (column.inputType === "DATE" ||
                                    column.inputType === "TIME" ||
                                    column.inputType === "DATETIME")
                            ) {
                                return [dv.dataElement, dayjs(dv.value)];
                            }
                            return [dv.dataElement, dv.value];
                        })
                    );

                    let worksheet: ChangeWorkSheet = {
                        ...others,
                        ...computedDataValues,
                    };

                    if (dueDate) {
                        worksheet = { ...worksheet, dueDate: dayjs(dueDate) };
                    }
                    if (eventDate) {
                        worksheet = {
                            ...worksheet,
                            eventDate: dayjs(eventDate),
                        };
                    }
                    if (lastUpdated) {
                        worksheet = {
                            ...worksheet,
                            lastUpdated: dayjs(lastUpdated),
                        };
                    }

                    return worksheet;
                }
            )}
            columns={columns}
            stage={stage}
            tei={tei}
            project={project}
        />
    );
};

export default EditableTable;
