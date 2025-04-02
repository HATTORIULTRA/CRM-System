import axios from "axios";
import TokenHelper from "../helpers/token.helper.ts";

const tokenHelper = new TokenHelper();

export const API_URL = "https://easydev.club/api/v1";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = tokenHelper.tokenFromHelper.accessToken;
  if (token && config.url !== "/auth/refresh") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry &&
      originalRequest.url !== "/auth/signin" &&
      originalRequest.url !== "/user/logout"
    ) {
      originalRequest._isRetry = true;
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
          "Bearer " + res.data.accessToken;
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
