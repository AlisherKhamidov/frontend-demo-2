import Credentials from './types/Credentials';
import RegisterData from './types/RegisterData';
import User from './types/User';

const BASE_URL: string = import.meta.env.VITE_PRODUCTION_SERVER || '';

export async function user(): Promise<{
	id: number;
	email: string;
	role: string;
}> {
	const res = await fetch(`${BASE_URL}/api/users/my/profile`, {
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
		headers: {
			accept: 'application/json',
		},
	});
	if (res.status >= 400) {
		const { message }: { message: string } = await res.json();
		throw new Error(message);
	}
	res.headers.forEach((value, key) => {
		console.log(key, value);
	});
	const cookie = res.headers.get('set-cookie');
	console.log('set-cookie header value: ', cookie);
	return res.json();
}

export async function login(credentials: Credentials): Promise<User> {
	const res = await fetch(`${BASE_URL}/api/login`, {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		body: `username=${credentials.email}&password=${credentials.password}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});
	// реджектим промис если вернулся ошибочный статус
	if (res.status >= 400) {
		// достаем текст ошибки из ответа
		const { message }: { message: string } = await res.json();
		throw new Error(message);
	}
	return res.json();
}

export async function register(data: RegisterData): Promise<{ id: number; email: string }> {
	const res = await fetch(`${BASE_URL}/api/register`, {
		method: 'POST',
		body: JSON.stringify(data),
		mode: 'cors',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	interface Error {
		message: string;
		field: string;
		rejectedValue: string;
	}
	if (res.status >= 400) {
		const { errors }: { errors: Error[] } = await res.json();
		errors.forEach((err) => {
			throw new Error(`${err.field} ${err.rejectedValue} ${err.message}`);
		});
	}
	return res.json();
}

export async function logout(): Promise<void> {
	await fetch(`${BASE_URL}/api/logout`, {
		method: 'PUT',
		mode: 'cors',
		credentials: 'include',
	});
}
