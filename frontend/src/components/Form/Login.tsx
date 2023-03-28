import axios from "axios";
import React, { FC, Dispatch, SetStateAction, useState, useEffect } from "react";
import getMemberInfo from "quires/member/getMemberInfo";
import { useCookies } from "react-cookie"; // useCookies import
import LoginState from "recoil/atom";
import UserState from "recoil/userAtom";
import { useRecoilState } from "recoil";
import { instance } from "../../config/api";
import { setLocalStorage, getExpiredDate } from "../../utils/setAuthorization";

interface IHas {
  setHasId: Dispatch<SetStateAction<boolean>>;
  setLogin: Dispatch<SetStateAction<boolean>>;
}
interface IError {
  email?: string;
  pw1?: string;
}

const Login: FC<IHas> = ({ setHasId, setLogin }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["refresh"]);
  const [confirmLogin, setConfirmLogin] = useRecoilState(LoginState);
  const [user, setUser] = useRecoilState(UserState);
  const [loginBoolean, setLoginBoolean] = useState(false);
  const {
    data: info,
    isLoading: load,
    error: errorMessage,
  } = getMemberInfo(loginBoolean);

  const submit = async (e: any) => {
    e.preventDefault();

    if (Object.keys(error).length === 0) {
      await axios
        .post("/api/auth/login", {
          email: text.email,
          password: text.pw1,
        })
        .then((res) => {
          const { accessToken, refreshToken } = res.data.data;
          setCookie("refresh", refreshToken, { path: "/", expires: getExpiredDate() });
          setLocalStorage(accessToken);
          setLoginBoolean(true);
          // 토큰이 있을경우만 유저정보 불러옴. enable로 동기화.
          if (accessToken) {
            setUser(info.data);
          }
          setConfirmLogin(true);
        })

        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("올바른 이메일 or 비밀번호를 입력하세요");
    }
  };

  const img = process.env.PUBLIC_URL;
  const [name, setName] = useState(true);
  const [text, setText] = useState({
    email: "",
    pw1: "",
    pw2: "",
  });

  const [error, setError] = useState<IError>({});
  const [disable1, setDisable1] = useState(true);
  const [reset, setReset] = useState(false);
  useEffect(() => {
    const reg =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const err: IError = {};
    if (!reg.test(text.email)) {
      err.email = "이메일 형식에 맞게 입력하세요.";
    }
    if (text.pw1.length < 5) {
      err.pw1 = "5글자 이상 입력하세요.";
    }
    setError(err);
    if (text.email || text.pw1) {
      setReset(true);
    } else {
      setReset(false);
    }
  }, [text]);
  useEffect(() => {
    if (reset) {
      setDisable1(false);
    } else {
      setDisable1(true);
    }
  }, [reset]);

  useEffect(() => {
    if (info) {
      console.log(info);
      setConfirmLogin(true);
    }
  }, [reset]);
  return (
    <div className="join-wrap2">
      <div className="go-back">
        <button
          onClick={() => {
            setHasId(false);
            setLogin(false);
          }}
        >
          <img src={`${img}/common/ChevronLeftOutline.png`} alt="dd" />
        </button>
        <form action="" className="join-form">
          <h1>로그인</h1>
          <div>
            <label htmlFor="email">이메일*</label>
            <input
              type="text"
              id="email"
              name="email"
              value={text.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const { name, value } = e.target;
                setText({ ...text, [name]: value });
              }}
            />
            {reset && <p className="error-message">{error.email}</p>}
          </div>
          <div>
            <label htmlFor="pw1">비밀번호*</label>
            <input
              type="password"
              id="pw1"
              name="pw1"
              value={text.pw1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const { name, value } = e.target;
                setText({ ...text, [name]: value });
              }}
            />
            {reset && <p className="error-message">{error.pw1}</p>}
          </div>

          <button className="join-button" onClick={(e) => submit(e)} disabled={disable1}>
            다음으로
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
