import { Form, Modal } from "antd";
import FormBuilder from "antd-form-builder";
import { FC, useCallback, useState } from "react";

interface NewIndicatorProps {
  onInsert: (values: any) => Promise<void>;
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;
}

const NewIndicator: FC<NewIndicatorProps> = ({
  onInsert,
  modalVisible,
  setModalVisible,
}) => {
  const [form] = Form.useForm();
  const hideModal = useCallback(
    () => setModalVisible(false),
    [setModalVisible]
  );
  const [pending, setPending] = useState(false);

  const handleFinish = useCallback(
    async (values: any) => {
      setPending(true);
      await onInsert(values);
      setPending(false);
      Modal.success({
        title: "Success",
        content: "Submit success.",
        onOk: hideModal,
      });
      form.setFieldsValue({ name: "" });
    },
    [setPending, hideModal]
  );

  const meta: any = {
    disabled: pending,
    columns: 1,
    formItemLayout: null,
    colon: true,
    fields: [{ key: "name", label: "Indicator Name", required: true }],
  };

  return (
    <Modal
      title="New Indicator"
      closable={!pending}
      maskClosable={!pending}
      open={modalVisible}
      destroyOnClose
      onOk={() => form.submit()}
      onCancel={hideModal}
      okText={pending ? "Loading..." : "Ok"}
      okButtonProps={{ loading: pending, disabled: pending }}
      cancelButtonProps={{ disabled: pending }}
    >
      <Form form={form} onFinish={handleFinish}>
        <FormBuilder meta={meta} form={{} as any} />
      </Form>
    </Modal>
  );
};

export default NewIndicator;
