import { Box } from '@chakra-ui/layout';
import { Button, Form } from 'antd';
import FormBuilder from 'antd-form-builder';
import { useStore } from 'effector-react';
import { fromPairs } from "lodash";
import moment from 'moment';
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { useD2 } from "../Context";
import { changeIndicatorGroup } from '../Events';
import { dashboards, indicatorForGroup } from '../Store';
import { getFieldType } from '../utils/common';
import { generateUid } from '../utils/uid';
import NewIndicator from './NewIndicator';

const TrackedEntityInstanceForm = () => {
  const d2 = useD2()
  const { search } = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(search);
  const [form] = Form.useForm();
  const [formMetadata, setFormMetadata] = useState<any>();
  const [generatedIds, setGeneratedIds] = useState<any>();
  const queryClient = useQueryClient();
  const indicators = useStore(indicatorForGroup);
  const store = useStore(dashboards);
  const [modalVisible, setModalVisible] = useState(false)

  const [currentGroup, setCurrentGroup] = useState<string>(store.indicatorGroup);

  const addEvent = async (event: any) => {
    return await api.post(`events`, event);
  }

  const { mutateAsync: insertEvent } = useMutation(addEvent, {
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries(["userUnits"]);
      const grp = variables.dataValues.find((dv: any) => dv.dataElement === 'kuVtv8R9n8q')
      changeIndicatorGroup(grp.value)
    },
  })

  const onInsert = async (values: any) => {
    const grp = form.getFieldsValue()['TG1QzFgGTex'];
    const eventId = generateUid();
    const event = {
      event: eventId,
      program: "eQf9K4L2yxE",
      orgUnit: "akV6429SUqu",
      eventDate: new Date().toISOString(),
      dataValues: [
        {
          dataElement: "kToJ1rk0fwY",
          value: values.name
        },
        {
          dataElement: "kuVtv8R9n8q",
          value: grp
        }
      ]
    }
    await insertEvent(event);
    changeIndicatorGroup(grp);
    form.setFieldsValue({ kHRn35W3Gq4: eventId })
  }

  const api = d2.Api.getApi();
  const { isLoading,
    isError,
    error,
    data
  } = useQuery<any, Error>(
    ["programs", params.get('program')],
    () => fetchProgramAttributes(params.get('program'))
  );

  const addTrackedEntityInstance = async (instance: any) => {
    return await api.post(`trackedEntityInstances.json`, instance);
  }

  const { mutateAsync } = useMutation(addTrackedEntityInstance, {
    onSuccess: () => {
      queryClient.invalidateQueries(["trackedEntityInstances", 1, params.get('ou'), params.get('program'), 10])
    },
  })

  const handleFinish = async (values: any) => {
    const withValues: any = Object.entries(values).reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {});
    const enrollmentDate = withValues['y3hJLGjctPk']
    const attributes = Object.entries(withValues).map(([attribute, v]) => {
      let value = v;
      if (v instanceof moment) {
        value = moment(v).format('YYYY-MM-DD')
      }
      return {
        attribute,
        value
      }
    });

    const trackedEntityInstance = {
      orgUnit: params.get('ou'),
      trackedEntityType: params.get('trackedEntityType'),
      attributes,
      enrollments: [{
        orgUnit: params.get('ou'),
        program: params.get('program'),
        enrollmentDate: enrollmentDate.format('YYYY-MM-DD'),
        incidentDate: enrollmentDate.format('YYYY-MM-DD'),
      }]
    }
    await mutateAsync(trackedEntityInstance);
    history.push({ search: params.toString(), pathname: '/tracker' })
  }

  const fetchProgramAttributes = async (program: string) => {
    return await api.get(`programs/${program}.json`, {
      fields: "id,selectIncidentDatesInFuture,selectEnrollmentDatesInFuture,incidentDateLabel,enrollmentDateLabel,programTrackedEntityAttributes[id,name,mandatory,valueType,displayInList,sortOrder,allowFutureDate,trackedEntityAttribute[id,name,generated,pattern,unique,valueType,orgunitScope,optionSetValue,displayFormName,optionSet[options[code,name]]]]"
    });
  }

  const generateFormFields = (currentData: any) => {
    let fields = [];
    let other = []
    if (currentData && currentData.programTrackedEntityAttributes) {
      other = currentData.programTrackedEntityAttributes.map((pTea: any) => {
        const { mandatory, trackedEntityAttribute: { optionSetValue, optionSet, generated, id }, valueType } = pTea;
        let field: any = {
          key: pTea.trackedEntityAttribute.id,
          label: pTea.trackedEntityAttribute.displayFormName,
          required: mandatory,
          widget: getFieldType(valueType, optionSetValue)
        }
        if (optionSetValue) {
          field = { ...field, options: optionSet.options.map((o: any) => [o.code, o.name]) }
        }

        if (id === 'kHRn35W3Gq4') {
          field = {
            ...field,
            options: [...indicators, ['add', 'Add new indicator']],
            widget: 'select',
            dynamic: true,
            widgetProps: {
              onChange: (value: string) => {
                if (value === 'add') {
                  setModalVisible(true)
                }
              },
            },
          }
        }

        if (id === 'iInAQ40vDGZ') {
          field = {
            ...field,
            widgetProps: {
              disabledDate: (currentDate: moment.Moment) => {
                return currentDate.isBefore(form.getFieldValue('y3hJLGjctPk'))
              },
            }
          }
        }

        if (id === 'y3hJLGjctPk') {
          field = {
            ...field,
            widgetProps: {
              onChange: (value: string) => {
                form.setFieldsValue({ iInAQ40vDGZ: undefined })
              },
            }
          }
        }

        if (id === 'TG1QzFgGTex') {
          field = {
            ...field,
            widgetProps: {
              onChange: (value: string) => {
                form.setFieldsValue({ kHRn35W3Gq4: undefined })
                changeIndicatorGroup(value);
                setCurrentGroup(value);
              },
            },
          }
        }
        if (generated) {
          field = { ...field, disabled: true }
        }
        return field;
      });
    }

    if (currentData.id === 'T3geRmoJ9Wt') {
      fields = [{
        key: 'y3hJLGjctPk',
        label: 'Plan Date',
        required: true,
        widget: 'date-picker'
      }]
    }

    fields = [...fields, ...other]

    return {
      columns: 2,
      formItemLayout: null,
      colon: true,
      fields
    }
  }

  const generateData = async (program: any) => {
    if (program && program.programTrackedEntityAttributes) {
      const uniques = program.programTrackedEntityAttributes.filter((a: any) => a.trackedEntityAttribute.generated).map(({ trackedEntityAttribute: { id } }: any) => api.get(`trackedEntityAttributes/${id}/generate`));
      setGeneratedIds(fromPairs((await Promise.all(uniques)).map((res: any) => [res.ownerUid, res.value])));
    }
  }

  useEffect(() => {
    if (data) {
      setFormMetadata(generateFormFields(data))
      generateData(data);
    }
  }, [data, store.indicatorGroup, currentGroup]);

  useEffect(() => {
    if (generatedIds) {
      form.setFieldsValue(generatedIds)
    }
  }, [generatedIds])

  if (isError) {
    return <div>{error.message}</div>
  }

  if (isLoading) {
    return <div>Is Loading</div>
  }

  return (
    <Box bg="white" m="auto" p="10px">
      <Form form={form} onFinish={handleFinish} layout="vertical" initialValues={{ ['TG1QzFgGTex']: store.indicatorGroup }}>
        <FormBuilder meta={formMetadata} form={form} />
        <Form.Item>
          <Button htmlType="submit" type="primary">Submit</Button>
        </Form.Item>
        <NewIndicator onInsert={onInsert} modalVisible={modalVisible} setModalVisible={setModalVisible} indicatorGroup={currentGroup} />
      </Form>
    </Box>
  )
}

export default TrackedEntityInstanceForm
