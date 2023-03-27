import React, { FC, useEffect, useState, useCallback } from "react";

import getMemberInfo from "quires/member/getMemberInfo";
import { QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

import Home from "pages/Home/Home";
import Notice from "pages/Home/Notice";
import Board from "pages/Home/Board";
import Team from "pages/Home/Team";
import CreateTeam from "pages/Account/CreateTeam";
import Detail from "pages/Home/Detail";
import Write from "pages/Home/Write";

import LoginState from "recoil/atom";
import UserState from "recoil/userAtom";
import Alarm from "pages/Alarm/Alarm";

import Toast from "components/common/Toast";
import Nav from "layouts/Nav";
import Login from "components/Form/Login";
import Main from "./layouts/Main";
import FormWrap from "./components/Form/FormWrap";
import Join from "./components/Form/Join";
import Preview from "./components/Form/Preview";
import "./styles/style.scss";
import "./styles/base.scss";
import { instance } from "./config/api";
import FindTeam from "./pages/FindTeam";

const App = () => {
  const [user, setUser] = useRecoilState(UserState);
  const [login, setLogin] = useState(false);
  const [hasId, setHasId] = useState(false);
  const [confirmLogin, setConfirmLogin] = useRecoilState(LoginState);
  const [loginBoolean, setLoginBoolean] = useState(false);
  const { data: info, isLoading: load } = getMemberInfo(loginBoolean);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setConfirmLogin(true);
      setLoginBoolean(true);
      if (info) {
        setUser(info.data);
      }
    }
    // 의존성 배열에 info가 있어야 한다.
  }, [info]);

  return (
    <CookiesProvider>
      <Router>
        <Toast />
        {!confirmLogin && (
          <FormWrap>
            {login && !hasId ? <Login setHasId={setHasId} setLogin={setLogin} /> : null}
            {!login &&
              (hasId ? (
                <Join setHasId={setHasId} />
              ) : (
                <Preview setLogin={setLogin} setHasId={setHasId} />
              ))}
          </FormWrap>
        )}
        <Nav />
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="" element={<Home />} />
            <Route path="notice" element={<Notice />} />
            <Route path="board" element={<Board />} />
            <Route path="board/:id" element={<Detail time="1시간" />} />
            <Route path="board/:teamId/write" element={<Write />} />
            <Route path="team" element={<Team />} />
          </Route>
          <Route path="/search" element={<FindTeam />} />
          <Route path="/alarm" element={<Alarm />} />
          <Route path="/profile" element={<CreateTeam />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
};

export default App;
