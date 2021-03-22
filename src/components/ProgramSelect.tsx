import { Select } from "antd";
import { useD2 } from "../Context";
import { usePrograms } from "../Queries";

const { Option } = Select;

const ProgramSelect = ({ selectedValue, handleChange }) => {
  const d2 = useD2();
  const { data, isLoading, isError, error } = usePrograms(d2);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }
  return (
    <Select
      size="large"
      style={{ width: "100%" }}
      value={selectedValue}
      onChange={handleChange}
    >
      {data.map((p) => (
        <Option key={p.id} value={p.id}>
          {p.name}
        </Option>
      ))}
    </Select>
  );
};

export default ProgramSelect;
