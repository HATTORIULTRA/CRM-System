import { FC, ReactNode } from "react";
import { FormProps, Button, Form, Input } from "antd";

import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import { loginUser } from "../../store/slices/authSlice.ts";
import { AuthData } from "../../types/auth.ts";
import {
  PASSWORD_LENGTH_RULE,
  USERNAME_LENGTH_RULES,
} from "../../constans/validation.ts";

const Login: FC = (): ReactNode => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const onFinish: FormProps<AuthData>["onFinish"] = (values) => {
    try {
      dispatch(loginUser(values));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        style={{ minWidth: 420 }}
      >
        <Form.Item
          label="Login"
          name="login"
          initialValue={""}
          rules={[
            {
              required: true,
              message: "Введите логин!",
            },
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
              message: "Email должен быть без пробелов!",
            },
          ]}
        >
          <Input placeholder="enter your email" style={{ minHeight: 45 }} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          initialValue={""}
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
        >
          <Input.Password
            placeholder="enter your password"
            style={{ minHeight: 45 }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            style={{
              minWidth: 420,
              minHeight: 50,
              backgroundColor: "#7F265B",
              fontWeight: "bold",
              fontSize: 18,
            }}
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
