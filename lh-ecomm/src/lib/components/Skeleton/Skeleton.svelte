<script lang="ts">
	export let width: string = 'w-full';
	export let height: string = 'h-4';
	export let isCircle: boolean = false;
	export let className: string = '';
</script>

<div
	class={`skeleton ${width} ${height} ${isCircle ? 'rounded-full' : 'rounded-md'} ${className}`}
></div>

<style>
	.skeleton {
		@apply bg-gray-300 animate-pulse;
	}
</style>
