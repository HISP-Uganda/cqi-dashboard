import { Box, Center, Stack } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useEffect, useState } from "react";
import { useEventOptions } from "../../Queries";
import AllIndicators from "../AllIndicators";

const Indicators = () => {
    const { data, isError, isLoading, error, isSuccess } = useEventOptions(
        "vPQxfsUQLEy",
        "kToJ1rk0fwY"
    );
    return (
        <Box>
            {isLoading && <Spinner />}
            {isSuccess && <AllIndicators indicators={data} />}
            {isError && (
                <Center className="biggest-height">{error.message}</Center>
            )}
        </Box>
    );
};

export default Indicators;
