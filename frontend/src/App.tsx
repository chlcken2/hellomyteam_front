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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <AxiosInterceptor>
          <Router>
            <ThemeProvider theme={theme}>
              <GlobalStyle />
              <ResponsiveLayout>
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
