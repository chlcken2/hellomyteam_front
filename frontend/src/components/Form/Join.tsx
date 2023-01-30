import React, { FC, Dispatch, SetStateAction, useState, useEffect } from "react";
import styled from "styled-components";
import FormWrap from "./FormWrap";

interface IHas {
  setHasId: Dispatch<SetStateAction<boolean>>;
}
interface IError {
  title?: string;
  comment?: string;
}
const Join: FC<IHas> = ({ setHasId }) => {
  const img = process.env.PUBLIC_URL;
  const [name, setName] = useState<boolean>(true);
  const [email, setEmail] = useState("");
  const [text, setText] = useState({
    title: "",
    comment: "",
  });
  const [error, setError] = useState<IError>({});
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  /* 리스트 출력 기능 */
  const submit = (e: any) => {
    const err: IError = {};

    e.preventDefault();
    if (text.title.length < 5) {
      err.title = "5글자 이상 입력하세요.";
    }

    if (text.comment.length < 5) {
      err.comment = "5글자 이상 입력하세요";
    }
    setError(err);
    setShow(true);
  };

  useEffect(() => {
    if (Object.keys(error).length === 0 && show) {
      setData([text, ...data]);
      setText({ title: "", comment: "" });
      setName(false);
    }
  }, [error]);

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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
              <div>
                <label htmlFor="pw1">비밀번호*</label>
                <input type="text" id="pw1" />
              </div>
              <div>
                <label htmlFor="pw2">비밀번호 확인*</label>
                <input type="text" id="pw2" />
              </div>
              <button className="join-button" onClick={(e) => submit(e)} disabled>
                다음으로
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="join-wrap2">
          <div className="go-back">
            <button onClick={() => setName(true)}>
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
              <input type="text" id="name" />
            </div>
            <div>
              <label htmlFor="email">가입목적*</label>
              <select name="" id="email">
                <option value="">팀 관리</option>
              </select>
            </div>
            <div className="check-input">
              <input type="checkbox" name="" id="check" />
              <label htmlFor="check">
                서비스 이용약관 및 개인정보 처리방침에 동의합니다.
              </label>
            </div>
            <button className="join-button" disabled>
              가입 완료
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Join;
