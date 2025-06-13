import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Button, Form, Input, notification, Tag, Typography } from "antd";

import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import {
  getUserByID,
  updateUserProfile,
} from "../../store/slices/adminSlice.ts";
import { UserRequest } from "../../types/admin.ts";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.tsx";
import s from "./UserProfilePage.module.scss";
import isDirtyHelper from "../../helpers/isDirty.helper.ts";
import { PHONE_NUMBER_RULE, USERNAME_LENGTH_RULES, USERNAME_PATTERN_RULE } from "../../constans/authValidation.tsx";

const UserProfilePage = () => {
  const { Title, Text } = Typography;

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
    const newValues = isDirtyHelper(userProfile!, values);
    if (Object.keys(newValues).length > 0) {
      await dispatch(updateUserProfile({ userId: +userId, values: newValues }));
      await dispatch(getUserByID(+userId));
      setActiveEdit(false);
    } else {
      setActiveEdit(false);
    }
  };

  useEffect(() => {
    const initializeUserProfile = async () => {
      try {
        await dispatch(getUserByID(+userId));
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
                  min: USERNAME_LENGTH_RULES.min,
                  message: USERNAME_LENGTH_RULES.messageMin,
                },
                {
                  max: USERNAME_LENGTH_RULES.max,
                  message: USERNAME_LENGTH_RULES.messageMax,
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
                  pattern: USERNAME_PATTERN_RULE.pattern,
                  message: USERNAME_PATTERN_RULE.message,
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
                  pattern: PHONE_NUMBER_RULE.pattern,
                  message: PHONE_NUMBER_RULE.message,
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
          <Title className={s.title}>Профиль пользователя</Title>
          <Text className={s.userData}>
            Имя пользователя: {userProfile?.username}
          </Text>
          <Text className={s.userData}>
            Почта пользователя: {userProfile?.email}
          </Text>
          <Text className={s.userData}>
            Номер телефона пользователя:{" "}
            {!userProfile?.phoneNumber
              ? "Номер не указан"
              : userProfile?.phoneNumber}
          </Text>
          <div className={s.roles}>
            Роли:{" "}
            {userProfile?.roles.map((item) => <Tag key={item}>{item}</Tag>)}
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
      <Link style={{ marginLeft: "20px" }} to={"/users"}>
        Назад
      </Link>
    </div>
  );
};

export default UserProfilePage;
