import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Routes, Route, Link, NavLink, Outlet } from "react-router-dom";
import FormWrap from "components/Form/FormWrap";
import Join from "components/Form/Join";
import Login from "components/Form/Login";

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
  const [hasId, setHasId] = useState<boolean>(false);

  return (
    <>
      <FormWrap>{!hasId ? <Login setHasId={setHasId} /> : <Join />}</FormWrap>
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
    </>
  );
};

export default Main;
