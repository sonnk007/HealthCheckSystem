import { Space, Button, Modal, message, Input, InputRef } from "antd";
import Table, { ColumnType, ColumnsType } from "antd/es/table";
import { PatientTableModel } from "../../Models/MedicalRecordModel";
import { useNavigate } from "react-router-dom";
import MedicalRecordAddForm from "../MedicalRecords/MedicalRecordAddForm";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../ContextProvider/AuthContext";
import Roles from "../../Enums/Enums";
import patientService from "../../Services/PatientService";
import {
  ApiResponseModel,
  PatientTableResponseModel,
} from "../../Models/PatientModel";
import { SearchOutlined } from "@ant-design/icons";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

const PatientTable = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPatientId, setSelectedPatientId] = useState<
    number | undefined
  >(undefined);

  const [patients, setPatients] = useState<PatientTableResponseModel[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  //Search
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  type DataIndex = keyof PatientTableResponseModel;
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
  ): ColumnType<PatientTableResponseModel> => ({
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

  const { authenticated } = useContext(AuthContext);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleViewPatient = (id: number) => {
    if (authenticated?.role === Roles.Doctor) {
      message.error("Chức năng chỉ dành cho y tá", 2);
    } else {
      setOpen(true);
      setSelectedPatientId(id);
    }
  };

  const handleViewMRs = (id: number) => {
    navigate(`${id}/medical-records`);
  };

  const columns: ColumnsType<PatientTableResponseModel> = [
    {
      title: "Mã bệnh nhân",
      dataIndex: "patientId",
      key: "patientId",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.patientId - b.patientId,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) =>
        gender === true ? <span>Nam</span> : <span>Nữ</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "",
      key: "action",
      render: (record: PatientTableResponseModel) => (
        <Space size="middle">
          {authenticated?.role === Roles.Nurse ||
          authenticated?.role === Roles.Admin ? (
            <Button
              type="primary"
              onClick={() => handleViewPatient(record.patientId)}
            >
              Thêm bệnh án
            </Button>
          ) : (
            <></>
          )}
          <Button
            type="primary"
            onClick={() => handleViewMRs(record.patientId)}
          >
            Danh sách khám
          </Button>
        </Space>
      ),
    },
  ];

  const fetchPatient = async () => {
    // var result: PatientTableResponseModel[] | undefined =
    //   await patientService.getPatients(pagination.current, pagination.pageSize);
    // if (result === undefined) {
    //   message.error("Lỗi lấy danh sách bệnh nhân", 2);
    // } else {
    //   var pats: PatientTableResponseModel[] = result.map((item) => ({
    //     ...item,
    //     key: item.patientId + "key",
    //   }));
    //   setPatients(pats);
    //   console.log(result);
    //   setPagination({
    //     ...pagination,
    //     total: result.length, // Update total count
    //   });
    // }
    var result: ApiResponseModel | undefined = await patientService.getPatients(
      pagination.current,
      pagination.pageSize
    );
    if (result === undefined) {
      message.error("Lỗi lấy danh sách bệnh nhân", 2);
    } else {
      var pats: PatientTableResponseModel[] = result.items.map((item) => ({
        ...item,
        key: item.patientId + "key",
      }));
      setPatients(pats);
      console.log(result);
      setPagination({
        ...pagination,
        total: result.totalCount, // Update total count
      });
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  useEffect(() => {
    fetchPatient();
  }, [authenticated, pagination.current, pagination.pageSize]);

  return (
    <div style={{ minHeight: "100vh", height: "auto" }}>
      {patients !== undefined && (
        <Table
          columns={columns}
          dataSource={patients}
          rowKey={(record) => record.patientId}
          pagination={pagination}
          onChange={handleTableChange}
        />
      )}
      <Modal
        title="Thêm hồ sơ bệnh án"
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
            form="medicalRecordAddForm"
            htmlType="submit"
          >
            Tạo hồ sơ
          </Button>,
        ]}
      >
        {selectedPatientId !== undefined && (
          <MedicalRecordAddForm patientId={selectedPatientId} />
        )}
      </Modal>
    </div>
  );
};

export default PatientTable;
