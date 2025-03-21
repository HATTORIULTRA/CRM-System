import { FC } from "react";
import { Navigate, Outlet } from "react-router";
import { getTokenFromLocalStorage } from "../../helpers/localStorage.helper.ts";

const PublicWrapper: FC = () => {
	const accessToken = getTokenFromLocalStorage().accessToken;

	return accessToken ? <Navigate to="/" /> : <Outlet />;
};

export default PublicWrapper;
