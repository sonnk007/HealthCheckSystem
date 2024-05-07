import { Button, Modal } from "antd";
import { useState } from "react";
import PatientAddForm from "../component/Patient/PatientAddForm";

interface ParentCompProps {
  childComp?: React.ReactNode;
}

const CashierPage: React.FC<ParentCompProps> = (props: any) => {
  const { childComp } = props;
  const [open, setOpen] = useState<boolean>(false);

  const handleCancel = () => {
    setOpen(false);
  };
  const handleAddPatient = () => {
    setOpen(true);
  };
  return (
    <div>
      <div>
        {/* <Button type="primary" onClick={handleAddPatient}>
          Thêm mới bệnh nhân
        </Button>
        <Modal
          title="Thêm mới bệnh nhân"
          open={open}
          onCancel={handleCancel}
          maskClosable={false}
          width="max-content"
          footer={[
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              form="patientAddForm"
              htmlType="submit"
            >
              Lưu
            </Button>,
          ]}
        >
          <PatientAddForm />
        </Modal> */}
      </div>
      <br />
      <div>{childComp}</div>
    </div>
  );
};

export default CashierPage;
