<script>
	export let imgSrc;
	export let mobileSrc;
	export let href = '#';
</script>

<div class="container max-w-[1600px] p-4 md:p-10">
	<a {href} class="hidden md:block">
		<img src={imgSrc} alt="Luxe Up Your Life" class="cursor-pointer rounded" />
	</a>
	<a {href} class="block md:hidden">
		<img src={mobileSrc} alt="Luxe Up Your Life" class="cursor-pointer rounded" />
	</a>
</div>
