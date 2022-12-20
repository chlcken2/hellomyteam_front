import axios from "axios";
import { DEV_BASE_URL } from "constants/urls";
import { useToken, useUser } from "hooks";
import { useCookies } from "react-cookie";
import React from "react";

const createInstance = () => {
  return axios.create({
    baseURL: DEV_BASE_URL,
    timeout: 2000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
};

const instance = createInstance();

const AxiosInterceptor = (props: Props) => {
  const [cookie, setCookie] = useCookies(["access_token"]);

  instance.interceptors.request.use(
    // token refresh
    async (config) => {
      const newConfig = { ...config };
      const accessToken = cookie.access_token;
      const { user } = useUser();
      if (user) {
        if (accessToken) {
          newConfig.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          const { refresh } = useToken();
          const refreshInstance = createInstance();
          await refreshInstance.post("users/token/refresh/", { refresh }).then((data) => {
            const newAccess = data.data.access;
            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 25);
            setCookie("access_token", newAccess, { expires });
            newConfig.headers.Authorization = `Bearer ${newAccess}`;
          });
        }
      }
      return newConfig;
    },

    async (error) => {
      return await Promise.reject(error);
    },
  );

  return props.children;
};

interface Props {
  children: React.ReactElement;
}

export { AxiosInterceptor, instance };
