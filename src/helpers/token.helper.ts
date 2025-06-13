class TokenHelper {
  #accessToken: string | null = null;

  set accessToken(token: string | null) {
    this.#accessToken = token;
  }

  set refreshTokenToLocalStorage(token: string) {
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

const tokenHelper = new TokenHelper();
export default tokenHelper;
