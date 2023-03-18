import React, { FC, useEffect, useState, useCallback } from "react";

import { QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie"; // useCookies import

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

import { AxiosInterceptor, queryClient } from "config";
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
  const [cookies, setCookie, removeCookie] = useCookies(["refresh"]);

  const checkPopupClose = () => {
    // 로그인 했을시에 로컬스토리지의 유효기한 체크.
    const expireDay = JSON.parse(localStorage.getItem("access"))?.expiry || 0;
    const later = Date.now();

    if (expireDay !== 0) {
      if (expireDay < later) {
        // expireday는 4시고 현재 시간이 5시일경우에는 false를 반환한다.
        return false;
      }
      return true;
    }
  };

  useEffect(() => {
    console.log(checkPopupClose());
    if (checkPopupClose() !== undefined)
      if (checkPopupClose()) {
        console.log("아직 안지남");
      } else {
        console.log("시간 지남");
        localStorage.removeItem("access");
        removeCookie("refresh");
        setConfirmLogin(false);
        setLogin(true);
        setHasId(false);
      }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("access")) {
      setConfirmLogin(true);
      instance
        .get("/api/user/me")
        .then((res) => {
          if (res.data.status === "success") {
            setUser(res.data.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <AxiosInterceptor>
          <Router>
            <Toast />
            {!confirmLogin && (
              <FormWrap>
                {login && !hasId ? (
                  <Login setHasId={setHasId} setLogin={setLogin} />
                ) : null}
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
                <Route path="board/write" element={<Write />} />
                <Route path="team" element={<Team />} />
              </Route>
              <Route path="/search" element={<FindTeam />} />
              <Route path="/alarm" element={<Alarm />} />
              <Route path="/profile" element={<CreateTeam />} />
            </Routes>
          </Router>
        </AxiosInterceptor>
      </CookiesProvider>
    </QueryClientProvider>
  );
};

export default App;
