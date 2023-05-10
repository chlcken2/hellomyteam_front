import { useLocation } from "react-router-dom";

export const formatDate = (selectedDate: string | Date) => {
  const date = new Date(selectedDate);

  return `${
    date.getMonth() + 1
  }월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes()}`;
};

export const menuClassName = (menuPath: string | string[], className: string) => {
  const { pathname } = useLocation();

  if (Array.isArray(menuPath))
    return menuPath.some((el) => el === pathname) ? className : "";
  if (menuPath === "" && pathname === "/") return className;
  if (menuPath !== "" && pathname.indexOf(menuPath) !== -1) return className;

  return "";
};
