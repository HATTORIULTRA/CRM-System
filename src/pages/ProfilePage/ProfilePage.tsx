import { FC, ReactNode, useEffect } from "react";
import { Button, notification, Tag, Typography } from "antd";

import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import { getUserProfile, logoutUser } from "../../store/slices/authSlice.ts";
import s from "./ProfilePage.module.scss";

const ProfilePage: FC = (): ReactNode => {
  const { Title, Text } = Typography;
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
        <Title>Profile</Title>
        <Text className={s.userData}>Имя: {user?.username}</Text>
        <Text className={s.userData}>Почта: {user?.email}</Text>
        <Text className={s.userData}>
          Телефон:{" "}
          {user?.phoneNumber.length === 0
            ? "Номер не указан"
            : user?.phoneNumber}
        </Text>
        <div className={s.roles}>
          Роли: {user?.roles.map((item) => <Tag key={item}>{item}</Tag>)}
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
