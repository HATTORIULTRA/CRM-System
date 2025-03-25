import { FC, ReactNode, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FormProps, Button, Form, Input } from "antd";

import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import {
	resLoginErrorNotification,
	successLoginNotification,
} from "../../helpers/notification.helper.ts";
import { loginUser } from "../../store/slices/authSlice.ts";
import { AuthData } from "../../types/IAuth.ts";

const Login: FC = (): ReactNode => {
	const [form] = Form.useForm();
	const dispatch = useAppDispatch();
	const isAuth = useAppSelector((state) => state.auth.token);
	const status = useAppSelector((state) => state.auth.status);
	const isLoading = useAppSelector((state) => state.auth.isLoading);
	const navigate = useNavigate();

	const onFinish: FormProps<AuthData>["onFinish"] = (values) => {
		try {
			dispatch(loginUser(values));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (isAuth !== null) {
			successLoginNotification();
			navigate("/");
		}
	}, [isAuth]);

	useEffect(() => {
		if (status === 401) {
			resLoginErrorNotification();
		}
	}, [status]);

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
					rules={[
						{
							required: true,
							message: "Введите логин!",
						},
						{
							min: 2,
							message: "Количество символов должно быть больше 2!",
						},
						{
							max: 60,
							message: "Количество символов должно быть меньше 60!",
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
					rules={[
						{
							required: true,
							message: "Введите пароль!",
						},
						{
							min: 2,
							message: "Количество символов должно быть больше 2!",
						},
						{
							max: 60,
							message: "Количество символов должно быть меньше 60!",
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
			<h2>
				Нет аккаунта? <Link to="/auth/register">Зарегистрироваться</Link>
			</h2>
		</>
	);
};

export default Login;
