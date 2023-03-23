import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

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
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // 모바일 탭바의 menuItem 배경 인터렉션관련 스타일 state
  const [menuItemBackgroundStyle, setMenuItemBackgroundStyle] = useState({
    width: 0,
    offsetLeft: 0,
  });

  const menuClassName = (path: string) => {
    if (path === "" && pathname === "/") return "active";
    if (path !== "" && pathname.indexOf(path) !== -1) return "active";
    return "";
  };

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

  return (
    <div className="main-wrap">
      <h1 className="main-title">우리동네 축구팀</h1>
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
