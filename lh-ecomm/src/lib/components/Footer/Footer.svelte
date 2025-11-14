<script lang="ts">
	import {
		FacebookLineLogos,
		InstagramLineLogos,
		LinkedinBoxLineLogos,
		YoutubeLineLogos
	} from 'svelte-remix';

	import { Accordion, AccordionItem, Checkbox } from 'flowbite-svelte';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Divider from '$lib/components/Divider/Divider.svelte';

	import type { FooterData } from './types';
	import SubscriptionModal from '$lib/pages/HomePage/components/SubscriptionModal/SubscriptionModal.svelte';
	import { page } from '$app/stores';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	export let data: Array<FooterData> = [];

	let subscriptionModal = false;
	let email = '';
	let subscribeWatch = false;
	let subscribeBeauty = false;

	async function subscribeEmailMarketing(): Promise<void> {
		const request = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: `mutation customerEmailMarketingSubscribe($email: String!) {
							customerEmailMarketingSubscribe(email: $email) {
								customer {
									id
								}
							}
						}`,
				variables: {
					email
				}
			}),
			headers: {
				'X-SHOPIFY-API-VERSION': 'unstable'
			}
		});

		const response = await request.json();

		subscriptionModal = true;
		email = '';
		subscribeBeauty = false;
		subscribeWatch = false;
	}

	async function tagCustomer(
		customerId: string,
		watch: boolean = false,
		beauty: boolean = false
	): Promise<void> {
		const tags = ['newsletter'];

		if (watch) tags.push('watch');
		if (beauty) tags.push('beauty');

		const request = await fetch('/api/admin/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: `mutation CustomerUpdate($input: CustomerInput!) {
							customerUpdate(input: $input) {
								customer {
									id
									tags
								}
							}
						}`,
				variables: {
					input: {
						id: customerId,
						tags
					}
				}
			})
		});

		await request.json();
	}

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const blogUrl =
		$page.params.store === 'sg'
			? 'https://blog.luxehouze.com/en/'
			: 'https://blog.luxehouze.com/en-id/';

	const urlMap = {
		'About Us': `${baseParams}/about-us`,
		Authenticity: `${baseParams}/authenticity`,
		'Store Location': `${baseParams}/visit-us`,
		Testimonials: `${baseParams}/testimonials`,
		Careers: `https://careers.luxehouze.com/jobs`,
		'Sell With Us': `${baseParams}/sell-with-us`,
		'Join Our Community': `${baseParams}/community`,
		'Pre-Order': `${baseParams}/concierge`,
		Promotions: `${baseParams}/promotions`,
		'Contact Us': `${baseParams}/contact-us`,
		FAQ: `${baseParams}/faq`,
		'Payment Methods': `${baseParams}/payment-method-at-luxehouze`,
		'Privacy Policy': `${baseParams}/privacy-policy`,
		'Data Protection Notice': `${baseParams}/data-protection-notice`,
		'Terms and Conditions': `${baseParams}/terms-and-conditions`,
		'Watch Service': `${baseParams}/watch-service`,
		Blog: blogUrl
	};

	function getURL(title: string): string {
		return urlMap[title] || '#';
	}

	function menuClick() {
		googleAnalClickedEvent('click_button_sell_with_us', {
			location: {
				name: 'Footer'
			}
		});
	}
</script>

<div class="bg-white-2 p-4 lg:py-8" data-sveltekit-preload-data="false">
	<div class="container">
		<div class="flex justify-between flex-col lg:flex-row">
			<!-- Desktop -->
			{#each data as footer}
				<div class="hidden lg:block">
					<Text type="body-1" color="black-10" weight="semibold">
						{footer.title.toUpperCase()}
					</Text>
					{#each footer.subs as item, index}
						<div class={`cursor-pointer ${index === 0 ? 'mt-[12px]' : 'mt-[20px]'}`}>
							<a
								on:click={() => (item.title.toLowerCase() === 'sell with us' ? menuClick() : null)}
								href={getURL(item.title)}
								class="text-decoration-none"
							>
								<Text type="body-2" color="black-10">
									{item.title.toUpperCase()}
								</Text>
							</a>
						</div>
					{/each}
				</div>
			{/each}

			<!-- Mobile -->
			<div class="block lg:hidden">
				<Accordion flush>
					{#each data as footer, index}
						<AccordionItem borderBottomClass="border-0" paddingFlush={'py-4'}>
							<Text type="body-1" color="black-7" weight="semibold" slot="header">
								{footer.title.toLocaleUpperCase()}
							</Text>
							<div class="-mt-3 ml-3">
								{#each footer.subs as item, index}
									<div class={`cursor-pointer ${index !== 0 ? 'mt-3' : ''}`}>
										<a href={getURL(item.title)} class="text-decoration-none">
											<Text type="body-1" color="black-10">
												{item.title.toLocaleUpperCase()}
											</Text>
										</a>
									</div>
								{/each}
							</div>
						</AccordionItem>
					{/each}
				</Accordion>
			</div>

			<div class="w-full lg:w-[466px] mt-3 lg:mt-0">
				<Text type="body-1" color="black-7" weight="semibold">NEVER MISS AN UPDATE!</Text>
				<div class="flex flex-wrap gap-3 mt-3">
					<input
						type="email"
						bind:value={email}
						id="mailing-list"
						placeholder="Enter your email"
						class="flex rounded"
					/>
					<Button
						disabled={(!subscribeWatch && !subscribeBeauty) || email.length === 0}
						variant="primary"
						onClick={() => {
							subscribeEmailMarketing();
						}}>SUBSCRIBE</Button
					>
				</div>

				<div class="mt-3">
					<Checkbox bind:checked={subscribeWatch}>
						<Text type="caption-1" color="black-6">
							I agree to receive promotional materials from Luxehouze.
						</Text>
					</Checkbox>
					{#if subscriptionModal}
						<SubscriptionModal
							on:close={() => {
								subscriptionModal = false;
							}}
						/>
					{/if}
				</div>

				<div class="mt-6 lg:mt-8">
					<Text type="body-1" color="black-10" weight="semibold">Accepted Payment Methods</Text>
					<div class="flex gap-3 mt-3">
						<div class="bg-white-1 p-3 rounded w-[50px] h-[32px]">
							<img src="/icons/visa.svg" alt="visa" />
						</div>
						<div class="bg-white-1 p-3 rounded w-[50px] h-[32px]">
							<img class="mt-[-2px] ml-[2px]" src="/icons/mastercard.svg" alt="mastercard" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-6 lg:mt-8">
			<Text type="body-1" color="black-10" weight="semibold">ABOUT LUXEHOUZE</Text>
			<div class="mt-2">
				<Text type="body-2" color="black-10">
					Luxehouze is the leading luxury goods marketplace that specializes in authentic high-end
					watches, leather goods, and beauty products
				</Text>
			</div>
		</div>

		<Divider verticalMargin="my-6 lg:my-8" />

		<div class="flex justify-between flex-col lg:flex-row gap-6 lg:gap-0">
			<Text type="caption-2" color="black-10">
				© COPYRIGHT 2022 LUXEHOUZE. ALL RIGHT RESERVED.
			</Text>
			<div class="flex gap-6">
				<a href="https://www.facebook.com/profile.php?id=100071442746932" target="_blank">
					<FacebookLineLogos class="cursor-pointer" />
				</a>
				<a href="https://instagram.com/luxehouze?igshid=YmMyMTA2M2Y=" target="_blank">
					<InstagramLineLogos class="cursor-pointer" />
				</a>
				<a href="https://www.linkedin.com/company/luxehouze/" target="_blank">
					<LinkedinBoxLineLogos class="cursor-pointer" />
				</a>
				<a href="https://www.youtube.com/@luxehouze" target="_blank">
					<YoutubeLineLogos class="cursor-pointer" />
				</a>
			</div>
		</div>
	</div>
</div>
