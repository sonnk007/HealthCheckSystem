import { Form, Input, message, Col, InputNumber } from "antd";
import { ServiceAddModel } from "../../Models/SubEntityModel";
import { ServiceTypeAddFormProps } from "./ServiceTypeAddForm";
import subService from "../../Services/SubService";

const ServiceAddForm = ({id}:ServiceTypeAddFormProps) => {
  const onFinish = async (values: ServiceAddModel) => {
    //alert(values.price)
    if (id === null) {
      message.error("Vui lòng chọn loại dịch vụ", 2);
      return;
    }
    var response = await subService.addService(id, values);
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
      id="serviceAddForm"
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<ServiceAddModel> label="Tên dịch vụ" name="serviceName">
        <Input placeholder="Tên dịch vụ" />
      </Form.Item>
      <Form.Item<ServiceAddModel> label="Giá dịch vụ" name="price">
        <InputNumber placeholder="Giá dịch vụ" min={0} max={900000} />
      </Form.Item>
    </Form>
  );
};

export default ServiceAddForm;
