import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router";

import getMemberInfo from "quires/member/getMemberInfo";

import Input from "../../components/common/Input";
import useLoginMutation from "../../quires/certification/useLoginMutation";

const img = process.env.PUBLIC_URL;

const Login = () => {
  const navigate = useNavigate();

  const [text, setText] = useState({
    email: "",
    password: "",
  });

  const {
    data: loginResponse,
    mutate: loginMutate,
    isError: loginError,
  } = useLoginMutation({
    email: text.email,
    password: text.password,
  });

  const { refetch: memberIdRefetch } = getMemberInfo(!!loginResponse);

  useEffect(() => {
    if (loginError) return alert("올바른 이메일 or 비밀번호를 입력하세요");
    if (!loginResponse) return;

    memberIdRefetch();

    navigate("/");
  }, [loginResponse, loginError]);

  const loginDisabled = () => {
    if (text.email.length > 5 && text.password.length > 5) {
      return false;
    }
    return true;
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && text.email.length > 5 && text.password.length > 5) {
      loginMutate();
    }
  };

  return (
    <>
      <button
        onClick={() => {
          navigate("/onboarding");
        }}
      >
        <img src={`${img}/common/ChevronLeftOutline.png`} alt="dd" />
      </button>
      <div className="guide-text">
        <h1>로그인</h1>
      </div>
      <div className="join-form">
        <Input
          value={text.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setText({ ...text, email: value });
          }}
          label="이메일"
        />
        <Input
          value={text.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setText({ ...text, password: value });
          }}
          keyDownHandler={onEnterPress}
          type="password"
          label="비밀번호"
        />
      </div>
      <button
        className="next-button"
        onClick={() => loginMutate()}
        // disabled={loginDisabled()}
      >
        로그인
      </button>
    </>
  );
};

export default Login;
