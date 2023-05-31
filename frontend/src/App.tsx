import { Suspense, lazy, useEffect, useState } from "react";

import getMemberInfo from "quires/member/getMemberInfo";
import getTeamInfo from "quires/team/getTeamInfo";
import joinedTeamsAtom from "recoil/joinedTeams";
import { getCookie } from "utils/setAuthorization";

import { CookiesProvider } from "react-cookie";
import {
  Route,
  redirect,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import UserState from "recoil/userAtom";
import Toast from "components/common/Toast";
import LoginState from "recoil/atom";

import "./styles/style.scss";
import "./styles/base.scss";
import "./styles/layouts/main.scss";

const FormWrap = lazy(() => import("./pages/Onboarding/FormWrap"));
const SignupSecondPage = lazy(() => import("pages/Onboarding/SignupSecondPage"));
const SignupSuccess = lazy(() => import("./pages/Onboarding/SignupSuccess"));
const Login = lazy(() => import("./pages/Onboarding/Login"));
const SignupFirstPage = lazy(() => import("./pages/Onboarding/SignupFirstPage"));
const Nav = lazy(() => import("./layouts/Nav"));
const Main = lazy(() => import("./layouts/Main"));
const Home = lazy(() => import("./pages/Home/Home"));
const Notice = lazy(() => import("./pages/Home/Notice"));
const Board = lazy(() => import("./pages/Home/Board"));
const Detail = lazy(() => import("./pages/Home/Detail"));
const Write = lazy(() => import("./pages/Home/Write"));
const Profile = lazy(() => import("./pages/Home/Profile/Profile"));
const Team = lazy(() => import("./pages/Home/Team"));
const FindTeam = lazy(() => import("./pages/FindTeam"));
const Onboarding = lazy(() => import("./pages/Onboarding/Onboarding"));
const CreateTeam = lazy(() => import("./pages/Account/CreateTeam"));
const EditProfile = lazy(() => import("./pages/Home/Profile/EditProfile"));
const Alarm = lazy(() => import("./pages/Alarm/Alarm"));

const App = () => {
  const setUser = useSetRecoilState(UserState);
  const setJoinedTeams = useSetRecoilState(joinedTeamsAtom);
  const [, setConfirmLogin] = useRecoilState(LoginState);
  const [loginBoolean, setLoginBoolean] = useState(false);
  const { data: userInfo } = getMemberInfo(loginBoolean);
  const { data: joinedTeamResponse } = getTeamInfo(loginBoolean);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setConfirmLogin(true);
      setLoginBoolean(true);
      if (userInfo && joinedTeamResponse) {
        setUser(userInfo.data);
        setJoinedTeams(joinedTeamResponse.data);
      }
    }
    // 의존성 배열에 info가 있어야 한다.
  }, [userInfo, joinedTeamResponse]);

  const mainLoader = async () => {
    if (!localStorage.getItem("token") && !getCookie("refresh")) {
      return redirect("/onboarding");
    }
    if (!getCookie("refresh")) {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      return redirect("/onboarding/login");
    }
    localStorage.setItem("userId", userInfo.data.id.toString());
    if (!joinedTeamResponse || !joinedTeamResponse.data) return null;
    return joinedTeamResponse.data;
  };

  const getUserIdLoader = () => {
    if (!userInfo) return null;
    return userInfo.data.id;
  };

  const getJoinedTeamListLoader = () => {
    if (!joinedTeamResponse) return null;
    return joinedTeamResponse.data;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<div>Not found</div>}>
        <Route loader={mainLoader} element={<Nav />}>
          <Route loader={getJoinedTeamListLoader} path="/" element={<Main />}>
            <Route path="" element={<Home />} />
            <Route path="notice" element={<Notice />} />
            <Route path="board" element={<Board />} />
            <Route path="board/:id" element={<Detail />} />
            <Route path="board/:teamId/write" element={<Write />} />
            <Route path="team" element={<Team />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route
            loader={getUserIdLoader}
            path="/search/*"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <FindTeam />
              </Suspense>
            }
          />
          <Route
            path="/alarm"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Alarm />
              </Suspense>
            }
          />
          <Route path="/create" element={<CreateTeam />} />
        </Route>
        <Route path="/onboarding" element={<Onboarding />}>
          <Route element={<FormWrap />}>
            <Route path="signup" element={<SignupFirstPage />} />
            <Route path="signup/2" element={<SignupSecondPage />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="signup/3" element={<SignupSuccess />} />
        </Route>
      </Route>,
    ),
  );

  return (
    <CookiesProvider>
      <Toast />
      <RouterProvider router={router} />
    </CookiesProvider>
  );
};

export default App;
