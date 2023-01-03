import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Routes, Route, Link, NavLink, Outlet } from "react-router-dom";

const Title = styled.h1`
  text-align-last: left;
  padding: 40px 0;
  padding-left: 40px;
`;

const Menu = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  li {
    text-align: center;
    width: 25%;
    height: 36px;
    line-height: 36px;
    border-radius: 8px;
    a {
      width: 100%;
      height: 100%;
      display: block;
      color: #7a7a7a;
      cursor: pointer;
    }
    &.active {
      background-color: #f4f6f8;
      a {
        color: #000;
      }
    }
  }
  width: 100%;
  background: #fff;
  border-radius: 16px;
  height: 52px;
  margin-left: 40px;
  margin-right: 40px;
`;
const Main = () => {
  const [on, setOn] = useState<number>(0);
  return (
    <>
      <Title>우리동네 축구팀</Title>
      <Menu>
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
      </Menu>
      <Outlet />
    </>
  );
};

export default Main;
