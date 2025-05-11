

export const TODO_VALUE_RULE = {
  min: 2,
  messageMin: "Количество символов должно быть больше 2!",
  max: 64,
  messageMax: "Количество символов должно быть меньше 64!",
  pattern: /^[a-zA-Z0-9а-яА-ЯёЁ.,!?() ]/,
  messagePattern: "Только латинские буквы и цифры!",
};
