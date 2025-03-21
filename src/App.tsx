import { FC, ReactNode, useEffect } from "react";
import { BrowserRouter } from "react-router";

import AppRouter from "./components/AppRouter/AppRouter.tsx";
import { checkAuth, logoutUser } from "./store/slices/authSlice.ts";
import { useAppDispatch } from "./hooks/redux.ts";
import { getTokenFromLocalStorage } from "./helpers/localStorage.helper.ts";

const App: FC = (): ReactNode => {
	const dispatch = useAppDispatch();
	const token = getTokenFromLocalStorage().accessToken;

	useEffect(() => {
		dispatch(checkAuth());
	}, []);

	useEffect(() => {
		if (!token) {
			dispatch(logoutUser());
		}
	}, [token]);

	return (
		<div className="app">
			<BrowserRouter>
				<AppRouter />
			</BrowserRouter>
		</div>
	);
};

export default App;
