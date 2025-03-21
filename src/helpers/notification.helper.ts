import { notification } from "antd";

export const userExistNotification = () => {
	notification.config({ maxCount: 1 });
	notification.error({
		message: "Ошибка",
		description: "Такой пользователь уже существует!",
		placement: "bottomRight",
		duration: 4,
	});
};

export const wrongReqNotification = () => {
	notification.config({ maxCount: 1 });
	notification.error({
		message: "Упс",
		description: "Неизвестная ошибка, повторите попытку.",
		placement: "bottomRight",
		duration: 4,
	});
};

export const resErrorNotification = () => {
	notification.config({ maxCount: 1 });
	notification.error({
		message: "Упс",
		description: "Ошибка сервера, повторите попытку.",
		placement: "bottomRight",
		duration: 4,
	});
};

export const resLoginErrorNotification = () => {
	notification.config({ maxCount: 1 });
	notification.error({
		message: "Ошибка",
		description: "Неверные данные пользователя.",
		placement: "bottomRight",
		duration: 4,
	});
};

export const registerSuccessNotification = () => {
	notification.config({ maxCount: 1 });
	notification.success({
		message: "Успех",
		description: "Вы успешно зарегистрировались.",
		placement: "bottomRight",
		duration: 4,
	});
};

export const successLoginNotification = () => {
	notification.config({ maxCount: 1 });
	notification.success({
		message: "Успех",
		description: "Вы авторизовались!",
		placement: "bottomRight",
		duration: 3,
	});
};
