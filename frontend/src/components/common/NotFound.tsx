import { useNavigate } from "react-router-dom";
import Button from "./Button";

import "../../styles/components/common.scss";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <p>404</p>
      <span>페이지를 찾을 수 없습니다</span>
      <div className="not-found-button">
        <Button
          text="홈 화면으로"
          handler={() => navigate("/")}
          color="blue"
          width="fullWidth"
        />
      </div>
    </div>
  );
};

export default NotFound;
