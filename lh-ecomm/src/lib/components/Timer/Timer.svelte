<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';

	import { DateTime } from 'luxon';
	import type { DurationUnit } from 'luxon';

	export let dueDate: Date | null;
	export let includeDays = false;
	export let size: 'small' | 'big' = 'big';

	const bigClass = 'py-3 px-4 md:justify-center w-full';
	const smallClass = `py-2 px-4 w-full xl:w-[440px]`;

	const endDate = dueDate ? DateTime.fromJSDate(dueDate) : DateTime.now();

	const diffUnit: Array<DurationUnit> = ['hours', 'minutes', 'seconds'];

	if (includeDays) {
		diffUnit.unshift('days');
	}

	let diff = endDate.diffNow(diffUnit).toObject();

	function difference() {
		const stopper = endDate?.diffNow(['seconds'])?.toObject()?.seconds?.toFixed(0);

		if (stopper && parseInt(stopper) < 0) {
			return;
		}

		diff = endDate.diffNow(diffUnit).toObject();
	}

	let clear: NodeJS.Timeout;

	$: {
		clearInterval(clear);
		clear = setInterval(difference, 1000);
	}
</script>

<div
	class={`timer rounded flex justify-between items-center ${size === 'big' ? bigClass : smallClass} ${includeDays ? 'max-lg:flex-col' : ''}`}
>
	<Text
		color="white-1"
		type="caption-1"
		weight="semibold"
		class={`${includeDays ? 'max-lg:mb-2' : ''}`}>SHOP BEFORE IT'S OVER!</Text
	>
	<div class="md:pl-3 flex justify-center items-center gap-1 font-mono">
		{#if includeDays}
			<div class="bg-white-1 py-1 px-2 rounded">
				<Text type="body-1" weight="semibold" color="brown-9">
					{diff?.days?.toFixed(0).padStart(2, '0')}{includeDays ? 'd' : ''}
				</Text>
			</div>
			<div>
				<Text type="subtitle-3" weight="semibold" color="brown-9">:</Text>
			</div>
		{/if}
		<div class="bg-white-1 py-1 px-2 rounded">
			<Text type="body-1" weight="semibold" color="brown-9">
				{diff?.hours?.toFixed(0).padStart(2, '0')}{includeDays ? 'h' : ''}
			</Text>
		</div>

		<div>
			<Text type="subtitle-3" weight="semibold" color="brown-9">:</Text>
		</div>
		<div class="bg-white-1 py-1 px-2 rounded">
			<Text type="body-1" weight="semibold" color="brown-9">
				{diff?.minutes?.toFixed(0).padStart(2, '0')}{includeDays ? 'm' : ''}
			</Text>
		</div>
		<div>
			<Text type="subtitle-3" weight="semibold" color="brown-9">:</Text>
		</div>
		<div class="bg-white-1 py-1 px-2 rounded">
			<Text type="body-1" weight="semibold" color="brown-9">
				{diff?.seconds?.toFixed(0).padStart(2, '0')}{includeDays ? 's' : ''}
			</Text>
		</div>
	</div>
</div>

<style>
	.timer {
		background-image: linear-gradient(to right, #a19387, #d8d1cc, #7f6e5f);
	}
</style>
