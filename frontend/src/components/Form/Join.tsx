import React from "react";
import styled from "styled-components";
import FormWrap from "./FormWrap";

const Join = () => {
  return (
    <>
      <h1>반가워요 👋</h1>
      <p>이제 몇가지 정보만 입력해주시면 손쉽게 여러분만의 팀을 관리할 수 있어요</p>
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
        <div>
          <input type="checkbox" name="" id="check" />
          <label htmlFor="check">
            서비스 이용약관 및 개인정보 처리방침에 동의합니다.
          </label>
        </div>
        <button>가입 완료</button>
      </form>
    </>
  );
};

export default Join;
