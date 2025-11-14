<script>
	export let sectionTitle = 'Brands We Accept';
	export let additionalText = '(Please reach out if your watch brand is not listed here)';
	export let topBrands = '';
	export let bottomBrands = '';
	export let moreBrandsText = '';

	let topBrandsArray = topBrands.split(',').map((brand) => brand.trim());
	let bottomBrandsArray = bottomBrands.split(',').map((brand) => brand.trim());
</script>

<div class="text-center mt-16 container max-w-[1600px]">
	<h2 class="text-3xl font-semibold mb-8">
		{sectionTitle}
	</h2>

	<div class="brands-container px-4">
		{#each topBrandsArray.concat(bottomBrandsArray) as brand}
			<div class="bg-gray-100 py-4 px-6 rounded-lg text-center font-bold">
				{brand}
			</div>
		{/each}
		{#if moreBrandsText}
			<div class="bg-gray-100 py-4 px-6 rounded-lg text-center text-sm text-gray-500">
				{moreBrandsText}
			</div>
		{/if}
	</div>

	<p class="text-sm text-gray-500 mt-4 mb-16">
		{additionalText}
	</p>
</div>

<style>
	.brands-container {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 16px;
		justify-content: center;
	}

	@media (max-width: 768px) {
		.brands-container {
			grid-template-columns: repeat(2, 1fr);
			padding: 10px;
		}
	}
</style>
