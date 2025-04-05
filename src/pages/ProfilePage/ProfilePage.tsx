import { FC, ReactNode, useEffect } from "react";
import { Button, notification } from "antd";

import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import { getUserProfile, logoutUser } from "../../store/slices/authSlice.ts";
import s from "./ProfilePage.module.scss";

const ProfilePage: FC = (): ReactNode => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const onLogoutClick = async () => {
    await dispatch(logoutUser());
    notification.config({ maxCount: 3 });
    notification.success({
      message: "Выход",
      description: "Вы вышли из аккаунта.",
      placement: "bottomRight",
      duration: 4,
    });
  };

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);

  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <h2>Profile</h2>
        <h2>Имя: {user?.username}</h2>
        <h3>Почта: {user?.email}</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          Роли: {user?.roles.map((item) => <h3 key={item}>{item}</h3>)}
        </div>
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
