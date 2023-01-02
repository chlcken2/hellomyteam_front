import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Routes, Route, Link, NavLink, Outlet } from "react-router-dom";
import Shorcut from "../components/Navbar/Shorcut";
import Notice from "../components/Navbar/Notice";

const MainWrap = styled.main`
  padding-left: 110px;
  height: 100vh;
  ul {
    background-color: #fff;
    ${({ theme }) => theme.flexCenter};
    height: 52px;
  }
  @media screen and (max-width: 390px) {
    padding-left: 0;
  }
`;
const Main = () => {
  return (
    <MainWrap>
      <ul>
        {[
          { path: "shortcut", name: "둘러보기" },
          { path: "notice", name: "공지게시판" },
          { path: "notice", name: "자유게시판" },
          { path: "notice", name: "팀원" },
          { path: "notice", name: "프로필" },
        ].map((el, idx) => (
          <li key={idx}>
            <Link className="active" to={`/${el.path}`}>
              {el.name}
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </MainWrap>
  );
};

export default Main;
