<script>
	import { formatDistance } from 'date-fns';
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

<time datetime={value.toLocaleString()}>{formatDistance(value, now, { addSuffix: true })}</time>
