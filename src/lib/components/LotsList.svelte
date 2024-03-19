<script>
	import { page } from '$app/stores';

	import EndTime from '$lib/components/EndTime.svelte';
	import Price from '$lib/components/Price.svelte';

	/** @type {import('$lib/types').Lot[]} */
	export let lots;
</script>

<table>
	<thead>
		<tr>
			<th scope="col">title</th>
			<th scope="col">bid</th>
			<th scope="col">ends</th>
		</tr>
	</thead>
	<tbody class="striped">
		{#each lots as lot}
			<tr>
				<th scope="row">
					<a class:contrast={lot.userId == $page.data.user?.id} href="/lots/{lot.id}">
						{lot.title}
					</a>
				</th>
				<td>
					<Price value={lot.highestBid?.value || lot.startingPrice} />
				</td>
				<td>
					<EndTime value={lot.endTime} />
				</td>
			</tr>
		{/each}
	</tbody>
</table>
