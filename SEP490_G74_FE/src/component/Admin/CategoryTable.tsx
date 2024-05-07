import React, { useEffect, useRef, useState } from "react";
import { Button, Space, Table, message, Modal, Form, Row, Col } from "antd";
import { ColumnType, ColumnsType } from "antd/es/table";
import Input, { InputRef } from "antd/es/input/Input";
import {
  CategoryAddModel,
  CategoryResponseModel,
} from "../../Models/SubEntityModel";
import categoryService from "../../Services/CategoryService";
import ServiceTypeAddForm from "../SubEntities/ServiceTypeAddForm";
import { FilterConfirmProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import CategoryAddForm from "../SubEntities/CategoryAddForm";

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

  const [editCateModalVisible, setEditCateModalVisible] = useState(false);

  const [editCateForm] = Form.useForm();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  //================== open flag =============
  const [openServiceType, setOpenServiceType] = useState<boolean>(false);

  //===================handle cancel==================
  //===== handle cancel edit form =====
  const handleCancelCateEdit = () => {
    setEditCateModalVisible(false);
  };

  //===== handle cancel modal =====
  const handleCancelServiceType = () => {
    setOpenServiceType(false);
  };

  //================handle add
  const handleAddServiceType = (id: number) => {
    setSelectedCategoryId(id);
    setOpenServiceType(true);
  };

  //=============handle open edit modal
  const handleOpenEditCategory = (id: number) => {
    setSelectedCategoryId(id);
    setEditCateModalVisible(true);
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
  //===================== Columns =====================

  const cateColumns: ColumnsType<CategoryResponseModel> = [
    {
      title: "ID",
      dataIndex: "categoryId",
      key: "actionC_categoryId",
      sorter: (a, b) => a.categoryId - b.categoryId,
    },
    {
      title: "Name",
      dataIndex: "categoryName",
      key: "actionC_categoryName",
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
      ...getColumnSearchProps("categoryName"),
    },
    {
      title: "",
      key: `actionC`,
      render: (_, record) => (
        <Space size="middle" key={`space_${record.categoryId}`}>
          <Button
            key={`editC_${record.categoryId}`}
            type="primary"
            onClick={() => handleOpenEditCategory(record.categoryId)}
          >
            Chỉnh sửa
          </Button>
          <Button
            key={`removeC_${record.categoryId}`}
            danger={record.isDeleted !== true ? true : false}
            type="primary"
            onClick={() => handleDeleteCategory(record.categoryId)}
          >
            {record.isDeleted !== true ? <>Vô hiệu hóa</> : <>Kích hoạt</>}
          </Button>
          <Button
            key={`addTypeC_${record.categoryId}`}
            type="primary"
            onClick={() => handleAddServiceType(record.categoryId)}
          >
            Thêm mới loại dịch vụ
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
      //setCates(response.filter(c => c.isDeleted === false));
      setCates(response);
      return response;
    }
  };

  //==============Delete=================
  //show confirm dialog before delete
  const handleDeleteCategory = (id: number) => {
    Modal.confirm({
      title: "Xác nhận thay đổi",
      content: "Bạn có chắc chắn muốn thay đổi?",
      onOk: () => {
        removeCategory(id);
      },
      onCancel: () => {
        // Do nothing
      },
    });
  };
  //===========Delete API=============
  const removeCategory = async (id: number) => {
    var response = await categoryService.deleteCategories(id);
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
    };
    fetchData();
  }, []);

  const [openCategory, setOpenCategory] = useState<boolean>(false);

  const handleAddCategory = () => {
    setOpenCategory(true);
  };

  const handleCancelCategory = () => {
    setOpenCategory(false);
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
      {/*===================== Category =====================*/}
      <Row>
        <Col>
          <Button type="primary" onClick={handleAddCategory}>
            Thêm mới khoa khám
          </Button>
        </Col>
      </Row>
      <h2>Khoa khám</h2>
      <Row>
        <Col span={24}></Col>
      </Row>
      <div>
        <br />
      </div>
      <Row>
        <Col span={24}>
          <Table<CategoryResponseModel>
            rowKey={(record) => `idC_${record.categoryId}`}
            dataSource={cates}
            columns={cateColumns}
            pagination={{ pageSize: 5 }}
            style={{ width: "auto", minWidth: "400px" }}
            onRow={(record) => ({
              onClick: () => setSelectedCategoryId(record.categoryId), // set the selected id when a row is clicked
            })}
          />
        </Col>
      </Row>
      {/*======================== PopUp Modal ==========================*/}

      {/*=============== Edit category modal ========================*/}
      <Modal
        title="Chỉnh sửa khoa khám"
        key="editSubModal"
        onCancel={handleCancelCateEdit}
        open={editCateModalVisible}
        footer={[
          <Button
            key="submitF"
            form="editForm"
            type="primary"
            htmlType="submit"
          >
            Chỉnh sửa
          </Button>,
          <Button key="removeF" type="primary" onClick={handleCancelCateEdit}>
            Hủy
          </Button>,
        ]}
      >
        {/* Edit category form */}
        <Form
          id="editForm"
          form={editCateForm}
          layout="vertical"
          name="basic"
          onFinish={handleEditCategory}
        >
          <Form.Item<CategoryResponseModel> label="ID" name="categoryId">
            <Input placeholder="ID" disabled />
          </Form.Item>
          <Form.Item<CategoryResponseModel> label="Tên" name="categoryName">
            <Input placeholder="Nhập tên" />
          </Form.Item>
        </Form>
      </Modal>

      {/*=============== Add service type modal ========================*/}
      <Modal
        title="Thêm mới loại dịch vụ"
        open={openServiceType}
        onCancel={handleCancelServiceType}
        maskClosable={false}
        width="500px"
        footer={[
          <Button key="back" onClick={handleCancelServiceType}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            form="serviceTypeAddForm"
            htmlType="submit"
          >
            Lưu
          </Button>,
        ]}
      >
        <ServiceTypeAddForm id={selectedCategoryId} />
      </Modal>
      {/*=============== Add category modal ========================*/}
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
    </div>
  );
};

export default CategoryTable;
