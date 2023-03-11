import axios from "axios";
import { useUser } from "hooks";
import { useCookies } from "react-cookie";

import React from "react";

const createInstance = () => {
  return axios.create({
    baseURL: "http://localhost:3000",
    timeout: 2000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
};

const instance = createInstance();

const AxiosInterceptor = (props: Props) => {
  const [cookie, setCookie] = useCookies(["refresh"]);

  instance.interceptors.request.use(
    // token refresh
    async (config) => {
      const newConfig = { ...config };
      const accessToken = JSON.parse(localStorage.getItem("access")).value;
      const refreshToken = JSON.parse(localStorage.getItem("access")).value;

      if (!accessToken) {
        config.headers.accessToken = null;
        config.headers.refreshToken = null;
        return config;
      }
      if (config.headers && accessToken) {
        config.headers.Authorization = `${accessToken}`;
        config.headers.refreshToken = `${refreshToken}`;
        return config;
      }

      // TODO: 수정예정
      const { user } = useUser();
      if (user) {
        if (accessToken) {
          newConfig.headers.Authorization = `${accessToken}`;
        } else {
          const { refresh } = cookie.refresh;
          const refreshInstance = createInstance();
          await refreshInstance.post("/api/auth/refresh", { refresh }).then((data) => {
            console.log(`hayoung${data}`);
            const newAccess = data.data.access;
            newConfig.headers.Authorization = `${newAccess}`;
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
