import { useContext, useEffect, useState } from "react";
import { AuthContext, User } from "../ContextProvider/AuthContext";
import Roles from "../Enums/Enums";
import { Link, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, message } from "antd";
import { JWTTokenModel } from "../Models/AuthModel";
import { jwtDecode } from "jwt-decode";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { ROUTE_URLS, TOKEN } from "../Commons/Global";

const NurseLayoutPage = (props: any) => {
  const { childComp } = props;
  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [WelcomeMessage, setWelcomeMessage] = useState<string>("");
  const [collapsed] = useState(false);
  const handleLogout = () => {
    let user: User = {
      role: Roles.Guest,
      userId: 0,
    };

    setAuthenticated(user);
    localStorage.removeItem(TOKEN);
    message.info("Logged out", 1);
    navigate(ROUTE_URLS.LOGIN_PAGE);
  };

  const handleWelcomeMessage = () => {
    var token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var user: JWTTokenModel = jwtDecode(token);
      if (user !== null) {
        setWelcomeMessage("Xin chào Y tá, " + user.unique_name);
      }
    }
  };

  useEffect(() => {
    handleWelcomeMessage();
  }, []);

  return (
    <div>
      <div
        className="header-layout"
        style={{
          backgroundColor: "greenyellow",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {WelcomeMessage}
        <Button type="primary" danger={true} onClick={() => handleLogout()}>
          Đăng xuất
        </Button>
      </div>
      <div>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ background: "#146C94", color: "white", height: "auto" }}
          >
            <div className="demo-logo-vertical" />
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{ background: "#146C94", color: "white" }}
            >
              <Menu.Item key="1"> 
                <Link to={ROUTE_URLS.NURSE + ROUTE_URLS.LIST_MEDICAL_RECORDS_PAGE}>Hồ sơ bệnh án</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to={"/nurse/patients"}>Danh sách bệnh nhân</Link>
              </Menu.Item>
              {/* <Menu.Item key="3">
                <Link to={"/"}>Hóa đơn thuốc</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to={"/"}>Hóa đơn dịch vụ</Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to={"/"}>Nhân sự</Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to={"/"}>Hồ sơ bệnh án</Link>
              </Menu.Item>
              <Menu.Item key="7">
                <Link to={"/"}>Hồ sơ cá nhân</Link>
              </Menu.Item> */}
            </Menu>
          </Sider>
          <Layout>
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
              }}
            >
              <div>{childComp}</div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </div>
  );
};

export default NurseLayoutPage;
