export default class TokenHelper {
	setTokenToLocalStorage(key: string, token: string): void {
		window.localStorage.setItem(key, token);
	}
	getTokenFromLocalStorage() {
		return {
			refreshToken: window.localStorage.getItem("refreshToken"),
			accessToken: window.localStorage.getItem("accessToken"),
		};
	}
	removeTokenFromLocalStorage(key: string): void {
		window.localStorage.removeItem(key);
	}
}
