import { AxiosRequestConfig } from "axios";

export interface UserRegistration {
	login: string;
	username: string;
	password: string;
	email: string;
	phoneNumber?: string;
}

export interface AuthData {
	login: string;
	password: string;
}

export interface Profile {
	id: number;
	username: string;
	email: string;
	date: string;
	isBlocked: boolean;
	roles: string[];
	phoneNumber: string;
}

export interface ProfileRequest {
	username: string;
	email: string;
	phoneNumber: string;
}

export interface PasswordRequest {
	password: string;
}

export interface Token {
	accessToken: string;
	refreshToken: string;
}

export type KnownError = {
	data: string;
	config?: any;
	headers?: any;
	request?: any;
	status: number;
	statusText?: string;
};

export interface AxiosResponse<T = any> {
	data: T;
	status: number;
	statusText: string;
	headers: any;
	config: AxiosRequestConfig;
	request?: any;
}

export interface IAuthState {
	user: Profile | null;
	isLoading: boolean;
	token: string | null;
	isAuth: boolean;
	status: number | null;
}
