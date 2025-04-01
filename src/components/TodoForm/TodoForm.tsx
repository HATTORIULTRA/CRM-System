import { FC, ReactNode } from "react";
import { Button, Form, Input } from "antd";

import { addNewTodo } from "../../api/todosAPI.ts";
import { TodoInfo } from "../../types/apiTypes.ts";
import s from "./TodoForm.module.scss";

interface TodoFormProps {
  fetchTodos: () => void;
}

const TodoForm: FC<TodoFormProps> = ({ fetchTodos }): ReactNode => {
  const [form] = Form.useForm();

  const onFinish = async (values: TodoInfo) => {
    try {
      await addNewTodo({ ...values, isDone: false });
      await fetchTodos();
      form.resetFields();
    } catch (error) {
      console.log("Cant add new todo", error);
    }
  };

  return (
    <div className={s.formWrapper}>
      <Form
        className={s.form}
        form={form}
        name="basic"
        layout="inline"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          rules={[
            {
              required: true,
              message: "Введите название todo!",
            },
            {
              min: 2,
              message: "Количество символов должно быть больше 2!",
            },
            {
              max: 64,
              message: "Количество символов должно быть меньше 64!",
            },
            {
              whitespace: true,
              message: "Название не может состоять из пробелов!",
            },
            {
              pattern: /^[a-zA-Z0-9а-яА-ЯёЁ.,!?() ]/,
              message: "Только латинские буквы и цифры!",
            },
          ]}
        >
          <Input className={s.input} placeholder={"Task To Be Done..."} />
        </Form.Item>

        <Form.Item>
          <Button className={s.button} type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TodoForm;
