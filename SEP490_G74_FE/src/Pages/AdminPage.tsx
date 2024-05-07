import { Button, Col, Modal, Row } from "antd";
import { useState } from "react";
import PatientAddForm from "../component/Patient/PatientAddForm";
import CategoryAddForm from "../component/SubEntities/CategoryAddForm";
import AccountAddForm from "../component/SubEntities/AccountAddForm";
interface ParentCompProps {
  childComp?: React.ReactNode;
}

const AdminPage: React.FC<ParentCompProps> = (props: any) => {
  const { childComp } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [openCategory, setOpenCategory] = useState<boolean>(false);
  const [openAccount, setOpenAccount] = useState<boolean>(false);

  const handleCancel = () => {
    setOpen(false);
  };
  const handleCancelCategory = () => {
    setOpenCategory(false);
  };
  const handleCancelAccount = () => {
    setOpenAccount(false);
  };
  const handleAddPatient = () => {
    setOpen(true);
  };
  const handleAddCategory = () => {
    setOpenCategory(true);
  };
  const handleAddAccount = () => {
    setOpenAccount(true);
  };
  return (
    <div>
      <div>
        <Row>
          <Col span={6}>
            {/* <Button type="primary" onClick={handleAddPatient}>
              Thêm mới bệnh nhân
            </Button> */}
          </Col>
          <Col span={6}>
            {/* <Button type="primary" onClick={handleAddCategory}>
              Thêm mới khoa khám
            </Button> */}
          </Col>
          <Col span={6}>
            {/* <Button type="primary" onClick={handleAddAccount}>
              Thêm mới tài khoản
            </Button> */}
          </Col>
        </Row>
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
        </Modal>

        <Modal
          title="Thêm mới khoa khám"
          open={openCategory}
          onCancel={handleCancelCategory}
          maskClosable={false}
          width="500px"
          footer={[
            <Button key="back" onClick={handleCancelCategory}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              form="categoryAddForm"
              htmlType="submit"
            >
              Lưu
            </Button>,
          ]}
        >
          <CategoryAddForm />
        </Modal>

        <Modal
          title="Thêm mới tài khoản"
          open={openAccount}
          onCancel={handleCancelAccount}
          maskClosable={false}
          width="500px"
          footer={[
            <Button key="back" onClick={handleCancelAccount}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              form="categoryAddForm"
              htmlType="submit"
            >
              Lưu
            </Button>,
          ]}
        >
          <AccountAddForm />
        </Modal>


      </div>
      <br />
      <div>{childComp}</div>
    </div>
  );
};

export default AdminPage;
