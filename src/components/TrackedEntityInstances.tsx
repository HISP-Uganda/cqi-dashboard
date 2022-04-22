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
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import {
  changeDataEntryPage,
  changeInstance,
  changeOu,
  changeProject,
} from "../Events";
import { useInstances } from "../Queries";
import { $withOptionSet, dashboards } from "../Store";
import { withAttributesAsEvent } from "../utils/common";
import ColumnDrawer from "./ColumnDrawer";
import DisplayEvent from "./DisplayEvent";
import OptionDisplay from "./OptionDisplay";
import OrgUnitTreeSelect from "./OrgUnitTreeSelect";
import ProgramSelect from "./ProgramSelect";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;

const TrackedEntityInstances = () => {
  const store = useStore(dashboards);
  const withOptionSet = useStore($withOptionSet);
  const {
    pages,
    pagesCount,
    currentPage,
    setCurrentPage,
    isDisabled,
    pageSize,
    setPageSize,
  } = usePagination({
    total: store.total,
    limits: {
      outer: OUTER_LIMIT,
      inner: INNER_LIMIT,
    },
    initialState: {
      pageSize: 20,
      currentPage: 1,
    },
  });

  const { isLoading, isError, isSuccess, error, data } = useInstances(
    store.ou,
    store.program,
    currentPage,
    pageSize
  );

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (event: any) => {
    const pageSize = Number(event.target.value);
    setPageSize(pageSize);
    setCurrentPage(1);
  };

  const display = (record: any, a: string) => {
    if (withOptionSet.indexOf(a) !== -1) {
      return <OptionDisplay code={record[a]} />;
    }
    const withEvent = withAttributesAsEvent(a);
    if (withEvent) {
      return (
        <DisplayEvent
          programStage={withEvent.programStage}
          dataElement={withEvent.dataElement}
          event={record[a]}
        />
      );
    }
    return record[a];
  };

  const add = () => {
    changeDataEntryPage("form");
  };

  const onRowClick = (instance: any) => {
    changeProject({
      startDate: instance.y3hJLGjctPk,
      endDate: instance.iInAQ40vDGZ,
      frequency: instance.WQcY6nfPouv,
      indicator: instance.kHRn35W3Gq4,
    });
    changeInstance(instance.instance);
    changeDataEntryPage("instance");
  };

  return (
    <Stack p="5px">
      <Stack h="48px" direction="row">
        <Box w="34%">
          <OrgUnitTreeSelect
            multiple={false}
            value={store.ou}
            onChange={changeOu}
          />
        </Box>
        <Box w="34%">
          <ProgramSelect />
        </Box>
        <Spacer />
        <Stack direction="row">
          <Button onClick={() => add()}>Add</Button>
          <ColumnDrawer />
        </Stack>
      </Stack>
      <Box overflow="auto" border="3px solid gray" h="800px">
        {isLoading && <div>Is Loading</div>}
        {isSuccess && (
          <Table variant="striped" colorScheme="gray" textTransform="none">
            <Thead>
              <Tr py={1}>
                {store.columns
                  .filter((s: any) => s.displayInList)
                  .map((column: any) => (
                    <Th key={column.trackedEntityAttribute.id} minW="200px">
                      <Heading as="h6" size="xs" textTransform="none">
                        {column.trackedEntityAttribute.name}
                      </Heading>
                    </Th>
                  ))}
              </Tr>
            </Thead>
            <Tbody>
              {data.map((record: any) => (
                <Tr key={record.instance} onClick={() => onRowClick(record)}>
                  {store.columns
                    .filter((s: any) => s.displayInList)
                    .map((column: any) => (
                      <Td
                        fontSize="16px"
                        cursor="pointer"
                        key={`${record.instance}${column.trackedEntityAttribute.id}`}
                      >
                        {display(record, column.trackedEntityAttribute.id)}
                      </Td>
                    ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {isError && <div>{error.message}</div>}
      </Box>

      <Pagination
        pagesCount={pagesCount}
        currentPage={currentPage}
        isDisabled={isDisabled}
        onPageChange={handlePageChange}
      >
        <PaginationContainer
          align="center"
          justify="space-between"
          p={4}
          w="full"
        >
          <PaginationPrevious
            _hover={{
              bg: "yellow.400",
            }}
            bg="yellow.300"
          >
            <Text>Previous</Text>
          </PaginationPrevious>
          <PaginationPageGroup
            isInline
            align="center"
            separator={
              <PaginationSeparator
                onClick={() => console.warn("I'm clicking the separator")}
                bg="blue.300"
                fontSize="sm"
                w={14}
                jumpSize={11}
              />
            }
          >
            {pages.map((page: number) => (
              <PaginationPage
                w={14}
                bg="red.300"
                key={`pagination_page_${page}`}
                page={page}
                fontSize="sm"
                _hover={{
                  bg: "green.300",
                }}
                _current={{
                  bg: "green.300",
                  fontSize: "sm",
                  w: 14,
                }}
              />
            ))}
          </PaginationPageGroup>
          <PaginationNext
            _hover={{
              bg: "yellow.400",
            }}
            bg="yellow.300"
          >
            <Text>Next</Text>
          </PaginationNext>
        </PaginationContainer>
      </Pagination>
      <Center w="full">
        <Text>Records per page</Text>
        <Select ml={3} onChange={handlePageSizeChange} w={40} value={pageSize}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="150">150</option>
          <option value="200">200</option>
        </Select>
      </Center>
    </Stack>
  );
};

export default TrackedEntityInstances;
