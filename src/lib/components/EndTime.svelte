<script>
	import { compareAsc, formatDistance } from 'date-fns';
	import { onMount } from 'svelte';

	/**
	 * @type {Date}
	 */
	export let value;

	let now = new Date();

	onMount(() => {
		const interval = setInterval(() => {
			now = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

{#if compareAsc(value, now) === -1}
	ended <time datetime={value.toLocaleString()}
		>{formatDistance(value, now, { addSuffix: true })}</time
	>
{:else}
	ends <time datetime={value.toLocaleString()}
		>{formatDistance(value, now, { addSuffix: true })}</time
	>
{/if}
