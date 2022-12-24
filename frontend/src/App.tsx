import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DEV_BASE_URL, PROD_BASE_URL } from './constants/urls';
import GlobalStyle from './styles/GlobalStyles';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { Routes, Route } from 'react-router-dom';
import Nav from './layouts/Nav';
import Main from './layouts/Main';
import FindTeam from './layouts/FindTeam';
import Shorcut from './components/Shorcut';
import Notice from './components/Notice';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />

        <Nav />
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path=":shortcut" element={<Shorcut />}></Route>
            <Route path="notice" element={<Notice />}></Route>
          </Route>
          <Route path="/search" element={<FindTeam />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
