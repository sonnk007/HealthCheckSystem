import { Col, Row } from "antd";
import LoginForm from "../component/LoginForm";
import ImageComponent from "../asset/HealthCheck.png";

const LoginPage = () => {

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={{ backgroundColor: "#eeffcb", borderRadius: "20px", height: '800px', width: '70%', display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Row>
                    <Col span={12}>
                        <div style={{ width: "100%" }}>
                            <img src={ImageComponent} alt="Health Check" style={{ maxWidth: "100%", height: "auto" }} />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{ width: "100%", marginTop: '200px' }}>
                            <LoginForm />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default LoginPage;
