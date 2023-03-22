import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getExpiredDate, setLocalStorage } from "utils/setAuthorization";

const createInstance = () => {
  return axios.create({
    baseURL: "http://localhost:3000",
    timeout: 2000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
};

const instance = createInstance();

const AxiosInterceptor = (): null => {
  const [cookie, setCookie, removeCookie] = useCookies(["refresh"]);
  const navigate = useNavigate();

  useEffect(() => {
    instance.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        const accessToken = JSON.parse(localStorage.getItem("token")).value;

        if (!accessToken) {
          config.headers.accessToken = null;
          return config;
        }
        if (config.headers && accessToken) {
          config.headers.Authorization = accessToken;
          return config;
        }
        return config;
      },

      async (error: AxiosError) => {
        return error;
      },
    );

    instance.interceptors.response.use(
      async (config) => {
        return config;
      },
      async (err: AxiosError) => {
        const { refresh } = cookie;
        const { status, config: originalRequest } = err.response;
        if (status === 401 || status === 403) {
          try {
            const res = await axios.get("/api/auth/refresh", {
              headers: {
                Authorization: `Bearer ${refresh}`,
              },
            });

            const { accessToken, refreshToken } = res.data.data;

            setLocalStorage(accessToken);
            removeCookie("refresh");
            setCookie("refresh", refreshToken, { path: "/", expires: getExpiredDate() });
            originalRequest.headers.authorization = accessToken;

            return axios(originalRequest);
          } catch (err) {
            const { response } = err as AxiosError;
            if (response.status === 490 || response.status === 498) {
              localStorage.removeItem("token");
              navigate("/");
            }

            return err;
          }
        }

        return err;
      },
    );
  }, []);

  return null;
};

export { AxiosInterceptor, instance };
