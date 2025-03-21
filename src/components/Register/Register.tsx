import { FC, ReactNode, useEffect } from "react";
import { Link } from "react-router";
import { Button, Form, FormProps, Input } from "antd";

import { registerUser } from "../../store/slices/authSlice.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import { UserRegistration } from "../../types/IAuth.ts";
import {
	registerSuccessNotification,
	resErrorNotification,
	userExistNotification,
	wrongReqNotification,
} from "../../helpers/notification.helper.ts";

const Register: FC = (): ReactNode => {
	const [form] = Form.useForm();
	const dispatch = useAppDispatch();
	const { status } = useAppSelector((state) => state.auth);

	const onFinish: FormProps<UserRegistration>["onFinish"] = (values) => {
		console.log("Received values of form: ", values);
		try {
			dispatch(registerUser(values));
		} catch (error) {
			console.log("Register finish form error", error);
		}
	};

	useEffect(() => {
		if (status === 409) {
			userExistNotification();
		}
		if (status === 404) {
			wrongReqNotification();
		}
		if (status === 500) {
			resErrorNotification();
		}
		if (status === 200) {
			registerSuccessNotification();
		}
	}, [status]);

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
									pattern: /^[A-Za-zА-ЯЁа-яё]+$/,
									message: "Только латинский, либо русский алфавит!",
								},
								{
									min: 1,
									message: "Количество символов должно быть больше 1!",
								},
								{
									max: 60,
									message: "Количество символов должно быть меньше 60!",
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
									pattern: /^[A-Za-z]+$/,
									message: "Только латинский алфавит!",
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
									min: 6,
									message: "Количество символов должно быть больше 6!",
								},
								{
									max: 60,
									message: "Количество символов должно быть меньше 60!",
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
									min: 6,
									message: "Количество символов должно быть больше 6!",
								},
								{
									max: 60,
									message: "Количество символов должно быть меньше 60!",
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
									pattern: /^\+7\d{10}$/,
									message: 'Номер должен быть формата "+7999..."!',
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
							>
								Register
							</Button>
						</Form.Item>
					</Form>
					<h2>
						Уже есть аккаунт? <Link to="/auth/login">Войти</Link>
					</h2>
				</>
			)}
		</>
	);
};

export default Register;
