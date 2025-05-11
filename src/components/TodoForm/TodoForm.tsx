import { FC, ReactNode } from "react";
import { Button, Form, Input } from "antd";

import { addNewTodo } from "../../api/todosAPI.ts";
import { TodoInfo } from "../../types/apiTypes.ts";
import s from "./TodoForm.module.scss";
import { TODO_VALUE_RULE } from "../../constans/todoValidation.ts";

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
              min: TODO_VALUE_RULE.min,
              message: TODO_VALUE_RULE.messageMin,
            },
            {
              max: TODO_VALUE_RULE.max,
              message: TODO_VALUE_RULE.messageMax,
            },
            {
              whitespace: true,
              message: "Название не может состоять из пробелов!",
            },
            {
              pattern: TODO_VALUE_RULE.pattern,
              message: TODO_VALUE_RULE.messagePattern,
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
