import { FC } from "react";
import { Route, Routes } from "react-router";

import AuthPage from "../../pages/AuthPage/AuthPage.tsx";
import MainPage from "../../pages/MainPage/MainPage.tsx";
import TodoPage from "../../pages/TodoPage/TodoPage.tsx";
import ProfilePage from "../../pages/ProfilePage/ProfilePage.tsx";
import PrivateWrapper from "../PrivateWrapper/PrivateWrapper.tsx";
import PublicWrapper from "../PublicWrapper/PublicWrapper.tsx";
import Register from "../Register/Register.tsx";
import Login from "../Login/Login.tsx";

const AppRouter: FC = () => {
	return (
		<Routes>
			<Route element={<PublicWrapper />}>
				<Route path="/auth/*" element={<AuthPage />}>
					<Route index element={<Login />} />
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
				</Route>
			</Route>

			<Route element={<PrivateWrapper />}>
				<Route path="/*" element={<MainPage />}>
					<Route index element={<TodoPage />} />
					<Route path="todo" element={<TodoPage />} />
					<Route path="profile" element={<ProfilePage />} />
				</Route>
			</Route>
		</Routes>
	);
};

export default AppRouter;
