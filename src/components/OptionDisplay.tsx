import { Spinner, Td, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useOption } from "../Queries";

const OptionDisplay: FC<{ code: string }> = ({ code }) => {
    const { isLoading, isSuccess, isError, data, error } = useOption(code);
    return (
        <>
            {isLoading && <Spinner />}
            {isSuccess && (
                <Td fontSize="16px" cursor="pointer">
                    {data}
                </Td>
            )}
            {isError && <Text>{error.message}</Text>}
        </>
    );
};

export default OptionDisplay;
