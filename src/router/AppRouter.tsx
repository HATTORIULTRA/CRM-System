import { FC, ReactNode } from "react";
import { Route, Routes } from "react-router";

import { useAppSelector } from "../hooks/redux.ts";
import { Roles } from "../types/IAdmin.ts";

import AuthLayout from "../layouts/AuthLayout/AuthLayout.tsx";
import MainLayout from "../layouts/MainLayout/MainLayout.tsx";
import PrivateWrapper from "../components/PrivateWrapper/PrivateWrapper.tsx";
import PublicWrapper from "../components/PublicWrapper/PublicWrapper.tsx";
import Register from "../components/Register/Register.tsx";
import Login from "../components/Login/Login.tsx";
import TodoPage from "../pages/TodoPage/TodoPage.tsx";
import ProfilePage from "../pages/ProfilePage/ProfilePage.tsx";
import ErrorPage from "../pages/ErrorPage/ErrorPage.tsx";
import UsersPage from "../pages/UsersPage/UsersPage.tsx";
import UserProfilePage from "../pages/UserProfilePage/UserProfilePage.tsx";

const AppRouter: FC = (): ReactNode => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      <Route element={<PublicWrapper />}>
        <Route path="/auth/*" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Route>

      <Route element={<PrivateWrapper />}>
        <Route path="/*" element={<MainLayout />}>
          <Route index element={<TodoPage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:userId" element={<UserProfilePage />} />
          {(user && user.roles.includes(Roles.ADMIN)) ||
          (user && user.roles.includes(Roles.MODERATOR)) ? (
            <Route path="users" element={<UsersPage />} />
          ) : (
            <Route path="*" element={<ErrorPage />} />
          )}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
