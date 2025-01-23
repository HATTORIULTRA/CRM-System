import { MetaResponse, TodoInfo, Todo, TodoRequest } from "../types/types.ts";

export const BASE_URL = "https://easydev.club/api/v2";

export const httpRequest = async (
	filter: string
): Promise<MetaResponse<Todo, TodoInfo>> => {
	const res = await fetch(`${BASE_URL}/todos?filter=${filter}`, {
		method: "GET",
		headers: {
			"Content-type": "application/json",
		},
	});
	return res.json();
};

export const addNewTodo = async (todo: TodoRequest) => {
	try {
		const res = await fetch(`${BASE_URL}/todos`, {
			method: "POST",
			body: JSON.stringify(todo),
			headers: {
				"Content-type": "application/json",
			},
		});
		return res.ok;
	} catch (e) {
		console.log("Cant add new todo", e);
	}
};

export const deleteTodo = async (id: number) => {
	try {
		const res = await fetch(`${BASE_URL}/todos/${id}`, {
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
			},
		});
		return res.ok;
	} catch (e) {
		console.log("Cant delete todo", e);
	}
};

export const completeTodo = async (id: number, todo: TodoRequest) => {
	try {
		const res = await fetch(`${BASE_URL}/todos/${id}`, {
			method: "PUT",
			body: JSON.stringify(todo),
			headers: {
				"Content-type": "application/json",
			},
		});
		return res.ok;
	} catch (e) {
		console.log("Cant complete todo", e);
	}
};
