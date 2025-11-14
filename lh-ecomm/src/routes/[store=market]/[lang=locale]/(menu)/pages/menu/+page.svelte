<script lang="ts">
	import MenuPage from '$lib/pages/MenuPage/MenuPage.svelte';

	export let data;
</script>

<MenuPage data={data.menu.list} />
