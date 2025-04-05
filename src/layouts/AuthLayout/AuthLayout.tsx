import { FC, ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router";

import skeletPNG from "../../assets/skeletPNG.png";
import authLogo from "../../assets/authLogo.png";
import s from "./AuthLayout.module.scss";

const AuthLayout: FC = (): ReactNode => {
  const location = useLocation();
  const isLogin = location.pathname === "/auth/login";

  return (
    <div className={s.wrapper}>
      <div className={s.left}>
        <img className={s.image} src={skeletPNG} alt="auth-image" />
      </div>
      <div className={s.right}>
        <img className={s.authLogo} src={authLogo} alt="auth-logo" />
        <div className={s.top}>
          <h1 className={s.title}>
            {isLogin ? "Login to your Account" : "Register new Account"}
          </h1>
          <p className={s.descr}>See what is going on with your business</p>
        </div>
        <Outlet />
        <div>
          {isLogin ? (
            <h2>
              Нет аккаунта? <Link to="/auth/register">Зарегистрироваться</Link>
            </h2>
          ) : (
            <h2>
              Уже есть аккаунт? <Link to="/auth/login">Войти</Link>
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
