<script>
	import { page } from '$app/stores';
	import CurrencySelector from '$lib/components/CurrencySelector.svelte';

	export let data;
</script>

<header>
	<nav>
		<ul>
			<li><strong><a href="/" class="contrast">tinybet</a></strong></li>
		</ul>
		<ul>
			<li>
				<CurrencySelector />
			</li>
			{#if data.user == null}
				<li>
					<a aria-current={$page.url.pathname == '/login' ? 'page' : 'false'} href="/login">
						login
					</a>
				</li>
			{:else}
				<li>
					<a aria-current={$page.url.pathname == '/lots/new' ? 'page' : 'false'} href="/lots/new"
						>new lot</a
					>
				</li>
				<li>
					<a
						aria-current={$page.url.pathname == '/lots' ? 'page' : 'false'}
						href="/lots?userid={data.user.id}">your lots</a
					>
				</li>
				<li>
					<a href="/logout">logout</a>
				</li>
			{/if}
		</ul>
	</nav>
</header>

<main>
	<slot />
</main>
