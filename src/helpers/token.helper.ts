export default class TokenHelper {
  #accessToken: string | null = null;

  set setAccessToken(token: string | null) {
    this.#accessToken = token;
  }

  set setRefreshTokenToLocalStorage(token: string) {
    window.localStorage.setItem("refreshToken", token);
  }

  get tokenFromHelper() {
    return {
      refreshToken: window.localStorage.getItem("refreshToken"),
      accessToken: this.#accessToken,
    };
  }

  removeRefreshTokenFromLS(): void {
    window.localStorage.removeItem("refreshToken");
  }
}
