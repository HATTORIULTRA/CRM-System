import { FC, ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../hooks/redux.ts";

const PrivateWrapper: FC = (): ReactNode => {
  const { isAuth } = useAppSelector((state) => state.auth);

  return isAuth ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default PrivateWrapper;
