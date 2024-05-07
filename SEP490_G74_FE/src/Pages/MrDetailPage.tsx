import {
  Button,
  Col,
  Collapse,
  CollapseProps,
  DatePicker,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import generatePDF from "react-to-pdf";
import medicalRecordService from "../Services/MedicalRecordService";
import {
  MedicalRecord,
  MedicalRecordDetailModel,
} from "../Models/MedicalRecordModel";
import {
  CategoryResponseModel,
  DoctorResponseModel,
  ServiceResponseModel,
  ServiceTypeResponseModel,
} from "../Models/SubEntityModel";
import { PatientAddModel } from "../Models/PatientModel";
import patientService from "../Services/PatientService";
import categoryService from "../Services/CategoryService";
import dayjs from "dayjs";
import subService from "../Services/SubService";
import TextArea from "antd/es/input/TextArea";
import { ROUTE_URLS } from "../Commons/Global";
import ExaminationFormViewOnly from "../component/MedicalRecords/ExaminationFormViewOnly";

const MrDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const getTargetElement = () => document.getElementById("printTargetDetail");
  const [mrDetailform] = Form.useForm();
  const navigate = useNavigate();

  const [mrDetail, setMrDetail] = useState<
    MedicalRecordDetailModel | undefined
  >(undefined);
  const [prevMrId, setPrevMrId] = useState<number | undefined>(undefined);
  const [cates, setCates] = useState<CategoryResponseModel[]>([]);
  const [doctors, setDoctors] = useState<DoctorResponseModel[]>([]);
  const [types, setTypes] = useState<ServiceTypeResponseModel[]>([]);
  const [services, setServices] = useState<ServiceResponseModel[]>([]);
  const [selectedServices, setSelectedServices] = useState<
    ServiceResponseModel[]
  >([]);
  const [patient, setPatient] = useState<PatientAddModel | undefined>(
    undefined
  );

  const fetchMedicalRecordDetail = async () => {
    var medicalRecordId = Number.parseInt(id ?? "0");
    mrDetailform.setFieldsValue({
      id: medicalRecordId,
    });

    var mrDetailResponse: MedicalRecordDetailModel | undefined =
      await medicalRecordService.getMedicalRecordDetailById(medicalRecordId);
    if (mrDetailResponse === undefined) {
      message.error("Get Medical Record Detail Failed", 2);
    } else {
      setMrDetail(mrDetailResponse);
      setPrevMrId(mrDetailResponse.prevMedicalRecordId);

      // set cates
      var currentSelectedCategories: CategoryResponseModel[] =
        mrDetailResponse.categories.map((cate) => ({
          categoryId: cate.categoryId,
          categoryName: cate.categoryName,
          isDeleted: cate.isDeleted,
        }));

      setCates(currentSelectedCategories);

      // set doctors
      var currentSelectedDoctors: DoctorResponseModel[] =
        mrDetailResponse.doctors.map((doc) => ({
          userId: doc.doctorId,
          userName: doc.doctorName,
          isDeleted: doc.isDeleted,
          categoryId: doc.categoryId,
        }));

      setDoctors(currentSelectedDoctors);

      // set types
      setTypes(mrDetailResponse.serviceTypes);

      // set services
      var serviceIds: number[] = [];
      mrDetailResponse.serviceTypes.forEach((type) => {
        serviceIds = [...serviceIds, ...type.services.map((x) => x.serviceId)];
      });

      var selectedServices = mrDetailResponse.serviceTypes
        .map((element) => element.services)
        .flat();

      setServices(selectedServices);
      setSelectedServices(selectedServices);

      // set default static values
      mrDetailform.setFieldsValue({
        isPaid: mrDetailResponse.isPaid,
        isCheckUp: mrDetailResponse.isCheckUp,
        prevMedicalRecordId: mrDetailResponse.prevMedicalRecordId,
        selectedCategoryIds: mrDetailResponse.categories.map(
          (cate) => cate.categoryId
        ),
        selectedDoctorIds: mrDetailResponse.doctors.map((doc) => doc.doctorId),
        selectedServiceTypeIds: mrDetailResponse.serviceTypes.map(
          (element) => element.serviceTypeId
        ),
        selectedServiceIds: serviceIds,
      });

      return mrDetailResponse;
    }
  };

  const fetchPatient = async (patientId: number) => {
    //PatientAddModel
    var response: PatientAddModel | undefined =
      await patientService.getPatientById(patientId);
    if (response === undefined) {
      message.error("Get Patient Failed", 2);
      return undefined;
    } else {
      console.log(response);
      return response;
    }
  };

  const fetchCates = async () => {
    var response = await categoryService.getCategories();
    if (response === undefined) {
      message.error("Get Categories Failed", 2);
      return [];
    } else {
      console.log(response);
      //setCates(response);
      return response;
    }
  };

  async function fetchDoctors(
    values: number[]
  ): Promise<DoctorResponseModel[]> {
    var docsResponse: DoctorResponseModel[] = [];

    try {
      await Promise.all(
        values.map(async (cateId) => {
          const selectedDocsByCate = await subService.getDoctorsByCategoryId(
            cateId
          );
          if (selectedDocsByCate) {
            docsResponse = [...docsResponse, ...selectedDocsByCate];
          } else {
            throw new Error(`Failed to get doctor for category ${cateId}`);
          }
        })
      );
    } catch (error: any) {
      //message.error(error.message, 2);
      // Log or handle the error more specifically if needed
      console.error(error.message);
      return [];
    }
    return docsResponse;
  }

  async function fetchServiceTypes(
    values: number[]
  ): Promise<ServiceTypeResponseModel[]> {
    var types: ServiceTypeResponseModel[] = [];

    try {
      await Promise.all(
        values.map(async (cateId) => {
          var cateByType = await subService.getServicesType(cateId);
          if (cateByType !== undefined) {
            types = [...types, ...cateByType];
          }
        })
      );
    } catch (error: any) {
      //message.error("Get Categories by Service Failed", 2);
      // Log or handle the error more specifically if needed
      console.error(error.message);
      return [];
    }
    return types;
  }

  async function fetchServices(
    values: number[]
  ): Promise<ServiceResponseModel[]> {
    var services: ServiceResponseModel[] = [];

    try {
      await Promise.all(
        values.map(async (typeId) => {
          var serviceByType = await subService.getServices(typeId);
          if (serviceByType !== undefined) {
            services = [...services, ...serviceByType];
            //setServices(services);
          }
        })
      );
    } catch (error: any) {
      //message.error("Get Categories by Service Failed", 2);
      // Log or handle the error more specifically if needed
      console.error(error.message);
      return [];
    }
    return services;
  }

  const fetchData = async () => {
    if (id === undefined) {
      message.error("Mã hồ sơ không hợp lệ", 2).then(() => navigate("/"));
    } else {
      //Fetch patient info, medical record detail and categories
      var responses = await Promise.all([fetchMedicalRecordDetail()]);
      if (responses !== undefined && responses.length >= 1) {
        setMrDetail(responses[0]);
        var patientId = responses[0]?.patientId;
        var patientRes: PatientAddModel | undefined = await fetchPatient(
          patientId ?? 0
        );
        if (patientRes !== undefined) {
          setPatient(patientRes);
        }
        var currentMrDetail = responses[0];
        //get cate, doc, type, service options
        var cateResponses: CategoryResponseModel[] = await fetchCates();
        if (cateResponses !== undefined) {
          setCates(cateResponses.filter((cate) => cate.isDeleted === false));
          var [docs, types] = await Promise.all([
            fetchDoctors(cateResponses.map((cate) => cate.categoryId)),
            fetchServiceTypes(cateResponses.map((cate) => cate.categoryId)),
          ]);
          if (docs !== undefined && types !== undefined) {
            setDoctors(docs.filter((doc) => doc.isDeleted === false));
            setTypes(types.filter((type) => type.isDeleted === false));
            // get services by selectedTypes
            var typeIds: number[] | undefined =
              currentMrDetail?.serviceTypes.map((t) => t.serviceTypeId);
            var services: ServiceResponseModel[] = [];
            if (typeIds !== undefined) {
              services = await fetchServices(typeIds);
            }
            if (services !== undefined) {
              setServices(
                services.filter((service) => service.isDeleted === false)
              );
            }
          }
        }
      }
    }
  };

  const today = dayjs();

  const handleViewPrevMed = () => {
    if (prevMrId !== undefined) {
      navigate(
        `${ROUTE_URLS.MEDICAL_RECORD_DETAIL_PAGE.replace(":id", "") + prevMrId}`
      );
    }
  };

  const itemsExamination: CollapseProps["items"] = [
    {
      key: `exam_${mrDetail?.medicalRecordId}`,
      label: "Kết luận",
      children: (
        <ExaminationFormViewOnly
          medicalRecordId={mrDetail?.medicalRecordId ?? 0}
          isReload={true}
          patientId={mrDetail?.patientId}
        />
      ),
    },
  ];

  const [nextMrIds, setNextMrIds] = useState<number[]>([]);

  const fetchNextMrIds = async () => {
    var medicalRecordId = Number.parseInt(id ?? "0");
    if (medicalRecordId !== undefined) {
      var res = await medicalRecordService.getNextMrIdsByMrId(medicalRecordId);
      if (res !== undefined) {
        setNextMrIds(res);
      }
    }
  };

  useEffect(() => {
    fetchNextMrIds();
    fetchData();
  }, [id]);

  return patient === undefined ? (
    <></>
  ) : (
    <div style={{ minHeight: "100vh" }}>
      <div>
        <Button type="link" onClick={() => generatePDF(getTargetElement)}>
          Tải xuống dưới dạng PDF
        </Button>
        <div id="printTargetDetail" style={{ padding: "20px" }}>
          <Form
            id="medicalRecordDetailForm"
            form={mrDetailform}
            name="basic"
            layout="vertical"
            initialValues={{
              dob: dayjs(patient.dob),
              editDate: today,
              gender: patient.gender,
              name: patient.name,
              phone: patient.phone,
              address: patient.address,
              height: patient.height,
              weight: patient.weight,
              blood: patient.bloodGroup,
              bloodPressure: patient.bloodPressure,
              description: patient.allergieshistory,
              prevMedicalRecordId: prevMrId,
              examReason: mrDetail?.examReason,
            }}
            autoComplete="off"
          >
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item label="Mã hồ sơ" name="id">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item<MedicalRecord>
                  label="Ngày chỉnh sửa"
                  name="editDate"
                >
                  <DatePicker disabled format={"MM/DD/YYYY HH:mm:ss"} />
                </Form.Item>
              </Col>
              {prevMrId !== undefined && prevMrId !== null ? (
                <Col span={8} onClick={handleViewPrevMed}>
                  <Form.Item
                    label="Mã hồ sơ khám trước"
                    name="prevMedicalRecordId"
                  >
                    <Input contentEditable={false} />
                  </Form.Item>
                </Col>
              ) : (
                <Col span={8}></Col>
              )}
            </Row>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item<MedicalRecord> label="Thanh toán" name="isPaid">
                  <Radio.Group disabled>
                    <Radio value={true}>Rồi</Radio>
                    <Radio value={false}>Chưa</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item<MedicalRecord> label="Khám" name="isCheckUp">
                  <Radio.Group disabled>
                    <Radio value={true}>Rồi</Radio>
                    <Radio value={false}>Chưa</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item<MedicalRecord> label="Mã bệnh nhân" name="patientId">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item<MedicalRecord> label="Họ và tên" name="name">
                  <Input placeholder="Họ và tên" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item<MedicalRecord> label="Ngày sinh" name="dob">
                  <DatePicker disabled format={"MM/DD/YYYY HH:mm:ss"} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<MedicalRecord> label="Giới tính" name="gender">
                  <Radio.Group disabled>
                    <Radio value={true}>Male</Radio>
                    <Radio value={false}>Female</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item<MedicalRecord> label="Số điện thoại" name="phone">
                  <Input disabled placeholder="0983872xxx" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item<MedicalRecord> label="Địa chỉ" name="address">
              <Input disabled placeholder="Địa chỉ" />
            </Form.Item>
            <Row gutter={10}>
              <Col span={6}>
                <Form.Item<MedicalRecord> label="Chiều cao (cm)" name="height">
                  <Input disabled placeholder="170" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<MedicalRecord> label="Cân nặng (kg)" name="weight">
                  <Input disabled placeholder="55" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<MedicalRecord> label="Nhóm máu" name="blood">
                  <Input disabled placeholder="A" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<MedicalRecord>
                  label="Huyết áp (mmHg)"
                  name="bloodPressure"
                >
                  <Input disabled placeholder="110" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item<MedicalRecord>
              label="Tiền sử bệnh dị ứng"
              name="description"
            >
              <TextArea placeholder="Tiền sử bệnh" disabled />
            </Form.Item>
            <Form.Item<MedicalRecord> label="Lí do khám" name="examReason">
              <TextArea placeholder="Lí do khám" disabled />
            </Form.Item>
            {/*=========Next=========== */}
            <div>{nextMrIds.length > 0 && <span>Các hồ sơ tái khám</span>}</div>
            <div>
              {nextMrIds.map((id) => {
                return (
                  <div key={id}>
                    <Button
                      type="link"
                      onClick={() => {
                        navigate(
                          `${
                            ROUTE_URLS.MEDICAL_RECORD_DETAIL_PAGE.replace(
                              ":id",
                              ""
                            ) + id
                          }`
                        );
                      }}
                    >
                      {id}
                    </Button>
                  </div>
                );
              })}
            </div>
            {/*=========Select Category and Doctor=========== */}
            <div>
              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item<MedicalRecord>
                    name="selectedCategoryIds"
                    label="Chọn khoa khám"
                  >
                    <Select
                      disabled
                      mode="multiple"
                      options={cates.map((category) => ({
                        value: category.categoryId,
                        label: category.categoryName,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ display: "none" }}>
                  <Form.Item<MedicalRecord>
                    name="selectedDoctorIds"
                    label="Chọn bác sĩ khám"
                  >
                    <Select
                      disabled
                      mode="multiple"
                      options={doctors.map((doc) => ({
                        value: doc.userId,
                        label: doc.userName,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            {/*=========Select Service Type=========== */}
            <div>
              {1 === 1 && (
                <Form.Item<MedicalRecord>
                  name="selectedServiceTypeIds"
                  label="Chọn loại dịch vụ khám"
                >
                  <Select
                    disabled
                    mode="multiple"
                    allowClear
                    options={types.map((type) => ({
                      value: type.serviceTypeId,
                      label: type.serviceTypeName,
                    }))}
                  />
                </Form.Item>
              )}
              {1 === 1 && (
                <Form.Item<MedicalRecord>
                  name="selectedServiceIds"
                  label="Chọn dịch vụ khám"
                >
                  <Select
                    disabled
                    mode="multiple"
                    allowClear
                    options={services.map((service) => ({
                      value: service.serviceId,
                      label: service.serviceName,
                    }))}
                  />
                </Form.Item>
              )}
            </div>
          </Form>
        </div>
        <Divider />
        <div>
          <Row style={{ fontWeight: "bold" }}>
            <Col span={8}>Dịch vụ đã chọn: </Col>
            <Col span={8}>Giá tiền: </Col>
            <Col span={8}>Bác sĩ khám: </Col>
          </Row>
          <br />
          <div id="listServicePrice">
            {selectedServices.map((service) => (
              <div key={service.serviceId}>
                <Row>
                  <Col span={8}>{service.serviceName}</Col>
                  <Col span={8}>{service.price.toLocaleString()} VND</Col>
                  <Col span={8}>{service.doctorName}</Col>
                </Row>
              </div>
            ))}
          </div>
          <Divider dashed />
          <Row>
            <Col span={12}>
              <b>Tạm tính: </b>
            </Col>
            <Col span={12}>
              {selectedServices
                .reduce((total, s) => total + s.price, 0)
                .toLocaleString()}{" "}
              VND
            </Col>
          </Row>
          <br />
        </div>
        {/*=========Examination=========== */}
        <Collapse destroyInactivePanel items={itemsExamination} />
      </div>
    </div>
  );
};

export default MrDetailPage;
