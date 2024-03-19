<script>
	export let form;

	$: isUsernameError = form && form.error && form.field == 'username';
	$: isPasswordError = form && form.error && form.field == 'password';
</script>

<form method="POST">
	<fieldset>
		<input
			aria-invalid={isUsernameError ? true : undefined}
			aria-describedby="username-invalid-helper"
			required
			name="username"
			placeholder="username"
			autocomplete="username"
		/>
		{#if form && isUsernameError}
			<small id="username-invalid-helper">{form.message}</small>
		{/if}

		<input
			aria-invalid={isPasswordError}
			aria-describedby="password-invalid-helper"
			required
			type="password"
			name="password"
			placeholder="password"
		/>
		{#if form && isPasswordError}
			<small id="password-invalid-helper">{form.message}</small>
		{/if}
	</fieldset>

	<input type="submit" value="login" />
</form>

<p>
	<small>
		do not have an account?
		<a href="/signup">signup</a>
	</small>
</p>
