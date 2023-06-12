import { Suspense, lazy, useEffect, useState } from "react";

import getMemberInfo from "quires/member/getMemberInfo";
import getTeamInfo from "quires/team/getTeamInfo";
import joinedTeamsAtom from "recoil/joinedTeams";
import { getCookie } from "utils/setAuthorization";
import { CookiesProvider, useCookies } from "react-cookie";

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

import LoadingSpinner from "components/common/LoadingSpinner";
import NotFound from "components/common/NotFound";

import "./styles/style.scss";
import "./styles/base.scss";
import "./styles/layouts/main.scss";

const FormWrap = lazy(() => import("./pages/Onboarding/FormWrap"));
const SignupSecondPage = lazy(() => import("./pages/Onboarding/SignupSecondPage"));
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
const MyTeam = lazy(() => import("./pages/Account/MyTeam"));

const App = () => {
  const [, , removeCookie] = useCookies(["refresh"]);
  const [useUser, setUseUser] = useRecoilState(UserState);
  const setJoinedTeams = useSetRecoilState(joinedTeamsAtom);
  const [, setConfirmLogin] = useRecoilState(LoginState);
  const [loginBoolean, setLoginBoolean] = useState(false);
  const { data: userInfo, refetch: userRefetch } = getMemberInfo(true);
  const { data: joinedTeamResponse, refetch: dataRefetch } = getTeamInfo(loginBoolean);
  const [hideNav, setHideNav] = useState<boolean>(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setConfirmLogin(true);
      setLoginBoolean(true);

      if (userInfo)
        userRefetch().then((res) => {
          dataRefetch().then((data) => {
            if (data.data.data === null) {
              // 처음 가입
              if (userInfo) {
                setUseUser({
                  ...useUser,
                  teamInfo: [],
                  selectedTeamId: null,
                  ...userInfo.data,
                });
              }
            }
            // 가입된 팀이 있지만 로컬스토리지를 비우고 새로고침 햇을경우
            else {
              setUseUser({
                ...useUser,
                teamInfo: [...data.data.data],
                selectedTeamId: [...data.data.data][0].teamId,
                ...userInfo.data,
              });
            }
            localStorage.setItem("arrayData", JSON.stringify(data.data.data));
          });
        });
    }
    // 의존성 배열에 info가 있어야 한다.
  }, [userInfo, joinedTeamResponse]);
  // 컴포넌트 마운트시마다 데이터 갱신
  useEffect(() => {
    dataRefetch().then((data) => {
      setUseUser({
        ...useUser,
        teamInfo: [...data.data.data],
        selectedTeamId: [...data.data.data][0].teamId,
      });
    });
  }, []);

  const mainLoader = async () => {
    if (!localStorage.getItem("token") && !getCookie("refresh")) {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      return redirect("/onboarding");
    }
    if (!getCookie("refresh")) {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      return redirect("/onboarding/login");
    }
    // 새로 로그인할 경우 로컬스토리지 초기화

    if (userInfo) localStorage.setItem("userId", userInfo.data.id.toString());

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

  // 다른 아이디로 로그인할 경우 로컬스토리지 비움
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      localStorage.removeItem("userId");
      localStorage.removeItem("selectedTeamId");
      localStorage.removeItem("arrayData");
      removeCookie("refresh");
    }
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<NotFound />}>
        <Route loader={mainLoader} element={<Nav hideNav={hideNav} />}>
          <Route loader={mainLoader} path="/" element={<Main />}>
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
              <Suspense fallback={<LoadingSpinner />}>
                <FindTeam />
              </Suspense>
            }
          />
          <Route
            path="/alarm"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Alarm />
              </Suspense>
            }
          />
          <Route path="/account">
            <Route path="create" element={<CreateTeam data={setHideNav} />} />
            <Route loader={getJoinedTeamListLoader} path="" element={<MyTeam />} />
          </Route>
        </Route>
        <Route path="/onboarding" element={<Onboarding />}>
          <Route element={<FormWrap />}>
            <Route path="signup" element={<SignupFirstPage />} />
            <Route path="signup/2" element={<SignupSecondPage />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="signup/3" element={<SignupSuccess />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  );

  return (
    <CookiesProvider>
      <Toast />
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </CookiesProvider>
  );
};

export default App;
