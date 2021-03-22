import { Button, Form, Popconfirm, Table, Typography } from 'antd';
import { fromPairs } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { useD2 } from '../Context';
import { getField } from '../utils/common';
import { generateUid } from '../utils/uid';

interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

interface TableProps {
  columns: any[];
  tei: string;
  stage: string;
}


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: string;
  record: Item;
  index: number;
  optionSetValue: boolean;
  options?: any[];
  rules: any[];
  compulsory: boolean,
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  optionSetValue,
  compulsory,
  children,
  options,
  rules,
  ...restProps
}) => {
  const inputNode = getField(inputType, optionSetValue, options);
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={rules}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable: FC<TableProps> = ({ columns, tei, stage }) => {
  const d2 = useD2();
  const api = d2.Api.getApi();
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const { isLoading,
    isError,
    error,
    data: fetchedData
  } = useQuery<any, Error>(
    ["events", stage, tei],
    () => fetchEvents(),
  );

  const cancel = () => {
    setEditingKey('');
  };

  const fetchEvents = async () => {
    return await api.get(`events.json`, {
      programStage: stage,
      trackedEntityInstance: tei
    });
  }

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const allColumns = [
    ...columns,
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button type="link" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = allColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        optionSetValue: col.optionSetValue,
        compulsory: col.compulsory,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        options: col.options,
        title: col.title,
        rules: col.rules,
        editing: isEditing(record),
      }),
    };
  });

  const handleDelete = (key: React.Key) => {
    setData(data.filter(item => item.key !== key))
  };

  const handleAdd = () => {
    const event = generateUid();
    const record = {
      key: event,
      event,
      programStage: stage,
      trackedEntityInstance: tei,
      program: params.get('program'),
      orgUnit: params.get('ou'),
      ...fromPairs(columns.map((c: any) => [c.dataIndex, '']))
    }
    setData([...data, record]);
    edit(record)
  };

  useEffect(() => {
    if (fetchedData) {
      const processedData = fetchedData.events.map(({ dataValues, ...others }: any) => {
        return {
          ...others,
          ...fromPairs(dataValues.map((dv: any) => [dv.dataElement, dv.value]))
        }
      });
      setData(processedData);
    }
  }, [fetchedData])

  if (isLoading) {
    return <div>Is Loading</div>
  }

  if (isError) {
    return <div>{JSON.stringify(error)}</div>
  }

  return (
    <Form form={form} component={false}>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>Add a row</Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowKey="event"
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default EditableTable;
