<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
  import WatchImage from '$lib/assets/page/error/watch.svg';
  import BeautyImage from '$lib/assets/page/error/beauty.svg';
  import JewelryImage from '$lib/assets/page/error/jewelry.svg';
  import BagsImage from '$lib/assets/page/error/bags.svg';
	import { page } from '$app/stores';
  import { Card } from 'flowbite-svelte';

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
  const collections = [
    {
      image: WatchImage,
      title: "Watch collections",
      href: `${baseParams}/watch`,
    },
    {
      image: BeautyImage,
      title: "Beauty collections",
      href: `${baseParams}/beauty`,
    },
    {
      image: JewelryImage,
      title: "Jewelry collections",
      href: `${baseParams}/jewelry`,
    },
    {
      image: BagsImage,
      title: "Bags collections",
      href: `${baseParams}/bag`,
    },

  ]
</script>

<div class="w-full p-5 xl:px-10 "><img class="max-w-[200px]" src="/img/main-logo.png" alt="Main Logo" /></div>
<div class="container max-w-[1600px] min-h-[50vh] text-center md:p-20 p-4 grid">
	<div class="flex flex-col max-w-3xl mx-auto mt-4 gap-[12px]">
		<Text type="subtitle-1" weight="semibold" color="black-9" class="mt-4">
			Something went wrong
		</Text>
		<Text type="body-1">There’s a trouble on our server while processing your request</Text>
	</div>
	<div class="flex mx-auto gap-4 mt-4">
		<Button variant="primary" href={baseParams} class="w-[239px] h-[38px] px-[16px] py-[8px] rounded">
			BACK TO HOME
		</Button>
	</div>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 bg-white-2 rounded p-4 md:p-12">
    <Text type="subtitle-3" weight="semibold" color="black-9" class="col-span-full text-center">Explore some of our collections</Text>
    {#each collections as collection}
      <Card href={collection.href} class="flex flex-col items-center gap-2 bg-white-1 p-4 rounded">
        <img src={collection.image} alt={collection.title} class="w-[24px] h-[24px]" />
        <Text type="body-2" weight="semibold" color="black-9">{collection.title}</Text>
      </Card>
    {/each}
  </div>
</div>
