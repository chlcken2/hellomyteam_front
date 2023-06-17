import axios, { AxiosError } from "axios";
import { API_URL } from "constants/urls";
import { getCookie, getExpiredDate, setLocalStorage } from "utils/setAuthorization";

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  subscribers.push(callback);
};

const onRrefreshed = (token: string) => {
  subscribers.forEach((callback) => callback(token));
};

const getRefreshToken = async (): Promise<string | void> => {
  try {
    const cookie = getCookie("refresh");
    const res = await axios.get("/api/auth/refresh", {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });

    const { accessToken, refreshToken } = res.data.data;

    isRefreshing = false;

    onRrefreshed(accessToken);
    subscribers = [];
    setLocalStorage(accessToken);
    document.cookie = `refresh=${refreshToken}; path=/; max-age=${getExpiredDate()}`;

    return accessToken;
  } catch (err) {
    const {
      response: { status },
    } = err as AxiosError;
    if (status === 490 || status === 498) {
      localStorage.removeItem("token");
    }
    isRefreshing = false;
    subscribers = [];
  }
};

const createInstance = () => {
  return axios.create({
    baseURL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : API_URL,
    timeout: 9000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
};

const instance = createInstance();

instance.interceptors.request.use(
  async (config) => {
    const accessToken = JSON.parse(localStorage.getItem("token"));

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
    const { status, config: originalRequest } = err.response;
    if (status === 401 || status === 403) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = token;
            resolve(axios(originalRequest));
          });
        });
      }
      isRefreshing = true;
      const accessToken = await getRefreshToken();

      if (typeof accessToken === "string") {
        originalRequest.headers.Authorization = accessToken;
        return axios(originalRequest);
      }
    }

    return Promise.reject(err);
  },
);

export { instance };
