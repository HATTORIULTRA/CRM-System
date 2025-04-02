import { FC, ReactNode, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import { checkAuth } from "../../store/slices/authSlice.ts";

const PrivateWrapper: FC = (): ReactNode => {
  const { isAuth } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuth) {
      dispatch(checkAuth());
    }
  }, []);

  return isAuth ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default PrivateWrapper;
