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
  CategoryAddModel,
  CategoryResponseModel,
  ServiceAddModel,
  ServiceResponseModel,
  ServiceTypeAddModel,
  ServiceTypeResponseModel,
  SupplyAddModel,
  SupplyResponseModel,
  SupplyTypeAddModel,
  SupplyTypeResponseModel,
} from "../../Models/SubEntityModel";
import categoryService from "../../Services/CategoryService";
import subService from "../../Services/SubService";
import ServiceTypeAddForm from "../SubEntities/ServiceTypeAddForm";
import ServiceAddForm from "../SubEntities/ServiceAddForm";
import CategoryAddForm from "../SubEntities/CategoryAddForm";
import dayjs from "dayjs";
import { FilterConfirmProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const CategoryTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  type DataIndex = keyof CategoryResponseModel;
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
  ): ColumnType<CategoryResponseModel> => ({
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
  const [cates, setCates] = useState<CategoryResponseModel[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeResponseModel[]>(
    []
  );
  const [services, setServices] = useState<ServiceResponseModel[]>([]);

  const [supplyTypes, setSupplyTypes] = useState<SupplyTypeResponseModel[]>([]);
  const [supplies, setSupplies] = useState<SupplyResponseModel[]>([]);

  //=====================================
  const [editCateModalVisible, setEditCateModalVisible] = useState(false);
  const [editTypeModalVisible, setEditTypeModalVisible] = useState(false);
  const [editServiceModalVisible, setEditServiceModalVisible] = useState(false);
  const [editSupplyTypeModalVisible, setEditSupplyTypeModalVisible] =
    useState(false);
  const [editSupplyModalVisible, setEditSupplyModalVisible] = useState(false);

  const [editCateForm] = Form.useForm();
  const [editTypeForm] = Form.useForm();
  const [editServiceForm] = Form.useForm();
  const [editSupplyTypeForm] = Form.useForm();
  const [editSupplyForm] = Form.useForm();

  const [supplyTypeAddForm] = Form.useForm();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );

  const [selectedSupplyTypeId, setSelectedSupplyTypeId] = useState<
    number | null
  >(null);
  const [selectedSupplyId, setSelectedSupplyId] = useState<number | null>(null);

  //================== open flag =============
  const [openServiceType, setOpenServiceType] = useState<boolean>(false);
  const [openService, setOpenService] = useState<boolean>(false);
  const [openSupplyType, setOpenSupplyType] = useState<boolean>(false);
  const [openSupply, setOpenSupply] = useState<boolean>(false);

  //====== add supply type modal
  const [openAddSupplyType, setOpenAddSupplyType] = useState<boolean>(false);

  //===================handle cancel==================
  //===== handle cancel edit form =====
  const handleCancelCateEdit = () => {
    setEditCateModalVisible(false);
  };

  const handleCancelTypeEdit = () => {
    setEditTypeModalVisible(false);
  };

  const handleCancelServiceEdit = () => {
    setEditServiceModalVisible(false);
  };

  const handleCancelSupplyTypeEdit = () => {
    setEditSupplyTypeModalVisible(false);
  };

  const handleCancelSupplyEdit = () => {
    setEditSupplyModalVisible(false);
  };

  //===== handle cancel modal =====
  const handleCancelServiceType = () => {
    setOpenServiceType(false);
  };

  const handleCancelService = () => {
    setOpenService(false);
  };

  const handleCancelSupplyType = () => {
    setOpenSupplyType(false);
  };

  const handleCancelSupply = () => {
    setOpenSupply(false);
  };

  //================handle add
  const handleAddServiceType = (id: number) => {
    setSelectedCategoryId(id);
    setOpenServiceType(true);
  };

  const handleAddService = (id: number) => {
    setSelectedTypeId(id);
    setOpenService(true);
  };

  const handleAddSupply = (id: number) => {
    setSelectedSupplyTypeId(id);
    setOpenSupply(true);
  };

  //=============handle open edit modal
  const handleOpenEditCategory = (id: number) => {
    setSelectedCategoryId(id);
    setEditCateModalVisible(true);
  };

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

  const handleOpenEditSupplyType = (id: number) => {
    setSelectedSupplyTypeId(id);
    setEditSupplyTypeModalVisible(true);
  };

  const handleOpenEditSupply = (
    id: number,
    supplyTypeId: number | undefined | null
  ) => {
    if (supplyTypeId === undefined || supplyTypeId === null) {
      message.error("Dịch vụ có loại dịch vụ không hợp lệ", 2);
      return;
    }
    setSelectedSupplyId(id);
    setSelectedSupplyTypeId(supplyTypeId);
    setEditSupplyModalVisible(true);
  };

  //============ Handle Edit Call API =============

  const handleEditCategory = async (values: CategoryResponseModel) => {
    if (selectedCategoryId === null) {
      message.error("Vui lòng chọn khoa khám", 2);
      return;
    }

    var editCartMode: CategoryAddModel = {
      categoryName: values.categoryName,
    };

    var response = await categoryService.updateCategory(
      selectedCategoryId,
      editCartMode
    );
    if (response === 204) {
      message.success("Chỉnh sửa thành công", 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Chỉnh sửa thất bại", 2);
    }
    setEditCateModalVisible(false);
  };

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

  //================= Handle Add Call API =================
  const handleInsertSupplyType = async (values: SupplyTypeResponseModel) => {
    var supplyTypeAdd: SupplyTypeAddModel = {
      suppliesTypeName: values.suppliesTypeName,
    };

    var response = await subService.addSupplyType(supplyTypeAdd);
    if (response !== undefined && response >= 200 && response < 300) {
      message.success("Chỉnh sửa thành công", 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Chỉnh sửa thất bại", 2);
    }
    setEditTypeModalVisible(false);
  };

  const handleUpdateSupplyType = async (values: SupplyTypeResponseModel) => {
    //message.error(`Check supply type add click: ${values.suppliesTypeName}`, 2);

    if (selectedSupplyTypeId === null || selectedSupplyTypeId === undefined) {
      message.error("Loại thuốc không hợp lệ", 2);
      return;
    }

    var supplyTypeAdd: SupplyTypeAddModel = {
      suppliesTypeName: values.suppliesTypeName,
    };

    var response = await subService.updateSupplyType(
      selectedSupplyTypeId,
      supplyTypeAdd
    );
    if (response !== undefined && response >= 200 && response < 300) {
      message.success("Chỉnh sửa thành công", 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Chỉnh sửa thất bại", 2);
    }
    setEditTypeModalVisible(false);
  };

  const handleInsertSupply = async (values: SupplyResponseModel) => {
    //message.error(`Check supply type add click: ${values.sName}`, 2);

    if (selectedSupplyTypeId === null || selectedSupplyTypeId === undefined) {
      message.error("Loại thuốc không hợp lệ", 2);
      return;
    }

    var supplyAdd: SupplyAddModel = {
      sName: values.sName,
      suppliesTypeId: selectedSupplyTypeId,
      distributor: values.distributor,
      price: values.price,
      unitInStock: values.unitInStock,
      exp: dayjs(values.exp).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      uses: values.uses,
    };

    console.log(supplyAdd);

    var response = await subService.addSupply(supplyAdd);
    if (response !== undefined && response >= 200 && response < 300) {
      message.success("Chỉnh sửa thành công", 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Chỉnh sửa thất bại", 2);
    }
    setEditSupplyModalVisible(false);
  };

  const handleUpdateSupply = async (values: SupplyResponseModel) => {
    //message.error(`Check supply type add click: ${values.suppliesTypeName}`, 2);

    if (
      selectedSupplyTypeId === null ||
      selectedSupplyTypeId === undefined ||
      selectedSupplyId === null ||
      selectedSupplyId === undefined
    ) {
      message.error("Loại thuốc không hợp lệ", 2);
      return;
    }

    var supplyAdd: SupplyAddModel = {
      sName: values.sName,
      suppliesTypeId: selectedSupplyTypeId,
      distributor: values.distributor,
      price: values.price,
      unitInStock: values.unitInStock,
      exp: dayjs(values.exp).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      uses: values.uses,
    };

    console.log(selectedSupplyId);

    var response = await subService.updateSupply(selectedSupplyId, supplyAdd);
    if (response !== undefined && response >= 200 && response < 300) {
      message.success("Chỉnh sửa thành công", 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Chỉnh sửa thất bại", 2);
    }
    setEditSupplyModalVisible(false);
  };

  //===================== Columns =====================

  const supplyTypeColumns: ColumnsType<SupplyTypeResponseModel> = [
    {
      title: "ID",
      dataIndex: "suppliesTypeId",
      key: "actionT_suppliesTypeId",
      sorter: (a, b) => a.suppliesTypeId - b.suppliesTypeId,
    },
    {
      title: "Name",
      dataIndex: "suppliesTypeName",
      key: "actionT_suppliesTypeName",
      sorter: (a, b) => a.suppliesTypeName.length - b.suppliesTypeName.length,
    },
    // {
    //   title: "Category",
    //   dataIndex: "categoryName",
    //   key: "actionT_categoryName",
    //   sorter: (a, b) => a.categoryName!.length - b.categoryName!.length,
    // },
    {
      title: "",
      key: "actionT",
      render: (_, record) => (
        <Space size="middle" key={`spaceT_${record.suppliesTypeId}`}>
          <Button
            key={`editT_${record.suppliesTypeId}`}
            type="primary"
            onClick={() => handleOpenEditSupplyType(record.suppliesTypeId)}
          >
            Chỉnh sửa
          </Button>
          <Button
            key={`removeT_${record.suppliesTypeId}`}
            danger={record.isDeleted !== true ? true : false}
            type="primary"
            onClick={() => handleDeleteSupplyType(record.suppliesTypeId)}
          >
            {record.isDeleted !== true ? <>Vô hiệu hóa</> : <>Kích hoạt</>}
          </Button>
          <Button
            key={`addTypeC_${record.suppliesTypeId}`}
            type="primary"
            onClick={() => handleAddSupply(record.suppliesTypeId)}
          >
            Thêm mới thuốc
          </Button>
        </Space>
      ),
    },
  ];

  const suppliesColumns: ColumnsType<SupplyResponseModel> = [
    {
      title: "ID",
      dataIndex: "sId",
      key: "actionC_sId",
      sorter: (a, b) => a.sId - b.sId,
    },
    {
      title: "Name",
      dataIndex: "sName",
      key: "actionC_sName",
      sorter: (a, b) => a.sName.length - b.sName.length,
    },
    {
      title: "Cách dùng",
      dataIndex: "uses",
      key: "actionC_uses",
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "exp",
      key: "actionC_exp",
      sorter: (a, b) => a.exp!.length - b.exp!.length,
      render: (date: any) => dayjs(date).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Nhà phân phối",
      dataIndex: "distributor",
      key: "actionC_distributor",
      sorter: (a, b) => a.distributor!.length - b.distributor!.length,
    },
    {
      title: "Số lượng tồn kho",
      dataIndex: "unitInStock",
      key: "actionC_unitInStock",
      sorter: (a, b) => a.unitInStock! - b.unitInStock!,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "actionC_price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "",
      key: "actionC",
      render: (_, record) => (
        <Space size="middle" key={`spaceS_${record.sId}`}>
          <Button
            key={`editS_${record.sId}`}
            type="primary"
            onClick={() =>
              handleOpenEditSupply(record.sId, record.suppliesTypeId)
            }
          >
            Chỉnh sửa
          </Button>
          <Button
            key={`removeS_${record.sId}`}
            danger={record.isDeleted !== true ? true : false}
            type="primary"
            onClick={() => handleDeleteSupply(record.sId)}
          >
            {record.isDeleted !== true ? <>Vô hiệu hóa</> : <>Kích hoạt</>}
          </Button>
        </Space>
      ),
    },
  ];

  const fetchSupplyTypes = async () => {
    var response = await subService.getAllSupplyTypes();
    if (response === undefined) {
      message.error("Get Categories Failed", 2);
    } else {
      console.log(response);
      //map category name to service type
      //setSupplyTypes(response.filter((c) => c.isDeleted === false));
      setSupplyTypes(response);
      return response;
    }
  };

  const fetchSupplies = async (supplyTypes: SupplyTypeResponseModel[]) => {
    var response = await subService.getAllSupplies();
    if (response === undefined) {
      message.error("Get Supplie Failed", 2);
    } else {
      console.log(response);
      //map service type name to service
      response.map((item: SupplyResponseModel) => {
        item.suppliesTypeName = supplyTypes.find(
          (type) => type.suppliesTypeId === item.suppliesTypeId
        )?.suppliesTypeName;

        item.suppliesTypeId =
          supplyTypes.find(
            (type) => type.suppliesTypeId === item.suppliesTypeId
          )?.suppliesTypeId ?? 0;
      });
      // setSupplies(response.filter((c) => c.isDeleted === false));
      setSupplies(response);
      return response;
    }
  };

  //==============Delete=================

  const handleDeleteSupplyType = (id: number) => {
    Modal.confirm({
      title: "Xác nhận thay đổi",
      content: "Bạn có chắc chắn muốn thay đổi?",
      onOk: () => {
        removeSupplyType(id);
      },
      onCancel: () => {
        // Do nothing
      },
    });
  };

  const handleDeleteSupply = (id: number) => {
    Modal.confirm({
      title: "Xác nhận thay đổi",
      content: "Bạn có chắc chắn muốn thay đổi?",
      onOk: () => {
        removeSupply(id);
      },
      onCancel: () => {
        // Do nothing
      },
    });
  };
  //===========Delete API=============

  const removeSupplyType = async (id: number) => {
    var response = await subService.deleteSupplyType(id);
    if (response === 200) {
      message.success("Thành công", 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error("Thất bại", 2);
    }
  };

  const removeSupply = async (id: number) => {
    var response = await subService.deleteSupply(id);
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
      var supplyTypes = await fetchSupplyTypes();
      if (supplyTypes !== undefined) {
        var supplies = await fetchSupplies(supplyTypes);
      }
    };
    fetchData();
  }, []);

  // Filter Search

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/*============== Supply type ==================*/}

      <Row
        gutter={10}
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Col>
          <h2>Loại thuốc</h2>
        </Col>
        <Col>
          <Button type="primary" onClick={() => setOpenAddSupplyType(true)}>
            Thêm loại thuốc
          </Button>
        </Col>
      </Row>
      {/* <Row>
        <Col span={24}>
          <Search
            key="2"
            placeholder="Nhập tên"
            onChange={handleSearchServiceTypes}
          />
        </Col>
      </Row>
      <div>
        <br />
      </div> */}
      <Row>
        <Col span={24}>
          <Table<SupplyTypeResponseModel>
            rowKey={(record) => `idT_${record.suppliesTypeId}`}
            dataSource={supplyTypes}
            pagination={{ pageSize: 5 }}
            columns={supplyTypeColumns}
            style={{ width: "auto", minWidth: "400px" }}
            onRow={(record) => ({
              onClick: () => {
                //alert(record.suppliesTypeId);
                setSelectedSupplyTypeId(record.suppliesTypeId);
              }, // set the selected id when a row is clicked
            })}
          />
        </Col>
      </Row>

      {/*============== Supply ==================*/}
      <h2>Thuốc</h2>
      <Row>
        <Col span={24}>
          <Table<SupplyResponseModel>
            rowKey={(record) => `idT_${record.sId}`}
            dataSource={supplies}
            pagination={{ pageSize: 5 }}
            columns={suppliesColumns}
            style={{ width: "auto", minWidth: "400px" }}
            onRow={(record) => ({
              onClick: () => {
                //alert(record.sId);
                setSelectedSupplyId(record.sId);
              }, // set the selected id when a row is clicked
            })}
          />
        </Col>
      </Row>

      {/*======================== PopUp Modal ==========================*/}
      {/*=============== Edit supply type modal ========================*/}
      <Modal
        title="Chỉnh sửa loại thuốc"
        key="editSupplyTypeModal"
        onCancel={handleCancelSupplyTypeEdit}
        open={editSupplyTypeModalVisible}
        footer={[
          <Button
            key="submitSupplyTypeF"
            form="editSupplyTypeForm"
            type="primary"
            htmlType="submit"
          >
            Chỉnh sửa loại thuốc
          </Button>,
          <Button
            key="removeF"
            type="primary"
            onClick={handleCancelSupplyTypeEdit}
          >
            Hủy
          </Button>,
        ]}
      >
        {/*==== Edit supply type form ===== */}
        <Form
          id="editSupplyTypeForm"
          form={editSupplyTypeForm}
          layout="vertical"
          name="basicT"
          onFinish={handleUpdateSupplyType}
        >
          <Form.Item<SupplyTypeResponseModel> label="ID" name="suppliesTypeId">
            <Input placeholder="ID" disabled />
          </Form.Item>
          <Form.Item<SupplyTypeResponseModel>
            label="Tên"
            name="suppliesTypeName"
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>
        </Form>
      </Modal>

      {/*=============== Add supply modal ========================*/}
      <Modal
        title="Thêm mới thuốc"
        open={openSupply}
        onCancel={() => setOpenSupply(false)}
        maskClosable={false}
        width="500px"
        footer={[
          <Button key="back" onClick={() => setOpenSupply(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            form="supplyAddForm"
            htmlType="submit"
          >
            Lưu
          </Button>,
        ]}
      >
        {/*====== Form Add Supply ============*/}
        <Form
          id="supplyAddForm"
          name="basic"
          layout="vertical"
          onFinish={handleInsertSupply}
          onFinishFailed={() => {
            message.error("Thêm mới thuốc thất bại", 2);
          }}
          autoComplete="off"
        >
          <Form.Item<SupplyAddModel> label="Tên thuốc" name="sName">
            <Input placeholder="Tên thuốc" />
          </Form.Item>
          <Form.Item<SupplyAddModel> label="Cách dùng" name="uses">
            <Input placeholder="Cách dùng" />
          </Form.Item>
          <Form.Item<SupplyAddModel> label="Ngày hết hạn" name="exp">
            <DatePicker format={"MM/DD/YYYY HH:mm:ss"} />
          </Form.Item>
          <Form.Item<SupplyAddModel> label="Nhà phân phối" name="distributor">
            <Input placeholder="Nhà phân phối" />
          </Form.Item>
          <Form.Item<SupplyAddModel> label="Số lượng" name="unitInStock">
            <InputNumber min={1} max={10000000} placeholder="Số lượng" />
          </Form.Item>
          <Form.Item<SupplyAddModel> label="Giá" name="price">
            <InputNumber min={1} max={100000000} placeholder="Giá" />
          </Form.Item>
        </Form>
      </Modal>

      {/*================== Edit supply modal ===================*/}
      <Modal
        title="Chỉnh sửa thuốc"
        key="editServiceModal"
        onCancel={handleCancelSupplyEdit}
        open={editSupplyModalVisible}
        footer={[
          <Button
            key="submitSupplyTypeF"
            form="editSupplyForm"
            type="primary"
            htmlType="submit"
          >
            Chỉnh sửa
          </Button>,
          <Button key="removeF" type="primary" onClick={handleCancelSupplyEdit}>
            Hủy
          </Button>,
        ]}
      >
        {/*===== Edit supply form =========*/}
        <Form
          id="editSupplyForm"
          form={editSupplyForm}
          layout="vertical"
          name="basic"
          onFinish={handleUpdateSupply}
        >
          <Form.Item<ServiceResponseModel> label="ID" name="serviceId">
            <Input placeholder="ID" disabled />
          </Form.Item>
          <Form.Item<SupplyAddModel> label="Tên thuốc" name="sName">
            <Input placeholder="Tên thuốc" />
          </Form.Item>
          <Form.Item<SupplyAddModel> label="Cách dùng" name="uses">
            <Input placeholder="Cách dùng" />
          </Form.Item>
          <Form.Item<SupplyAddModel> label="Ngày hết hạn" name="exp">
            <DatePicker format={"MM/DD/YYYY HH:mm:ss"} />
          </Form.Item>
          <Form.Item<SupplyAddModel> label="Nhà phân phối" name="distributor">
            <Input placeholder="Nhà phân phối" />
          </Form.Item>
          <Form.Item<SupplyAddModel> label="Số lượng" name="unitInStock">
            <InputNumber min={1} max={1000000} placeholder="Số lượng" />
          </Form.Item>
          <Form.Item<SupplyAddModel> label="Giá" name="price">
            <InputNumber min={1} max={100000000} placeholder="Giá" />
          </Form.Item>
        </Form>
      </Modal>

      {/*================== Add supply type modal ===================*/}
      <Modal
        title="Thêm mới loại thuốc"
        open={openAddSupplyType}
        onCancel={() => setOpenAddSupplyType(false)}
        maskClosable={false}
        width="500px"
        footer={[
          <Button key="back" onClick={() => setOpenAddSupplyType(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            form="supplyTypeAddForm"
            htmlType="submit"
          >
            Lưu
          </Button>,
        ]}
      >
        {/*====== Form Add Supply Type ============*/}
        <Form
          id="supplyTypeAddForm"
          form={supplyTypeAddForm}
          name="basic"
          layout="vertical"
          onFinish={handleInsertSupplyType}
          onFinishFailed={() =>
            message.error("Thêm mới loại thuốc thất bại", 2)
          }
          autoComplete="off"
        >
          <Form.Item<SupplyTypeAddModel>
            label="Tên loại thuốc"
            name="suppliesTypeName"
          >
            <Input placeholder="Tên loại thuốc" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryTable;
