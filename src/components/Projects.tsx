import { useState } from "react";

import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  PaginationSeparator,
  usePagination,
} from "@ajna/pagination";
import {
  Box,
  Button,
  Center,
  Heading,
  Select,
  Spacer,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { DatePicker } from "antd";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import moment from "moment";
import * as XLSX from "xlsx";
import { changeOu } from "../Events";
import { useInstances } from "../Queries";
import { $withOptionSet, allIndicators, dashboards } from "../Store";
import { withAttributesAsEvent } from "../utils/common";
import ColumnDrawer from "./ColumnDrawer";
import DisplayEvent from "./DisplayEvent";
import OptionDisplay from "./OptionDisplay";
import OrgUnitTreeSelect from "./OrgUnitTreeSelect";
import ProgramSelect from "./ProgramSelect";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;

const { RangePicker } = DatePicker;

const Projects = () => {
  return <Text>Coming soon</Text>;
  // const store = useStore(dashboards);
  // const engine = useDataEngine();
  // const [selectedDates, setSelectedDates] = useState<any>([
  //   moment().startOf("year"),
  //   moment().endOf("year"),
  // ]);
  // const [downloading, setDownloading] = useState<boolean>(false);
  // const availableIndicators = useStore(allIndicators);
  // const withOptionSet = useStore($withOptionSet);
  // const {
  //   pages,
  //   pagesCount,
  //   currentPage,
  //   setCurrentPage,
  //   isDisabled,
  //   pageSize,
  //   setPageSize,
  // } = usePagination({
  //   total: store.total,
  //   limits: {
  //     outer: OUTER_LIMIT,
  //     inner: INNER_LIMIT,
  //   },
  //   initialState: {
  //     pageSize: 20,
  //     currentPage: 1,
  //   },
  // });

  // const { isLoading, isError, isSuccess, error, data } = useInstances(
  //   store.ou,
  //   store.program,
  //   currentPage,
  //   pageSize,
  //   "DESCENDANTS",
  //   selectedDates[0].format("YYYY-MM-DD"),
  //   selectedDates[1].format("YYYY-MM-DD")
  // );

  // const handlePageChange = (nextPage: number) => {
  //   setCurrentPage(nextPage);
  // };

  // const handlePageSizeChange = (event: any) => {
  //   const pageSize = Number(event.target.value);
  //   setPageSize(pageSize);
  //   setCurrentPage(1);
  // };

  // const display = (record: any, a: string) => {
  //   if (withOptionSet.indexOf(a) !== -1) {
  //     return <OptionDisplay code={record[a]} />;
  //   }
  //   const withEvent = withAttributesAsEvent(a);
  //   if (withEvent) {
  //     return (
  //       <DisplayEvent
  //         programStage={withEvent.programStage}
  //         dataElement={withEvent.dataElement}
  //         event={record[a]}
  //       />
  //     );
  //   }
  //   return record[a];
  // };

  // const download = async () => {
  //   setDownloading(true);
  //   const processedIndicators = fromPairs(availableIndicators);
  //   let params: { [key: string]: any } = {
  //     program: store.program,
  //     skipPaging: "true",
  //     ou: store.ou,
  //     ouMode: "DESCENDANTS",
  //     programStartDate: selectedDates[0].format("YYYY-MM-DD"),
  //     programEndDate: selectedDates[1].format("YYYY-MM-DD"),
  //   };

  //   const {
  //     instances: { headers, rows },
  //     optionSet: { options },
  //   }: any = await engine.query({
  //     instances: {
  //       resource: "trackedEntityInstances/query.json",
  //       params,
  //     },
  //     optionSet: {
  //       resource: `optionSets/uKIuogUIFgl`,
  //       params: {
  //         fields: "options[id,code,name]",
  //       },
  //     },
  //   });

  //   const indicatorGroups = fromPairs(
  //     options.map((o: any) => [o.code, o.name])
  //   );

  //   const index = headers.findIndex((h: any) => h.name === "kHRn35W3Gq4");
  //   const pIndex = headers.findIndex((h: any) => h.name === "TG1QzFgGTex");

  //   const all = [
  //     headers.map((h: any) => h.column),
  //     ...rows.map((h: string[]) => {
  //       return h.map((v, i) => {
  //         if (i === index) {
  //           return processedIndicators[v];
  //         }
  //         if (i === pIndex) {
  //           return indicatorGroups[v];
  //         }
  //         return v;
  //       });
  //     }),
  //   ];

  //   const wb = XLSX.utils.book_new();
  //   const ws = XLSX.utils.aoa_to_sheet(all);
  //   XLSX.utils.book_append_sheet(wb, ws, "export");
  //   XLSX.writeFile(wb, "export.xlsx");
  //   setDownloading(false);
  // };
  // return (
  //   <Stack bg="white" p="5px">
  //     <Stack h="48px" direction="row">
  //       <Box w="20%">
  //         <OrgUnitTreeSelect
  //           multiple={false}
  //           value={store.ou}
  //           onChange={changeOu}
  //         />
  //       </Box>
  //       <Box w="20%">
  //         <ProgramSelect />
  //       </Box>
  //       <Box w="20%">
  //         <RangePicker value={selectedDates} onChange={setSelectedDates} />
  //       </Box>
  //       <Spacer />
  //       <Stack direction="row">
  //         <Button onClick={() => download()} isLoading={downloading}>
  //           Download
  //         </Button>
  //         <ColumnDrawer />
  //       </Stack>
  //     </Stack>
  //     {isLoading && (
  //       <Stack
  //         alignItems="center"
  //         justifyItems="center"
  //         justifyContent="center"
  //         alignContent="center"
  //         h="calc(100vh - 106px)"
  //       >
  //         <Spinner />
  //       </Stack>
  //     )}
  //     <Box overflow="auto" border="3px solid gray" h="800px">
  //       {isSuccess && (
  //         <Table variant="striped" colorScheme="gray" textTransform="none">
  //           <Thead>
  //             <Tr py={1}>
  //               {store.columns
  //                 .filter((s: any) => s.displayInList)
  //                 .map((column: any) => (
  //                   <Th key={column.trackedEntityAttribute.id} minW="200px">
  //                     <Heading as="h6" size="xs" textTransform="none">
  //                       {column.trackedEntityAttribute.name}
  //                     </Heading>
  //                   </Th>
  //                 ))}
  //             </Tr>
  //           </Thead>
  //           <Tbody>
  //             {data.map((record: any) => (
  //               <Tr key={record.instance}>
  //                 {store.columns
  //                   .filter((s: any) => s.displayInList)
  //                   .map((column: any) => (
  //                     <Td
  //                       key={`${record.instance}${column.trackedEntityAttribute.id}`}
  //                     >
  //                       {display(record, column.trackedEntityAttribute.id)}
  //                     </Td>
  //                   ))}
  //               </Tr>
  //             ))}
  //           </Tbody>
  //         </Table>
  //       )}
  //     </Box>
  //     {isError && <div>{error.message}</div>}

  //     <Pagination
  //       pagesCount={pagesCount}
  //       currentPage={currentPage}
  //       isDisabled={isDisabled}
  //       onPageChange={handlePageChange}
  //     >
  //       <PaginationContainer
  //         align="center"
  //         justify="space-between"
  //         p={4}
  //         w="full"
  //       >
  //         <PaginationPrevious
  //           _hover={{
  //             bg: "yellow.400",
  //           }}
  //           bg="yellow.300"
  //         >
  //           <Text>Previous</Text>
  //         </PaginationPrevious>
  //         <PaginationPageGroup
  //           isInline
  //           align="center"
  //           separator={
  //             <PaginationSeparator
  //               onClick={() => console.warn("I'm clicking the separator")}
  //               bg="blue.300"
  //               fontSize="sm"
  //               w={14}
  //               jumpSize={11}
  //             />
  //           }
  //         >
  //           {pages.map((page: number) => (
  //             <PaginationPage
  //               w={14}
  //               bg="red.300"
  //               key={`pagination_page_${page}`}
  //               page={page}
  //               fontSize="sm"
  //               _hover={{
  //                 bg: "green.300",
  //               }}
  //               _current={{
  //                 bg: "green.300",
  //                 fontSize: "sm",
  //                 w: 14,
  //               }}
  //             />
  //           ))}
  //         </PaginationPageGroup>
  //         <PaginationNext
  //           _hover={{
  //             bg: "yellow.400",
  //           }}
  //           bg="yellow.300"
  //         >
  //           <Text>Next</Text>
  //         </PaginationNext>
  //       </PaginationContainer>
  //     </Pagination>
  //     <Center w="full">
  //       <Text>Records per page</Text>
  //       <Select ml={3} onChange={handlePageSizeChange} w={40} value={pageSize}>
  //         <option value="5">5</option>
  //         <option value="10">10</option>
  //         <option value="20">20</option>
  //         <option value="25">25</option>
  //         <option value="50">50</option>
  //         <option value="100">100</option>
  //         <option value="150">150</option>
  //         <option value="200">200</option>
  //       </Select>
  //     </Center>
  //   </Stack>
  // );
};

export default Projects;
