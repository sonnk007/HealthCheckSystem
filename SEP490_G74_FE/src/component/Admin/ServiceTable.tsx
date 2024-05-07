import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Space,
  Table,
  message,
  Modal,
  Form,
  Row,
  Col,
  InputNumber,
  DatePicker,
} from "antd";
import { ColumnType, ColumnsType } from "antd/es/table";
import Search from "antd/es/input/Search";
import Input, { InputRef } from "antd/es/input/Input";
import {
  CategoryResponseModel,
  ServiceAddModel,
  ServiceResponseModel,
  ServiceTypeAddModel,
  ServiceTypeResponseModel,
} from "../../Models/SubEntityModel";
import categoryService from "../../Services/CategoryService";
import subService from "../../Services/SubService";
import ServiceAddForm from "../SubEntities/ServiceAddForm";
import { FilterConfirmProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const ServiceTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  type TypeDataIndex = keyof ServiceTypeResponseModel;
  type ServiceDataIndex = keyof ServiceResponseModel;
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: TypeDataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleServiceSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex:  ServiceDataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const handleServiceReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getTypeColumnSearchProps = (
    dataIndex: TypeDataIndex
  ): ColumnType<ServiceTypeResponseModel> => ({
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
      record[dataIndex!]!
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
  //-------
  const getServiceColumnSearchProps = (
    dataIndex: ServiceDataIndex
  ): ColumnType<ServiceResponseModel> => ({
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
            handleServiceSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleServiceSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleServiceReset(clearFilters)}
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
      record[dataIndex!]!
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
  const [cates, setCates] = useState<CategoryResponseModel[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeResponseModel[]>(
    []
  );
  const [services, setServices] = useState<ServiceResponseModel[]>([]);

  //=====================================
  const [editTypeModalVisible, setEditTypeModalVisible] = useState(false);
  const [editServiceModalVisible, setEditServiceModalVisible] = useState(false);
  const [editTypeForm] = Form.useForm();
  const [editServiceForm] = Form.useForm();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );

  //================== open flag =============
  const [openService, setOpenService] = useState<boolean>(false);

  //===================handle cancel==================
  //===== handle cancel edit form =====
  const handleCancelTypeEdit = () => {
    setEditTypeModalVisible(false);
  };

  const handleCancelServiceEdit = () => {
    setEditServiceModalVisible(false);
  };

  const handleCancelService = () => {
    setOpenService(false);
  };

  const handleAddService = (id: number) => {
    setSelectedTypeId(id);
    setOpenService(true);
  };

  //=============handle open edit modal

  const handleOpenEditServiceType = (
    id: number,
    categoryId: number | undefined | null
  ) => {
    if (categoryId === undefined || categoryId === null) {
      message.error("Loại dịch vụ có khoa khám không hợp lệ", 2);
      return;
    }
    setSelectedTypeId(id);
    setSelectedCategoryId(categoryId);
    setEditTypeModalVisible(true);
  };

  const handleOpenEditService = (
    id: number,
    serviceTypeId: number | undefined | null
  ) => {
    if (serviceTypeId === undefined || serviceTypeId === null) {
      message.error("Dịch vụ có loại dịch vụ không hợp lệ", 2);
      return;
    }
    setSelectedTypeId(serviceTypeId);
    setSelectedServiceId(id);
    setEditServiceModalVisible(true);
  };
  //============ Handle Edit Call API =============
  const handleEditType = async (values: ServiceTypeResponseModel) => {
    if (selectedTypeId === null) {
      message.error("Vui lòng chọn loại dịch vụ khám", 2);
      return;
    }

    if (selectedCategoryId === null) {
      message.error("Loại dịch vụ có khoa khám không hợp lệ", 2);
      return;
    }

    var editTypeModel: ServiceTypeAddModel = {
      serviceTypeName: values.serviceTypeName,
      categoryId: selectedCategoryId,
    };

    var response = await subService.updateServiceType(
      selectedTypeId,
      editTypeModel
    );
    if (response === 200) {
      message.success("Chỉnh sửa thành công", 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Chỉnh sửa thất bại", 2);
    }
    setEditTypeModalVisible(false);
  };

  const handleEditService = async (values: ServiceResponseModel) => {
    if (selectedServiceId === null) {
      message.error("Vui lòng chọn loại dịch vụ khám", 2);
      return;
    }

    if (selectedTypeId === null) {
      message.error("Dịch vụ có loại khoa khám không hợp lệ", 2);
      return;
    }

    var editServiceModel: ServiceAddModel = {
      serviceName: values.serviceName,
      serviceTypeId: selectedTypeId,
      price: values.price,
    };

    var response = await subService.updateService(
      selectedServiceId,
      editServiceModel
    );
    if (response === 200) {
      message.success("Chỉnh sửa thành công", 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Chỉnh sửa thất bại", 2);
    }
    setEditServiceModalVisible(false);
  };

  //===================== Columns =====================
  const typeColumns: ColumnsType<ServiceTypeResponseModel> = [
    {
      title: "ID",
      dataIndex: "serviceTypeId",
      key: "actionT_serviceTypeId",
      sorter: (a, b) => a.serviceTypeId - b.serviceTypeId,
    },
    {
      title: "Name",
      dataIndex: "serviceTypeName",
      key: "actionT_serviceTypeName",
      sorter: (a, b) => a.serviceTypeName.length - b.serviceTypeName.length,
      ...getTypeColumnSearchProps("serviceTypeName"),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "actionT_categoryName",
      sorter: (a, b) => a.categoryName!.length - b.categoryName!.length,
      ...getTypeColumnSearchProps("categoryName"),
    },
    {
      title: "",
      key: "actionT",
      render: (_, record) => (
        <Space size="middle" key={`spaceT_${record.serviceTypeId}`}>
          <Button
            key={`editT_${record.serviceTypeId}`}
            type="primary"
            onClick={() =>
              handleOpenEditServiceType(record.serviceTypeId, record.categoryId)
            }
          >
            Chỉnh sửa
          </Button>
          <Button
            key={`removeT_${record.serviceTypeId}`}
            danger = {record.isDeleted !== true ? true : false}
            type="primary"
            onClick={() => handleDeleteServiceType(record.serviceTypeId)}
          >
            {record.isDeleted !== true ? <>Vô hiệu hóa</> : <>Kích hoạt</>}
          </Button>
          <Button
            key={`addTypeC_${record.serviceTypeId}`}
            type="primary"
            onClick={() => handleAddService(record.serviceTypeId)}
          >
            Thêm mới dịch vụ
          </Button>
        </Space>
      ),
    },
  ];

  const servicesColumns: ColumnsType<ServiceResponseModel> = [
    {
      title: "ID",
      dataIndex: "serviceId",
      key: "actionC_serviceId",
      sorter: (a, b) => a.serviceId - b.serviceId,
    },
    {
      title: "Name",
      dataIndex: "serviceName",
      key: "actionC_serviceName",
      sorter: (a, b) => a.serviceName.length - b.serviceName.length,
      ...getServiceColumnSearchProps("serviceName"),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "actionC_price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Type",
      dataIndex: "serviceTypeName",
      key: "actionC_serviceTypeName",
      sorter: (a, b) => a.serviceTypeName!.length - b.serviceTypeName!.length,
      ...getServiceColumnSearchProps("serviceTypeName"),
    },
    {
      title: "",
      key: "actionC",
      render: (_, record) => (
        <Space size="middle" key={`spaceS_${record.serviceId}`}>
          <Button
            key={`editS_${record.serviceId}`}
            type="primary"
            onClick={() =>
              handleOpenEditService(record.serviceId, record.serviceTypeId)
            }
          >
            Chỉnh sửa
          </Button>
          <Button
            key={`removeS_${record.serviceId}`}
            danger = {record.isDeleted !== true ? true : false}
            type="primary"
            onClick={() => handleDeleteService(record.serviceId)}
          >
            {record.isDeleted !== true ? <>Vô hiệu hóa</> : <>Kích hoạt</>}
          </Button>
        </Space>
      ),
    },
  ];
  //===================== Fetch Data =====================

  const fetchCategories = async () => {
    var response = await categoryService.getCategories();
    if (response === undefined) {
      message.error("Get Categories Failed", 2);
    } else {
      console.log(response);
      //setCates(response.filter((c) => c.isDeleted === false));
      setCates(response);
      return response;
    }
  };

  const fetchServiceTypes = async (cates: CategoryResponseModel[]) => {
    var response = await subService.getServicesType(0);
    if (response === undefined) {
      message.error("Get Categories Failed", 2);
    } else {
      console.log(response);
      //map category name to service type
      response.map((item: ServiceTypeResponseModel) => {
        item.categoryName = cates.find(
          (cate) => cate.categoryId === item.categoryId
        )?.categoryName;
        item.categoryId = cates.find(
          (cate) => cate.categoryId === item.categoryId
        )?.categoryId;
      });
      //setServiceTypes(response.filter((c) => c.isDeleted === false));
      setServiceTypes(response);
      return response;
    }
  };

  const fetchServices = async (serviceTypes: ServiceTypeResponseModel[]) => {
    var response = await subService.getServices(0);
    if (response === undefined) {
      message.error("Get Categories Failed", 2);
    } else {
      console.log(response);
      //map service type name to service
      response.map((item: ServiceResponseModel) => {
        item.serviceTypeName = serviceTypes.find(
          (type) => type.serviceTypeId === item.serviceTypeId
        )?.serviceTypeName;
        item.serviceTypeId = serviceTypes.find(
          (type) => type.serviceTypeId === item.serviceTypeId
        )?.serviceTypeId;
      });
      //setServices(response.filter((c) => c.isDeleted === false));
      setServices(response);
      return response;
    }
  };
  //==============Delete=================
  const handleDeleteServiceType = (id: number) => {
    Modal.confirm({
      title: "Xác nhận thay đổi",
      content: "Bạn có chắc chắn muốn thay đổi?",
      onOk: () => {
        removeServiceType(id);
      },
      onCancel: () => {
        // Do nothing
      },
    });
  };

  const handleDeleteService = (id: number) => {
    Modal.confirm({
      title: "Xác nhận thay đổi",
      content: "Bạn có chắc chắn muốn thay đổi?",
      onOk: () => {
        removeService(id);
      },
      onCancel: () => {
        // Do nothing
      },
    });
  };

  //===========Delete API=============
  const removeServiceType = async (id: number) => {
    var response = await subService.deleteServiceType(id);
    if (response === 200) {
      message.success("Thành công", 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Thất bại", 2);
    }
  };

  const removeService = async (id: number) => {
    var response = await subService.deleteService(id);
    if (response === 200) {
      message.success("Thành công", 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Thất bại", 2);
    }
  };
  //=============================

  useEffect(() => {
    const fetchData = async () => {
      var cates = await fetchCategories();
      if (cates !== undefined) {
        var types = await fetchServiceTypes(cates);
        if (types !== undefined) {
          await fetchServices(types);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/*===================== Service Type =====================*/}
      <h2>Loại dịch vụ</h2>
      <Row>
        <Col span={24}></Col>
      </Row>
      <div>
        <br />
      </div>
      <Row>
        <Col span={24}>
          <Table<ServiceTypeResponseModel>
            rowKey={(record) => `idT_${record.serviceTypeId}`}
            dataSource={serviceTypes}
            pagination={{ pageSize: 5 }}
            columns={typeColumns}
            style={{ width: "auto", minWidth: "400px" }}
            onRow={(record) => ({
              onClick: () => setSelectedTypeId(record.serviceTypeId), // set the selected id when a row is clicked
            })}
          />
        </Col>
      </Row>
      {/*===================== Service =====================*/}
      <h2>Dịch vụ</h2>
      <Row>
        <Col span={24}></Col>
      </Row>
      <div>
        <br />
      </div>
      <Row>
        <Col span={24}>
          <Table<ServiceResponseModel>
            rowKey={(record) => `idS_${record.serviceId}`}
            dataSource={services}
            pagination={{ pageSize: 5 }}
            columns={servicesColumns}
            style={{ width: "auto", minWidth: "400px" }}
            onRow={(record) => ({
              onClick: () => setSelectedServiceId(record.serviceId), // set the selected id when a row is clicked
            })}
          />
        </Col>
      </Row>

      {/*======================== PopUp Modal ==========================*/}

      {/*=============== Edit service type modal ========================*/}
      <Modal
        title="Chỉnh sửa loại dịch vụ"
        key="editTypeModal"
        onCancel={handleCancelTypeEdit}
        open={editTypeModalVisible}
        footer={[
          <Button
            key="submitTypeF"
            form="editTypeForm"
            type="primary"
            htmlType="submit"
          >
            Chỉnh sửa
          </Button>,
          <Button key="removeF" type="primary" onClick={handleCancelTypeEdit}>
            Hủy
          </Button>,
        ]}
      >
        {/*==== Edit service type form ===== */}
        <Form
          id="editTypeForm"
          form={editTypeForm}
          layout="vertical"
          name="basicT"
          onFinish={handleEditType}
        >
          <Form.Item<ServiceTypeResponseModel> label="ID" name="serviceTypeId">
            <Input placeholder="ID" disabled />
          </Form.Item>
          <Form.Item<ServiceTypeResponseModel>
            label="Tên"
            name="serviceTypeName"
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>
        </Form>
      </Modal>

      {/*=============== Add service modal ========================*/}
      <Modal
        title="Thêm mới dịch vụ"
        open={openService}
        onCancel={handleCancelService}
        maskClosable={false}
        width="500px"
        footer={[
          <Button key="back" onClick={handleCancelService}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            form="serviceAddForm"
            htmlType="submit"
          >
            Lưu
          </Button>,
        ]}
      >
        {/*====== Form Add Service ============*/}
        <ServiceAddForm id={selectedTypeId} />
      </Modal>

      {/*================== Edit service modal ===================*/}
      <Modal
        title="Chỉnh sửa dịch vụ"
        key="editServiceModal"
        onCancel={handleCancelServiceEdit}
        open={editServiceModalVisible}
        footer={[
          <Button
            key="submitTypeF"
            form="editServiceForm"
            type="primary"
            htmlType="submit"
          >
            Chỉnh sửa
          </Button>,
          <Button
            key="removeF"
            type="primary"
            onClick={handleCancelServiceEdit}
          >
            Hủy
          </Button>,
        ]}
      >
        {/*===== Edit service form =========*/}
        <Form
          id="editServiceForm"
          form={editServiceForm}
          layout="vertical"
          name="basic"
          onFinish={handleEditService}
        >
          <Form.Item<ServiceResponseModel> label="ID" name="serviceId">
            <Input placeholder="ID" disabled />
          </Form.Item>
          <Form.Item<ServiceResponseModel> label="Tên" name="serviceName">
            <Input placeholder="Nhập tên" />
          </Form.Item>
          <Form.Item<ServiceResponseModel> label="Tên" name="price">
            <InputNumber min={1} max={900000} placeholder="Giá dịch vụ" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceTable;
