import { QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AxiosInterceptor, queryClient } from "config";
import { Main } from "pages";
import ResponsiveLayout from "./layouts/responsive.layout";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <AxiosInterceptor>
          <Router>
            <ResponsiveLayout>
              <Routes>
                <Route path="/" element={<Main />} />
              </Routes>
            </ResponsiveLayout>
          </Router>
        </AxiosInterceptor>
      </CookiesProvider>
    </QueryClientProvider>
  );
};

export default App;
