import { Button, Form } from 'antd';
import FormBuilder from 'antd-form-builder';
import { fromPairs } from "lodash";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getFieldType } from '../utils/common';
import { useD2 } from "../Context";

const TrackedEntityInstanceForm = () => {
  const d2 = useD2()
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [form] = Form.useForm();
  const [formMetadata, setFormMetadata] = useState<any>();
  const forceUpdate = FormBuilder.useForceUpdate();
  const [generatedIds, setGeneratedIds] = useState<any>();
  const api = d2.Api.getApi();
  const { isLoading,
    isError,
    error,
    data,

  } = useQuery(
    ["programs", params.get('program')],
    () => fetchProgramAttributes(),
    { keepPreviousData: true }
  );
  const handleFinish = (values: any) => {
    console.log('Submit: ', values)
  }


  const fetchProgramAttributes = async () => {
    return await api.get(`programs/${params.get('program')}.json`, {
      fields: "selectIncidentDatesInFuture,selectEnrollmentDatesInFuture,incidentDateLabel,enrollmentDateLabel,programTrackedEntityAttributes[id,name,mandatory,valueType,displayInList,sortOrder,allowFutureDate,trackedEntityAttribute[id,name,generated,pattern,unique,valueType,orgunitScope,optionSetValue,displayFormName,optionSet[options[code,name]]]]"
    });
  }

  const generateFormFields = (currentData: any) => {
    let fields = [
      {
        key: 'label1',
        colSpan: 2,
        render() {
          return (
            <fieldset>
              <legend>Enrollment Information</legend>
            </fieldset>
          )
        }
      },
      {
        key: 'enrollmentDate',
        label: data.enrollmentDateLabel,
        rules: [
          {
            required: true,
            message: `${data.enrollmentDateLabel} is required`,
          },
        ],
        colSpan: 2,
        widget: 'date-picker'
      },
      {
        key: 'incidentDate',
        label: data.incidentDateLabel,
        rules: [
          {
            required: true,
            message: `${data.incidentDateLabel} is required`,
          },
        ],
        colSpan: 2,
        widget: 'date-picker'
      },
      {
        key: 'label2',
        colSpan: 2,
        render() {
          return (
            <fieldset style={{ marginTop: 20 }}>
              <legend>Profile Information</legend>
            </fieldset>
          )
        }
      },
    ]
    const other = currentData.programTrackedEntityAttributes.map((pTea: any) => {
      const { mandatory, trackedEntityAttribute: { optionSetValue, optionSet, generated, orgunitScope, id }, valueType } = pTea;
      let field: any = {
        key: pTea.trackedEntityAttribute.id,
        label: pTea.trackedEntityAttribute.displayFormName,
        required: mandatory,
        widget: getFieldType(valueType, optionSetValue)
      }

      if (optionSetValue) {
        field = { ...field, options: optionSet.options.map((o: any) => [o.code, o.name]) }
      }
      if (generated) {
        field = { ...field, disabled: true }
      }
      return field;
    });

    fields = [...fields, ...other]

    return {
      columns: 2,
      formItemLayout: null,
      colon: true,
      fields
    }
  }

  const generateData = async (program: any) => {
    const uniques = program.programTrackedEntityAttributes.filter((a: any) => a.trackedEntityAttribute.generated).map(({ trackedEntityAttribute: { id } }: any) => api.get(`trackedEntityAttributes/${id}/generate`));
    setGeneratedIds(fromPairs((await Promise.all(uniques)).map((res: any) => [res.ownerUid, res.value])));
  }

  useEffect(() => {
    if (data) {
      setFormMetadata(generateFormFields(data))
      generateData(data);
    }
  }, [data]);

  useEffect(() => {
    if (generatedIds) {
      form.setFieldsValue(generatedIds)
    }
  }, [generatedIds])



  if (isLoading) {
    return <div>Is Loading</div>
  }
  if (isError) {
    return <div>{JSON.stringify(error)}</div>
  }

  return (
    <Form form={form} onFinish={handleFinish} onValuesChange={forceUpdate} layout="vertical" style={{ padding: 10 }}>
      <FormBuilder meta={formMetadata} form={form} />
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Submit
          </Button>
      </Form.Item>
    </Form>
  )
}

export default TrackedEntityInstanceForm
