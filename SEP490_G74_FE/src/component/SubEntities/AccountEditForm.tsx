import { Form, Input, message, Select } from "antd";
import { AddAccountModel, RoleResponseModel } from "../../Models/AuthModel";
import authService from "../../Services/AuthService";
import { useEffect, useState } from "react";
import { CategoryResponseModel } from "../../Models/SubEntityModel";
import categoryService from "../../Services/CategoryService";
import { CaretRightOutlined } from "@ant-design/icons";
import { create } from "cypress/types/lodash";

const AccountEditForm = () => {
  const [roles, setRoles] = useState<RoleResponseModel[]>([]);
  const [cates, setCates] = useState<CategoryResponseModel[]>([]);
  const [isDoctor, setIsDoctor] = useState<boolean>(false);

  const onFinish = async (values: AddAccountModel) => {
    if (values.roleId !== 2) {
      values.categoryId = 0;
    }
    var response = await authService.register(values);
    if (response !== undefined && response === 200) {
      message.success("Create Success",1).then(()=>{
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
    </Form>
  );
};

export default AccountEditForm;
