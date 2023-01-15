import React, { FC, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import FormWrap from "./FormWrap";

const JoinWrap = styled.div`
  padding: 2px;
  text-align: left;
  h1 {
    font-size: 22px;
    padding-bottom: 12px;
  }
  p {
    font-size: 14px;
    line-height: 22px;
    color: #7a7a7a;
    padding-bottom: 30px;
  }
  label {
    display: block;
    text-align: left;
    color: #7a7a7a;
    font-size: 14px;
    padding: 9px 0;
  }
  form {
    input[type="text"],
    select,
    button {
      border: 1px solid #e6e6e6;
      border-radius: 5px;
      height: 38px;
      width: 100%;
    }
  }
  #check {
    display: inline-block;
  }
  #check + label {
    display: inline-block;
  }
  .check-input {
    padding: 30px 0;
    text-align: left;
    input {
      width: 20px;
      height: 20px;
      border: 2px solid lightgray;
    }
    label {
      vertical-align: bottom;
    }
  }
`;
interface IHas {
  setHasId: Dispatch<SetStateAction<boolean>>;
}

const Join: FC<IHas> = ({ setHasId }) => {
  const img = process.env.PUBLIC_URL;

  return (
    <JoinWrap>
      <div className="go-back">
        <button onClick={() => setHasId(false)}>
          <img src={`${img}/common/back.png`} alt="dd" />
        </button>
      </div>
      <h1>반가워요 👋</h1>
      <p>
        이제 몇가지 정보만 입력해주시면 <br /> 손쉽게 여러분만의 팀을 관리할 수 있어요
      </p>
      <form action="">
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
        <button disabled>가입 완료</button>
      </form>
    </JoinWrap>
  );
};

export default Join;
