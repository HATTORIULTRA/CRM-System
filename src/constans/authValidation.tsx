export const USERNAME_LENGTH_RULES = {
  min: 2,
  messageMin: "Количество символов должно быть больше 2!",
  max: 24,
  messageMax: "Количество символов должно быть меньше 24!",
};

export const USERNAME_PATTERN_RULE = {
  pattern: /^[a-zA-Z0-9а-яА-ЯёЁ.,!?() ]/,
  message: "Только латинские буквы и цифры!",
};

export const LOGIN_PATTERN_RULE = {
  pattern: /^[A-Za-z]+$/,
  message: "Только латинский алфавит!",
};

export const PASSWORD_LENGTH_RULE = {
  min: 6,
  messageMin: "Количество символов должно быть меньше 6!",
  max: 24,
  messageMax: "Количество символов должно быть больше 24!",
};

export const PHONE_NUMBER_RULE = {
  pattern: /^\+7\d{10}$/,
  message: 'Номер должен быть формата "+7999..."!',
};