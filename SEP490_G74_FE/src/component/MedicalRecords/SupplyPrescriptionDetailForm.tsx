import {
  Form,
  Input,
  message,
  Select,
  Row,
  Col,
  SelectProps,
  Button,
  InputNumber,
  Divider,
  Modal,
} from "antd";
import { ExaminationProps } from "../../Models/MedicalRecordModel";
import { useContext, useEffect, useState } from "react";
import {
  ExamDetail,
  PrescriptionDiagnosIsPaidModel,
  SelectedSuppliesResponseModel,
  SuppliesPresAddModel,
  SupplyIdPreAddModel,
  SupplyPresSelectFormModel,
  SupplyResponseModel,
  SupplyTypeResponseModel,
} from "../../Models/SubEntityModel";
import subService from "../../Services/SubService";
import generatePDF from "react-to-pdf";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import Roles from "../../Enums/Enums";
import { AuthContext } from "../../ContextProvider/AuthContext";
import { PatientAddModel } from "../../Models/PatientModel";
import patientService from "../../Services/PatientService";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { TOKEN } from "../../Commons/Global";
import { JWTTokenModel } from "../../Models/AuthModel";
import { jwtDecode } from "jwt-decode";
import { text } from "stream/consumers";
import ExaminationService from "../../Services/ExaminationService";
import TextArea from "antd/es/input/TextArea";
import medicalRecordService from "../../Services/MedicalRecordService";

const SupplyPrescriptionDetailForm = ({
  medicalRecordId,
  isReload,
  patientId,
}: ExaminationProps) => {
  const [supplyPresForm] = Form.useForm();
  const { authenticated } = useContext(AuthContext);

  const [supplyTypeOptions, setSupplyTypeOptions] = useState<
    SelectProps["options"]
  >([]);

  const [supplyTypes, setSupplyTypes] = useState<
    SupplyTypeResponseModel[] | undefined
  >(undefined);

  const [availableSupplies, setAvailableSupplies] = useState<
    SupplyResponseModel[]
  >([]);

  const [selectedSupplies, setSelectedSupplies] = useState<
    SelectedSuppliesResponseModel[]
  >([]);

  const [patient, setPatient] = useState<PatientAddModel | undefined>(
    undefined
  );

  const [isPrintSuppliesModalOpen, setIsPrintSuppliesModalOpen] =
    useState<boolean>(false);

  const [examResult, setExamResult] = useState<string>("");

  const [diagnose, setDiagnose] = useState<string>("");

  const suppliesPrintColumns: ColumnsType<SelectedSuppliesResponseModel> = [
    {
      title: "STT",
      key: "STT",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên thuốc",
      key: "suppliesName",
      dataIndex: "supplyName",
    },
    {
      title: "Cách dùng",
      key: "uses",
      dataIndex: "uses",
    },
    // {
    //   title: "Đơn giá",
    //   key: "price",
    //   dataIndex: "price",
    //   render: (text, record, index) => (
    //     <span>{text.toLocaleString()} VND</span>
    //   ),
    // },
    {
      title: "Số lượng",
      key: "STT",
      dataIndex: "quantity",
      render: (text, record, index) => <span>{text} Viên</span>,
    },
    {
      title: "Liều dùng",
      key: "dose",
      dataIndex: "dose",
      render: (text, record, index) => <span>{text}</span>,
    },
  ];

  const onFinish = async (values: any) => {
    console.log(availableSupplies);
    console.log(values);

    if(authenticated?.role !== Roles.Doctor){
      message.error("Bạn không có quyền chỉnh sửa đơn thuốc", 2);
      return;
    }

    var selectedSupplies: SupplyIdPreAddModel[] = [];

    availableSupplies.forEach((element) => {
      var nameSelectedSupply = `selected_supply_${element.sId}`;
      var quantity = values[nameSelectedSupply];
      var doseName = `selected_supply_dose_${element.sId}`;
      var dose = values[doseName];

      if (quantity !== undefined) {
        var newSupplyId: SupplyIdPreAddModel = {
          supplyId: element.sId,
          quantity: quantity,
          dose: dose,
        };
        selectedSupplies.push(newSupplyId);
      }
    });

    if (selectedSupplies.length === 0) {
      message.info("Hãy chọn thuốc cần thêm", 2);
      return;
    }

    var diagnoseAdd: string = values["diagnose"];
    var supplyPresUpdate: SuppliesPresAddModel = {
      medicalRecordId: medicalRecordId,
      diagnose: diagnoseAdd,
      // supplyIds: selectedSupplies.filter((element) => element.quantity > 0),
      supplyIds: selectedSupplies,
    };

    if (medicalRecordId === undefined) {
      message.error("Update MR Failed Because Of Invalid Medical Record ID", 2);
      return;
    }

    var response = await subService.addSuppliesPrescriptionsByMrId(
      medicalRecordId,
      supplyPresUpdate
    );

    if (response === 200) {
      message.success("Update Success", 2).then(() => window.location.reload());
    } else {
      message.error("Update Failed", 2);
    }
  };

  const onFinishFailed = () => {
    message.error("Create Supply Prescription Failed");
  };

  const handleChangeSupplyType = async (values: number[]) => {
    supplyPresForm.resetFields(["selectedSupplies"]);

    // new
    if (values.length === 0) {
      //setSupplyOptions([]);
      supplyPresForm.resetFields(["selectedSupplies"]);
      return;
    }
    var newSupplyOptions: SelectProps["options"] = [];
    var suppliesByType: SupplyResponseModel[] = await fetchSupplies(values);
    suppliesByType = suppliesByType.filter((item) => item.isDeleted === false);
    console.log(suppliesByType);
    if (suppliesByType.length > 0) {
      suppliesByType.forEach((element) => {
        newSupplyOptions?.push({
          value: element.sId,
          label: element.sName,
        });
      });
      //setSupplyOptions(newSupplyOptions);
      supplyPresForm.resetFields(["selectedSupplies"]);
      setAvailableSupplies(suppliesByType);
      //   supplyPresForm.setFieldsValue({
      //     : suppliesByType.map((element) => element.sId),
      //   });
    }
  };

  async function fetchSupplies(
    values: number[]
  ): Promise<SupplyResponseModel[]> {
    var supplies: SupplyResponseModel[] = [];

    try {
      await Promise.all(
        values.map(async (typeId) => {
          var suppliesByType = await subService.getSuppliesBySupplyTypeId(
            typeId
          );
          if (suppliesByType !== undefined) {
            supplies = [...supplies, ...suppliesByType];
          }
        })
      );
    } catch (error) {
      message.error("Get Categories by Service Failed", 2);
      // Log or handle the error more specifically if needed
      console.error(error);
    }
    console.log(supplies);
    return supplies;
  }

  const fetchSupplyType = async () => {
    var response: SupplyTypeResponseModel[] | undefined =
      await subService.getAllSupplyTypes();
    console.log(response);
    if (response === undefined) {
      message.error("Get Supply Type Failed", 2);
      return;
    } else {
      response = response.filter((element) => element.isDeleted === false);
      var newOptions: SelectProps["options"] = [];
      response.forEach((element) => {
        newOptions!.push({
          value: element.suppliesTypeId,
          label: element.suppliesTypeName,
        });
      });
      setSupplyTypeOptions(newOptions);
      setSupplyTypes(response);
      supplyPresForm.setFieldsValue({
        medicalRecordId: medicalRecordId,
      });
    }
  };

  const fetchSelectedSupplies = async (medicalRecordId: number) => {
    var response = await subService.getSelectedSuppliesByMrId(medicalRecordId);
    console.log(response);
    if (response === undefined) {
      message.error("Get Selected Supplies Failed", 2);
      return;
    } else {
      setSelectedSupplies(response);
    }
  };

  const items: CollapseProps["items"] = [
    {
      key: `supplies_${medicalRecordId}`,
      label: <b>Thêm thuốc</b>,
      children: (
        <div id="add-supplies-container">
          <Form.Item<SupplyPresSelectFormModel>
            name="selectedSupplyTypes"
            label={<b>Chọn loại thuốc</b>}
          >
            <Select
              mode="multiple"
              onChange={handleChangeSupplyType}
              allowClear
              //set supply type options
              options={supplyTypeOptions}
            />
          </Form.Item>
          <Row gutter={10}>
            <Col span={6}>
              <b>Tên thuốc</b>
            </Col>
            <Col span={5}>
              <b>Giá tiền (VND)</b>
            </Col>
            <Col span={5}>
              <b>Liều dùng</b>
            </Col>
            <Col span={4}>
              <b>Số lượng đã chọn</b>
            </Col>
          </Row>
          <Divider dashed />
          {availableSupplies.map((element) => {
            return (
              <div key={element.sId}>
                <Row gutter={10}>
                  <Col span={6}>{element.sName}</Col>
                  <Col span={5}>{element.price.toLocaleString()} VND</Col>
                  <Col span={5}>
                    <Form.Item name={`selected_supply_dose_${element.sId}`}>
                      <Input placeholder="Liều dùng" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name={`selected_supply_${element.sId}`}>
                      <InputNumber
                        defaultValue={0}
                        placeholder="Số lượng"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            );
          })}
          <Form.Item name="diagnose">
            <TextArea rows={5} required placeholder="Thông tin thêm"/>
          </Form.Item>
        </div>
      ),
    },
  ];

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

  const [isPresPaid, setIsPresPaid] = useState<boolean>(false);

  const fetchDiagnose = async () => {
    var res: PrescriptionDiagnosIsPaidModel | undefined =
      await medicalRecordService.getPreDiagnoseByMrId(medicalRecordId);
    if (res !== undefined) {
      setDiagnose(res.diagnose);
      setIsPresPaid(res.isPaid);
      supplyPresForm.setFieldsValue({
        diagnose: res.diagnose,
      })
    }
  };

  const fetchExaminationResult = async () => {
    var res = await ExaminationService.getExamResultByMrId(medicalRecordId);
    if (res !== undefined) {
      var diagnose = res.conclusion;
      setExamResult(diagnose);
    }
  };

  const [name, setName] = useState<string>("");

  useEffect(() => {
    var token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var user: JWTTokenModel | undefined = jwtDecode(token);
      if (user !== undefined) {
        if (user.unique_name === undefined) user.unique_name = "";
        setName(user.unique_name);
      }
    }

    fetchDiagnose();
    fetchPatient();
    fetchExaminationResult();

    if (medicalRecordId !== undefined) {
      fetchSelectedSupplies(medicalRecordId);
      fetchSupplyType();
    }
  }, [medicalRecordId, isReload]);

  const getTargetElement = () => document.getElementById("printSupplies");
  return supplyTypes !== undefined ? (
    <div style={{ minWidth: "1000px", width: "max-content" }}>
      <Button type="primary" onClick={() => setIsPrintSuppliesModalOpen(true)}>
        In đơn thuốc
      </Button>
      <div id="main-container">
        <Form
          id="supplyPresDetailForm"
          form={supplyPresForm}
          name="basic3"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div id="printTargetSuppPres" style={{ padding: "20px" }}>
            <div id="mr-title">
              <Row gutter={10}>
                <Col span={8}>
                  <Form.Item<SupplyPresSelectFormModel>
                    label="Mã hồ sơ"
                    name="medicalRecordId"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={10} />
                <Col span={6} style={{textAlign:"center"}}>
                  Trạng thái đơn thuốc
                  <div>
                    {isPresPaid === true ? (
                      <b>Đã thanh toán</b>
                    ) : (
                      <b>Chưa thanh toán</b>
                    )}
                  </div>
                </Col>
              </Row>
              <Row gutter={10}></Row>
            </div>
            <div
              id="main-container"
              style={{
                border: "1px solid black",
                padding: "20px",
                borderRadius: "5px",
              }}
            >
              <Row>
                <Col>
                  <b>Đơn thuốc</b>
                </Col>
              </Row>
              <Divider />
              <Row gutter={10}>
                <Col span={6}>
                  <b>Tên thuốc</b>
                </Col>
                <Col span={4}>
                  <b>Số lượng</b>
                </Col>
                <Col span={6}>
                  <b>Liều dùng</b>
                </Col>
                <Col span={4}>
                  <b>Giá tiền (VND)</b>
                </Col>
                <Col span={4}>
                  <b>Tạm tính (VND)</b>
                </Col>
              </Row>
              <Divider dashed />
              {selectedSupplies.map((element) => {
                return (
                  <div key={element.supplyId}>
                    <Row gutter={10}>
                      <Col span={6}>{element.supplyName}</Col>
                      <Col span={4}>{element.quantity}</Col>
                      <Col span={6}>{element.dose}</Col>
                      <Col span={4}>{element.price.toLocaleString()} VND</Col>
                      <Col span={4}>
                        {(element.price * element.quantity).toLocaleString()}{" "}
                        VND
                      </Col>
                    </Row>
                  </div>
                );
              })}
              <Divider dashed />
              <Row>
                <Col span={16}></Col>
                <Col span={4}>
                  <b>Thành tiền</b>
                </Col>
                <Col span={4}>
                  <b>
                    {selectedSupplies
                      .reduce(
                        (sum, element) =>
                          sum + element.price * element.quantity,
                        0
                      )
                      .toLocaleString()}{" "}
                    VND
                  </b>
                </Col>
              </Row>
            </div>
            <br />
            <Row gutter={[10, 10]}>
              <Col span={24}>
                <b>Thông tin thêm:</b>
              </Col>
              <Col span={24}>
                <TextArea contentEditable={false} rows={5} value={diagnose} />
              </Col>
            </Row>
            <Divider />
          </div>
          <br />
          {authenticated?.role !== Roles.Admin &&
          authenticated?.role !== Roles.Doctor ? (
            <></>
          ) : (
            <Collapse items={items} />
          )}
        </Form>
      </div>
      {/*=================Modal================= */}
      <Modal
        destroyOnClose={true}
        open={isPrintSuppliesModalOpen}
        onCancel={() => setIsPrintSuppliesModalOpen(false)}
        onOk={() => generatePDF(getTargetElement)}
        style={{ width: "max-content", minWidth: "80vw" }}
      >
        <div id="printSupplies" style={{ padding: "20px" }}>
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
                    <div>Ngày: {dayjs().format("DD/MM/YYYY HH:mm:ss")}</div>
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
                    <h1>ĐƠN THUỐC BHYT</h1>
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
                  <b>Hình thức đến:</b>
                </Col>
                <Col span={20}>
                  <b>Tự đến</b>
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <b>Chẩn đoán:</b>
                </Col>
                <Col span={20}>
                  <b>{examResult}</b>
                </Col>
              </Row>
              <br />
              <br />
            </div>
          ) : (
            <></>
          )}
          <div style={{ minWidth: "100%", width: "max-content" }}>
            <Table
              columns={suppliesPrintColumns}
              dataSource={selectedSupplies}
              rowKey={(record) => record.supplyId}
              pagination={false}
            />
            <br />
            <br />
            <div>
              Cộng khoản: <b>{selectedSupplies.length}</b>
            </div>
            <div>
              <u>*Lời dặn: </u>
            </div>
            <br />
            <br />
            <div
              style={{
                width: "90%",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <div> </div>
                <br />
                <div>
                  <b>NGƯỜI BỆNH</b>
                </div>
                <div>
                  <i>Ký, ghi rõ họ tên</i>
                </div>
                <br />
                <div>
                  <b>{patient?.name}</b>
                </div>
                <div>
                  <i>Họ tên bố hoặc mẹ bệnh nhân dưới 72 tháng tuổi</i>
                </div>
                <br />
              </div>
              <div>
                <div>
                  <i>{dayjs().format("DD/MM/YYYY")}</i>
                </div>
                <div>
                  <b>BÁC SĨ</b>
                </div>
                <div>
                  <i>Ký, ghi rõ họ tên</i>
                </div>
                <br />
                <div>
                  <b>{name}</b>
                </div>
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  ) : (
    <div>An Error Occurs When Getting Patient</div>
  );
};

export default SupplyPrescriptionDetailForm;
