import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link, NavLink, Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import LoginState from "recoil/atom";
import "styles/pages/home.scss";

const MENU = [
  { path: "", name: "둘러보기" },
  { path: "notice", name: "공지게시판" },
  { path: "board", name: "자유게시판" },
  { path: "team", name: "팀원" },
  { path: "profile", name: "프로필" },
];

const Main = () => {
  const [on, setOn] = useState<number>(0);
  const [confirmLogin, setConfirmLogin] = useRecoilState(LoginState);

  useEffect(() => {
    console.log(confirmLogin);
  }, [confirmLogin]);

  return (
    <div className="main-wrap">
      <h1 className="main-title">우리동네 축구팀</h1>
      <ul className="main-menu">
        {MENU.map((menuItem, idx) => (
          <li
            key={idx}
            onClick={() => setOn(idx)}
            onKeyDown={() => setOn(idx)}
            className={on === idx ? "active" : ""}
          >
            <Link to={`/${menuItem.path}`}>{menuItem.name}</Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
};

export default Main;
