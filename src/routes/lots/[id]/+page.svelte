<script>
	import { page } from '$app/stores';
	import { compareAsc } from 'date-fns';

	import EndTime from '$lib/components/EndTime.svelte';
	import Price from '$lib/components/Price.svelte';
	import Distance from '$lib/components/Distance.svelte';
	import { onMount } from 'svelte';

	export let data;
	export let form;

	$: isLotIdError = form && form.error && form.field == 'lot-id';
	$: isAmountError = form && form.error && form.field == 'amount';
	$: isCurrencyError = form && form.error && form.field == 'currency';

	let hasEnded = data.lot && compareAsc(new Date(), new Date(data.lot.endTime)) === 1;
	onMount(() => {
		return setInterval(() => {
			hasEnded = data.lot && compareAsc(new Date(), new Date(data.lot.endTime)) === 1;
		}, 1000);
	});

	$: canBid = data.lot && data.user && data.user.id != data.lot.userId && !hasEnded;

	$: displayCurrency =
		$page.data.user?.preferences.displayCurrency || $page.data.session.preferences.displayCurrency;
</script>

{#if data.lot}
	<h2>
		{data.lot.title}
	</h2>

	<EndTime value={data.lot.endTime} />

	{#if canBid}
		<article>
			<form method="POST" action="?/bid">
				<fieldset>
					<input name="lot-id" hidden required value={data.lot.id} />

					<div role="group">
						<input
							aria-invalid={isAmountError ? true : undefined}
							aria-describedby="amount-invalid-helper"
							name="amount"
							type="number"
							required
							placeholder="100.0"
						/>

						<select
							aria-invalid={isCurrencyError ? true : undefined}
							aria-describedby="currency-invalid-helper"
							id="currency"
							name="currency"
						>
							<option selected={displayCurrency == 'SEK'} value="SEK">SEK</option>
							<option selected={displayCurrency == 'EUR'} value="EUR">EUR</option>
							<option selected={displayCurrency == 'GBP'} value="GBP">GBP</option>
						</select>
					</div>
					{#if form && isAmountError}
						<small id="amount-invalid-helper">{form.message}</small>
					{/if}
					{#if form && isCurrencyError}
						<small id="currency-invalid-helper">{form.message}</small>
					{/if}
					{#if form && isLotIdError}
						<small id="lot-id-invalid-helper">{form.message}</small>
					{/if}
				</fieldset>

				<input type="submit" value="bid" />
			</form>
		</article>
	{/if}

	<section>
		<ul>
			{#if hasEnded && data.lot.userId != data.user?.id}
				<li>
					{#if data.lot.highestBid && data.lot.highestBid.userId == data.user?.id}
						<strong>you won</strong>.
					{:else}
						<strong>you lost</strong>.
						{#if data.lot.highestBid}
							<span>highest bid was <Price value={data.lot.highestBid.value} /></span>
						{/if}
					{/if}
				</li>
			{/if}
			{#each data.bids as bid}
				<li>
					{#if data.user?.id == bid.userId}
						<strong>you</strong>
					{:else}
						<span>someone</span>
					{/if}
					bidded
					<Price value={bid.value} />
					<Distance value={bid.createdAt} />
				</li>
			{/each}
			<li>
				starting price <Price value={data.lot.startingPrice} />
			</li>
		</ul>
	</section>
{/if}
