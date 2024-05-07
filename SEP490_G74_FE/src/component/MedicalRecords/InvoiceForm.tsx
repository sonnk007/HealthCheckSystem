import { Button, Col, Divider, Form, Modal, Row, message } from "antd";
import { ExaminationProps } from "../../Models/MedicalRecordModel";
import ExaminationService from "../../Services/ExaminationService";
import { ExamDetail } from "../../Models/SubEntityModel";
import { useEffect, useState } from "react";
import { PatientAddModel } from "../../Models/PatientModel";
import patientService from "../../Services/PatientService";
import dayjs from "dayjs";
import generatePDF from "react-to-pdf";
import { JWTTokenModel } from "../../Models/AuthModel";
import { TOKEN } from "../../Commons/Global";
import { jwtDecode } from "jwt-decode";
import Table, { ColumnsType } from "antd/es/table";

const InvoiceForm = ({
  medicalRecordId,
  isReload,
  patientId,
  isPaid,
}: ExaminationProps) => {
  const [invoice, setInvoice] = useState<ExamDetail[] | undefined>(undefined);
  const [patient, setPatient] = useState<PatientAddModel | undefined>(
    undefined
  );
  const [total, setTotal] = useState<number>(0);
  const [invoiceForm] = Form.useForm();
  const [isPrintInvoiceModalOpen, setIsPrintInvoiceModalOpen] =
    useState<boolean>(false);

  const fetchInvoice = async (medicalRecordId: number) => {
    var response = await ExaminationService.getListExamServicesByMrId(
      medicalRecordId
    );
    if (response === undefined) {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau", 2);
    } else {
      console.log(response);
      setInvoice(response.examDetails);

      const totalPrice = response.examDetails.reduce(
        (accumulator, examDetail) => accumulator + examDetail.price!,
        0
      );
      setTotal(totalPrice);
      invoiceForm.setFieldsValue({
        totalPrice: totalPrice,
        examDetails: response.examDetails,
      });
    }
  };

  const fetchPatient = async () => {
    if (patientId === undefined) return;
    //PatientAddModel
    var response: PatientAddModel | undefined =
      await patientService.getPatientById(patientId);
    if (response === undefined) {
      message.error("Get Patient Failed", 2);
    } else {
      console.log(response);
      setPatient(response);
    }
  };

  const [name, setName] = useState<string>("");

  const invoicePrintColumns: ColumnsType<ExamDetail> = [
    {
      title: "STT",
      key: "STT",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên dịch vụ",
      key: "serviceName",
      dataIndex: "serviceName",
    },
    {
      title: "Số lượng",
      key: "STT",
      dataIndex: "STT",
      render: () => <span>1</span>,
    },
    {
      title: "Đơn giá",
      key: "price",
      dataIndex: "price",
      render: (text, record, index) => (
        <span>{record.price?.toLocaleString()} VND</span>
      ),
    },
    {
      title: "Thành tiền",
      key: "price",
      dataIndex: "price",
      render: (text, record, index) => (
        <span>{record.price?.toLocaleString()} VND</span>
      ),
    },
  ];

  const handlePayServiceMr = async (
    medicalRecordId: number,
    serviceId: number
  ) => {
    if (isPaid) {
      message.info("Hóa đơn đã thanh toán không thể chỉnh sửa", 2);
      return;
    }
    var response = await ExaminationService.patchPayServiceMr(
      medicalRecordId,
      serviceId
    );
    if (response === undefined && response !== 200) {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau", 2);
    } else {
      message.success("Thanh toán thành công", 2).then(() => {
        window.location.reload();
      });
    }
  };

  const TableFooter = () => {
    return (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0}></Table.Summary.Cell>
        <Table.Summary.Cell index={1} colSpan={3}>Tổng Cộng</Table.Summary.Cell>
        <Table.Summary.Cell index={2}>
          <b>
            {(invoice!
              .filter((detail) => detail.isPaid === true)
              .reduce((total, detail) => total + detail!.price!, 0)).toLocaleString()}{" "}
            VND
          </b>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    );
  };

  useEffect(() => {
    var token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var user: JWTTokenModel | undefined = jwtDecode(token);
      if (user !== undefined) {
        if (user.unique_name === undefined) user.unique_name = "";
        setName(user.unique_name);
      }
    }

    fetchPatient();
    fetchInvoice(medicalRecordId);
  }, [isReload]);
  const getTargetElement = () => document.getElementById("printInvoice");
  return invoice === undefined ? (
    <></>
  ) : (
    <div>
      <Row>
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Button
            type="primary"
            onClick={() => setIsPrintInvoiceModalOpen(true)}
          >
            In hóa đơn
          </Button>
        </Col>
      </Row>
      <div id="printInvoiceContainer" style={{ padding: "20px" }}>
        {patient !== undefined ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  fontSize: "15px",
                }}
              >
                <div>
                  <div>
                    <b>PHÒNG KHÁM HCS</b>
                  </div>
                  <div>
                    <i>Hola University</i>
                  </div>
                  <div>
                    <i>0123456789</i>
                  </div>
                </div>
                <div>
                  <div>
                    <b>Kí hiệu: HCS</b>
                  </div>
                  <div>
                    Số: <b>{medicalRecordId}</b>
                  </div>
                  <div>Ngày thu: {dayjs().format("DD/MM/YYYY HH:mm:ss")}</div>
                </div>
              </div>
            </div>
            <br />
            <br />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Row>
                <Col span={24}>
                  <h1>HÓA ĐƠN DỊCH VỤ</h1>
                  <div style={{ textAlign: "center" }}>
                    Ngày thu: {dayjs().format("DD/MM/YYYY HH:mm:ss")}
                  </div>
                </Col>
              </Row>
            </div>
            <br />
            <br />
            {/* <Row>
              <Col span={24}>
                <h2>
                  <b>Thông tin bệnh nhân</b>
                </h2>
              </Col>
            </Row> */}
            <br />
            <Row>
              <Col span={4}>
                <b>Họ tên bệnh nhân:</b>
              </Col>
              <Col span={20}>
                <b>{patient?.name.toUpperCase()}</b>
              </Col>
            </Row>
            <Row>
              <Col span={4}>
                <b>Năm sinh:</b>
              </Col>
              <Col span={20}>
                {dayjs(patient.dob).format("YYYY-MM-DD HH:mm:ss")}
              </Col>
            </Row>
            <Row>
              <Col span={4}>
                <b>Số điện thoại:</b>
              </Col>
              <Col span={20}>{patient?.phone}</Col>
            </Row>
            <Row>
              <Col span={4}>
                <b>Địa chỉ:</b>
              </Col>
              <Col span={20}>{patient?.address}</Col>
            </Row>
            <Row>
              <Col span={4}>
                <b>Đối tượng:</b>
              </Col>
              <Col span={20}>Dịch vụ</Col>
            </Row>
            <br />
            <br />
          </div>
        ) : (
          <></>
        )}
        <div style={{ minWidth: "1000px", width: "max-content" }}>
          <Row>
            <Col span={8}>
              <b>Tên dịch vụ</b>
            </Col>
            <Col span={4}>
              <b>Trạng thái</b>
            </Col>
            <Col span={6}>
              <b>Giá</b>
            </Col>
            <Col span={6}></Col>
          </Row>
          <Divider />
          {invoice.map((examDetail) => (
            <div key={examDetail.serviceId}>
              <Row>
                <Col span={8}>{examDetail.serviceName}</Col>
                <Col span={4}>
                  {examDetail.isPaid === true
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </Col>
                <Col span={6}>{examDetail.price?.toLocaleString()} VND</Col>
                <Col span={6}>
                  <Button
                    type="primary"
                    disabled={examDetail.isPaid === true ? true : false}
                    onClick={() =>
                      handlePayServiceMr(
                        examDetail.medicalRecordId,
                        examDetail.serviceId
                      )
                    }
                  >
                    Thanh toán
                  </Button>
                </Col>
              </Row>
              <Divider />
            </div>
          ))}
          <Row>
            <Col span={8}>
              <h3>
                <b>Tổng tiền</b>
              </h3>
            </Col>
            <Col span={6} />
            <Col span={10}>
              <h3>
                <b>{total.toLocaleString()} VND</b>
              </h3>
            </Col>
          </Row>
          <br />
          <br />
          <br />
          <Row>
            <Col span={24}>
              <b>Nhân viên thu ngân</b>
            </Col>
          </Row>
          <Row>
            <Col span={24}>{name}</Col>
          </Row>
        </div>
      </div>
      {/*=================Modal================= */}
      <Modal
        destroyOnClose={true}
        open={isPrintInvoiceModalOpen}
        onCancel={() => setIsPrintInvoiceModalOpen(false)}
        onOk={()=>generatePDF(getTargetElement)}
        style={{ width: "max-content", minWidth: "80vw" }}
      >
        <div id="printInvoice" style={{ padding: "20px" }}>
          {patient !== undefined ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    fontSize: "15px",
                  }}
                >
                  <div>
                    <div>
                      <b>PHÒNG KHÁM HCS</b>
                    </div>
                    <div>
                      <i>Hola University</i>
                    </div>
                    <div>
                      <i>0123456789</i>
                    </div>
                  </div>
                  <div>
                    <div>
                      <b>Kí hiệu: HCS</b>
                    </div>
                    <div>
                      Số: <b>{medicalRecordId}</b>
                    </div>
                    <div>Ngày thu: {dayjs().format("DD/MM/YYYY HH:mm:ss")}</div>
                  </div>
                </div>
              </div>
              <br />
              <br />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Row>
                  <Col span={24}>
                    <h1>BIÊN LAI THU TIỀN</h1>
                    <div style={{ textAlign: "center" }}>
                      Ngày thu: {dayjs().format("DD/MM/YYYY HH:mm:ss")}
                    </div>
                  </Col>
                </Row>
              </div>
              <br />
              <br />
              <br />
              <Row>
                <Col span={4}>
                  <b>Họ tên bệnh nhân:</b>
                </Col>
                <Col span={20}>
                  <b>{patient?.name.toUpperCase()}</b>
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <b>Năm sinh:</b>
                </Col>
                <Col span={20}>
                  {dayjs(patient.dob).format("YYYY-MM-DD HH:mm:ss")}
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <b>Số điện thoại:</b>
                </Col>
                <Col span={20}>{patient?.phone}</Col>
              </Row>
              <Row>
                <Col span={4}>
                  <b>Địa chỉ:</b>
                </Col>
                <Col span={20}>{patient?.address}</Col>
              </Row>
              <Row>
                <Col span={4}>
                  <b>Đối tượng:</b>
                </Col>
                <Col span={20}>Dịch vụ</Col>
              </Row>
              <br />
              <br />
            </div>
          ) : (
            <></>
          )}
          <div style={{ minWidth: "100%", width: "max-content" }}>
            <Table
              columns={invoicePrintColumns}
              dataSource={invoice.filter(
                (examDetail) => examDetail.isPaid === true
              )}
              rowKey={(record) => record.serviceId}
              pagination={false}
              summary={() => (
                <Table.Summary fixed>
                  <TableFooter />
                </Table.Summary>
              )}
            />
            <br />
            <Row>
              <Col span={6}>
                <div>
                  <b>Tổng người bệnh phải nộp: </b>
                </div>
              </Col>
              <Col span={4} />
              <Col span={14}>
                <div>
                  <b>
                    {(invoice
                      .filter((detail) => detail.isPaid === true)
                      .reduce(
                        (total, detail) => total + detail!.price!,
                        0
                      )).toLocaleString()}{" "}
                    VND
                  </b>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div style={{ fontSize: "15px" }}>
                  <span>
                    <i>Hình thức thanh toán: </i>
                    <b>
                      <i>Tiền mặt</i>
                    </b>
                  </span>
                </div>
              </Col>
            </Row>
            <br />
            <br />
            <br />
            <div
              style={{
                width: "90%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div>
                <div>
                  <b>Người thu tiền</b>
                </div>
                <div>
                  <i>Ký, ghi rõ họ tên</i>
                </div>
                <br />
                <div>{name}</div>
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceForm;
