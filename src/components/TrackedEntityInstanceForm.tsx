import { Box, Spinner } from "@chakra-ui/react";
import { useSearch } from "@tanstack/react-location";
import { LocationGenerics } from "../interfaces";
import { useProgramAttributes } from "../Queries";
import InstanceForm from "./InstanceForm";

const TrackedEntityInstanceForm = () => {
    const search = useSearch<LocationGenerics>();

    const { isLoading, isSuccess, isError, error, data } = useProgramAttributes(
        search.program || "",
        search.trackedEntityInstance || "",
        search.isNew || false
    );

    return (
        <Box bg="white" m="auto" w="100%">
            {isLoading && <Spinner />}
            {isSuccess && (
                <InstanceForm
                    programTrackedEntityAttributes={
                        data.program.programTrackedEntityAttributes
                    }
                    instance={data.instance}
                />
            )}
            {isError && <div>{error.message}</div>}
        </Box>
    );
};

export default TrackedEntityInstanceForm;
