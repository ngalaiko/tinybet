<script>
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	const currentCurrency = derived(page, ($page) => {
		return (
			$page.data.user?.preferences.displayCurrency || $page.data.session.preferences.displayCurrency
		);
	});
</script>

<details class="dropdown">
	<summary>{$currentCurrency}</summary>
	<ul>
		<li>
			<form
				method="POST"
				action="/?/displayCurrency&redirectTo={encodeURIComponent($page.url.pathname)}"
			>
				<input value="SEK" hidden name="currency" />
				<input type="submit" value="SEK" class="secondary" />
			</form>
		</li>
		<li>
			<form
				method="POST"
				action="/?/displayCurrency&redirectTo={encodeURIComponent($page.url.pathname)}"
			>
				<input value="EUR" hidden name="currency" />
				<input type="submit" value="EUR" class="secondary" />
			</form>
		</li>
		<li>
			<form
				method="POST"
				action="/?/displayCurrency&redirectTo={encodeURIComponent($page.url.pathname)}"
			>
				<input value="GBP" hidden name="currency" />
				<input type="submit" value="GBP" class="secondary" />
			</form>
		</li>
	</ul>
</details>
