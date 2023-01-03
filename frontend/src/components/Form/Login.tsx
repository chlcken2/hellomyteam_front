import React, { FC, Dispatch, SetStateAction } from "react";

interface IHas {
  setHasId: Dispatch<SetStateAction<boolean>>;
}

const Login: FC<IHas> = ({ setHasId }) => {
  return (
    <div>
      <h2>가입</h2>
      <ul>
        <li>
          <h3>팀 생성&관리</h3>
        </li>
        <li>
          <h3>다른팀과 교류</h3>
        </li>
        <li>
          <h3>커뮤니티 게시판</h3>
        </li>
        <li>
          <h3>일정관리</h3>
        </li>
      </ul>
      <ul>
        <li>
          <button onClick={() => setHasId(false)}>
            <span>Google 로그인</span>
          </button>
        </li>
        <li>
          <button onClick={() => setHasId(true)}>Google 계정으로 시작하기</button>
        </li>
      </ul>
    </div>
  );
};

export default Login;
