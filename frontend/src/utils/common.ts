import { useLocation } from "react-router-dom";

export const formatDate = (selectedDate: string | Date) => {
  const date = new Date(selectedDate);

  return `${
    date.getMonth() + 1
  }월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes()}`;
};

export const formatBirthday = (birthday: string) => {
  const year = birthday.slice(0, 4);
  const month = birthday.slice(4, 6);
  const day = birthday.slice(6, 8);

  const formattedDate = `${year}. ${month}. ${day}`;

  return formattedDate;
};

export const base64toFile = (baseData: string, filename: string) => {
  const arr = baseData.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const menuClassName = (menuPath: string | string[], className: string) => {
  const { pathname } = useLocation();

  if (Array.isArray(menuPath))
    return menuPath.some((el) => el === pathname) ? className : "";
  if (menuPath === "" && pathname === "/") return className;
  if (menuPath !== "" && pathname.indexOf(menuPath) !== -1) return className;

  return "";
};
