import {
  Space,
  Button,
  Modal,
  message,
  Row,
  Col,
  Divider,
  Input,
  InputRef,
} from "antd";
import Table, { ColumnType, ColumnsType } from "antd/es/table";
import {
  MedicalRecordAddModel,
  MedicalRecordTableModel,
} from "../../Models/MedicalRecordModel";
import { useContext, useEffect, useRef, useState } from "react";
import MedicalRecordDetailForm from "./MedicalRecordDetailForm";
import { AuthContext } from "../../ContextProvider/AuthContext";
import Roles from "../../Enums/Enums";
import medicalRecordService from "../../Services/MedicalRecordService";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import GenericModal from "../Generic/GenericModal";
import ExaminationForm from "./ExaminationForm";
import ExaminationService from "../../Services/ExaminationService";
import InvoiceForm from "./InvoiceForm";
import SupplyPrescriptionDetailForm from "./SupplyPrescriptionDetailForm";
import {
  ApiResponseModel,
  PatientTableResponseModel,
} from "../../Models/PatientModel";
import { SearchOutlined } from "@ant-design/icons";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { defaultMrOption } from "../../Commons/Global";
import subService from "../../Services/SubService";
import { PrescriptionDiagnosIsPaidModel } from "../../Models/SubEntityModel";

const ListMedicalRecordTable = () => {
  //const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState<boolean>(false);
  const [openExaminate, setOpenExaminate] = useState<boolean>(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number>(1);
  const [selectedMrId, setSelectedMrId] = useState<number>(1);
  const { authenticated } = useContext(AuthContext);
  const [isReOpen, setIsReOpen] = useState<boolean>(false);
  const [isExamReload, setIsExamReload] = useState<boolean>(false);
  const [isInvoiceReload, setIsInvoiceReload] = useState<boolean>(false);
  const [isSupplyPresReload, setIsSupplyPresReload] = useState<boolean>(false);
  const [openInvoice, setOpenInvoice] = useState<boolean>(false);
  const [openSupplyPres, setOpenSupplyPres] = useState<boolean>(false);
  const [isSelectedMrPaid, setIsSelectedMrPaid] = useState<boolean>(false);

  //Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  //Search
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  type DataIndex = keyof MedicalRecordTableModel;
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
  ): ColumnType<MedicalRecordTableModel> => ({
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

  const handleViewMedicalRecord = (id: number, mrId: number) => {
    setOpen(true);
    setSelectedPatientId(id);
    setSelectedMrId(mrId);
    setIsReOpen(!isReOpen);
  };

  const [medicalRecords, setMedicalRecords] = useState<
    MedicalRecordTableModel[]
  >([]);

  const navigate = useNavigate();

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCancelExaminate = () => {
    setOpenExaminate(false);
  };

  const handleCancelInvoice = () => {
    setOpenInvoice(false);
  };

  const handleCancelSupplyPres = () => {
    setOpenSupplyPres(false);
  };

  const handlePaid = async () => {
    if (
      medicalRecords.find((item) => item.medicalRecordId === selectedMrId)
        ?.isCheckUp === true
    ) {
      message.info("Hồ sơ đã khám", 2);
      return;
    }

    var statusCode = await medicalRecordService.updateMrCheckUpStatus(
      selectedMrId
    );
    if (statusCode === 200) {
      message.success("Đã khám hồ sơ " + selectedMrId, 2).then(() => {
        window.location.reload();
      });
    } else {
      message.error(`Hồ sơ ${selectedMrId} phải thanh toán trước khi khám`, 2);
    }
  };

  const handleCheckout = async (id: number) => {
    if (
      authenticated?.role !== Roles.Cashier &&
      authenticated?.role !== Roles.Admin
    ) {
      message.error("Chức năng chỉ dành cho thu ngân", 2);
    } else {
      if (
        medicalRecords.find((item) => item.medicalRecordId === id)?.isPaid ===
        true
      ) {
        message.info("Hồ sơ đã thanh toán", 2);
        return;
      }
      var statusCode = await medicalRecordService.updateMrPaidStatus(id);
      if (statusCode === 200) {
        message.success("Đã thanh toán hồ sơ: " + id, 2).then(() => {
          window.location.reload();
        });
      } else {
        message.error("Lỗi khi thanh toán hồ sơ: " + id, 2);
      }
    }
  };

  const handleExaminate = (mrId: number, isCheckUp: boolean) => {
    if (isCheckUp === false) {
      message.info("Hồ sơ chưa khám", 2);
      return;
    }
    setIsExamReload(!isExamReload);
    setOpenExaminate(true);
    setSelectedMrId(mrId);
  };

  const handleInvoice = (mrId: number, isPaid: boolean) => {
    setIsSelectedMrPaid(isPaid);
    setIsInvoiceReload(!isInvoiceReload);
    setOpenInvoice(true);
    setSelectedMrId(mrId);
  };

  const handleSupplyPres = (mrId: number) => {
    setIsSupplyPresReload(!isSupplyPresReload);
    setOpenSupplyPres(true);
    setSelectedMrId(mrId);
  };

  const handleCreateReCheckUpMr = async (mrId: number) => {
    var mrDetail = await medicalRecordService.getMedicalRecordDetailById(mrId);
    if (mrDetail === undefined) {
      message.error("Lỗi khi lấy thông tin hồ sơ", 2);
      return;
    } else {
      var doctor = await subService.getLeastAssignedDoctorByCategoryId(mrId);
      if (doctor !== undefined) {
        var mrAddModel: MedicalRecordAddModel = {
          examReason: "Tái khám",
          categoryIds: [defaultMrOption.DEFAULT_CATEGORY_ID],
          doctorIds: [doctor.userId],
          patientId: mrDetail.patientId,
          previousMedicalRecordId: mrId,
        };

        var response = await medicalRecordService.addMedicalRecord(mrAddModel);
        if (response === 200 || response === 201) {
          message
            .success("Tạo hồ sơ tái khám thành công", 2)
            .then(() => window.location.reload());
        } else {
          message.error("Lỗi khi tạo hồ sơ tái khám", 2);
          return;
        }
      } else {
        message.error("Không tìm thấy bác sĩ phù hợp", 2);
        return;
      }
    }
  };

  const columns: ColumnsType<MedicalRecordTableModel> = [
    {
      title: "Mã hồ sơ",
      dataIndex: "medicalRecordId",
      key: "medicalRecordId",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.medicalRecordId - b.medicalRecordId,
    },
    {
      title: "Mã bệnh nhân",
      dataIndex: "patientId",
      key: "patientId",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.patientId - b.patientId,
    },
    {
      title: "Tên bệnh nhân",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Ngày tháng",
      dataIndex: "medicalRecordDate",
      key: "medicalRecordDate",
      render: (text) => <a>{dayjs(text).format("YYYY-MM-DD HH:mm:ss")}</a>,
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (record) => (
        <a>{record === true ? "Đã thanh toán" : "Chưa thanh toán"}</a>
      ),
      sorter: (a, b) => +a.isPaid - +b.isPaid,
    },
    {
      title: "Khám",
      dataIndex: "isCheckUp",
      key: "isCheckUp",
      render: (record) => <a>{record === true ? "Đã khám" : "Chưa khám"}</a>,
      sorter: (a, b) => +a.isCheckUp - +b.isCheckUp,
    },
    {
      title: "",
      key: "action-1",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Row gutter={[5, 5]}>
            <Col span={24}>
              <Button
                key="view"
                type="primary"
                onClick={() =>
                  handleViewMedicalRecord(
                    record.patientId,
                    record.medicalRecordId
                  )
                }
              >
                Xem hồ sơ
              </Button>
            </Col>
            {record.isCheckUp === true &&
              authenticated?.role !== Roles.Doctor &&
              authenticated?.role !== Roles.Cashier && (
                <Col span={24}>
                  <Button
                    key="re-check-up-btn"
                    type="primary"
                    onClick={() =>
                      handleCreateReCheckUpMr(record.medicalRecordId)
                    }
                  >
                    Tạo hồ sơ tái khám
                  </Button>
                </Col>
              )}
          </Row>
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Row gutter={[5, 5]}>
            <Col>
              <Button
                key="checkout"
                type="primary"
                onClick={() => handleSupplyPres(record.medicalRecordId)}
              >
                Đơn thuốc
              </Button>
            </Col>
            <Col>
              {authenticated?.role !== Roles.Admin &&
              authenticated?.role !== Roles.Cashier ? (
                <></>
              ) : (
                <Button
                  key="checkout"
                  type="primary"
                  onClick={() =>
                    handleInvoice(record.medicalRecordId, record.isPaid)
                  }
                >
                  Hóa đơn
                </Button>
              )}
            </Col>
          </Row>
          <div style={{ height: "5px" }} />
          <Row gutter={[5, 5]}>
            <Col>
              {authenticated?.role !== Roles.Admin &&
              authenticated?.role !== Roles.Cashier ? (
                <></>
              ) : (
                <Button
                  key="checkout"
                  type="primary"
                  style={{ backgroundColor: "#0cb39d" }}
                  onClick={() => handleCheckout(record.medicalRecordId)}
                >
                  Chốt hóa đơn
                </Button>
              )}
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  const fetchMedicalRecords = async () => {
    var response: ApiResponseModel | undefined =
      await medicalRecordService.getMedicalRecordsByPatientId(
        0,
        pagination.current,
        pagination.pageSize
      );
    if (response === undefined) {
      message.error("Lỗi khi lấy dữ liệu hồ sơ bệnh nhân", 2);
    } else {
      console.log(response);
      const mappedResponse: MedicalRecordTableModel[] = response.items.map(
        (item) => ({ ...item, key: item.medicalRecordId + "" })
      );
      setMedicalRecords(mappedResponse);
      setPagination({
        ...pagination,
        total: response.totalCount, // Update total count
      });
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const handlePayPrescription = async () => {
    if (selectedMrId === undefined) {
      message.error("Lỗi khi lấy mã hóa đơn", 2);
      return;
    }

    var res: PrescriptionDiagnosIsPaidModel | undefined =
      await medicalRecordService.getPreDiagnoseByMrId(selectedMrId);
    if (res !== undefined) {
      if (res.isPaid === true) {
        message.info("Đơn thuốc đã được thanh toán", 2);
        return;
      } else {
        var statusCode = await medicalRecordService.payPrescriptionByMrId(
          selectedMrId
        );
        if (statusCode === 200) {
          message.success("Thanh toán đơn thuốc thành công", 2).then(() => {
            window.location.reload();
          });
        } else {
          message.error("Đơn thuốc trống", 2);
          return;
        }
      }
    } else {
      message.error("Hồ sơ chưa có đơn thuốc", 2);
      return;
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, [pagination.current, pagination.pageSize]);

  return (
    <div style={{ minHeight: "100vh", height: "auto" }}>
      <Table
        columns={columns}
        dataSource={medicalRecords}
        rowKey={(record) => record.medicalRecordId}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <GenericModal
        title="Hồ sơ bệnh nhân"
        isOpen={open}
        onClose={handleCancel}
        childComponent={
          <div>
            <MedicalRecordDetailForm
              patientId={selectedPatientId}
              medicalRecordId={selectedMrId}
              isReload={isReOpen}
            />
          </div>
        }
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="checkout"
            type="primary"
            onClick={() => handleSupplyPres(selectedMrId)}
          >
            Đơn thuốc
          </Button>,
          // authenticated?.role !== Roles.Admin &&
          // authenticated?.role !== Roles.Doctor ? (
          //   <></>
          // ) : (
          //   <Button key="paid" onClick={handlePaid}>
          //     Đã khám
          //   </Button>
          // ),
          authenticated?.role !== Roles.Admin &&
          authenticated?.role !== Roles.Doctor &&
          authenticated?.role !== Roles.Nurse ? (
            <></>
          ) : (
            <Button
              key="submit"
              type="primary"
              form="medicalRecordDetailForm"
              htmlType="submit"
            >
              Lưu
            </Button>
          ),
        ]}
      />

      {/* =============== Modal Examination Result */}
      {/* <GenericModal
        isOpen={openExaminate}
        onClose={handleCancelExaminate}
        title={`Kết luận hồ sơ ${selectedMrId}`}
        childComponent={
          <ExaminationForm
            isReload={isExamReload}
            medicalRecordId={selectedMrId}
          />
        }
        footer={[
          <Button key="back" onClick={handleCancelExaminate}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            form="examAddForm"
            htmlType="submit"
          >
            Lưu kết luận tổng
          </Button>,
        ]}
      /> */}

      {/* =============== Modal Invoice */}
      <GenericModal
        isOpen={openInvoice}
        onClose={handleCancelInvoice}
        title={`Hóa đơn hồ sơ ${selectedMrId}`}
        childComponent={
          <InvoiceForm
            isReload={isInvoiceReload}
            medicalRecordId={selectedMrId}
            patientId={selectedPatientId}
            isPaid={isSelectedMrPaid}
          />
        }
        footer={[
          <Button key="back" onClick={handleCancelInvoice}>
            Hủy
          </Button>,
        ]}
      />

      {/* =============== Modal Supply Prescription */}
      <GenericModal
        isOpen={openSupplyPres}
        onClose={handleCancelSupplyPres}
        title={`Đơn thuốc hồ sơ ${selectedMrId}`}
        childComponent={
          <SupplyPrescriptionDetailForm
            isReload={isSupplyPresReload}
            medicalRecordId={selectedMrId}
            patientId={selectedPatientId}
          />
        }
        footer={[
          <Button key="back" onClick={handleCancelSupplyPres}>
            Hủy
          </Button>,
          ,
          authenticated?.role === Roles.Cashier && (
            <Button type="primary" onClick={handlePayPrescription}>
              Thanh toán
            </Button>
          ),
          authenticated?.role === Roles.Doctor && (
            <Button
              key="submit"
              type="primary"
              form="supplyPresDetailForm"
              htmlType="submit"
            >
              Lưu
            </Button>
          ),
        ]}
      />
    </div>
  );
};

export default ListMedicalRecordTable;
