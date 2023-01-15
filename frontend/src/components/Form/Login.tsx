import axios from "axios";
import React, { FC, Dispatch, SetStateAction } from "react";

interface IHas {
  setHasId: Dispatch<SetStateAction<boolean>>;
}

const Login: FC<IHas> = ({ setHasId }) => {
  const img = process.env.PUBLIC_URL;
  const handleLogin = () => {
    setHasId(false);
    axios
      .post("/auth/signup", {
        email: "kim123@naver.com",
        joinPurpose: "TEAM_CREATE",
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <div className="join-wrap">
      <h2>가입</h2>
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
        <button onClick={handleLogin} className="g-login">
          <span>Google 로그인</span>
        </button>
        <button onClick={() => setHasId(true)} className="start-join">
          Google 계정으로 시작하기
        </button>
      </div>
    </div>
  );
};

export default Login;
