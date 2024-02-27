import { Spinner, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useEventAndOption } from "../Queries";
const DisplayEvent: FC<{
    dataElement: string;
    programStage: string;
    event: string;
}> = ({ dataElement, programStage, event }) => {
    const { isLoading, isSuccess, isError, data, error } = useEventAndOption(
        event,
        programStage,
        dataElement
    );
    return (
        <>
            {isLoading && <Spinner />}
            {isSuccess && <Text>{data}</Text>}
            {isError && <Text>{error.message}</Text>}
        </>
    );
};

export default DisplayEvent;
