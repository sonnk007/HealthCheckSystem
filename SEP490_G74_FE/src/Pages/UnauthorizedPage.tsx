import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };
  return (
    <div
    style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }}
    >
      <div>
        <h1>Unauthorized Page</h1>
      </div>
      <div>
        <Button type="primary" onClick={() => handleBack()}>
          Back To Your Page
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
