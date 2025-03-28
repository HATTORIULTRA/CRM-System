import axios from "axios";
import TokenHelper from "../helpers/localStorage.helper.ts";

const tokenHelper = new TokenHelper();

export const API_URL = "https://easydev.club/api/v1";

const instance = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

instance.interceptors.request.use((config) => {
	const token = tokenHelper.getTokenFromLocalStorage().accessToken;
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
			originalRequest.url !== "/auth/signin"
		) {
			originalRequest._isRetry = true;
			try {
				const refreshToken: string | null =
					tokenHelper.getTokenFromLocalStorage().refreshToken;
				const res = await axios.post(
					`${API_URL}/auth/refresh`,
					{ refreshToken },
					{ withCredentials: true }
				);
				axios.defaults.headers.common["Authorization"] =
					"Bearer " + res.data.accessToken;

				tokenHelper.setTokenToLocalStorage("accessToken", res.data.accessToken);
				tokenHelper.setTokenToLocalStorage(
					"refreshToken",
					res.data.refreshToken
				);
				return instance.request(originalRequest);
			} catch (e) {
				console.log(e);
				tokenHelper.removeTokenFromLocalStorage("accessToken");
				tokenHelper.removeTokenFromLocalStorage("refreshToken");
				window.location.href = "/auth/login";
			}
		}
		throw error;
	}
);

export default instance;
