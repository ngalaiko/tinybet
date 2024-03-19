<script>
	import LotsList from '$lib/components/LotsList.svelte';
	export let data;
</script>

<LotsList lots={data.lots} />
