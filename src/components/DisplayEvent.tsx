import { Spinner, Td, Text, Box } from "@chakra-ui/react";
import { FC } from "react";
import { useEventAndOption } from "../Queries";
import { truncateText } from "../utils/common";
const DisplayEvent: FC<{
    programStage: string;
    event: string;
}> = ({ programStage, event }) => {
    const { isLoading, isSuccess, isError, data, error } = useEventAndOption(
        event,
        programStage,
    );
    return (
        <>
            {isLoading && <Spinner />}
            {isSuccess && (
                <>
                    <Td>
                        <Box
                            as="span"
                            position="relative"
                            _hover={{
                                _after: {
                                    content: `"${data["kToJ1rk0fwY"]}"`,
                                    position: "absolute",
                                    backgroundColor: "gray.300",
                                    border: "1px solid gray.500",
                                    width: "300px",
                                    padding: "8px",
                                    whiteSpace: "pre-line",
                                    zIndex: 1,
                                    left: "0",
                                    top: "100%",
                                    transform: "translateY(4px)",
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                },
                            }}
                        >
                            {truncateText(data["kToJ1rk0fwY"], 50)}
                        </Box>
                    </Td>
                    <Td>
                        <Box
                            as="span"
                            position="relative"
                            _hover={{
                                _after: {
                                    content: `"${data["WI6Qp8gcZFX"]}"`,
                                    position: "absolute",
                                    backgroundColor: "gray.100",
                                    border: "1px solid gray.300",
                                    // width: "200px",
                                    padding: "8px",
                                    whiteSpace: "pre-line",
                                    zIndex: 1,
                                    left: "0",
                                    top: "100%",
                                    transform: "translateY(4px)",
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                },
                            }}
                        >
                            {truncateText(data["WI6Qp8gcZFX"], 50)}
                        </Box>
                    </Td>
                    <Td>
                        <Box
                            as="span"
                            position="relative"
                            _hover={{
                                _after: {
                                    content: `"${data["krwzUepGwj7"]}"`,
                                    position: "absolute",
                                    backgroundColor: "gray.100",
                                    border: "1px solid gray.300",
                                    // width: "200px",
                                    padding: "8px",
                                    // whiteSpace: "nowrap",
                                    zIndex: 1,
                                    left: "0",
                                    top: "100%",
                                    transform: "translateY(4px)",
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                },
                            }}
                        >
                            {truncateText(data["krwzUepGwj7"], 50)}
                        </Box>
                    </Td>
                </>
            )}
            {isError && <Text>{error.message}</Text>}
        </>
    );
};

export default DisplayEvent;
