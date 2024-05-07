import {
  Form,
  Input,
  Radio,
  DatePicker,
  message,
  Row,
  Col,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import { PatientAddModel } from "../../Models/PatientModel";
import TextArea from "antd/es/input/TextArea";
import patientService from "../../Services/PatientService";
import { Rule } from "antd/es/form";

const PatientAddForm = () => {
  const today = dayjs();

  const onFinish = async (values: PatientAddModel) => {
    values = {
      ...values,
      dob: dayjs(values.dob).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      img: "",
      serviceDetailName: "",
    };
    console.log(values);
    var response = await patientService.addPatientContact(values);
    if (response === 200 || response === 201) {
      message.success("Thêm bệnh nhân thành công", 2, () => {
        window.location.reload();
      });
    } else {
      message.error("Thêm bệnh nhân thất bại", 2);
    }
  };

  const onFinishFailed = () => {
    message.error("Thêm bệnh nhân thất bại");
  };
  const phoneValidationRule: Rule = {
    required: true,
    pattern: /^\d{10,11}$/,
    message: "Vui lòng nhập số điện thoại hợp lệ",
  };
  return (
    <Form
      id="patientAddForm"
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{
        dob: today,
        editDate: today,
        gender: true,
        selectedCategoryId: 1,
        selectedDoctorId: 1,
        selectedServiceTypeIds: 1,
        selectedServiceIds: [1, 2],
      }}
      autoComplete="off"
    >
      <Col span={8}>
        <Form.Item<PatientAddModel>
          label="Họ và tên"
          name="name"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên của bạn",
            },
          ]}
        >
          <Input placeholder="Họ và tên" />
        </Form.Item>
      </Col>
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item<PatientAddModel> label="Ngày sinh" name="dob">
            <DatePicker format={"MM/DD/YYYY HH:mm:ss"} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<PatientAddModel> label="Giới tính" name="gender">
            <Radio.Group>
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Form.Item<PatientAddModel>
            label="Số điện thoại"
            name="phone"
            rules={[phoneValidationRule]}
          >
            <Input placeholder="0983872xxx" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item<PatientAddModel>
        label="Địa chỉ"
        name="address"
        rules={[{ required: true, message: "Hãy nhập địa chỉ" }]}
      >
        <Input placeholder="Địa chỉ" />
      </Form.Item>
      <Row gutter={10}>
        <Col span={6}>
          <Form.Item<PatientAddModel> label="Chiều cao (cm)" name="height">
            <InputNumber min={20} max={250} placeholder="170" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<PatientAddModel> label="Cân nặng (kg)" name="weight">
            <InputNumber min={1} max={500} placeholder="55" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<PatientAddModel>
            label="Nhóm máu"
            name="bloodGroup"
          >
            <Input placeholder="A" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<PatientAddModel>
            label="Huyết áp (mmHg)"
            name="bloodPressure"
          >
            <InputNumber min={1} max={1000} placeholder="110" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item<PatientAddModel>
        label="Lịch sử bệnh dị ứng"
        name="allergieshistory"
      >
        <TextArea placeholder="Không" />
      </Form.Item>
    </Form>
  );
};

export default PatientAddForm;
