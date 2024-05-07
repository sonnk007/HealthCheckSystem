import { Form, Input, message, Col } from "antd";
import { CategoryAddModel } from "../../Models/SubEntityModel";
import categoryService from "../../Services/CategoryService";

const CategoryAddForm = () => {
  const onFinish = async (values: CategoryAddModel) => {
    var response = await categoryService.addCategory(values);
    if(response===200){
      message.success("Thêm thành công khoa khám mới: "+values.categoryName, 2).then(()=>{
        window.location.reload(); 
      });
    }else{
      message.error("Thêm khoa khám thất bại", 2)
    }
  };

  const onFinishFailed = () => {
    message.error("Create Failed");
  };

  return (
    <Form
      id="categoryAddForm"
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<CategoryAddModel> label="Tên khoa khám" name="categoryName">
        <Input placeholder="Tên khoa khám" />
      </Form.Item>
    </Form>
  );
};

export default CategoryAddForm;
