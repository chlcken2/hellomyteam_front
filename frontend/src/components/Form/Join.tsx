import axios from "axios";
import React, { FC, Dispatch, SetStateAction, useState, useEffect } from "react";
import FormWrap from "./FormWrap";

interface IHas {
  setHasId: Dispatch<SetStateAction<boolean>>;
}
interface IError {
  email?: string;
  pw1?: string;
  pw2?: string;
  name?: string;
  birth?: string;
  purpose?: string;
  privacyYn?: string;
  termsOfServiceYn?: string;
}
interface IError2 {
  name?: string;
  birth?: string;
  purpose?: string;
  privacyYn?: string;
  termsOfServiceYn?: string;
}
const Join: FC<IHas> = ({ setHasId }) => {
  const img = process.env.PUBLIC_URL;
  const [name, setName] = useState<boolean>(true);
  const [text, setText] = useState({
    email: "",
    pw1: "",
    pw2: "",
  });
  const [text2, setText2] = useState({
    name: "",
    birth: "",
    purpose: "TEAM_CREATE",
    privacyYn: "NO",
    termsOfServiceYn: "NO",
  });
  const [error, setError] = useState<IError>({});
  const [error2, setError2] = useState<IError>({});
  const [disable1, setDisable1] = useState(true);
  const [disable2, setDisable2] = useState(true);
  const [isCheck, setIsCheck] = useState(false);
  const [reset, setReset] = useState(false);
  const [reset2, setReset2] = useState(false);
  /* 리스트 출력 기능 */
  const submit = (e: any) => {
    e.preventDefault();

    if (Object.keys(error).length === 0) {
      setName(false);
      setReset(false);
    } else {
      console.log(error);
    }
  };

  const submit2 = (e: any) => {
    e.preventDefault();
    if (Object.keys(error2).length === 0) {
      // console.log(`결과물`, text, text2);
      axios
        .post("/api/auth/signup", {
          birthday: text2.birth,
          email: text.email,
          joinPurpose: "TEAM_CREATE",
          name: text2.name,
          password: text.pw1,
          privacyYn: "YES",
          termsOfServiceYn: "YES",
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      console.log(error2);
    }
  };
  const changeCheck = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      setIsCheck(true);
    } else {
      setIsCheck(false);
    }
  };

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
    if (text.pw2.length < 5) {
      err.pw2 = "5글자 이상 입력하세요";
    }
    setError(err);
    if (text.email || text.pw1 || text.pw2) {
      setReset(true);
    } else {
      setReset(false);
    }
  }, [text]);

  useEffect(() => {
    console.log(isCheck);
    if (isCheck) {
      setText2((current) => {
        const newText = { ...current };
        text2.privacyYn = "YES";
        return newText;
      });
    } else {
      setText2((current) => {
        const newText = { ...current };
        text2.privacyYn = "NO";
        return newText;
      });
    }
  }, [isCheck]);

  useEffect(() => {
    console.log(text2.privacyYn);
    const err2: IError2 = {};
    if (text2.name.length < 3) {
      err2.name = "이름은 세글자 이상 입력하시오";
    }
    if (text2.birth.length !== 8) {
      err2.birth = "생년월일을 올바르게 입력하세요 (ex: 19900103)";
    }
    if (text2.privacyYn === "NO") {
      err2.privacyYn = "서비스 이용약관 및 개인정보 처리방침에 동의하세요.";
    }
    setError2(err2);

    if (text2.name || text2.birth === "YES" || text2.privacyYn === "YES") {
      setReset2(true);
    } else {
      setReset2(false);
    }
  }, [text2]);

  useEffect(() => {
    if (reset) {
      setDisable1(false);
    } else {
      setDisable1(true);
    }
  }, [reset]);

  useEffect(() => {
    if (reset2) {
      setDisable2(false);
    } else {
      setDisable2(true);
    }
  }, [reset2]);

  return (
    <div>
      {name ? (
        <div className="join-wrap2">
          <div className="go-back">
            <button onClick={() => setHasId(false)}>
              <img src={`${img}/common/ChevronLeftOutline.png`} alt="dd" />
            </button>
            <form action="" className="join-form">
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
              <div>
                <label htmlFor="pw2">비밀번호 확인*</label>
                <input
                  type="password"
                  id="pw2"
                  name="pw2"
                  value={text.pw2}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const { name, value } = e.target;
                    setText({ ...text, [name]: value });
                  }}
                />
                {reset && <p className="error-message">{error.pw2}</p>}
              </div>
              <button
                className="join-button"
                onClick={(e) => submit(e)}
                disabled={disable1}
              >
                다음으로
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="join-wrap2">
          <div className="go-back">
            <button
              onClick={() => {
                setName(true);
                setReset(true);
              }}
            >
              <img src={`${img}/common/ChevronLeftOutline.png`} alt="dd" />
            </button>
          </div>
          <h1>반가워요 👋</h1>
          <p>
            이제 몇가지 정보만 입력해주시면 <br /> 손쉽게 여러분만의 팀을 관리할 수 있어요
          </p>
          <form action="" className="join-form">
            <div>
              <label htmlFor="name">이름*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={text2.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { name, value } = e.target;
                  setText2({ ...text2, [name]: value });
                }}
              />
              {reset2 && <p className="error-message">{error2.name}</p>}
            </div>
            <div>
              <label htmlFor="birth">생년월일*</label>
              <input
                type="text"
                id="birth"
                name="birth"
                value={text2.birth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { name, value } = e.target;
                  setText2({ ...text2, [name]: value });
                }}
              />
              {reset2 && <p className="error-message">{error2.birth}</p>}
            </div>
            <div>
              <label htmlFor="purpose">가입목적*</label>
              <select
                name="purpose"
                id="purpose"
                value={text2.purpose}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const { name, value } = e.target;
                  setText2({ ...text2, [name]: value });
                }}
              >
                <option value="TEAM_CREATE">팀 관리</option>
              </select>
              {reset2 && <p className="error-message">{error2.purpose}</p>}
            </div>
            <div className="check-input">
              <input
                type="checkbox"
                name="check"
                id="check"
                onClick={(e) => changeCheck(e)}
                checked={isCheck}
                readOnly
              />
              <label htmlFor="check">
                서비스 이용약관 및 개인정보 처리방침에 동의합니다.
              </label>
              {reset2 && <p className="error-message">{error2.privacyYn}</p>}
            </div>
            <button
              className="join-button"
              onClick={(e) => submit2(e)}
              disabled={disable2}
            >
              가입 완료
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Join;
