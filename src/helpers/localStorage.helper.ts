export function getTokenFromLocalStorage() {
	return {
		refreshToken: window.localStorage.getItem("refreshToken"),
		accessToken: window.localStorage.getItem("accessToken"),
	};
}

export function setAccessTokenToLocalStorage(key: string, token: string): void {
	const jsonToken = token;
	window.localStorage.setItem(key, jsonToken);
}

export function setRefreshTokenToLocalStorage(
	key: string,
	token: string
): void {
	const jsonToken = token;
	window.localStorage.setItem(key, jsonToken);
}

export function removeTokenFromLocalStorage(key: string): void {
	window.localStorage.removeItem(key);
}
