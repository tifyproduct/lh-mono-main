<script lang="ts">
	import { AccordionItem, Accordion, Tabs, TabItem } from 'flowbite-svelte';

	import Text from '$lib/components/Text/Text.svelte';
	import Divider from '$lib/components/Divider/Divider.svelte';
	import { titleCaseFormat } from '$lib/utils/formatter';

	export let productDetailData;

	let activeTab = 'specifications';

	const handleChangeTab = (value: string) => {
		activeTab = value;
	};

	let isShowMore = false;

	$: filteredSpecifications = productDetailData.specifications.filter((item: any) => item.value);

	$: slicedSpecifications = isShowMore
		? filteredSpecifications
		: filteredSpecifications.slice(0, 5);

	const toggleShowMore = () => {
		isShowMore = !isShowMore;
	};
</script>

<div>
	<!-- Desktop -->
	<div class="hidden lg:block">
		<Accordion flush multiple>
			<AccordionItem borderBottomClass="border-0" paddingFlush="py-0" open>
				<Text type="subtitle-3" color="black-10" weight="semibold" slot="header">
					Specifications
				</Text>

				{#each slicedSpecifications as item, index (item.key)}
					<div class={`flex justify-between border-b py-4 ${index === 0 ? 'pt-6' : ''}`}>
						<Text type="body-1" color="black-10" weight="medium">{titleCaseFormat(item.key)}</Text>
						<Text type="body-1" color="black-10">{item.value}</Text>
					</div>
				{/each}

				<div class="py-4 cursor-pointer" role="presentation" on:click={toggleShowMore}>
					<Text type="body-1" color="beige-10" weight="semibold">
						Show {isShowMore ? 'less' : 'more'}
					</Text>
				</div>
			</AccordionItem>
			<Divider />
			<AccordionItem borderBottomClass="border-0" paddingFlush="py-0">
				<Text type="subtitle-3" color="black-10" weight="semibold" slot="header">Descriptions</Text>
				<div class="py-4 pt-6">
					<Text type="body-1" color="black-10">
						{@html productDetailData.descriptionHtml}
					</Text>
				</div>
			</AccordionItem>
			<Divider />
		</Accordion>
	</div>

	<div class="block lg:hidden">
		<div class="mx-[-15px] sm:mx-0">
			<Divider
				verticalMargin="my-7"
				borderHeight="border-t-8 sm:border-t"
				borderColor="border-white-2 sm:border-black-2"
			/>
		</div>
		<Tabs tabStyle="underline" class="flex flex-wrap gap-4 border-none" contentClass="p-0">
			<TabItem
				open
				activeClasses="pb-1 border-b border-brown-10"
				inactiveClasses=""
				on:click={() => handleChangeTab('specifications')}
			>
				<Text
					type="body-1"
					color={activeTab === 'specifications' ? 'brown-10' : 'black-4'}
					weight="semibold"
					slot="title"
				>
					Specifications
				</Text>

				{#each slicedSpecifications as item, index (item.key)}
					<div class={`flex justify-between border-b py-4 ${index === 0 ? 'pt-6' : ''}`}>
						<Text type="body-1" color="black-10" weight="medium">{titleCaseFormat(item.key)}</Text>
						<Text type="body-1" color="black-10">{item.value}</Text>
					</div>
				{/each}

				<div class="py-4 cursor-pointer" role="presentation" on:click={toggleShowMore}>
					<Text type="body-1" color="beige-10" weight="semibold">
						Show {isShowMore ? 'less' : 'more'}
					</Text>
				</div>
			</TabItem>
			<TabItem
				activeClasses="pb-1 border-b border-brown-10"
				inactiveClasses=""
				on:click={() => handleChangeTab('descriptions')}
			>
				<Text
					type="body-1"
					color={activeTab === 'descriptions' ? 'brown-10' : 'black-4'}
					weight="semibold"
					slot="title">Descriptions</Text
				>
				<div class="py-4 pt-6">
					<Text type="body-1" color="black-10">
						{@html productDetailData.descriptionHtml}
					</Text>
				</div>
			</TabItem>
		</Tabs>
	</div>
</div>
