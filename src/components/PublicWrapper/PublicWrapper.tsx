import { FC, ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../hooks/redux.ts";

const PublicWrapper: FC = (): ReactNode => {
  const { isAuth } = useAppSelector((state) => state.auth);

  return isAuth ? <Navigate to="/" /> : <Outlet />;
};

export default PublicWrapper;
