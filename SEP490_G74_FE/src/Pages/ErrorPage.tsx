import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <div>
        <h1>Page Not Found</h1>
      </div>
      <div>
        <Button type="primary" onClick={() => handleBack()}>
          Back To Your Page
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
