import { FC } from "react";
import { Navigate, Outlet } from "react-router";
import { getTokenFromLocalStorage } from "../../helpers/localStorage.helper.ts";

const PrivateWrapper: FC = () => {
	const accessToken = getTokenFromLocalStorage().accessToken;

	return accessToken ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default PrivateWrapper;
