import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link, NavLink, Outlet } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import LoginState from "recoil/atom";
import UserState from "recoil/userAtom";
import "styles/pages/home.scss";
import "styles/layouts/main.scss";

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
  const useUser = useRecoilValue(UserState);

  useEffect(() => {
    console.log(useUser);
  });

  return (
    <div className="main-wrap">
      <h1 className="main-title">우리동네 축구팀</h1>
      <div className="main-menu-wrapper">
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
      </div>
      <Outlet />
    </div>
  );
};

export default Main;
