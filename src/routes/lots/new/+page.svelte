<script>
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	export let form;

	$: isTitleError = form && form.error && form.field == 'title';
	$: isStartingPriceError = form && form.error && form.field == 'starting-price';
	$: isEndTimeError = form && form.error && form.field == 'end-time';

	const displayCurrency = derived(page, ($page) => {
		return (
			$page.data.user?.preferences.displayCurrency || $page.data.session.preferences.displayCurrency
		);
	});
</script>

<form method="POST">
	<fieldset>
		<input
			aria-invalid={isTitleError ? true : undefined}
			aria-describedby="title-invalid-helper"
			required
			name="title"
			placeholder="title"
		/>
		{#if form && isTitleError}
			<small id="title-invalid-helper">{form.message}</small>
		{/if}

		<input
			aria-invalid={isEndTimeError ? true : undefined}
			aria-describedby="end-time-invalid-helper"
			required
			name="end-time"
			type="datetime-local"
		/>
		{#if form && isEndTimeError}
			<small id="end-time-invalid-helper">{form.message}</small>
		{/if}

		<div role="group">
			<input
				aria-invalid={isStartingPriceError ? true : undefined}
				aria-describedby="starting-price-invalid-helper"
				required
				name="starting-price"
				type="number"
				placeholder="100.0"
			/>

			<select id="currency" name="currency">
				<option selected={$displayCurrency == 'SEK'} value="SEK">SEK</option>
				<option selected={$displayCurrency == 'EUR'} value="EUR">EUR</option>
				<option selected={$displayCurrency == 'GBP'} value="GBP">GBP</option>
			</select>
		</div>
		{#if form && isStartingPriceError}
			<small id="starting-price-invalid-helper">{form.message}</small>
		{/if}
	</fieldset>

	<input type="submit" value="publish" />
</form>
