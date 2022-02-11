import { Form, Modal } from "antd";
import FormBuilder from "antd-form-builder";
import { FC, useCallback, useState } from "react";

interface NewIndicatorProps {
  onInsert: (values: any) => Promise<void>;
  modalVisible: boolean;
  indicatorGroup: string;
  setModalVisible: (val: boolean) => void;
}

const NewIndicator: FC<NewIndicatorProps> = ({
  onInsert,
  modalVisible,
  setModalVisible,
  indicatorGroup,
}) => {
  const [form] = Form.useForm();
  const hideModal = useCallback(
    () => setModalVisible(false),
    [setModalVisible]
  );
  const [pending, setPending] = useState(false);

  const handleFinish = useCallback(
    async (values) => {
      setPending(true);
      await onInsert(values);
      setPending(false);
      Modal.success({
        title: "Success",
        content: "Submit success.",
        onOk: hideModal,
      });
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
      visible={modalVisible}
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
