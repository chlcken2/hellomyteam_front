import Button from "components/common/Button";
import { Dispatch, SetStateAction } from "react";

interface IHas {
  setHasId: Dispatch<SetStateAction<boolean>>;
  setLogin: Dispatch<SetStateAction<boolean>>;
}

const Preview = ({ setHasId, setLogin }: IHas) => {
  const img = process.env.PUBLIC_URL;
  const handleLogin = () => {
    setHasId(false);
    setLogin(true);
  };
  return (
    <div className="preview-wrap">
      <button>
        <img src={`${img}/common/ChevronLeftOutline.png`} alt="go-back" />
      </button>
      <h2>가입 및 로그인</h2>
      <ul className="join-menu">
        <li>
          <span>
            <img src={`${img}/common/join-1.png`} alt="1" />
          </span>
          <h3>팀 생성&관리</h3>
        </li>
        <li>
          <span>
            <img src={`${img}/common/join-2.png`} alt="2" />
          </span>
          <h3>다른팀과 교류</h3>
        </li>
        <li>
          <span>
            <img src={`${img}/common/join-3.png`} alt="3" />
          </span>
          <h3>커뮤니티 게시판</h3>
        </li>
        <li>
          <span>
            <img src={`${img}/common/join-4.png`} alt="1" />
          </span>
          <h3>일정관리</h3>
        </li>
      </ul>
      <div className="join-button">
        <Button text="로그인" handler={handleLogin} width="fullWidth" />
        <Button
          text="회원가입"
          handler={() => {
            setHasId(true);
          }}
          width="fullWidth"
          color="blue"
        />
      </div>
    </div>
  );
};

export default Preview;
