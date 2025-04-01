import { FC, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button, notification } from "antd";

import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import { getMe, logoutUser } from "../../store/slices/authSlice.ts";
import TokenHelper from "../../helpers/localStorage.helper.ts";
import s from "./ProfilePage.module.scss";

const ProfilePage: FC = (): ReactNode => {
  const tokenHelper = new TokenHelper();
  const navigate = useNavigate();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const onLogoutClick = async () => {
    await dispatch(logoutUser());
    navigate("/auth/login");
    showNotification();
    tokenHelper.removeTokenFromLocalStorage("accessToken");
    tokenHelper.removeTokenFromLocalStorage("refreshToken");
  };

  const showNotification = () => {
    notification.config({ maxCount: 1 });
    notification.success({
      message: "Выход",
      description: "Вы вышли из аккаунта.",
      placement: "bottomRight",
      duration: 3,
    });
  };

  useEffect(() => {
    dispatch(getMe());
  }, []);

  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <h2>Profile</h2>
        <h2>Имя: {user?.username}</h2>
        <h3>Почта: {user?.email}</h3>
        <h3>Роли: {user?.roles[0]}</h3>
        <h3>
          Телефон:{" "}
          {user?.phoneNumber.length === 0
            ? "Номер не указан"
            : user?.phoneNumber}
        </h3>
      </div>
      <Button
        onClick={onLogoutClick}
        style={{ width: 100, height: 40, fontSize: "18px" }}
        color="danger"
        variant="solid"
        loading={isLoading}
      >
        Выйти
      </Button>
    </div>
  );
};

export default ProfilePage;
