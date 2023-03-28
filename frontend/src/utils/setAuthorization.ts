export const setLocalStorage = (accessToken: string) => {
  localStorage.removeItem("token");
  const item = {
    value: accessToken,
    expiry: new Date().getTime() + 1,
  };
  localStorage.setItem("token", JSON.stringify(item));
};

export const getExpiredDate = () => {
  const date = new Date();
  const oneWeek = new Date();
  oneWeek.setDate(date.getDate() + 7);

  return oneWeek;
};

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};
