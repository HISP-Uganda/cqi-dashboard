import { Box, Button, Spinner, Stack, useToast } from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate } from "@tanstack/react-location";
import { Form } from "antd";
import FormBuilder from "antd-form-builder";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addIndicator,
  changeIndicatorGroup,
  changeInstance,
  changeProject,
} from "../Events";
import { useProgramAttributes } from "../Queries";
import { dashboards, indicatorForGroup } from "../Store";
import { getFieldType } from "../utils/common";
import { generateUid } from "../utils/uid";
import NewIndicator from "./NewIndicator";
import InstanceForm from "./InstanceForm";

const TrackedEntityInstanceForm = () => {
  // const toast = useToast();
  // const navigate = useNavigate();
  // const engine = useDataEngine();
  // const [form] = Form.useForm();
  // const [formMetadata, setFormMetadata] = useState<any>();
  // const [generatedIds, setGeneratedIds] = useState<any>();
  // const queryClient = useQueryClient();
  // const indicators = useStore(indicatorForGroup);
  const store = useStore(dashboards);
  // const [modalVisible, setModalVisible] = useState(false);
  // const [submitting, setSubmitting] = useState<boolean>(false);
  // const [currentGroup, setCurrentGroup] = useState<string>(
  //   store.indicatorGroup
  // );

  // const addEvent = async (data: any) => {
  //   const mutation: any = {
  //     type: "create",
  //     resource: "events",
  //     data,
  //   };
  //   return await engine.mutate(mutation);
  // };

  // const { mutateAsync: insertEvent } = useMutation(addEvent, {
  //   onSuccess: async (data, variables) => {
  //     await queryClient.invalidateQueries(["userUnits"]);
  //     const grp = variables.dataValues.find(
  //       (dv: any) => dv.dataElement === "kuVtv8R9n8q"
  //     );
  //     changeIndicatorGroup(grp.value);
  //   },
  // });

  const { isLoading, isSuccess, isError, error, data } = useProgramAttributes(
    store.program
  );

  // const addTrackedEntityInstance = async (data: any) => {
  //   const mutation: any = {
  //     type: "create",
  //     resource: "trackedEntityInstances",
  //     data,
  //   };
  //   return await engine.mutate(mutation);
  // };

  // const { mutateAsync } = useMutation(addTrackedEntityInstance, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries([
  //       "trackedEntityInstances",
  //       1,
  //       store.ou,
  //       store.program,
  //       10,
  //     ]);
  //   },
  // });

  // const handleFinish = async (values: any) => {
  //   setSubmitting(true);
  //   const instance = generateUid();
  //   const withValues: any = Object.entries(values).reduce(
  //     (a: any, [k, v]) => (v == null ? a : ((a[k] = v), a)),
  //     {}
  //   );
  //   const enrollmentDate = withValues["y3hJLGjctPk"];
  //   const attributes = Object.entries(withValues).map(([attribute, v]) => {
  //     let value = v;
  //     if (v instanceof moment) {
  //       value = moment(v).format("YYYY-MM-DD");
  //     }
  //     return {
  //       attribute,
  //       value,
  //     };
  //   });

  //   const trackedEntityInstance = {
  //     trackedEntityInstance: instance,
  //     orgUnit: store.ou,
  //     trackedEntityType: store.trackedEntityType,
  //     attributes,
  //     enrollments: [
  //       {
  //         orgUnit: store.ou,
  //         program: store.program,
  //         enrollmentDate: enrollmentDate.format("YYYY-MM-DD"),
  //         incidentDate: enrollmentDate.format("YYYY-MM-DD"),
  //       },
  //     ],
  //   };
  //   try {
  //     await mutateAsync(trackedEntityInstance);
  //     changeProject(values);
  //     changeInstance(instance);
  //     navigate({ to: "/data-entry/tracked-entity-instance" });
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: <p>{error.message}</p>,
  //       status: "error",
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //   }
  //   setSubmitting(false);
  // };

  // const generateFormFields = (currentData: any) => {
  //   let fields: any[] = [];
  //   let other: any[] = [];
  //   if (currentData && currentData.programTrackedEntityAttributes) {
  //     other = currentData.programTrackedEntityAttributes.map((pTea: any) => {
  //       const {
  //         mandatory,
  //         trackedEntityAttribute: { optionSetValue, optionSet, generated, id },
  //         valueType,
  //       } = pTea;
  //       let field: any = {
  //         key: pTea.trackedEntityAttribute.id,
  //         label: pTea.trackedEntityAttribute.displayFormName,
  //         required: mandatory,
  //         widget: getFieldType(valueType, optionSetValue),
  //       };
  //       if (optionSetValue) {
  //         field = {
  //           ...field,
  //           options: optionSet.options.map((o: any) => [o.code, o.name]),
  //         };
  //       }

  //       if (id === "kHRn35W3Gq4") {
  //         field = {
  //           ...field,
  //           options: indicators,
  //           widget: "select",
  //           dynamic: true,
  //           widgetProps: {
  //             onChange: (value: string) => {
  //               if (value === "add") {
  //                 setModalVisible(true);
  //               }
  //             },
  //           },
  //         };
  //       }

  //       if (id === "iInAQ40vDGZ") {
  //         field = {
  //           ...field,
  //           widgetProps: {
  //             disabledDate: (currentDate: moment.Moment) => {
  //               return currentDate.isBefore(form.getFieldValue("y3hJLGjctPk"));
  //             },
  //           },
  //         };
  //       }

  //       if (id === "y3hJLGjctPk") {
  //         field = {
  //           ...field,
  //           widgetProps: {
  //             onChange: (value: string) => {
  //               form.setFieldsValue({ iInAQ40vDGZ: undefined });
  //             },
  //           },
  //         };
  //       }

  //       if (id === "TG1QzFgGTex") {
  //         field = {
  //           ...field,
  //           widgetProps: {
  //             onChange: (value: string) => {
  //               form.setFieldsValue({ kHRn35W3Gq4: undefined });
  //               changeIndicatorGroup(value);
  //               setCurrentGroup(value);
  //             },
  //           },
  //         };
  //       }
  //       if (generated) {
  //         field = { ...field, disabled: true };
  //       }
  //       return field;
  //     });
  //   }

  //   if (currentData.id === "T3geRmoJ9Wt") {
  //     fields = [
  //       {
  //         key: "y3hJLGjctPk",
  //         label: "Plan Date",
  //         required: true,
  //         widget: "date-picker",
  //       },
  //     ];
  //   }

  //   fields = [...fields, ...other];

  //   return {
  //     columns: 2,
  //     formItemLayout: null,
  //     colon: true,
  //     fields,
  //   };
  // };

  // const generateData = async (program: any) => {
  //   if (program && program.programTrackedEntityAttributes) {
  //     const uniques = program.programTrackedEntityAttributes
  //       .filter((a: any) => a.trackedEntityAttribute.generated)
  //       .map(({ trackedEntityAttribute: { id } }: any) => {
  //         return [
  //           id,
  //           {
  //             resource: `trackedEntityAttributes/${id}/generate`,
  //           },
  //         ];
  //       });
  //     const response = await engine.query(fromPairs(uniques));
  //     setGeneratedIds(
  //       fromPairs(
  //         Object.values(response).map(({ ownerUid, value }: any) => [
  //           ownerUid,
  //           value,
  //         ])
  //       )
  //     );
  //   }
  // };

  // useEffect(() => {
  //   if (data) {
  //     setFormMetadata(generateFormFields(data));
  //     generateData(data);
  //   }
  // }, [data, store.indicatorGroup, indicators, currentGroup]);

  // useEffect(() => {
  //   if (generatedIds) {
  //     form.setFieldsValue(generatedIds);
  //   }
  // }, [generatedIds]);

  return (
    <Box bg="white" m="auto" p="30px">
      {isLoading && <Spinner />}
      {isSuccess && (
        <InstanceForm {...data} />
        // <Form
        //   form={form}
        //   onFinish={handleFinish}
        //   layout="vertical"
        //   initialValues={store.project}
        // >
        //   <FormBuilder meta={formMetadata} form={form} />
        //   <Stack direction="row">
        //     <Form.Item>
        //       <Button type="submit" isLoading={submitting}>
        //         Submit
        //       </Button>
        //     </Form.Item>
        //     <Form.Item>
        //       <Button
        //         type="submit"
        //         colorScheme="red"
        //         onClick={() => navigate({ to: "/data-entry" })}
        //       >
        //         Cancel
        //       </Button>
        //     </Form.Item>
        //   </Stack>
        //   <NewIndicator
        //     onInsert={onInsert}
        //     modalVisible={modalVisible}
        //     setModalVisible={setModalVisible}
        //   />
        // </Form>
      )}
      {isError && <div>{error.message}</div>}
    </Box>
  );
};

export default TrackedEntityInstanceForm;
