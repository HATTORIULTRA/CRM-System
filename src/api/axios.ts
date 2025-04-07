import axios from "axios";
import tokenHelper from "../helpers/token.helper.ts";

export const API_URL = "https://easydev.club/api/v1";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = tokenHelper.tokenFromHelper.accessToken;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh" &&
      originalRequest.url !== "auth/logout"
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken: string | null =
          tokenHelper.tokenFromHelper.refreshToken;
        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        tokenHelper.setAccessToken = res.data.accessToken;
        tokenHelper.setRefreshTokenToLocalStorage = res.data.refreshToken;

        axios.defaults.headers.common["Authorization"] =
          tokenHelper.tokenFromHelper.accessToken;

        return instance.request(originalRequest);
      } catch (e) {
        console.log(e);
        tokenHelper.setAccessToken = null;
        tokenHelper.removeRefreshTokenFromLS();
      }
    }
    throw error;
  }
);

export default instance;
