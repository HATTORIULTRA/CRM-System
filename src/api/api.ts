import axios from "axios";
import { MetaResponse, TodoInfo, Todo, TodoRequest } from "../types/types.ts";

const instance = axios.create({
	baseURL: "https://easydev.club/api/v2",
});

export const requestFilteredTodos = async (
	filter: keyof TodoInfo
): Promise<MetaResponse<Todo, TodoInfo>> => {
	try {
		const res = await instance.get(`/todos`, {
			params: {
				filter,
			},
		});
		return res.data;
	} catch (error) {
		console.log("Cant fetch data", error);
		throw error;
	}
};

export const addNewTodo = async (todo: TodoRequest) => {
	try {
		await instance.post(`/todos`, {
			title: todo.title,
		});
	} catch (error) {
		console.log("Cant add new todo", error);
		throw error;
	}
};

export const deleteTodo = async (id: number) => {
	try {
		await instance.delete(`/todos/${id}`);
	} catch (error) {
		console.log("Cant delete todo", error);
		throw error;
	}
};

export const completeTodo = async (id: number, todo: TodoRequest) => {
	try {
		await instance.put(`/todos/${id}`, {
			...todo,
		});
	} catch (error) {
		console.log("Cant complete todo", error);
		throw error;
	}
};
