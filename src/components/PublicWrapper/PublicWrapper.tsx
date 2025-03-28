import { FC, ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import TokenHelper from "../../helpers/localStorage.helper.ts";

const PublicWrapper: FC = (): ReactNode => {
	const tokenHelper = new TokenHelper();
	const accessToken = tokenHelper.getTokenFromLocalStorage().accessToken;

	return accessToken ? <Navigate to="/" /> : <Outlet />;
};

export default PublicWrapper;
