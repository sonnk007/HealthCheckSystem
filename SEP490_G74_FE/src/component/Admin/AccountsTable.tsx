import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Space,
  Table,
  message,
  Modal,
  Form,
  Row,
  Col,
  Select,
  InputNumber,
  Radio,
  DatePicker,
} from "antd";
import { ColumnType, ColumnsType } from "antd/es/table";
import Input, { InputRef } from "antd/es/input/Input";
import {
  CategoryAddModel,
  CategoryResponseModel,
} from "../../Models/SubEntityModel";
import categoryService from "../../Services/CategoryService";
import { FilterConfirmProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {
  AccountResponseModel,
  JWTTokenModel,
  RoleResponseModel,
  UpdateAccountModel,
} from "../../Models/AuthModel";
import authService from "../../Services/AuthService";
import { TOKEN } from "../../Commons/Global";
import { jwtDecode } from "jwt-decode";
import { useForm } from "antd/es/form/Form";
import { Rule } from "antd/es/form";
import dayjs from "dayjs";
import { AuthContext } from "../../ContextProvider/AuthContext";
import PatientAddForm from "../Patient/PatientAddForm";
import AccountAddForm from "../SubEntities/AccountAddForm";

const AccountsTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  type DataIndex = keyof AccountResponseModel;
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<AccountResponseModel> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  //===================== State =====================
  const [accounts, setAccounts] = useState<AccountResponseModel[]>([]);

  const [selectedAccount, setSelectedAccount] =
    useState<AccountResponseModel>();

  const [editAccountModalVisible, setEditAccountModalVisible] = useState(false);

  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );

  const [accountEditForm] = useForm();

  //===================handle cancel==================
  //===== handle cancel edit form =====
  const handleCancelAccountEdit = () => {
    setEditAccountModalVisible(false);
  };

  //=============handle open edit modal=================

  const handleOpenEditAccount = (id: number) => {
    setSelectedAccountId(id);
    setEditAccountModalVisible(true);
    var selectedAccount: AccountResponseModel | undefined = accounts.find(
      (account) => account.userId === id
    );
    if (selectedAccount === undefined) {
      message.error("Không tìm thấy tài khoản");
      return;
    }

    setSelectedAccount(selectedAccount);
    accountEditForm.setFieldsValue({
      userId: id,
      name: selectedAccount.userName,
      address: selectedAccount.address,
      email: selectedAccount.email,
      phone: selectedAccount.phone,
      dob: dayjs(selectedAccount.dob),
      gender: selectedAccount.gender,
      categoryId: selectedAccount.categoryId,
      roleId: selectedAccount.roleId,
    });
  };

  //===================== Columns =====================
  const accountsColumns: ColumnsType<AccountResponseModel> = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "action_userId",
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "action_userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "action_email",
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Chức vụ",
      dataIndex: "roleName",
      key: "action_roleName",
      sorter: (a, b) => a.roleName.length - b.roleName.length,
      ...getColumnSearchProps("roleName"),
    },
    {
      title: "",
      key: `actionC`,
      render: (_, record) => (
        <Space size="middle" key={`space_${record.userId}`}>
          <Button
            key={`editC_${record.userId}`}
            type="primary"
            onClick={() => handleOpenEditAccount(record.userId)}
          >
            Xem thông tin
          </Button>
          <Button
            key={`removeC_${record.userId}`}
            danger={record.isDeleted !== true ? true : false}
            type="primary"
            onClick={() => handleDeleteAccount(record.userId)}
          >
            {record.isDeleted !== true ? <>Vô hiệu hóa</> : <>Kích hoạt</>}
          </Button>
        </Space>
      ),
    },
  ];

  //===================== Fetch Data =====================

  const fetchAccounts = async () => {
    var response = await authService.getAccounts();
    if (response === undefined) {
      message.error("Tải tài khoản thất bại", 2);
    } else {
      console.log(response);
      setAccounts(response);
      return response;
    }
  };

  //==============Delete=================
  //show confirm dialog before delete
  const handleDeleteAccount = (id: number) => {
    Modal.confirm({
      title: "Xác nhận thay đổi",
      content: "Bạn có chắc chắn muốn thay đổi?",
      onOk: () => {
        removeAccount(id);
      },
      onCancel: () => {
        // Do nothing
      },
    });
  };
  //===========Delete API=============
  const removeAccount = async (id: number) => {
    var token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var user: JWTTokenModel = jwtDecode(token);
      if (user !== undefined) {
        if (user.nameid !== undefined) {
          if (Number.parseInt(user.nameid) === id) {
            message.error("Không thể thay đổi trạng thái chính mình", 2);
            return;
          }
        }
      }
    }

    var response = await authService.deleteAccount(id);
    if (response !== undefined && response === 200) {
      message.success("Success", 1).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Failed");
    }
  };

  //=============================

  useEffect(() => {
    const fetchData = async () => {
      await fetchAccounts();
    };
    fetchData();
  }, []);

  // Edit account
  const [roles, setRoles] = useState<RoleResponseModel[]>([]);
  const [cates, setCates] = useState<CategoryResponseModel[]>([]);
  const [isDoctor, setIsDoctor] = useState<boolean>(false);

  const onFinishEditAccount = async (values: UpdateAccountModel) => {
    if (values.roleId !== 2) {
      values.categoryId = 0;
    }

    values = { ...values, userId: selectedAccountId ?? 0 };
    console.log(values);

    if (selectedAccount?.roleId === 2) {
      values.roleId = selectedAccount.roleId;
      values.categoryId = selectedAccount.categoryId;
    }

    var response = await authService.updateAccount(values);
    if (response !== undefined && response === 200) {
      message.success("Update Success", 1).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Update Failed");
    }
  };

  const onFinishFailed = () => {
    message.error("Validation Failed");
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
    console.log(values);
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

  // Filter Search
  const [open, setOpen] = useState<boolean>(false);
  const handleCancel = () => {
    setOpen(false);
  };
  const handleAddPatient = () => {
    setOpen(true);
  };
  //-------------account
  const [openAccount, setOpenAccount] = useState<boolean>(false);

  const handleAddAccount = () => {
    setOpenAccount(true);
  };
  const handleCancelAccount = () => {
    setOpenAccount(false);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
        minHeight: "100vh",
      }}
    >
      {/*===================== Accounts =====================*/}
      <Row gutter={10}>
        <Col>
          <Button type="primary" onClick={handleAddPatient}>
            Thêm mới bệnh nhân
          </Button>
        </Col>
        <Col>
          <Button type="primary" onClick={handleAddAccount}>
            Thêm mới tài khoản
          </Button>
        </Col>
      </Row>
      <h2>Nhân sự</h2>
      <Row>
        <Col span={24}></Col>
      </Row>
      <div>
        <br />
      </div>
      <Row>
        <Col span={24}>
          <Table<AccountResponseModel>
            rowKey={(record) => `id_${record.userId}`}
            dataSource={accounts}
            columns={accountsColumns}
            pagination={{ pageSize: 5 }}
            style={{ width: "auto", minWidth: "400px" }}
            onRow={(record) => ({
              onClick: () => setSelectedAccountId(record.userId),
            })}
          />
        </Col>
      </Row>

      {/*=============== Edit account modal ========================*/}
      <Modal
        title="Chỉnh sửa account"
        key="editSubModal"
        onCancel={handleCancelAccountEdit}
        destroyOnClose={true}
        open={editAccountModalVisible}
        footer={[
          <Button
            key="editForm"
            form="editForm"
            type="primary"
            htmlType="submit"
          >
            Chỉnh sửa
          </Button>,
          <Button
            key="removeF"
            type="primary"
            onClick={handleCancelAccountEdit}
          >
            Hủy
          </Button>,
        ]}
      >
        {/* Edit account form */}
        <Form
          id="editForm"
          form={accountEditForm}
          name="basic"
          layout="vertical"
          onFinish={onFinishEditAccount}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<UpdateAccountModel> label="ID" name="userId">
            <InputNumber disabled />
          </Form.Item>
          <Form.Item<UpdateAccountModel>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item<UpdateAccountModel>
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
            ]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item<UpdateAccountModel>
            name="roleId"
            label="Chọn chức vụ"
            required
          >
            <Select
              onChange={handleOnChane}
              options={roles.map((role) => ({
                value: role.roleId,
                label: role.roleName,
              }))}
            />
          </Form.Item>
          <Form.Item<UpdateAccountModel>
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
          <Col span={16}>
            <Form.Item<UpdateAccountModel>
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
              <Form.Item<UpdateAccountModel> label="Ngày sinh" name="dob">
                <DatePicker format={"MM/DD/YYYY HH:mm:ss"} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<UpdateAccountModel> label="Giới tính" name="gender">
                <Radio.Group>
                  <Radio value={true}>Nam</Radio>
                  <Radio value={false}>Nữ</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item<UpdateAccountModel>
                label="Số điện thoại"
                name="phone"
                rules={[phoneValidationRule]}
              >
                <Input placeholder="0983872xxx" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item<UpdateAccountModel>
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Hãy nhập địa chỉ" }]}
          >
            <Input placeholder="Địa chỉ" />
          </Form.Item>
        </Form>
      </Modal>
      {/*===================== Add patient modal =====================*/}
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

      {/*===================== Add account modal =====================*/}
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
  );
};

export default AccountsTable;
