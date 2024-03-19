import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

import { fail, redirect } from '@sveltejs/kit';

const SALT_ROUNDS = 10;

const USERNAME_EMPTY = { error: true, field: 'username', message: 'username is empty' };
const USERNAME_EXISTS = { error: true, field: 'username', message: 'user alreay exists' };

const PASSWORD_EMPTY = { error: true, field: 'password', message: 'password is empty' };
const PASSWORDS_MISMATCH = { error: true, field: 'password', message: 'passwords do not match' };

const REPEAT_PASSWORD_EMPTY = {
	error: true,
	field: 'repeat-password',
	message: 'repeat password is empty'
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		if (!username) {
			return fail(400, USERNAME_EMPTY);
		}

		const password = data.get('password')?.toString();
		if (!password) {
			return fail(400, PASSWORD_EMPTY);
		}

		const repeatPassword = data.get('repeat-password');
		if (!repeatPassword) {
			return fail(400, REPEAT_PASSWORD_EMPTY);
		}

		if (password !== repeatPassword) {
			return fail(400, PASSWORDS_MISMATCH);
		}

		const existingUser = await locals.usersDatabase.findByUsername(username);
		if (existingUser) {
			return fail(400, USERNAME_EXISTS);
		}

		const newUser = { id: randomUUID(), username, preferences: locals.session.preferences };
		const hash = await bcrypt.hash(password, SALT_ROUNDS);
		const newPassword = { userId: newUser.id, hash };

		locals.session.userId = newUser.id;
		locals.user = newUser;

		await Promise.all([
			locals.passwordsDatabase.insert(newPassword),
			locals.sessionsDatabase.update(locals.session),
			locals.usersDatabase.insert(newUser)
		]);

		return redirect(303, '/');
	}
};
