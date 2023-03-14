import React, { FC, useEffect, useState } from "react";

import { QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

import Home from "pages/Home/Home";
import Notice from "pages/Home/Notice";
import Board from "pages/Home/Board";
import Team from "pages/Home/Team";
import Detail from "pages/Home/Detail";
import Write from "pages/Home/Write";
import LoginState from "recoil/atom";
import { AxiosInterceptor, queryClient } from "config";
import Nav from "layouts/Nav";
import Login from "components/Form/Login";
import Main from "./layouts/Main";
import FormWrap from "./components/Form/FormWrap";
import Join from "./components/Form/Join";
import Preview from "./components/Form/Preview";
import "./styles/style.scss";
import "./styles/base.scss";
import { instance } from "./config/api";
import FindTeam from "./layouts/FindTeam";

const App = () => {
  const [login, setLogin] = useState(false);
  const [hasId, setHasId] = useState(false);
  const [confirmLogin, setConfirmLogin] = useRecoilState(LoginState);
  useEffect(() => {
    instance
      .get("/api/user/me")
      .then((res) => {
        if (res.data.status === "success") {
          setConfirmLogin(true);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <AxiosInterceptor>
          <Router>
            <Nav />
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
            </Routes>
          </Router>
        </AxiosInterceptor>
      </CookiesProvider>
    </QueryClientProvider>
  );
};

export default App;
