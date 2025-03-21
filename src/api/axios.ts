import axios from "axios";
import {
	getTokenFromLocalStorage,
	removeTokenFromLocalStorage,
	setAccessTokenToLocalStorage,
} from "../helpers/localStorage.helper.ts";

export const API_URL = "https://easydev.club/api/v1";

const instance = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

instance.interceptors.request.use((config) => {
	const token = getTokenFromLocalStorage().accessToken;
	if (token) {
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
			!error.config._isRetry
		) {
			originalRequest._isRetry = true;
			try {
				const refreshToken: string | null =
					getTokenFromLocalStorage().refreshToken;
				const res = await axios.post(
					`${API_URL}/auth/refresh`,
					{ refreshToken },
					{ withCredentials: true }
				);
				setAccessTokenToLocalStorage("accessToken", res.data.accessToken);
				setAccessTokenToLocalStorage("refreshToken", res.data.refreshToken);
				return instance.request(originalRequest);
			} catch (e) {
				console.log(e);
				await axios.post(`${API_URL}/user/logout`);
				removeTokenFromLocalStorage("accessToken");
				removeTokenFromLocalStorage("refreshToken");
				window.location.href = "/auth/login";
			}
		}
		throw error;
	}
);

export default instance;
