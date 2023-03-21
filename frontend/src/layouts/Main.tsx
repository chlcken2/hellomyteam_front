import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import getMemberInfo from "quires/member/getMemberInfo";
import getTeamInfo from "quires/team/getTeamInfo";

import { Routes, Route, Link, NavLink, Outlet } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import LoginState from "recoil/atom";
import UserState from "recoil/userAtom";
import { joinTeamTypes } from "types/UserTypes";
import { instance } from "config";

import "styles/pages/home.scss";

const MENU = [
  { path: "", name: "둘러보기" },
  { path: "notice", name: "공지게시판" },
  { path: "board", name: "자유게시판" },
  { path: "team", name: "팀원" },
  { path: "profile", name: "프로필" },
];

const Main = () => {
  const { data: memberInfo } = getMemberInfo();
  const { data: teamInfo } = getTeamInfo(memberInfo?.data.id);
  const [on, setOn] = useState<number>(0);
  const useUser = useRecoilValue(UserState);
  const [showTeam, setShowTeam] = useState(false);
  const [teamList, setTeamList] = useState([]);

  useEffect(() => {
    // 로그인 후 가입한 팀 id와 팀 이름 가져오기
    console.log(teamInfo);
  }, [useUser]);

  return (
    <div className="main-wrap">
      <div className="team">
        <ul>
          {/* {teamInfo?.data.map((el: joinTeamTypes, i: number) => {
            return <li key={i}>{el.teamName}</li>;
          })} */}
        </ul>
      </div>
      <h1 className="main-title">
        <button onClick={() => setShowTeam(true)}>우리동네 축구팀</button>
      </h1>
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
