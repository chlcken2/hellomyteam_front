import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import getTeamInfo from "quires/team/getTeamInfo";
import { teamMemberId } from "quires/team/getTeamId";
import Button from "components/common/button";
import UserState from "../recoil/userAtom";
import "styles/pages/home.scss";
import "styles/layouts/main.scss";

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
  const [showTeamsModal, setShowTeamsModal] = useState(false);

  // 모바일 탭바의 menuItem 배경 인터렉션관련 스타일 state
  const [menuItemBackgroundStyle, setMenuItemBackgroundStyle] = useState({
    width: 0,
    offsetLeft: 0,
  });
  const [userId, setUserId] = useState(0);
  const [currentTeamTitle, setCurrentTeamTitle] = useState("헬로마이팀");
  const [currentTeamId, setCurrentTeamId] = useState(0);
  const [logo, setLogo] = useState(`${path}/common/logo.png`);

  // User가 가입한 team list fetch
  const { data: team, isLoading: isGetTeamInfoLoading } = getTeamInfo(userId);

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
    setLogo(imageUrl);
    setCurrentTeamTitle(name);
    setCurrentTeamId(id);
    setShowTeamsModal(false);

    // 2023-03-29: teamMemberInfoId Atom에 추가함
    if (isGetTeamInfoLoading) return alert("로딩중입니다");
    teamMemberId(id, useUser.id).then((res) => {
      setUseUser({ ...useUser, teamMemberInfoId: res.data.data, selectedTeamId: id });
    });
  };

  // recoil에 담긴 User의 정보가 있을시에, 사용자의 id값을 리액트 쿼리에 보냄
  useEffect(() => {
    if (useUser) {
      setUserId(useUser.id);
    }
  }, [useUser]);

  // 리코일에 사용자 정보와 사용자가 가입한 팀을 모두 담는다
  useEffect(() => {
    if (team?.data) {
      setUseUser({ ...useUser, teamInfo: [...team.data] });
    }
  }, [team]);

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

  console.log(team);
  return (
    <div className="main-wrap">
      <div className="main-buttons">
        <h1 className="main-title">
          <button onClick={handleTeamsModal}>
            <span>
              <img src={logo} alt="로고" />
            </span>
            <p>{currentTeamTitle}</p>
          </button>
          {showTeamsModal && (
            <div className="main-teams">
              <ul>
                {team?.data.map((el, idx) => {
                  return (
                    <li key={idx}>
                      <button
                        onClick={() => handleMember(el.teamName, el.teamId, el?.imageUrl)}
                      >
                        {el.teamName}
                      </button>
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
