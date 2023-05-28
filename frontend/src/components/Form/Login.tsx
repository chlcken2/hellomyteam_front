import { Dispatch, SetStateAction, useState, useEffect, ChangeEvent } from "react";
import { useCookies } from "react-cookie"; // useCookies import
import LoginState from "recoil/atom";

import { useSetRecoilState, useRecoilState } from "recoil";
import getMemberInfo from "quires/member/getMemberInfo";
import UserState from "recoil/userAtom";
import { setLocalStorage, getExpiredDate } from "../../utils/setAuthorization";
import Input from "../common/Input";
import useLoginMutation from "../../quires/certification/useLoginMutation";

interface IHas {
  setHasId: Dispatch<SetStateAction<boolean>>;
  setLogin: Dispatch<SetStateAction<boolean>>;
}

const Login = ({ setHasId, setLogin }: IHas) => {
  const [cookies, setCookie] = useCookies(["refresh"]);
  // userId를 리코일에 추가하기
  const [useUser, setUseUser] = useRecoilState(UserState);
  const [validUser, isValidUser] = useState(false);
  const { data: userData, isLoading: userLoad } = getMemberInfo(validUser);
  const setConfirmLogin = useSetRecoilState(LoginState);
  const img = process.env.PUBLIC_URL;
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

  useEffect(() => {
    if (loginError) return alert("올바른 이메일 or 비밀번호를 입력하세요");
    if (!loginResponse) return;

    const { accessToken, refreshToken } = loginResponse.data.data;
    setCookie("refresh", refreshToken, { path: "/", expires: getExpiredDate() });
    setLocalStorage(accessToken);

    isValidUser(true);
  }, [loginResponse, loginError]);

  useEffect(() => {
    if (validUser && !userLoad) {
      setUseUser(userData.data);
      setConfirmLogin(true);
      localStorage.setItem("userId", userData.data.id.toString());
    }
  }, [isValidUser, userData]);

  const loginDisabled = () => {
    if (text.email.length > 5 && text.password.length > 5) {
      return false;
    }
    return true;
  };
  return (
    <div className="join-wrap">
      <button
        onClick={() => {
          setHasId(false);
          setLogin(false);
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
          type="password"
          label="비밀번호"
        />
      </div>
      <button
        className="next-button"
        onClick={() => loginMutate()}
        disabled={loginDisabled()}
      >
        로그인
      </button>
    </div>
  );
};

export default Login;
