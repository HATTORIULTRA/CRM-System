import { FC, ReactNode } from "react";
import { Outlet, useLocation } from "react-router";

import skeletPNG from "../../assets/skeletPNG.png";
import authLogo from "../../assets/authLogo.png";
import s from "./AuthPage.module.scss";


const AuthPage: FC = (): ReactNode => {
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
			</div>
		</div>
	);
};

export default AuthPage;
