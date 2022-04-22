import { Box, Spinner, Stack } from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { Button, Form } from "antd";
import FormBuilder from "antd-form-builder";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { changeDataEntryPage, changeIndicatorGroup } from "../Events";
import { useProgramAttributes } from "../Queries";
import { dashboards, indicatorForGroup } from "../Store";
import { getFieldType } from "../utils/common";
import { generateUid } from "../utils/uid";
import NewIndicator from "./NewIndicator";

const TrackedEntityInstanceForm = () => {
  const engine = useDataEngine();
  const [form] = Form.useForm();
  const [formMetadata, setFormMetadata] = useState<any>();
  const [generatedIds, setGeneratedIds] = useState<any>();
  const queryClient = useQueryClient();
  const indicators = useStore(indicatorForGroup);
  const store = useStore(dashboards);
  const [modalVisible, setModalVisible] = useState(false);

  const [currentGroup, setCurrentGroup] = useState<string>(
    store.indicatorGroup
  );

  const addEvent = async (data: any) => {
    const mutation: any = {
      type: "create",
      resource: "events",
      data,
    };
    return await engine.mutate(mutation);
  };

  const { mutateAsync: insertEvent } = useMutation(addEvent, {
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries(["userUnits"]);
      const grp = variables.dataValues.find(
        (dv: any) => dv.dataElement === "kuVtv8R9n8q"
      );
      changeIndicatorGroup(grp.value);
    },
  });

  const onInsert = async (values: any) => {
    const grp = form.getFieldsValue()["TG1QzFgGTex"];
    const eventId = generateUid();
    const event = {
      event: eventId,
      program: "eQf9K4L2yxE",
      orgUnit: "akV6429SUqu",
      eventDate: new Date().toISOString(),
      dataValues: [
        {
          dataElement: "kToJ1rk0fwY",
          value: values.name,
        },
        {
          dataElement: "kuVtv8R9n8q",
          value: grp,
        },
      ],
    };
    await insertEvent(event);
    changeIndicatorGroup(grp);
    form.setFieldsValue({ kHRn35W3Gq4: eventId });
  };

  const { isLoading, isSuccess, isError, error, data } = useProgramAttributes(
    store.program
  );

  const addTrackedEntityInstance = async (data: any) => {
    const mutation: any = {
      type: "create",
      resource: "trackedEntityInstances",
      data,
    };
    return await engine.mutate(mutation);
  };

  const { mutateAsync } = useMutation(addTrackedEntityInstance, {
    onSuccess: () => {
      queryClient.invalidateQueries([
        "trackedEntityInstances",
        1,
        store.ou,
        store.program,
        10,
      ]);
    },
  });

  const handleFinish = async (values: any) => {
    const withValues: any = Object.entries(values).reduce(
      (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
      {}
    );
    const enrollmentDate = withValues["y3hJLGjctPk"];
    const attributes = Object.entries(withValues).map(([attribute, v]) => {
      let value = v;
      if (v instanceof moment) {
        value = moment(v).format("YYYY-MM-DD");
      }
      return {
        attribute,
        value,
      };
    });

    const trackedEntityInstance = {
      orgUnit: store.ou,
      trackedEntityType: store.trackedEntityType,
      attributes,
      enrollments: [
        {
          orgUnit: store.ou,
          program: store.program,
          enrollmentDate: enrollmentDate.format("YYYY-MM-DD"),
          incidentDate: enrollmentDate.format("YYYY-MM-DD"),
        },
      ],
    };
    await mutateAsync(trackedEntityInstance);
    changeDataEntryPage("list");
    // history.push({ pathname: "/tracker" });
  };

  const generateFormFields = (currentData: any) => {
    let fields = [];
    let other = [];
    if (currentData && currentData.programTrackedEntityAttributes) {
      other = currentData.programTrackedEntityAttributes.map((pTea: any) => {
        const {
          mandatory,
          trackedEntityAttribute: { optionSetValue, optionSet, generated, id },
          valueType,
        } = pTea;
        let field: any = {
          key: pTea.trackedEntityAttribute.id,
          label: pTea.trackedEntityAttribute.displayFormName,
          required: mandatory,
          widget: getFieldType(valueType, optionSetValue),
        };
        if (optionSetValue) {
          field = {
            ...field,
            options: optionSet.options.map((o: any) => [o.code, o.name]),
          };
        }

        if (id === "kHRn35W3Gq4") {
          field = {
            ...field,
            options: [...indicators, ["add", "Add new indicator"]],
            widget: "select",
            dynamic: true,
            widgetProps: {
              onChange: (value: string) => {
                if (value === "add") {
                  setModalVisible(true);
                }
              },
            },
          };
        }

        if (id === "iInAQ40vDGZ") {
          field = {
            ...field,
            widgetProps: {
              disabledDate: (currentDate: moment.Moment) => {
                return currentDate.isBefore(form.getFieldValue("y3hJLGjctPk"));
              },
            },
          };
        }

        if (id === "y3hJLGjctPk") {
          field = {
            ...field,
            widgetProps: {
              onChange: (value: string) => {
                form.setFieldsValue({ iInAQ40vDGZ: undefined });
              },
            },
          };
        }

        if (id === "TG1QzFgGTex") {
          field = {
            ...field,
            widgetProps: {
              onChange: (value: string) => {
                form.setFieldsValue({ kHRn35W3Gq4: undefined });
                changeIndicatorGroup(value);
                setCurrentGroup(value);
              },
            },
          };
        }
        if (generated) {
          field = { ...field, disabled: true };
        }
        return field;
      });
    }

    if (currentData.id === "T3geRmoJ9Wt") {
      fields = [
        {
          key: "y3hJLGjctPk",
          label: "Plan Date",
          required: true,
          widget: "date-picker",
        },
      ];
    }

    fields = [...fields, ...other];

    return {
      columns: 2,
      formItemLayout: null,
      colon: true,
      fields,
    };
  };

  const generateData = async (program: any) => {
    if (program && program.programTrackedEntityAttributes) {
      const uniques = program.programTrackedEntityAttributes
        .filter((a: any) => a.trackedEntityAttribute.generated)
        .map(({ trackedEntityAttribute: { id } }: any) => {
          return [
            id,
            {
              resource: `trackedEntityAttributes/${id}/generate`,
            },
          ];
        });
      const response = await engine.query(fromPairs(uniques));
      setGeneratedIds(
        fromPairs(
          Object.values(response).map(({ ownerUid, value }: any) => [
            ownerUid,
            value,
          ])
        )
      );
    }
  };

  useEffect(() => {
    if (data) {
      setFormMetadata(generateFormFields(data));
      generateData(data);
    }
  }, [data, store.indicatorGroup, currentGroup]);

  useEffect(() => {
    if (generatedIds) {
      form.setFieldsValue(generatedIds);
    }
  }, [generatedIds]);

  return (
    <Box bg="white" m="auto" p="10px">
      {isLoading && <Spinner />}
      {isSuccess && (
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          initialValues={{ ["TG1QzFgGTex"]: store.indicatorGroup }}
        >
          <FormBuilder meta={formMetadata} form={form} />
          <Stack direction="row">
            <Form.Item>
              <Button htmlType="submit" type="primary">
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="button"
                type="primary"
                onClick={() => changeDataEntryPage("list")}
              >
                Cancel
              </Button>
            </Form.Item>
          </Stack>
          <NewIndicator
            onInsert={onInsert}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            indicatorGroup={currentGroup}
          />
        </Form>
      )}
      {isError && <div>{error.message}</div>}
    </Box>
  );
};

export default TrackedEntityInstanceForm;
