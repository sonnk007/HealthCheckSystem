import { Space, Button, message, Row, Col, Input, InputRef } from "antd";
import Table, { ColumnType, ColumnsType } from "antd/es/table";
import { MedicalRecordTableModel } from "../../Models/MedicalRecordModel";
import { useContext, useEffect, useRef, useState } from "react";
import MedicalRecordDetailForm from "./MedicalRecordDetailForm";
import { AuthContext } from "../../ContextProvider/AuthContext";
import Roles from "../../Enums/Enums";
import medicalRecordService from "../../Services/MedicalRecordService";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import GenericModal from "../Generic/GenericModal";
import InvoiceForm from "./InvoiceForm";
import SupplyPrescriptionDetailForm from "./SupplyPrescriptionDetailForm";
import { ApiResponseModel } from "../../Models/PatientModel";
import { SearchOutlined } from "@ant-design/icons";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { PrescriptionDiagnosIsPaidModel } from "../../Models/SubEntityModel";
import subService from "../../Services/SubService";

const ListMedicalRecordUnCheckTable = () => {
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

  const handleCancel = () => {
    setOpen(false);
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
      sorter: (a, b) =>
        dayjs(a.medicalRecordDate).unix() - dayjs(b.medicalRecordDate).unix(),
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (record) => (
        <a>{record === true ? "Đã thanh toán" : "Chưa thanh toán"}</a>
      ),
      sorter: (a, b) => (a.isPaid === b.isPaid ? 0 : a.isPaid ? 1 : -1),
    },
    {
      title: "Khám",
      dataIndex: "isCheckUpCompleted",
      key: "isCheckUpCompleted",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) =>
        a.isCheckUpCompleted.localeCompare(b.isCheckUpCompleted),
    },
    {
      title: "Khám hoàn tất",
      dataIndex: "isCheckUp",
      key: "isCheckUp",
      render: (record) => <a>{record === true ? "Hoàn tất" : "Chưa"}</a>,
      sorter: (a, b) =>
        a.isCheckUp === b.isCheckUp ? 0 : a.isCheckUp ? 1 : -1,
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
            <Col>
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
              {authenticated?.role !== Roles.Admin &&
              authenticated?.role !== Roles.Cashier ? (
                <></>
              ) : (
                <Button
                  key="checkout"
                  type="primary"
                  onClick={() => handleCheckout(record.medicalRecordId)}
                >
                  Thanh toán
                </Button>
              )}
            </Col>
          </Row>
          <div style={{ height: "5px" }} />
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
        </div>
      ),
    },
  ];

  const checkMrHavePrescription = async (meds: MedicalRecordTableModel[]) => {
    for (let index = 0; index < meds.length; index++) {
      var i = index;
      let mrId = meds[i].medicalRecordId;
      var isHavePres = await medicalRecordService.getPreDiagnoseByMrId(mrId);
      if (isHavePres !== undefined && isHavePres.isPaid === true) {
        meds[i] = { ...meds[i], isHaveUnpaidPrescription: true };
      } else {
        meds[i] = { ...meds[i], isHaveUnpaidPrescription: false };
      }
    }
    var updatedMeds = [...meds];
    setMedicalRecords(updatedMeds);
  };

  const fetchMedicalRecords = async () => {
    var response: ApiResponseModel | undefined =
      await medicalRecordService.getMedicalRecordsUnCheckByPatientId(
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
      //checkMrHavePrescription(mappedResponse);
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
          authenticated?.role === Roles.Cashier && (
            <Button type="primary" onClick={handlePayPrescription}>
              Thanh toán
            </Button>
          ),
          <Button
            key="submit"
            type="primary"
            form="supplyPresDetailForm"
            htmlType="submit"
          >
            Lưu
          </Button>,
        ]}
      />
    </div>
  );
};

export default ListMedicalRecordUnCheckTable;
