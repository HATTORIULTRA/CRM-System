import { FC, ReactNode } from "react";
import { Link } from "react-router";
import { Button, Form, FormProps, Input } from "antd";

import { registerUser } from "../../store/slices/authSlice.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import { UserRegistration } from "../../types/auth.ts";
import {
  LOGIN_PATTERN_RULE,
  PASSWORD_LENGTH_RULE,
  PHONE_NUMBER_RULE,
  USERNAME_LENGTH_RULES,
  USERNAME_PATTERN_RULE,
} from "../../constans/validation.ts";

const Register: FC = (): ReactNode => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { status, isLoading } = useAppSelector((state) => state.auth);

  const onFinish: FormProps<UserRegistration>["onFinish"] = (values) => {
    try {
      dispatch(registerUser(values));
    } catch (error) {
      console.log("Register finish form error", error);
    }
  };

  return (
    <>
      {status === 201 ? (
        <div>
          <h1>Вы успешно зарегистрировались</h1>
          <Link to="/auth/login">Войти в аккаунт</Link>
        </div>
      ) : (
        <>
          <Form
            layout="vertical"
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
              prefix: "+7",
            }}
            style={{ minWidth: 420 }}
            scrollToFirstError
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Введите имя пользователя!",
                  whitespace: true,
                },
                {
                  pattern: USERNAME_PATTERN_RULE.pattern,
                  message: USERNAME_PATTERN_RULE.message,
                },
                {
                  min: USERNAME_LENGTH_RULES.min,
                  message: USERNAME_LENGTH_RULES.messageMin,
                },
                {
                  max: USERNAME_LENGTH_RULES.max,
                  message: USERNAME_LENGTH_RULES.messageMax,
                },
              ]}
            >
              <Input style={{ minHeight: 45 }} />
            </Form.Item>

            <Form.Item
              name="login"
              label="Login"
              rules={[
                {
                  required: true,
                  message: "Введите свой логин!",
                  whitespace: true,
                },
                {
                  pattern: LOGIN_PATTERN_RULE.pattern,
                  message: LOGIN_PATTERN_RULE.message,
                },
                {
                  min: USERNAME_LENGTH_RULES.min,
                  message: USERNAME_LENGTH_RULES.messageMin,
                },
                {
                  max: USERNAME_LENGTH_RULES.max,
                  message: USERNAME_LENGTH_RULES.messageMax,
                },
              ]}
            >
              <Input style={{ minHeight: 45 }} />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Введите пароль!",
                },
                {
                  min: PASSWORD_LENGTH_RULE.min,
                  message: PASSWORD_LENGTH_RULE.messageMin,
                },
                {
                  max: PASSWORD_LENGTH_RULE.max,
                  message: PASSWORD_LENGTH_RULE.messageMax,
                },
              ]}
              hasFeedback
            >
              <Input.Password style={{ minHeight: 45 }} />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Подтвердите ваш пароль!",
                },
                {
                  min: PASSWORD_LENGTH_RULE.min,
                  message: PASSWORD_LENGTH_RULE.messageMin,
                },
                {
                  max: PASSWORD_LENGTH_RULE.max,
                  message: PASSWORD_LENGTH_RULE.messageMax,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Пароли должны совпадать!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password style={{ minHeight: 45 }} />
            </Form.Item>

            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "Введите корректный E-mail!",
                },
                {
                  required: true,
                  message: "Введите Ваш E-mail!",
                },
              ]}
            >
              <Input style={{ minHeight: 45 }} />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                {
                  pattern: PHONE_NUMBER_RULE.pattern,
                  message: PHONE_NUMBER_RULE.message,
                },
              ]}
            >
              <Input style={{ width: "100%", minHeight: 45 }} />
            </Form.Item>

            <Form.Item>
              <Button
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  minWidth: 420,
                  minHeight: 50,
                  backgroundColor: "#7F265B",
                }}
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};

export default Register;
