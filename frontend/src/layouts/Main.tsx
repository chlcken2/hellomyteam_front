import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import getTeamInfo from "quires/team/getTeamInfo";
import { teamMemberId } from "quires/team/getTeamId";
import Button from "components/common/button";
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
  const path = process.env.PUBLIC_URL;
  const navi = useNavigate();
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [useUser, setUseUser] = useRecoilState(UserState);
  // userId 리턴해야하므로 리코일값을 가져와야한다 (4/27)
  const [userId, setUserId] = useState(useUser?.id);
  const [flag, setFlag] = useState(false);

  const [showTeamsModal, setShowTeamsModal] = useState(false);
  // User가 가입한 team list fetch (param - memberId)
  const { data: team, isLoading: isGetTeamInfoLoading } = getTeamInfo(userId);

  // 모바일 탭바의 menuItem 배경 인터렉션관련 스타일 state
  const [menuItemBackgroundStyle, setMenuItemBackgroundStyle] = useState({
    width: 0,
    offsetLeft: 0,
  });

  const [currentTeamTitle, setCurrentTeamTitle] = useState(
    JSON.parse(localStorage.getItem("arrayData"))?.[0].teamName || "헬로마이팀",
  );
  const [currentTeamId, setCurrentTeamId] = useState(0);

  const [localTitle, setLocalTitle] = useState<titleType[]>(team?.data);

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
    setFlag(true);
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
    if (isGetTeamInfoLoading) return alert("로딩중입니다");
    teamMemberId(id, filtered[0].teamId).then((res) => {
      setUseUser({
        ...useUser,
        teamMemberInfoId: res.data.data,
        selectedTeamId: filtered[0].teamId,
      });
    });
  };

  // recoil에 담긴 User의 정보가 있을시에, 사용자의 id값을 리액트 쿼리에 보냄
  useEffect(() => {
    if (useUser) {
      setUserId(useUser.id);
    }
  }, [useUser]);

  const menuClassName = (menuPath: string) => {
    if (menuPath === "" && pathname === "/") return "active";
    if (menuPath !== "" && pathname.indexOf(menuPath) !== -1) return "active";
    return "";
  };

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
    if (isGetTeamInfoLoading) return;

    if (team.data) {
      setFlag(true);

      if (!localStorage.getItem("arrayData")) {
        localStorage.setItem("arrayData", JSON.stringify(team.data));
        setFlag(false);
      }

      // 로컬스토리지에서 배열 데이터 가져오기
      const arrayData = JSON.parse(localStorage.getItem("arrayData"));

      setCurrentTeamId(arrayData?.[0].teamId);
      setLocalTitle(arrayData);
      setCurrentTeamTitle(arrayData?.[0].teamName);

      // 리코일에 사용자 정보와 사용자가 가입한 팀을 모두 담는다

      setUseUser({
        ...useUser,
        teamInfo: [...team.data],
        selectedTeamId: localTitle?.[0].teamId,
      });

      if (!flag) return;
      team.data.forEach((el, idx) => {
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
  }, [team]);

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
            <div className="main-teams">
              <ul>
                {localTitle?.map((el: any, idx: number) => {
                  return (
                    <li
                      key={idx}
                      onKeyDown={() => handleMember(el.teamName, el.teamId, el.imageUrl)}
                      onClick={() => handleMember(el.teamName, el.teamId, el.imageUrl)}
                    >
                      <button>{el.teamName}</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </h1>
        <ul>
          <li>
            <Button
              text="글쓰기"
              handler={() => handleTeamWrite(currentTeamId)}
              color="blue"
            />
          </li>
        </ul>
      </div>

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
            <li key={idx} className={menuClassName(menuItem.path)}>
              <Link to={`/${menuItem.path}`}>{menuItem.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default Main;
