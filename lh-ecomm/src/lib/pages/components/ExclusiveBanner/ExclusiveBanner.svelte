<script>
	export let src = '';
	export let alt = '';
	export let className = '';
	export let href = '';
</script>

<div class={`container max-w-[1600px] ${className}`}>
	{#if href}
		<a {href}>
			<img {src} {alt} class="w-full" />
		</a>
	{:else}
		<img {src} {alt} class="w-full" />
	{/if}
</div>
