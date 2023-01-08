import React, { FC, useEffect, useState } from "react";

import { QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AxiosInterceptor, queryClient } from "config";
import GlobalStyle from "styles/GlobalStyles";
import Shorcut from "components/Navbar/Shorcut";
import Notice from "components/Navbar/Notice";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import Main from "./layouts/Main";
import ResponsiveLayout from "./layouts/responsive.layout";
import FormWrap from "./components/Form/FormWrap";
import Join from "./components/Form/Join";
import Login from "./components/Form/Login";
import "./styles/style.scss";

const App = () => {
  const [hasId, setHasId] = useState<boolean>(false);
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <AxiosInterceptor>
          <Router>
            <ThemeProvider theme={theme}>
              <GlobalStyle />
              <ResponsiveLayout>
                <FormWrap>{!hasId ? <Login setHasId={setHasId} /> : <Join />}</FormWrap>
                <Routes>
                  <Route path="/" element={<Main />}>
                    <Route path="shortcut" element={<Shorcut />} />
                    <Route path="notice" element={<Notice />} />
                  </Route>
                  {/* <Route path="/search" element={<FindTeam />} /> */}
                </Routes>
              </ResponsiveLayout>
            </ThemeProvider>
          </Router>
        </AxiosInterceptor>
      </CookiesProvider>
    </QueryClientProvider>
  );
};

export default App;
