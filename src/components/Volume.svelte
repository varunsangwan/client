<script>

	import { onMount } from 'svelte'

	import { getVolume } from '../lib/api'
	import { BASE_SYMBOL } from '../lib/constants'
	import { activateProductPrices } from '../lib/helpers'
	import { formatToDisplay } from '../lib/utils'

	import { prices } from '../stores/prices'

	let volume;

	onMount(async () => {
		activateProductPrices(1); // ETH-USD
		const res = await getVolume();
		volume = res.volume;
	});

</script>

<style>

	.volume {
		color: var(--gray);
		text-align: center;
		font-size: 80%;
	}

</style>

<div class='volume'>
	Volume: {#if volume}
		{formatToDisplay(volume)} {BASE_SYMBOL} {#if $prices[1]}(${formatToDisplay($prices[1] * volume)}){/if}
	{:else}...
	{/if}
</div>