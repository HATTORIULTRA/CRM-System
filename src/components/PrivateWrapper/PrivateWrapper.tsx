import { FC, ReactNode, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { getTokenFromLocalStorage } from "../../helpers/localStorage.helper.ts";
import { useAppDispatch } from "../../hooks/redux.ts";
import { checkAuth } from "../../store/slices/authSlice.ts";

const PrivateWrapper: FC = (): ReactNode => {
	const accessToken = getTokenFromLocalStorage().accessToken;
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!accessToken) {
			dispatch(checkAuth());
		}
	}, []);

	return accessToken ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default PrivateWrapper;
