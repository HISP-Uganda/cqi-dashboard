import { fromPairs } from "lodash";
import { FC } from "react";
import { ChangeWorkSheet, Column } from "../interfaces";
import { useEvents } from "../Queries";
import Editable from "./Editable";

// interface Item {
//   [key: string]: any;
//   key: string;
// }

interface TableProps {
  columns: Column[];
  tei: string;
  stage: string;
}

// interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
//   editing: boolean;
//   dataIndex: string;
//   title: any;
//   inputType: string;
//   record: Item;
//   index: number;
//   optionSetValue: boolean;
//   options?: any[];
//   rules: any[];
//   compulsory: boolean;
//   otherOptions: any;
//   children: React.ReactNode;
// }

// const EditableCell: React.FC<EditableCellProps> = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   optionSetValue,
//   compulsory,
//   children,
//   options,
//   otherOptions,
//   rules,
//   ...restProps
// }) => {
//   const inputNode = getField(inputType, optionSetValue, options, otherOptions);
//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item name={dataIndex} style={{ margin: 0 }} rules={rules}>
//           {inputNode}
//         </Form.Item>
//       ) : inputType === "DATE" ? (
//         moment(record[dataIndex]).format("YYYY-MM-DD")
//       ) : (
//         children
//       )}
//     </td>
//   );
// };

const EditableTable: FC<TableProps> = ({ columns, tei, stage }) => {
  // const store = useStore(dashboards);
  // const engine = useDataEngine();
  // const [form] = Form.useForm();
  // const [data, setData] = useState<any[]>([]);
  // const [editingKey, setEditingKey] = useState("");
  // const queryClient = useQueryClient();

  // const isEditing = (record: Item) => record.key === editingKey;
  // const edit = (record: Partial<Item> & { key: React.Key }) => {
  //   let modifiedRecord = { ...record, eventDate: moment(record.eventDate) };
  //   columns.forEach((column: any) => {
  //     if (column.inputType === "DATE" && record[column.key]) {
  //       modifiedRecord = {
  //         ...modifiedRecord,
  //         [column.key]: moment(record[column.key]),
  //       };
  //     }
  //   });
  //   form.setFieldsValue(modifiedRecord);
  //   setEditingKey(modifiedRecord.key);
  // };

  const {
    isLoading,
    isError,
    error,
    data: fetchedData,
  } = useEvents(stage, tei);

  // const cancel = () => {
  //   setEditingKey("");
  // };

  // const addEvent = async (data: any) => {
  //   const mutation: any = {
  //     type: "create",
  //     resource: "events",
  //     data,
  //   };
  //   return await engine.mutate(mutation);
  // };

  // const { mutateAsync } = useMutation(addEvent, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["events", stage, tei]);
  //   },
  // });

  // const save = async (key: React.Key) => {
  //   try {
  //     const row = (await form.validateFields()) as Item;
  //     const newData = [...data];
  //     const index = newData.findIndex((item) => key === item.key);
  //     if (index > -1) {
  //       const item = {
  //         ...newData[index],
  //         ...row,
  //       };

  //       const { eventDate, ...withValues }: any = Object.entries(item).reduce(
  //         (a: any, [k, v]) => (v == null ? a : ((a[k] = v), a)),
  //         {}
  //       );
  //       let event = Object.entries(withValues).reduce(
  //         (a: any, [k, v]) =>
  //           columns.findIndex((c: any) => c.key === k) > -1
  //             ? a
  //             : ((a[k] = v), a),
  //         {}
  //       );
  //       const dataElements = Object.entries(withValues).reduce(
  //         (a: any, [k, v]) =>
  //           columns.findIndex((c: any) => c.key === k) === -1
  //             ? a
  //             : ((a[k] = v), a),
  //         {}
  //       );

  //       const dataValues = Object.entries(dataElements).map(
  //         ([dataElement, value]) => {
  //           return {
  //             dataElement,
  //             value,
  //           };
  //         }
  //       );
  //       event = { ...event, dataValues, eventDate };
  //       await mutateAsync(event);
  //       setEditingKey("");
  //     } else {
  //       newData.push(row);
  //       setData(newData);
  //       setEditingKey("");
  //     }
  //   } catch (errInfo) {
  //     console.log("Validate Failed:", errInfo);
  //   }
  // };
  // const allColumns = [
  //   ...columns,
  //   {
  //     title: "Operation",
  //     dataIndex: "operation",
  //     render: (_: any, record: Item) => {
  //       const editable = isEditing(record);
  //       return editable ? (
  //         <span>
  //           <Button
  //             type="link"
  //             onClick={() => save(record.key)}
  //             style={{ marginRight: 8 }}
  //           >
  //             Save
  //           </Button>
  //           <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
  //             <Button type="link">Cancel</Button>
  //           </Popconfirm>
  //         </span>
  //       ) : (
  //         <Typography.Link
  //           disabled={editingKey !== ""}
  //           onClick={() => edit(record)}
  //         >
  //           Edit
  //         </Typography.Link>
  //       );
  //     },
  //   },
  // ];

  // const mergedColumns = allColumns.map((col) => {
  //   let otherOptions = {};
  //   if (!col.editable) {
  //     return col;
  //   }

  //   if (col.dataIndex === "megrn75m57y") {
  //     otherOptions = {
  //       ...otherOptions,
  //       disabledDate: (currentDate: moment.Moment) => {
  //         return currentDate.isBefore(form.getFieldValue("TY4BoFr95UI"));
  //       },
  //     };
  //   }

  //   if (col.dataIndex === "TY4BoFr95UI") {
  //     otherOptions = {
  //       ...otherOptions,
  //       onChange: () => {
  //         form.setFieldsValue({ megrn75m57y: undefined });
  //       },
  //     };
  //   }

  //   return {
  //     ...col,
  //     onCell: (record: Item) => ({
  //       record,
  //       optionSetValue: col.optionSetValue,
  //       compulsory: col.compulsory,
  //       inputType: col.inputType,
  //       dataIndex: col.dataIndex,
  //       options: col.options,
  //       title: col.title,
  //       rules: col.rules,
  //       editing: isEditing(record),
  //       otherOptions,
  //     }),
  //   };
  // });

  // const handleDelete = (key: React.Key) => {
  //   setData(data.filter(item => item.key !== key))
  // };

  // const handleAdd = () => {
  //   const event = generateUid();
  //   const record = {
  //     key: event,
  //     event,
  //     programStage: stage,
  //     trackedEntityInstance: tei,
  //     program: store.program,
  //     orgUnit: store.ou,
  //     ...fromPairs(columns.map((c: any) => [c.dataIndex, undefined])),
  //   };
  //   setData([...data, record]);
  //   edit(record);
  // };

  // useEffect(() => {
  //   if (fetchedData) {
  //     const processedData = fetchedData.events.map(
  //       ({ dataValues, ...others }: any) => {
  //         return {
  //           ...others,
  //           ...fromPairs(
  //             dataValues.map((dv: any) => [dv.dataElement, dv.value])
  //           ),
  //         };
  //       }
  //     );
  //     setData(processedData);
  //   }
  // }, [fetchedData]);

  if (isError) {
    return <div>Some error has occurred</div>;
  }

  if (isLoading) {
    return <div>Is Loading</div>;
  }

  return (
    // <Form form={form} component={false}>
    <Editable
      data={fetchedData.events.map(({ dataValues, ...others }: any) => {
        const worksheet: ChangeWorkSheet = {
          ...others,
          ...fromPairs(dataValues.map((dv: any) => [dv.dataElement, dv.value])),
        };
        return worksheet;
      })}
      columns={columns}
      stage={stage}
      tei={tei}
    />
    // </Form>
  );
};

export default EditableTable;
