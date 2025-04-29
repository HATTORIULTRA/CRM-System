import { FC, ReactNode, useEffect } from "react";
import { Button, notification } from "antd";

import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import { getUserProfile, logoutUser } from "../../store/slices/authSlice.ts";
import s from "./ProfilePage.module.scss";

const ProfilePage: FC = (): ReactNode => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  console.log(user);

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
        <h2 className={s.title}>Profile</h2>
        <h2 className={s.userData}>Имя: {user?.username}</h2>
        <h2 className={s.userData}>Почта: {user?.email}</h2>
        <h3 className={s.userData}>
          Телефон:{" "}
          {user?.phoneNumber.length === 0
            ? "Номер не указан"
            : user?.phoneNumber}
        </h3>
        <div className={s.roles}>
          Роли: {user?.roles.map((item) => <h3 key={item}>{item}</h3>)}
        </div>
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
