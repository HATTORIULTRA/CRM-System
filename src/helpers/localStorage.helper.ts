export function getTokenFromLocalStorage() {
	return {
		refreshToken: window.localStorage.getItem("refreshToken"),
		accessToken: window.localStorage.getItem("accessToken"),
	};
}

export function setTokenToLocalStorage(key: string, token: string): void {
	window.localStorage.setItem(key, token);
}

export function removeTokenFromLocalStorage(key: string): void {
	window.localStorage.removeItem(key);
}
