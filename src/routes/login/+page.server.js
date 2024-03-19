import bcrypt from 'bcrypt';

import { fail, redirect } from '@sveltejs/kit';

const USERNAME_EMPTY = { error: true, field: 'username', message: 'username is empty' };

const PASSWORD_EMPTY = { error: true, field: 'password', message: 'password is empty' };
const PASSWORD_INCORRECT = { error: true, field: 'password', message: 'incorrect password' };

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

		const existingUser = await locals.usersDatabase.findByUsername(username);
		if (!existingUser) {
			return fail(400, PASSWORD_INCORRECT);
		}

		const existingPassword = await locals.passwordsDatabase.findByUserId(existingUser.id);
		if (!existingPassword) {
			return fail(400, PASSWORD_INCORRECT);
		}
		const isValid = await bcrypt.compare(password, existingPassword.hash);
		if (!isValid) {
			return fail(400, PASSWORD_INCORRECT);
		}

		locals.session.userId = existingUser.id;
		locals.user = existingUser;

		await locals.sessionsDatabase.update(locals.session);

		return redirect(303, '/');
	}
};
