import { Col, DatePicker, Form, Input, message, Radio, Row, Select } from "antd";
import { AddAccountModel, RoleResponseModel } from "../../Models/AuthModel";
import authService from "../../Services/AuthService";
import { useEffect, useState } from "react";
import { CategoryResponseModel } from "../../Models/SubEntityModel";
import categoryService from "../../Services/CategoryService";
import { CaretRightOutlined } from "@ant-design/icons";
import { create } from "cypress/types/lodash";
import { Rule } from "antd/es/form";

const AccountAddForm = () => {
  const [roles, setRoles] = useState<RoleResponseModel[]>([]);
  const [cates, setCates] = useState<CategoryResponseModel[]>([]);
  const [isDoctor, setIsDoctor] = useState<boolean>(false);

  const onFinish = async (values: AddAccountModel) => {
    if (values.roleId !== 2) {
      values.categoryId = 0;
    }
    var response = await authService.register(values);
    if (response !== undefined && response === 200) {
      message.success("Create Success", 1).then(()=>{
        window.location.reload();
      });
    } else {
      message.error("Create Failed");
    }
  };

  const onFinishFailed = () => {
    message.error("Create Failed");
  };

  const fetchRoles = async () => {
    var response = await authService.getRoles();
    if (response !== undefined) {
      setRoles(response);
    } else {
      message.error("Get Roles Failed");
    }
  };

  const fetchCates = async () => {
    var response = await categoryService.getCategories();
    if (response !== undefined) {
      setCates(response);
    } else {
      message.error("Get Roles Failed");
    }
  };

  const prepareData = async () => {
    var response = await Promise.all([fetchRoles(), fetchCates()]);
    if (response !== undefined) {
      console.log(response);
    }
  };

  const handleOnChane = (values: number) => {
    console.log(values)
    if (values === 2) {
      setIsDoctor(true);
    } else {
      setIsDoctor(false);
    }
  };

  const phoneValidationRule: Rule = {
    required: true,
    pattern: /^\d{10,11}$/,
    message: "Vui lòng nhập số điện thoại hợp lệ",
  };

  useEffect(() => {
    prepareData();
  }, [isDoctor]);

  return (
    <Form
      id="categoryAddForm"
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="Tên tài khoản">
        <Input placeholder="Tên tài khoản" />
      </Form.Item>
      <Form.Item<AddAccountModel> label="Email" name="email">
        <Input type="email" placeholder="Email" />
      </Form.Item>
      <Form.Item<AddAccountModel> label="Password" name="password">
        <Input type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item<AddAccountModel>
        label="Confirm Password"
        name="confirmPassword"
      >
        <Input type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item<AddAccountModel> name="roleId" label="Chọn chức vụ">
        <Select
          onChange={handleOnChane}
          options={roles.map((role) => ({
            value: role.roleId,
            label: role.roleName,
          }))}
        />
      </Form.Item>
      <Form.Item<AddAccountModel>
        name="categoryId"
        label="Khoa khám (nếu là bác sĩ)"
      >
        <Select
          disabled={!isDoctor}
          options={cates.map((cate) => ({
            value: cate.categoryId,
            label: cate.categoryName,
          }))}
        />
      </Form.Item>
      <Col span={8}>
        <Form.Item<AddAccountModel>
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
          <Form.Item<AddAccountModel> label="Ngày sinh" name="dob">
            <DatePicker format={"MM/DD/YYYY HH:mm:ss"} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<AddAccountModel> label="Giới tính" name="gender">
            <Radio.Group>
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Form.Item<AddAccountModel>
            label="Số điện thoại"
            name="phone"
            rules={[phoneValidationRule]}
          >
            <Input placeholder="0983872xxx" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item<AddAccountModel>
        label="Địa chỉ"
        name="address"
        rules={[{ required: true, message: "Hãy nhập địa chỉ" }]}
      >
        <Input placeholder="Địa chỉ" />
      </Form.Item>
    </Form>
  );
};

export default AccountAddForm;
