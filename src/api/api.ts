import axios from "axios";
import { MetaResponse, TodoInfo, Todo, TodoRequest } from "../types/types.ts";

const BASE_URL = "https://easydev.club/api/v2";
axios.defaults.baseURL = BASE_URL;

export const requestFilteredTodos = async (
	filter: keyof TodoInfo
): Promise<MetaResponse<Todo, TodoInfo>> => {
	try {
		const res = await axios.get(`/todos?filter=${filter}`);
		return res.data;
	} catch (error) {
		console.log("Cant fetch data", error);
		throw error;
	}
};

export const addNewTodo = async (todo: TodoRequest) => {
	try {
		await axios.post(`/todos`, {
			title: todo.title,
		});
	} catch (error) {
		console.log("Cant add new todo", error);
		throw error;
	}
};

export const deleteTodo = async (id: number) => {
	try {
		await axios.delete(`/todos/${id}`);
	} catch (error) {
		console.log("Cant delete todo", error);
		throw error;
	}
};

export const completeTodo = async (id: number, todo: TodoRequest) => {
	try {
		await axios.put(`/todos/${id}`, {
			...todo,
		});
	} catch (error) {
		console.log("Cant complete todo", error);
		throw error;
	}
};
