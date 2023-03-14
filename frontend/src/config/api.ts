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

      console.log("hayoung", err);
      if (err.response.status === 498) {
        const { refresh } = cookie;
        // TODO: 토큰이 만료될때마다 갱신해줌. 창현님이 api 수정하신 후에 로직 추가할 예정
        console.log(refresh);

        try {
          const res = await axios({
            url: "/api/auth/refresh",
            method: "GET",
            headers: {
              Authorization: `Bearer ${refresh}`,
            },
          });
          if (res) {
            const { accessToken, refreshToken } = res.data.data;
            // access - localStorage
            localStorage.setItem("access", JSON.stringify(accessToken));
            // refresh - cookie
            const now = new Date();
            const after1week = new Date();
            after1week.setDate(now.getDate() + 7);
            setCookie("refresh", refreshToken, { path: "/", expires: after1week });
          }
          return await instance.request(originalConfig);
        } catch (err) {
          console.log("토큰 갱신 에러");
        }
        return Promise.reject(err);
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
