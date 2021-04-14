import { Button } from '@chakra-ui/button';
import { HStack } from '@chakra-ui/layout';
import { FC, useState } from "react";
import {
  useHistory
} from "react-router-dom";
import { changeUrl } from '../Events';
import VisualizationHeader, { HeaderProps } from './VisualizationHeader';

const Navigation: FC<HeaderProps> = () => {
  let history = useHistory();
  const [current, setCurrent] = useState<string>('analytics');
  const handleClick = (url: string) => {
    setCurrent(url);
    changeUrl(url);
    history.push(url)
  };
  return (
    <HStack>
      <Button onClick={() => handleClick('analytics')}>Analytics</Button>
      <Button onClick={() => handleClick('layered')}>Layered Dashboard</Button>
      <Button onClick={() => handleClick('indicators')}>All Indicators</Button>
      <Button onClick={() => handleClick('tracker')}>Data Entry</Button>
      {['analytics', 'layered', 'indicators', ''].indexOf(current) !== -1 && <VisualizationHeader />}
    </HStack>
  )
}

export default Navigation
