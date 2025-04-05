import { FC, ReactNode } from "react";
import { Route, Routes } from "react-router";

import AuthLayout from "../layouts/AuthLayout/AuthLayout.tsx";
import MainLayout from "../layouts/MainLayout/MainLayout.tsx";
import TodoPage from "../pages/TodoPage/TodoPage.tsx";
import ProfilePage from "../pages/ProfilePage/ProfilePage.tsx";
import PrivateWrapper from "../components/PrivateWrapper/PrivateWrapper.tsx";
import PublicWrapper from "../components/PublicWrapper/PublicWrapper.tsx";
import Register from "../components/Register/Register.tsx";
import Login from "../components/Login/Login.tsx";
import ErrorPage from "../pages/ErrorPage/ErrorPage.tsx";

const AppRouter: FC = (): ReactNode => {
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
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
