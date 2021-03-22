import { SettingOutlined } from '@ant-design/icons';
import { Drawer, List, Checkbox } from "antd";
import { FC, useEffect, useState } from "react";
import { useQuery } from 'react-query';
import { grey } from '@ant-design/colors';

import { useD2 } from '../Context';

type ColumnDrawerProps = {
  program: string;
  setColumns: (columns: any[]) => void;
  headers: any[];
}
const ColumnDrawer: FC<ColumnDrawerProps> = ({ program, setColumns, headers }) => {
  const d2 = useD2();
  const [visible, setVisible] = useState<boolean>(false);
  const [available, setAvailable] = useState<any[]>([]);
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const { isLoading,
    isError,
    error,
    data,
  } = useQuery<any, Error>(
    ["program", program],
    () => fetchProgram(),
  );

  const fetchProgram = async () => {
    const api = d2.Api.getApi();
    return await api.get(`programs/${program}.json`, {
      fields: "programTrackedEntityAttributes[id,name,mandatory,valueType,displayInList,trackedEntityAttribute[id,name,optionSetValue,optionSet[options[code,name]]]]"
    });
  }
  useEffect(() => {
    const processed = available.filter((a: any) => a.displayInList).map((a) => {
      const index = headers.findIndex((h) => h.name === a.trackedEntityAttribute.id);
      return {
        title: a.trackedEntityAttribute.name,
        render: (_: any, record: any) => {
          return {
            children: record[index],
          };
        }
      }
    });
    setColumns(processed)

  }, [available])


  useEffect(() => {
    if (data) {
      const { programTrackedEntityAttributes } = data;
      setAvailable(programTrackedEntityAttributes)
    }
  }, [data]);

  const includeColumns = (id: any) => (e: any) => {
    const elements = available.map((col: any) => {
      if (col.id === id) {
        return { ...col, displayInList: e.target.checked }
      }
      return col;
    });
    setAvailable(elements)
  }

  if (isLoading) {
    return <div>Is Loading</div>
  }
  if (isError) {
    return <div>{JSON.stringify(error)}</div>
  }

  return (
    <>
      <SettingOutlined style={{ fontSize: '24px' }} onClick={showDrawer} />
      <Drawer
        title="Columns"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={400}
      >
        <List
          itemLayout="horizontal"
          dataSource={available}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Checkbox checked={item.displayInList} onChange={includeColumns(item.id)} />}
                title={item.trackedEntityAttribute.name}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  )
}

export default ColumnDrawer
