import { Button } from '@chakra-ui/button';
import { Flex, HStack, Spacer } from '@chakra-ui/layout';
import { useStore } from 'effector-react';
import { FC, useEffect } from "react";
import {
  useHistory, useLocation
} from "react-router-dom";
import { changeUrl } from '../Events';
import { dashboards, maxLevel, orgUnits } from '../Store';
import VisualizationHeader, { HeaderProps } from './VisualizationHeader';

const Navigation: FC<HeaderProps> = () => {
  let history = useHistory();
  const store = useStore(dashboards);
  const highestLevel = useStore(maxLevel);
  const units = useStore(orgUnits);
  const l = useLocation();
  const handleClick = (url: string) => {
    changeUrl(url);
    let obj: any = { pathname: url };
    // if (url === '/layered') {
    //   const params = new URLSearchParams();
    //   params.append('ou', units);
    //   params.append('level', String(highestLevel))
    //   obj = { ...obj, search: params.toString() }
    // }
    history.push(obj)
  };
  useEffect(() => {
    history.push(l);
    changeUrl(l.pathname);
  }, [l])
  return (
    <Flex p="5px" bg="blackAlpha.300" h="48px">
      <HStack>
        <Button onClick={() => handleClick('/tracker')}>Data Entry</Button>
        <Button onClick={() => handleClick('/')}>Analytics</Button>
        <Button onClick={() => handleClick('/layered')}>Layered Dashboard</Button>
        <Button onClick={() => handleClick('/indicators')}>All Indicators</Button>
      </HStack>
      <Spacer />
      {['/', '/layered', '/indicators'].indexOf(store.url) !== -1 && <VisualizationHeader />}
    </Flex>
  )
}

export default Navigation
