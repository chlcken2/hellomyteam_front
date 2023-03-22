import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import LoginState from "recoil/atom";
import getTeamInfo from "quires/team/getTeamInfo";
import Button from "components/common/button";
import UserState from "../recoil/userAtom";
import "styles/pages/home.scss";

const MENU = [
  { path: "", name: "둘러보기" },
  { path: "notice", name: "공지게시판" },
  { path: "board", name: "자유게시판" },
  { path: "team", name: "팀원" },
  { path: "profile", name: "프로필" },
];

const Main = () => {
  const navi = useNavigate();
  const [on, setOn] = useState<number>(0);
  const [confirmLogin, setConfirmLogin] = useRecoilState(LoginState);
  const [useUser, setUseUser] = useRecoilState(UserState);
  const [show, setShow] = useState(false);
  // user의 id임. **team id가 XX!!!
  const [userId, setUserId] = useState(0);
  // user team title
  const [userTitle, setUserTitle] = useState("헬로마이팀");
  // team id
  const [teamId, setTeamId] = useState(0);
  // 특정 user가 가입한 team
  const { data: team, isLoading: load } = getTeamInfo(userId);

  // 토글보이기
  const handleTeams = () => {
    setShow(!show);
  };
  // 팀글쓰기로 빠짐
  const handleTeamWrite = (teamId: number) => {
    if (userTitle === "헬로마이팀") return alert("팀을 선택하세요");
    navi(`/board/${teamId}/write`);
  };
  // 타이틀바꾸기
  const handleMember = (name: string, id: number) => {
    setUserTitle(name);
    setTeamId(id);
    setShow(false);
  };

  // recoil에 담긴 User의 정보가 있을시에, 사용자의 id값을 리액트 쿼리에 보냄
  useEffect(() => {
    if (useUser) {
      setUserId(useUser.id);
    }
  }, [useUser]);

  // 리코일에 사용자 정보와 사용자가 가입한 팀을 모두 담는다
  useEffect(() => {
    if (load) return;
    if (team.data) {
      setUseUser({ ...useUser, teamInfo: [...team.data] });
    }
  }, [team]);
  console.log(useUser);
  return (
    <div className="main-wrap">
      <div className="main-buttons">
        <h1 className="main-title">
          <button onClick={handleTeams}>{userTitle}</button>
        </h1>
        <ul>
          <li>
            <Button text="글쓰기" handler={() => handleTeamWrite(teamId)} color="blue" />
          </li>
        </ul>
      </div>
      {show && (
        <div className="main-teams">
          <ul>
            {team?.data.map((el, idx) => {
              return (
                <li key={idx}>
                  <button onClick={() => handleMember(el.teamName, el.teamId)}>
                    {el.teamName}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
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
