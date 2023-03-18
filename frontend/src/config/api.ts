import axios from "axios";
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
    // req할 때마다 header에 access token을 던진다
    async (config) => {
      const newConfig = { ...config };
      const accessToken = JSON.parse(localStorage.getItem("access")).value;

      if (!accessToken) {
        config.headers.accessToken = null;
        return config;
      }
      if (config.headers && accessToken) {
        config.headers.Authorization = `${accessToken}`;
        return config;
      }
      return newConfig;
    },

    async (error) => {
      console.log(error);
      return await Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    // req할 때마다 header에 access token을 던진다
    async (config) => {
      return config;
    },
    async (err) => {
      const originalConfig = err.config;
      console.log(originalConfig);

      const {
        config,
        response: { status },
      } = err;

      console.log("hayoung", err);
      if (err.response) {
        const originalRequest = config;
        const { refresh } = cookie;
        // TODO: 토큰이 만료될때마다 갱신해줌.
        try {
          const res = await axios.get("/api/auth/refresh", {
            headers: {
              Authorization: `Bearer ${refresh}`,
            },
          });
          if (res) {
            const { accessToken, refreshToken } = res.data.data;
            // access - localStorage
            const a = JSON.stringify(accessToken);
            localStorage.setItem("access", a);
            // refresh - cookie
            const now = new Date();
            const after1week = new Date();
            after1week.setDate(now.getDate() + 7);
            setCookie("refresh", refreshToken, { path: "/", expires: after1week });
            // 추가
            originalRequest.headers.authorization = `${accessToken}`;
            // 401로 요청 실패했던 요청 새로운 accessToken으로 재요청
            return axios(originalRequest);
          }
        } catch (err) {
          console.dir(err);
          console.log("토큰 갱신 에러");
        }
      }
      return Promise.reject(err);
    },
  );

  return props.children;
};

interface Props {
  children: React.ReactElement;
}

export { AxiosInterceptor, instance };
