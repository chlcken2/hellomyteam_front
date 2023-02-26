import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link, NavLink, Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import LoginState from "recoil/atom";
import Select from "components/common/Select";
import Input from "components/Input/Input";

const OPTIONS = [
  { label: "라벨1", value: 1 },
  { label: "라벨2", value: 2 },
  { label: "라벨3", value: 3 },
  { label: "라벨4", value: 4 },
  { label: "라벨5", value: 5 },
  { label: "라벨5", value: 6 },
  { label: "라벨5", value: 7 },
];

const Main = () => {
  const [temp, setTemp] = useState("");
  const [on, setOn] = useState<number>(0);
  const [confirmLogin, setConfirmLogin] = useRecoilState(LoginState);

  useEffect(() => {
    console.log(confirmLogin);
  }, [confirmLogin]);

  return (
    <div className="main-wrap">
      <h1 className="main-title">우리동네 축구팀</h1>
      <div style={{ marginBottom: 30, width: 500 }}>
        <Input
          value={temp}
          setValue={setTemp}
          placeholder="텍스트를 입력해주세요."
          label="팀 이름"
          isRequierd
        />
      </div>
      <Select
        label="가입목적"
        placeholder="팀 관리"
        isRequierd
        options={OPTIONS}
        onChange={(op) => console.log(op)}
        width={500}
      />
      {/* <ul className="main-menu">
        {[
          { path: "shortcut", name: "둘러보기" },
          { path: "notice", name: "공지게시판" },
          { path: "notice", name: "자유게시판" },
          { path: "notice", name: "팀원" },
          { path: "notice", name: "프로필" },
        ].map((el, idx) => (
          <li
            key={idx}
            onClick={() => setOn(idx)}
            onKeyDown={() => setOn(idx)}
            className={on === idx ? "active" : ""}
          >
            <Link to={`/${el.path}`}>{el.name}</Link>
          </li>
        ))}
      </ul> */}
      <Outlet />
    </div>
  );
};

export default Main;
