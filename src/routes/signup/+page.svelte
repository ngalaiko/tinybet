<script>
	export let form;

	$: isUsernameError = form && form.error && form.field == 'username';
	$: isPasswordError = form && form.error && form.field == 'password';
	$: isRepeatPasswordError = form && form.error && form.field == 'repeat-password';
</script>

<form method="POST">
	<fieldset>
		<input
			aria-invalid={isUsernameError ? true : undefined}
			aria-describedby="username-invalid-helper"
			name="username"
			required
			placeholder="username"
			autocomplete="username"
		/>
		{#if form && isUsernameError}
			<small id="username-invalid-helper">{form.message}</small>
		{/if}

		<input
			aria-invalid={isPasswordError}
			aria-describedby="password-invalid-helper"
			type="password"
			required
			name="password"
			placeholder="password"
		/>
		{#if form && isPasswordError}
			<small id="password-invalid-helper">{form.message}</small>
		{/if}

		<input
			aria-invalid={isRepeatPasswordError}
			aria-describedby="repeat-password-invalid-helper"
			name="repeat-password"
			required
			type="password"
			placeholder="repeat password"
		/>
		{#if form && isRepeatPasswordError}
			<small id="repeat-password-invalid-helper">{form.message}</small>
		{/if}
	</fieldset>

	<input type="submit" value="signup" />
</form>

<p>
	<small>
		already have an account?
		<a href="/login">login</a>
	</small>
</p>
