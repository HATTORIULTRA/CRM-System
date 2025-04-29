import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Button, Form, Input, notification } from "antd";

import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import {
  retrieveUsersProfile,
  updateUserProfile,
} from "../../store/slices/adminSlice.ts";
import { UserRequest } from "../../types/IAdmin.ts";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.tsx";
import s from "./UserProfilePage.module.scss";

const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const { userProfile, isLoading } = useAppSelector((state) => state.admin);

  const [activeEdit, setActiveEdit] = useState(false);
  const [form] = Form.useForm();
  const { userId } = useParams();

  if (!userId) {
    return <h1>Ошибка! Нет ID пользователя.</h1>;
  }

  const onFinish = async (values: UserRequest) => {
    console.log(values);
    const { username, email, phoneNumber } = values;
    const newValues: UserRequest = {};
    if (username !== userProfile?.username) {
      newValues.username = username;
    }
    if (email !== userProfile?.email) {
      newValues.email = email;
    }
    if (phoneNumber !== userProfile?.phoneNumber) {
      newValues.phoneNumber = phoneNumber;
    }
    if (Object.keys(newValues).length > 0) {
      await dispatch(updateUserProfile({ userId: +userId, values: newValues }));
      await dispatch(retrieveUsersProfile(+userId));
      setActiveEdit(false);
    } else {
      setActiveEdit(false);
    }
  };

  useEffect(() => {
    const initializeUserProfile = async () => {
      try {
        await dispatch(retrieveUsersProfile(+userId));
      } catch (e) {
        console.log(e);
        notification.config({ maxCount: 3 });
        notification.error({
          message: "Ошибка загрузки профиля",
          description: "Попробуйте позже",
          placement: "bottomRight",
          duration: 3,
        });
      }
    };

    initializeUserProfile();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {activeEdit ? (
        <div>
          <h1>Режим редактирования</h1>
          <Form
            form={form}
            name="basic"
            layout="inline"
            autoComplete="off"
            onFinish={onFinish}
            initialValues={{
              username: userProfile?.username,
              email: userProfile?.email,
              phoneNumber: userProfile?.phoneNumber,
            }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  min: 2,
                  message: "Количество символов должно быть больше 2!",
                },
                {
                  max: 24,
                  message: "Количество символов должно быть меньше 24!",
                },
                {
                  whitespace: true,
                  message: "Имя не может состоять из пробелов!",
                },
                {
                  required: true,
                  message: "Username обязателен!",
                },
                {
                  pattern: /^[a-zA-Z0-9а-яА-ЯёЁ.,!?() ]/,
                  message: "Только латинские буквы и цифры!",
                },
              ]}
            >
              <Input className={s.input} />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ type: "email", message: "Некорректный email!" }]}
            >
              <Input className={s.input} />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  pattern: /^\+7\d{10}$/,
                  message: 'Номер должен быть формата "+7999..."!',
                },
              ]}
            >
              <Input className={s.input} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>

          <Button danger variant="solid" onClick={() => setActiveEdit(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className={s.wrapper}>
          <h2 className={s.title}>Профиль пользователя</h2>
          <h3 className={s.userData}>
            Имя пользователя: {userProfile?.username}
          </h3>
          <h3 className={s.userData}>
            Почта пользователя: {userProfile?.email}
          </h3>
          <h3 className={s.userData}>
            Номер телефона пользователя:{" "}
            {!userProfile?.phoneNumber
              ? "Номер не указан"
              : userProfile?.phoneNumber}
          </h3>
          <div className={s.roles}>
            Роли: {userProfile?.roles.map((item) => <h3 key={item}>{item}</h3>)}
          </div>
          <Button
            onClick={() => setActiveEdit(true)}
            type="primary"
            color={"primary"}
          >
            Edit
          </Button>
        </div>
      )}
      <Link to={"/users"}>Назад</Link>
    </div>
  );
};

export default UserProfilePage;
