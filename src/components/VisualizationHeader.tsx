import { Button, useDisclosure } from "@chakra-ui/react";
import { FC } from "react";
export interface HeaderProps {}
const VisualizationHeader: FC<HeaderProps> = () => {
  const { onOpen } = useDisclosure();

  return <Button onClick={onOpen}>Filters</Button>;
};

export default VisualizationHeader;
