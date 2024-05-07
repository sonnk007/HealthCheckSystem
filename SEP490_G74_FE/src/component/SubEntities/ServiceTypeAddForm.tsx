import { Form, Input, message, Col } from "antd";
import { ServiceTypeAddModel } from "../../Models/SubEntityModel";
import subService from "../../Services/SubService";

export interface ServiceTypeAddFormProps {
  id: number | null;
}

const ServiceTypeAddForm = ({id}:ServiceTypeAddFormProps) => {
  const onFinish = async (values: ServiceTypeAddModel) => {
    if (id === null) {
      message.error("Vui lòng chọn loại dịch vụ", 2);
      return;
    }
    var response = await subService.addServiceType(id, values);
    if (response === 200) {
      message.success("Thêm thành công", 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Thêm thất bại", 2);
    }
  };

  const onFinishFailed = () => {
    message.error("Create Failed");
  };

  return (
    <Form
      id="serviceTypeAddForm"
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<ServiceTypeAddModel>
        label="Tên loại dịch vụ"
        name="serviceTypeName"
      >
        <Input placeholder="Tên loại dịch vụ" />
      </Form.Item>
    </Form>
  );
};

export default ServiceTypeAddForm;
