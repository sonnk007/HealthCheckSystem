import {
  Button,
  Col,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import {
  DoctorDetailModel,
  ExaminationProps,
  PatientMedicalRecordExaminationPrintModel,
} from "../../Models/MedicalRecordModel";
import ExaminationService from "../../Services/ExaminationService";
import {
  ExamResultAddModel,
  ExamResultGetModel,
  ExaminationsResultModel,
} from "../../Models/SubEntityModel";
import { useContext, useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { AuthContext } from "../../ContextProvider/AuthContext";
import Roles from "../../Enums/Enums";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import axios from "axios";
import generatePDF from "react-to-pdf";
import { lte, set } from "cypress/types/lodash";
import patientService from "../../Services/PatientService";
import medicalRecordService from "../../Services/MedicalRecordService";
import { TOKEN } from "../../Commons/Global";
import { jwtDecode } from "jwt-decode";
import { JWTTokenModel } from "../../Models/AuthModel";
import categoryService from "../../Services/CategoryService";

const ExaminationFormViewOnly = ({
  medicalRecordId,
  isReload,
  patientId,
}: ExaminationProps) => {
  const { authenticated } = useContext(AuthContext);
  const [examAddForm] = Form.useForm();
  const [selectedServiceId, setSelectedServiceId] = useState<number>(0);
  const [examDetailList, setExamDetailList] = useState<
    ExaminationsResultModel | undefined
  >(undefined);
  const [examResult, setExamResult] = useState<ExamResultGetModel | undefined>(
    undefined
  );
  const [isExamConclused, setIsExamConclused] = useState<boolean>(false);
  const [isDefaultDoctor, serIsDefaultDoctor] = useState<boolean>(false);

  const fetchExamination = async () => {
    if (medicalRecordId === undefined) {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau");
      return;
    }

    var examDetails: ExaminationsResultModel | undefined =
      await ExaminationService.getListExamServicesByMrId(medicalRecordId);
    if (examDetails !== undefined) {
      console.log(examDetails);
      //setExamDetailList(examDetails);
      examAddForm.setFieldsValue({
        medicalRecordId: examDetails.medicalRecordId,
        examDetails: examDetails.examDetails,
      });
      return examDetails;
    }
  };

  const fetchExaminationResult = async () => {
    if (medicalRecordId === undefined) {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau");
      return;
    }

    examAddForm.setFieldsValue({
      diagnosis: "",
      conclusion: "",
    });

    var examResult: ExamResultGetModel | undefined =
      await ExaminationService.getExamResultByMrId(medicalRecordId);
    if (examResult !== undefined) {
      console.log(examResult);

      if (examResult.conclusion !== "" && examResult.diagnosis !== "") {
        setExamResult(examResult);
        examAddForm.setFieldsValue({
          diagnosis: examResult.diagnosis,
          conclusion: examResult.conclusion,
        });
        setIsExamConclused(true);
      }
      return examResult;
    }
  };

  const handleUpdateExaminationDetail = async (serviceId: number) => {
    if (isExamConclused) {
      message.error("Khám đã kết luận, không thể cập nhật kết quả khám");
      return;
    }

    const examDetails = examAddForm.getFieldValue("examDetails");
    var serviceUpdated = examDetails.filter(
      (detail: any) => detail.serviceId === serviceId
    );
    console.log(examDetails);
    console.log(serviceUpdated);
    var examDetail: ExaminationsResultModel = {
      medicalRecordId: medicalRecordId,
      examDetails: serviceUpdated,
    };
    var response = await ExaminationService.putUpdateExaminationResult(
      medicalRecordId,
      examDetail
    );

    if (response !== undefined && response === 200) {
      message.success("Cập nhật thành công");
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  const handleUpdateExaminationResult = async (
    values: ExaminationsResultModel
  ) => {
    if (isExamConclused) {
      message.error("Khám đã kết luận, không thể cập nhật kết quả khám");
      return;
    }

    if (values.diagnosis === undefined || values.conclusion === undefined) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    var examResultAddModel: ExamResultAddModel = {
      medicalRecordId: medicalRecordId,
      diagnosis: values.diagnosis,
      conclusion: values.conclusion,
    };

    var response = await ExaminationService.postAddExaminationResult(
      examResultAddModel.medicalRecordId,
      examResultAddModel
    );
    if (response === undefined) {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau", 2);
    } else {
      message
        .success("Cập nhật thành công", 2)
        .then(() => window.location.reload());
    }
  };

  //create a function use Promise.all to wait for fetchExamination and fetchExaminationResult
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const fetchExam = async () => {
    var response = await Promise.all([
      fetchExamination(),
      fetchExaminationResult(),
    ]);
    console.log(response);
    var examDetails = response[0];
    if (examDetails !== undefined) {
      var isAddImageDon = await Promise.all(
        examDetails.examDetails.map(async (detail) => {
          var image = await getImage(detail.medicalRecordId, detail.serviceId);
          if (image !== undefined) {
            detail.image = image;
          }
        })
      );
      if (isAddImageDon !== undefined) {
        console.log(examDetails);
        setExamDetailList(examDetails);
        setIsLoaded(true);
      }
    }
    return true;
  };

  const checkIsDefaultDoctor = async () => {
    var res = await categoryService.postIsDefaultDoctor();
    if (res !== undefined && res === 200) {
      return true;
    }
    return false;
  };

  const setUpData = async () => {
    var res = await Promise.all([checkIsDefaultDoctor(), fetchExam()]);
    if (res !== undefined && res.length > 0) {
      if (res[0] === true) {
        serIsDefaultDoctor(true);
      }
    }
  };

  useEffect(() => {
    setUpData();
  }, [isReload, isLoaded, selectedServiceId]);

  //======== upload file============
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        "https://localhost:7021/api/ExaminationResult/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        console.log("Image uploaded successfully:", response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const getImage = async (medicalRecordId: number, serviceId: number) => {
    try {
      const response = await axios.get(
        `https://localhost:7021/api/ExaminationResult/image/${medicalRecordId}_${serviceId}`,
        {
          responseType: "blob", // Important for dealing with images
          headers: {
            "Content-Type": "image/jpeg",
          },
        }
      );
      if (response.status === 200) {
        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl;
      } else {
        return undefined;
      }
    } catch (error) {
      //console.error("Failed to fetch image:", error);
      return undefined;
    }
  };

  const handleUpload = async (medicalRecordId: number, serviceId: number) => {
    console.log(fileList);
    var file = fileList[0] as unknown as File;
    const newFile = new File([file], `${medicalRecordId}_${serviceId}`);
    file = newFile;

    var response = await uploadImage(file);
    console.log(response);
    if (response === true) {
      message.success("Upload thành công");
    } else {
      message.error("Upload thất bại");
    }
  };
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>(null);
  const uploadProps: UploadProps = {
    multiple: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      return false;
    },
    fileList,
  };

  const getTargetElement = () =>
    document.getElementById("targetExamServicePrint" + selectedServiceId);

  // Print Modal
  const [openPrintModal, setOpenPrintModal] = useState<boolean>(false);
  const [printModel, setPrintModel] = useState<
    PatientMedicalRecordExaminationPrintModel | undefined
  >(undefined);

  const fetchPatient = async () => {
    if (patientId !== undefined) {
      var patient = await patientService.getPatientById(patientId);
      if (patient !== undefined) {
        return patient;
      }
    }
  };

  const fetchMedicalRecords = async () => {
    if (medicalRecordId !== undefined) {
      var mr = await medicalRecordService.getMedicalRecordDetailById(
        medicalRecordId
      );
      if (mr !== undefined) {
        return mr;
      }
    }
  };

  const fetchDoctorCategoryByService = async (serviceId: number) => {
    var response = await categoryService.getDoctorCategoryByService(
      serviceId,
      medicalRecordId
    );
    if (response !== undefined) {
      return response;
    }
    return undefined;
  };

  const fetchPatientMedical = async (serviceId: number) => {
    var response = await Promise.all([
      fetchPatient(),
      fetchDoctorCategoryByService(serviceId),
      fetchMedicalRecords(),
    ]);
    if (response !== undefined && response.length > 0) {
      var patient = response[0];
      var cateDoc = response[1];
      var medicalRecord = response[2];
      if (
        patient !== undefined &&
        medicalRecord !== undefined &&
        response[2] !== undefined
      ) {
        var examDetail = examDetailList?.examDetails.find(
          (detail) => detail.serviceId === serviceId
        );

        if (examDetail === undefined) return;

        let printModel: PatientMedicalRecordExaminationPrintModel = {
          patientId: patientId ?? 0,
          name: patient.name,
          address: patient.address,
          dob: patient.dob,
          blood: patient.bloodGroup,
          bloodPressure: Number.parseInt(patient.bloodPressure),
          height: patient.height,
          weight: patient.weight,
          description: medicalRecord.examReason,
          editDate: dayjs(medicalRecord.medicalRecordDate).format(
            "DD/MM/YYYY HH:mm:ss"
          ),
          doctorName: cateDoc?.doctorName ?? "",
          categoryName: cateDoc?.categoryName ?? "",
          phone: patient.phone,
          gender: patient.gender === "true" ? true : false,
          id: medicalRecordId ?? 0,
          diagnose: examDetail.diagnose,
          conclusion: examDetail.description,
          image: examDetail.image ?? "",
          price: examDetail.price ?? 50000,
          isCheckUp: true,
          isPaid: true,
          serviceId: examDetail.serviceId,
          serviceName: examDetail.serviceName,
          status: examDetail.status ?? true,
        };
        setPrintModel(printModel);
        console.log(printModel);
      }
      return response;
    }
  };

  const handlePrint = async (serviceId: number) => {
    setSelectedServiceId(serviceId);
    var res = await fetchPatientMedical(serviceId);
    if (res !== undefined && res.length > 0) {
      setOpenPrintModal(true);
    }
  };

  const printModal = () => {
    generatePDF(getTargetElement);
  };

  return examDetailList === undefined ? (
    <></>
  ) : (
    <div style={{ minWidth: "600px", width: "max-content" }}>
      <Form
        id="examAddForm"
        form={examAddForm}
        layout="vertical"
        name="basic exam"
        onFinish={handleUpdateExaminationResult}
      >
        <Row>
          <Col
            span={24}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            Ngày chỉnh sửa:{" "}
            {dayjs(examResult?.examDate).format("DD/MM/YYYY HH:mm:ss")}
          </Col>
        </Row>
        <br />
        {examDetailList.examDetails.map((examDetail, index) => (
          <div key={examDetail.serviceId}>
            <div>
              <Row>
                <Col span={16}>
                  Dịch vụ: <b>{examDetail.serviceName}</b>
                </Col>
                <Col span={4}>
                  <div>Trạng thái: </div>
                  <div>
                    <b>
                      {examDetail.status === undefined ||
                      examDetail.status! === false
                        ? "Chưa khám"
                        : "Đã khám"}
                    </b>
                  </div>
                </Col>
                <Col span={4}>
                  <div>Thanh toán: </div>
                  <div>
                    <b>
                      {examDetail.isPaid === undefined ||
                      examDetail.isPaid === false
                        ? "Chưa thanh toán"
                        : "Đã thanh toán"}
                    </b>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div style={{ marginBottom: "5px" }}>
                    <div>Hình ảnh</div>
                    {
                      <Image
                        src={examDetail.image}
                        style={{ maxWidth: "300px", maxHeight: "300px" }}
                      />
                    }
                  </div>
                  {/* <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                  </Upload>
                  <Button
                    type="primary"
                    onClick={() =>
                      handleUpload(
                        examDetail.medicalRecordId,
                        examDetail.serviceId
                      )
                    }
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                  >
                    {uploading ? "Đang tải" : "Tải ảnh lên"}
                  </Button> */}
                </Col>
              </Row>
              <Row key={examDetail.serviceId}>
                <Col span={24}>
                  <Form.Item<ExaminationsResultModel>
                    label="Mô tả"
                    name={["examDetails", index, "description"]}
                  >
                    <TextArea showCount disabled placeholder="Description" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item<ExaminationsResultModel>
                    label="Kết luận"
                    name={["examDetails", index, "diagnose"]}
                  >
                    <TextArea showCount disabled placeholder="Diagnose" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Row>
              <Col
                span={12}
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                {authenticated?.role !== Roles.Admin &&
                authenticated?.role !== Roles.Doctor ? (
                  <></>
                ) : (
                  <Button
                    onClick={() => handlePrint(examDetail.serviceId)}
                    type="primary"
                  >
                    In kết quả
                  </Button>
                )}
              </Col>
              {/* <Col
                span={12}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                {authenticated?.role !== Roles.Admin &&
                authenticated?.role !== Roles.Doctor ? (
                  <></>
                ) : (
                  <Button
                    disabled={!examDetail.isPaid}
                    onClick={() =>
                      handleUpdateExaminationDetail(examDetail.serviceId)
                    }
                    type="primary"
                  >
                    Đã khám
                  </Button>
                )}
              </Col> */}
            </Row>
            <Divider dashed />
          </div>
        ))}
        <div
          style={{ display: isDefaultDoctor === false ? "none" : undefined }}
        >
          <Row style={{ display: "flex", alignItems: "center" }}>
            <Col span={24}>
              <Form.Item<ExaminationsResultModel>
                label="Chẩn đoán sơ bộ"
                name={"diagnosis"}
              >
                <TextArea disabled placeholder="Diagnosis" />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: "flex", alignItems: "center" }}>
            <Col span={24}>
              <Form.Item<ExaminationsResultModel>
                label="Kết luận tổng"
                name={"conclusion"}
              >
                <TextArea disabled placeholder="Conclusion" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
      {/* <Row style={{ display: isDefaultDoctor === false ? "none" : undefined }}>
        <Col span={10} />
        <Col span={14}>
          {authenticated?.role !== Roles.Admin &&
          authenticated?.role !== Roles.Doctor ? (
            <></>
          ) : (
            <Button
              key="submitExam"
              type="primary"
              form="examAddForm"
              htmlType="submit"
              disabled={false}
            >
              Khám hoàn tất
            </Button>
          )}
        </Col>
      </Row> */}
      <Modal
        open={openPrintModal}
        onOk={() => printModal()}
        onCancel={() => setOpenPrintModal(false)}
        title="In kết quả khám"
        key={"printModal" + selectedServiceId}
        destroyOnClose={true}
      >
        <div>
          <div
            id={"targetExamServicePrint" + selectedServiceId}
            style={{ padding: "20px" }}
          >
            <Row gutter={10}>
              <Col span={12}>
                <b>Mã hồ sơ:</b> {printModel?.id}
              </Col>
              <Col span={12}>
                <b>Ngày:</b> {printModel?.editDate}
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={24}>
                <b>Mã bệnh nhân:</b> {printModel?.patientId}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <b>Tên bệnh nhân:</b> {printModel?.name.toLocaleUpperCase()}
              </Col>
            </Row>
            <Row>
              <Col>
                <b>Ngày sinh:</b>{" "}
                {dayjs(printModel?.dob).format("DD/MM/YYYY hh:mm:ss")}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <b>Giới tính:</b> {printModel?.gender === true ? "Nam" : " Nữ"}
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <b>Địa chỉ:</b> {printModel?.address.toLocaleUpperCase()}
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <b>Nhóm máu:</b> {printModel?.blood.toUpperCase()}
              </Col>
              <Col span={12}>
                <b>Huyết áp:</b> {printModel?.bloodPressure} (mmHg)
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <b>Chiều cao:</b> {printModel?.height} (cm)
              </Col>
              <Col span={12}>
                <b>Cân nặng:</b> {printModel?.weight} (kg)
              </Col>
            </Row>
            <Divider dashed />
            <Row>
              <Col>
                <b>Khoa khám: </b>
                {printModel?.categoryName.toLocaleUpperCase()}
              </Col>
            </Row>
            <Row>
              <Col>
                <b>Bác sĩ khám: </b>
                {printModel?.doctorName.toLocaleUpperCase()}
              </Col>
            </Row>
            <Row>
              <Col>
                <b>Dịch vụ khám: </b>
                {printModel?.serviceName.toLocaleUpperCase()}
              </Col>
            </Row>
            <Row gutter={10}>
              <Col>
                <b>Hình ảnh:</b>{" "}
              </Col>
            </Row>
            <Row>
              <Col span={18}>
                <Image src={printModel?.image} />
              </Col>
            </Row>
            <Row gutter={10}>
              <Col>
                <b>Mô tả:</b> {printModel?.diagnose.toLocaleUpperCase()}
              </Col>
            </Row>
            <Row gutter={10}>
              <Col>
                <b>Chẩn đoán sơ bộ:</b>{" "}
                {printModel?.conclusion.toLocaleUpperCase()}
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExaminationFormViewOnly;
