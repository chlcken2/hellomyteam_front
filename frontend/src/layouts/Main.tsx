import { Suspense, useEffect, useRef, useState } from "react";
import { menuClassName } from "utils/common";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  Route,
} from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { joinTeamTypes } from "types/UserTypes";

import LoadingSpinner from "components/common/LoadingSpinner";
import Button from "components/common/Button";
import teamMemberId from "quires/team/getTeamMemberId";
import Board from "pages/Home/Board";
import UserState from "../recoil/userAtom";
import "styles/pages/home.scss";
import "styles/layouts/main.scss";

interface titleType {
  imageUrl: string;
  teamId: number;
  teamName: string;
}

const BREAK_POINT = 1000;
const MENU = [
  { path: "", name: "둘러보기" },
  { path: "notice", name: "공지게시판" },
  { path: "board", name: "자유게시판" },
  { path: "team", name: "팀원" },
  { path: "profile", name: "프로필" },
];

const Main = () => {
  const teamInfo = useLoaderData() as joinTeamTypes[];

  const [mobileSize, setMobileSize] = useState(false);
  const [isClicked, setIsClicked] = useState(0);

  const handleClick = (idx: number) => {
    setIsClicked(0);
  };
  const path = process.env.PUBLIC_URL;
  const navi = useNavigate();
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [useUser, setUseUser] = useRecoilState(UserState);

  // userId 리턴해야하므로 리코일값을 가져와야한다 (4/27)
  const [userId, setUserId] = useState(
    Number(JSON.stringify(localStorage.getItem("userId"))) || useUser?.id || 0,
  );
  const [changeDataFlag, setChangeDataFlag] = useState("initial");

  const [showTeamsModal, setShowTeamsModal] = useState(false);

  const {
    data: teamId,
    isLoading: teamIdLoading,
    refetch: teamIdRefetch,
  } = teamMemberId(
    useUser?.selectedTeamId || teamInfo?.[0].teamId || 0,
    useUser?.id || 0,
  );

  // 모바일 탭바의 menuItem 배경 인터렉션관련 스타일 state
  const [menuItemBackgroundStyle, setMenuItemBackgroundStyle] = useState({
    width: 0,
    offsetLeft: 0,
  });

  const [currentTeamTitle, setCurrentTeamTitle] = useState(
    JSON.parse(localStorage.getItem("arrayData"))?.[0].teamName || "헬로마이팀",
  );
  const [currentTeamId, setCurrentTeamId] = useState(0);

  const [localTitle, setLocalTitle] = useState<titleType[]>(
    () => JSON.parse(localStorage?.getItem("arrayData")) || teamInfo,
  );

  // 토글보이기
  const handleTeamsModal = () => {
    setShowTeamsModal(!showTeamsModal);
  };

  // 팀글쓰기로 빠짐
  const handleTeamWrite = (teamId: number) => {
    if (currentTeamTitle === "헬로마이팀") return alert("팀을 선택하세요");
    return navi(`/board/${teamId}/write`);
  };
  // 타이틀바꾸기
  const handleMember = (name: string, id: number, imageUrl: string) => {
    setChangeDataFlag("notInitUser");
    setCurrentTeamTitle(name);
    setCurrentTeamId(id);
    setShowTeamsModal(false);

    // 2023-04-02 localStorage에 최근 정보 저장
    const arrayData = JSON.parse(localStorage.getItem("arrayData")) || [];
    const filtered = arrayData.filter((el: titleType) => el.teamName !== name);
    filtered.unshift({ teamName: name, imageUrl, teamId: id });
    localStorage.setItem("arrayData", JSON.stringify(filtered));

    setLocalTitle(filtered);

    // 2023-04-02: teamMemberInfoId Atom에 추가함
    if (teamId.data) {
      setUseUser({
        ...useUser,
        teamMemberInfoId: teamId.data,
        teamInfo: [...filtered],
        selectedTeamId: filtered[0].teamId,
      });
    }
  };

  // recoil에 담긴 User의 정보가 있을시에, 사용자의 id값을 리액트 쿼리에 보냄
  // useEffect(() => {
  //   if (useUser) {
  //     setUserId(useUser.id);
  //   }
  // }, [useUser]);

  // 리코일에 사용자 정보와 사용자가 가입한 팀을 모두 담는다
  // useEffect(() => {
  //   if (teamInfo) {
  //     setUseUser({ ...useUser, teamInfo: [...teamInfo] });
  //   }
  // }, [teamInfo]);

  // 모바일 홈 탭바 인터랙션 관련 코드
  const handleMenuItemInteraction = () => {
    const screenWidth = window.innerWidth;
    const activeMenu = menuRef.current?.querySelector(".active");

    if (activeMenu && screenWidth < BREAK_POINT) {
      const activeIndex = MENU.findIndex((item) => {
        return (
          (item.path === "" && pathname === "/") ||
          (item.path !== "" && pathname.indexOf(item.path) !== -1)
        );
      });

      if (activeMenu) {
        menuRef.current?.scrollTo({
          left: 100 * activeIndex - 24,
          behavior: "smooth",
        });

        const { offsetLeft } = activeMenu as HTMLLIElement;
        const { width } = activeMenu.getBoundingClientRect();
        setMenuItemBackgroundStyle({ width, offsetLeft });
      } else setMenuItemBackgroundStyle({ width: 0, offsetLeft: 0 });
    }
  };

  useEffect(() => {
    if (pathname) {
      handleMenuItemInteraction();
    }
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("resize", handleMenuItemInteraction);
    return () => {
      window.removeEventListener("resize", handleMenuItemInteraction);
    };
  }, []);

  useEffect(() => {
    const arrayData = JSON.parse(localStorage.getItem("arrayData"));
    if (!teamInfo) return;

    if (teamInfo && useUser?.id) {
      if (!arrayData) {
        localStorage.setItem("arrayData", JSON.stringify(teamInfo));
        setChangeDataFlag("initUser");
      }
    }
  }, [teamInfo, useUser]);

  useEffect(() => {
    if (changeDataFlag === "initUser") {
      // 로컬스토리지에서 배열 데이터 가져오기
      const arrayData = JSON.parse(localStorage.getItem("arrayData"));

      setCurrentTeamId(arrayData?.[0].teamId);
      setLocalTitle(arrayData);
      setCurrentTeamTitle(arrayData?.[0].teamName);
      teamInfo?.forEach((el: any, idx: number) => {
        // 가져온 배열에 새로운 데이터 추가 또는 기존 데이터 수정
        arrayData[idx] = {
          teamName: el.teamName,
          imageUrl: el.imageUrl,
          teamId: el.teamId,
        };

        // 수정된 배열 다시 로컬스토리지에 저장
        localStorage.setItem("arrayData", JSON.stringify(arrayData));
      });
    }
    teamIdRefetch();
  }, [changeDataFlag]);

  useEffect(() => {
    localStorage.setItem("selectedTeamId", localTitle?.[0].teamId.toString());
  }, [localTitle]);

  useEffect(() => {
    if (useUser?.id) {
      teamIdRefetch();
    }
  }, [useUser]);
  useEffect(() => {
    teamIdRefetch();
  }, []);
  // useEffect(() => {
  //   const windowWidth = window.innerWidth;
  //   const mediaQuery = window.matchMedia("(max-width: 768px)");

  //   const handleMediaQueryChange = (event: any) => {
  //     if (windowWidth <= 768) {
  //       setMobileSize(true);
  //     } else {
  //       setMobileSize(false);
  //     }
  //   };

  //   mediaQuery.addListener(handleMediaQueryChange);

  //   return () => {
  //     mediaQuery.removeListener(handleMediaQueryChange);
  //   };
  // }, []);

  console.log(useUser);
  return (
    <div className="main-wrap">
      <div className="main-buttons">
        <h1 className="main-title">
          <button onClick={handleTeamsModal}>
            <span>
              <img
                src={localTitle?.[0].imageUrl || `${path}/common/logo.png`}
                alt="로고"
              />
            </span>
            <p>{currentTeamTitle}</p>
          </button>
          {showTeamsModal && (
            <div className="main-teams__wrap">
              <div className="main-teams">
                <button className="close-teams" onClick={() => setShowTeamsModal(false)}>
                  <img src={`${path}/common/close.png`} alt="close" />
                </button>
                <ul>
                  <li className="mo-title">
                    <h3>나의 팀 선택</h3>
                  </li>

                  {localTitle?.map((el: any, idx: number) => {
                    return (
                      <li
                        key={idx}
                        onKeyDown={() =>
                          handleMember(el.teamName, el.teamId, el.imageUrl)
                        }
                        onClick={() => {
                          handleMember(el.teamName, el.teamId, el.imageUrl);
                          handleClick(idx);
                        }}
                        className={isClicked === idx ? "on" : ""}
                      >
                        <button>{el.teamName}</button>
                      </li>
                    );
                  })}
                  <li>
                    <button onClick={() => navi("/search")}>다른팀 더 가입하기</button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </h1>
        <ul>
          <li>
            <Button
              text="글쓰기"
              handler={() => handleTeamWrite(useUser.selectedTeamId || 0)}
              color="blue"
            />
          </li>
        </ul>
      </div>

      {useUser?.changedToMobile === false ||
        (useUser?.changedToMobile === undefined && (
          <div ref={menuRef} className="main-menu-wrapper">
            <ul className="main-menu">
              <div
                className="active-item-background"
                style={{
                  transform: `translateX(${menuItemBackgroundStyle.offsetLeft}px)`,
                  width: `${menuItemBackgroundStyle.width}px`,
                }}
              />
              {MENU.map((menuItem, idx) => (
                <li key={idx} className={menuClassName(menuItem.path, "active")}>
                  <Link to={`/${menuItem.path}`}>{menuItem.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default Main;
