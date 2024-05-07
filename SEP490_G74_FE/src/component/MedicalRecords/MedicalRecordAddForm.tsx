import {
  Form,
  Input,
  Radio,
  DatePicker,
  message,
  Select,
  Row,
  Col,
  InputNumber,
} from "antd";
import {
  MedicalRecord,
  MedicalRecordAddModel,
  PatientProps,
} from "../../Models/MedicalRecordModel";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { useContext, useEffect, useState } from "react";
import {
  CategoryResponseModel,
  DoctorResponseModel,
} from "../../Models/SubEntityModel";
import { AuthContext } from "../../ContextProvider/AuthContext";
import Roles from "../../Enums/Enums";
import medicalRecordService from "../../Services/MedicalRecordService";
import patientService from "../../Services/PatientService";
import { PatientAddModel } from "../../Models/PatientModel";
import subService from "../../Services/SubService";
import categoryService from "../../Services/CategoryService";
import { defaultMrOption as DEFAULT_MR_OPTION } from "../../Commons/Global";

const MedicalRecordAddForm = ({ patientId }: PatientProps) => {
  const [mrAddform] = Form.useForm();
  const today = dayjs();

  const { authenticated } = useContext(AuthContext);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [patient, setPatient] = useState<PatientAddModel | undefined>(
    undefined
  );

  const [cates, setCates] = useState<CategoryResponseModel[]>([]);
  const [doctors, setDoctors] = useState<DoctorResponseModel[]>([]);

  const onFinish = async (values: MedicalRecord) => {
    if(values.selectedDoctorId === undefined || values.selectedDoctorId === null){
      message.error("Hãy chọn bác sĩ cho bệnh án");
      return;
    }
    let isCateHasDoc = true;
    var medAddForm: MedicalRecordAddModel = {
      categoryIds: values.selectedCategoryIds,
      doctorIds: [values.selectedDoctorId],
      examReason: mrAddform.getFieldValue("examReason") as string,
      patientId: values.patientId,
    };

    if (medAddForm.categoryIds.length > medAddForm.doctorIds.length) {
      message.error("Hãy chọn đủ bác sĩ cho các khoa khám");
      return;
    }

    var selectedCates = cates.filter((cate) =>
      medAddForm.categoryIds.includes(cate.categoryId)
    );
    var selectedDoctors = doctors.filter((doc) =>
      medAddForm.doctorIds.includes(doc.userId)
    );

    for (const cate of selectedCates) {
      const countDocInCate = selectedDoctors.filter(
        (doc) => doc.categoryId === cate.categoryId
      );

      if (countDocInCate === undefined || countDocInCate.length < 1) {
        message.error("Hãy chọn đủ bác sĩ cho các khoa khám");
        isCateHasDoc = false;
        break;
      }
    }

    if (isCateHasDoc === false) return;

    var response = await medicalRecordService.addMedicalRecord(medAddForm);
    if (response !== 200 && response !== 201) {
      message.error("Tạo bệnh án thất bại", 2);
    } else {
      message.success("Tạo bệnh án thành công", 2).then(() => {
        window.location.reload();
      });
    }
  };

  const onFinishFailed = () => {
    message.error("Create MR Failed With Validation");
  };

  async function fetchDoctorsByCategories(
    values: number[]
  ): Promise<DoctorResponseModel[]> {
    var docs: DoctorResponseModel[] = [];

    try {
      await Promise.all(
        values.map(async (cateId) => {
          const doctorsByCategory = await subService.getDoctorsByCategoryId(
            cateId
          );
          if (doctorsByCategory) {
            docs = [...docs, ...doctorsByCategory];
          } else {
            throw new Error(`Không thể lấy danh sách bác sĩ cho khoa khám ID: ${cateId}`);
          }
        })
      );
    } catch (error) {
      message.error("Get Doctors Failed", 2);
      // Log or handle the error more specifically if needed
      console.error(error);
    }
    return docs;
  }

  const handleChangeCategory = async (values: number[]) => {
    if (values.length === 0) {
      mrAddform.resetFields(["selectedDoctorIds"]);
      return;
    }
    // ----------- new get least assigned doctor
    var currentSelectedDoctorIds: number[] =
      mrAddform.getFieldValue("selectedDoctorIds");
    if (currentSelectedDoctorIds === undefined) {
      currentSelectedDoctorIds = [];
    }

    var newSelectedDoctors: DoctorResponseModel[] =
      await fetchDoctorsByCategories(values);
    if (newSelectedDoctors) {
      mrAddform.resetFields(["selectedDoctorIds"]);
      setDoctors(newSelectedDoctors);

      // keep selected doctors if still available
      var oldAvailableDocIds: number[] = [];
      currentSelectedDoctorIds.forEach((oldDocId) => {
        if (newSelectedDoctors.find((newDoc) => newDoc.userId === oldDocId)) {
          oldAvailableDocIds.push(oldDocId);
        }
      });
      mrAddform.setFieldsValue({
        selectedDoctorIds: oldAvailableDocIds,
      });
    }
  };

  const checkRole = () => {
    if (authenticated?.role === Roles.Nurse) {
      setIsDisable(true);
    }
  };

  const fetchPatient = async () => {
    //PatientAddModel
    var response: PatientAddModel | undefined =
      await patientService.getPatientById(patientId);
    if (response === undefined) {
      message.error("Get Patient Failed", 2);
      return false;
    } else {
      console.log(response);
      setPatient(response);
      return true;
    }
  };

  const fetchCates = async () => {
    var response = await categoryService.getCategories();
    if (response === undefined) {
      message.error("Get Categories Failed", 2);
      return false;
    } else {
      response = response.filter((cate) => cate.isDeleted !== true);
      setCates(response);

      var defaultCate = response.find(
        (cate) => cate.categoryId === DEFAULT_MR_OPTION.DEFAULT_CATEGORY_ID
      );
      if (defaultCate) {
        var defaultDoctors = await fetchDoctorsByCategories([
          defaultCate.categoryId,
        ]);
        if (defaultDoctors) {
          defaultDoctors = defaultDoctors.filter(
            (doctor) => doctor.isDeleted !== true
          );
          setDoctors(defaultDoctors);
          mrAddform.setFieldsValue({
            selectedCategoryIds: [defaultCate.categoryId],
          });
          var leastAssignedDefaultDoctor = await subService.getLeastAssignedDoctorByCategoryId(defaultCate.categoryId);
          if(leastAssignedDefaultDoctor){
            mrAddform.setFieldsValue({
              selectedDoctorId: leastAssignedDefaultDoctor.userId,
            });
          }
          
          return true;
        }
      }
    }
    return false;
  };

  const fetchData = async () => {
    var responses = await Promise.all([fetchPatient(), fetchCates()]);
    if (responses !== undefined && responses.length === 2) {
      console.log("Data fetched");
    } else {
      console.log("Data fetch failed");
    }
  };

  useEffect(() => {
    mrAddform.setFieldsValue({
      patientId: patientId,
    });
    checkRole();
    fetchData();
  }, [patientId]);

  return patient !== undefined ? (
    <Form
      id="medicalRecordAddForm"
      form={mrAddform}
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
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
        docs: doctors,
      }}
      autoComplete="off"
    >
      <Row gutter={10}>
        <Col span={8}>
          <Form.Item<MedicalRecord> label="Mã hồ sơ" name="id">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item<MedicalRecord> label="Ngày chỉnh sửa" name="editDate">
            <DatePicker disabled format={"MM/DD/YYYY HH:mm:ss"} />
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
            <InputNumber disabled min={1} max={5000} placeholder="110" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Lí do khám"
        name="examReason"
        rules={[{ required: true, message: "Hãy nhập lí do khám" }]}
      >
        <TextArea placeholder="Lí do khám" />
      </Form.Item>
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item<MedicalRecord>
            name="selectedCategoryIds"
            label="Chọn khoa khám"
          >
            <Select
              //mode="multiple"
              disabled
              onChange={handleChangeCategory}
              options={cates.map((category) => ({
                value: category.categoryId,
                label: category.categoryName,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<MedicalRecord>
            name="selectedDoctorId"
            label="Chọn bác sĩ khám"
          >
            <Select
              //mode="multiple"
              options={doctors.map((doctor) => ({
                value: doctor.userId,
                label: doctor.userName,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  ) : (
    <div>Loading...</div>
  );
};

export default MedicalRecordAddForm;
