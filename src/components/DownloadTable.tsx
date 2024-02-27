import { Button } from "@chakra-ui/react";
import React from "react";

type ButtonProps = {
    label: string;
    onClick: () => void;
    colorScheme: string;
};

const DownloadTable: React.FC<ButtonProps> = ({
    label,
    colorScheme,
    onClick,
}) => {
    return (
        <Button onClick={onClick} type="button" colorScheme={colorScheme}>
            {label}
        </Button>
    );
};

export default DownloadTable;
