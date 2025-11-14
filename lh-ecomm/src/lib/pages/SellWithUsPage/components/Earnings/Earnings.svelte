<script>
	import Text from '$lib/components/Text/Text.svelte';
	import { Button } from 'flowbite-svelte';
	import { Table } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import SWUModal from '$lib/components/SWUModal/SWUModal.svelte';
	import { InformationLineSystem } from 'svelte-remix';
	// import AuthenticationModal from '$lib/components/AuthenticationModal/AuthenticationModal.svelte';
	import { showAuthenticationModal } from '$lib/stores/authentication';
	import customerProfileStore from '$lib/stores/customerProfileStore';

	export let credential;

	let brandsWatchId = [
		{ brand: 'Brand', fee: 'Luxehouze Fee', other: 'Competitors Fee' },
		{ brand: 'Others', fee: '0%', other: '5%' },
		{ brand: 'AP, RM, PP, Rolex', fee: '2%', other: '5%' }
	];

	let brandsWatchSg = [
		{ brand: 'Brand', fee: 'Luxehouze Fee', other: 'Competitors Fee' },
		{ brand: 'Others', fee: '0%', other: '5%' },
		{ brand: 'AP, RM, PP, Rolex', fee: '3%', other: '5%' }
	];

	let brandsBags = [
		{ brand: 'Brand', fee: 'Luxehouze Fee', other: 'Competitors Fee' },
		{ brand: 'Others', fee: '5%', other: '5%' },
		{ brand: 'Birkin & Kelly', fee: '3%', other: '5%' }
	];

	let watchOptions = [
		{ label: 'Select Brand', value: '', disabled: true },
		{ label: 'Others', value: 'Others' },
		{ label: 'AUDEMARS PIGUET', value: 'AP' },
		{ label: 'PATEK PHILIPPE', value: 'PP' },
		{ label: 'ROLEX', value: 'RL' },
		{ label: 'RICHARD MILLE', value: 'RM' }
	];

	let bagOptions = [
		{ label: 'Select Brand', value: '', disabled: true },
		{ label: 'Hermès Birkin', value: 'HB' },
		{ label: 'Hermès Kelly', value: 'HK' },
		{ label: 'Others', value: 'OT' }
	];

	const currentPage = get(page);
	const store = currentPage.params.store;
	let userInput = 0;
	let formattedInput = '';
	let earnings = 0;
	let activeTab = 'watch';
	let selectedWatch = '';
	let selectedBag = '';

	$: {
		if (activeTab === 'watch') {
			if (
				selectedWatch === 'AP' ||
				selectedWatch === 'RM' ||
				selectedWatch === 'PP' ||
				selectedWatch === 'RL'
			) {
				const feePercentage = store === 'sg' ? 0.03 : 0.02;
				earnings = userInput - userInput * feePercentage;
			} else if (selectedWatch === 'Others') {
				earnings = userInput;
			} else {
				earnings = userInput;
			}
		} else if (activeTab === 'bags') {
			if (selectedBag === 'HB' || selectedBag === 'HK') {
				earnings = userInput - userInput * 0.03;
			} else {
				earnings = userInput - userInput * 0.05;
			}
		}
	}

	const switchTab = (tab) => {
		activeTab = tab;
		selectedWatch = '';
		selectedBag = '';
		userInput = 0;
	};

	const handleInputChange = (event) => {
		let inputValue = event.target.value.replace(/\D/g, '');
		userInput = parseInt(inputValue) || 0;
		formattedInput = userInput.toLocaleString('id-ID');
	};

	$: isLoggedIn = $customerProfileStore?.isLoggedIn;
	let showModal = false;
	const openModal = () => {
		// if (isLoggedIn) {
		// 	showModal = true;
		// } else {
		// 	handleSignIn();
		// }
		showModal = true;
	};
	const handleSignIn = () => {
		$showAuthenticationModal = true;
	};
	const closeModal = () => {
		showModal = false;
	};
	const closeAuthentication = () => {
		$showAuthenticationModal = false;
	};

	const closeAuthenticationSuccess = () => {
		$showAuthenticationModal = false;
		customerProfileStore.set({ ...$customerProfileStore, isLoggedIn: true });
	};
	const onClickModal = () => {
		openModal();
	};
</script>

<div class="text-left md:text-center overflow-hidden grid justify-center">
	<div class="p-4">
		<Text type="subtitle-1" weight="semibold">Earn more with our competitive Consignment fees</Text>
	</div>
	<div class="bg-dark-brown-10 md:rounded-md md:p-8 mt-4 md:min-w-[1100px] p-4 md:p-0">
		<div class="flex justify-center gap-4">
			<Button
				class={`min-w-[138px] border border-dark-brown-05 ${activeTab === 'watch' ? 'bg-dark-brown-05 text-dark-brown-10' : 'bg-transparent text-white-1'} ${activeTab === 'watch' ? 'active' : ''}`}
				on:click={() => switchTab('watch')}
			>
				Watch
			</Button>
			<Button
				class={`min-w-[138px] border border-dark-brown-05 ${activeTab === 'bags' ? 'bg-dark-brown-05 text-dark-brown-10' : 'bg-transparent text-white-1'} ${activeTab === 'bags' ? 'active' : ''}`}
				on:click={() => switchTab('bags')}
			>
				Bag
			</Button>
		</div>

		<div class="border rounded-md overflow-hidden mt-4">
			{#if activeTab === 'watch'}
				<Table class="table-auto text-white-1 text-center">
					<tbody>
						{#each store === 'sg' ? brandsWatchSg : brandsWatchId as brandItem, index (brandItem)}
							<tr>
								<td
									class="p-4 max-w-[100px] {index ===
									(store === 'sg' ? brandsWatchSg : brandsWatchId).length - 1
										? ''
										: 'border-b'} border-r border-white"
								>
									{brandItem.brand}
								</td>
								<td
									class="p-4 max-w-[100px] {index ===
									(store === 'sg' ? brandsWatchSg : brandsWatchId).length - 1
										? ''
										: 'border-b'} border-r border-white"
								>
									{brandItem.fee}
								</td>
								<td
									class="p-4 max-w-[100px] {index ===
									(store === 'sg' ? brandsWatchSg : brandsWatchId).length - 1
										? ''
										: 'border-b'} border-white"
								>
									{brandItem.other}
								</td>
							</tr>
						{/each}
					</tbody>
				</Table>
			{:else if activeTab === 'bags'}
				<Table class="table-auto text-white-1 text-center">
					<tbody>
						{#each brandsBags as brandItem, index (brandItem)}
							<tr>
								<td
									class="p-4 max-w-[100px] {index === brandsBags.length - 1
										? ''
										: 'border-b'} border-r border-white"
								>
									{brandItem.brand}
								</td>
								<td
									class="p-4 max-w-[100px] {index === brandsBags.length - 1
										? ''
										: 'border-b'} border-r border-white"
								>
									{brandItem.fee}
								</td>
								<td
									class="p-4 max-w-[100px] {index === brandsBags.length - 1
										? ''
										: 'border-b'} border-white"
								>
									{brandItem.other}
								</td>
							</tr>
						{/each}
					</tbody>
				</Table>
			{/if}
		</div>

		<div class="mt-5">
			<Text type="body-1" color="white-1" weight="regular">
				*We will determine the selling price, ensuring your item is sold at the best value.
			</Text>
		</div>

		<div class="mt-3">
			<div class="border p-6 text-left mt-6 rounded-md">
				<div class="text-center">
					<Text type="subtitle-3" weight="semibold" color="white-1">Calculate Your Earnings</Text>
				</div>

				{#if activeTab === 'watch'}
					<div class="mt-4 grid">
						<Text type="body-1" color="white-1">Brand</Text>
						<select
							id="watch-select"
							bind:value={selectedWatch}
							class="p-2 border rounded-md text-black"
						>
							{#each watchOptions as option}
								<option value={option.value} disabled={option.disabled}>{option.label}</option>
							{/each}
						</select>
					</div>
				{:else if activeTab === 'bags'}
					<div class="mt-4 grid">
						<Text type="body-1" color="white-1">Brand</Text>
						<select
							id="bag-select"
							bind:value={selectedBag}
							class="p-2 border rounded-md text-black"
						>
							{#each bagOptions as option}
								<option value={option.value} disabled={option.disabled}>{option.label}</option>
							{/each}
						</select>
					</div>
				{/if}

				<div class="mt-2">
					<Text type="body-1" color="white-1">Simulate Price</Text>
					<div class="relative flex">
						<span class="absolute left-3 text-black-9 font-bold mt-2">Rp</span>
						<input
							id="large-input"
							size="lg"
							class="pl-10 p-2 rounded-lg border w-[100%] h-10"
							type="text"
							bind:value={formattedInput}
							on:input={handleInputChange}
							placeholder="Enter amount"
						/>
					</div>
					<div class="flex justify-between mt-2">
						<p class="text-[#FFFFFF] text-xs font-light">Earning</p>
						<p class="text-[#FFFFFF] text-xs font-light">
							{store === 'id' ? 'Rp ' : '$'}
							{earnings.toLocaleString()}
						</p>
					</div>
				</div>
			</div>
			<div class="bg-beige-10 flex p-3 rounded mt-6 gap-2">
				<InformationLineSystem fill="white" />
				<Text type="body-1" color="white-1" weight="regular">
					This is a simulation only. The final amount will be specified in the price agreement.
				</Text>
			</div>

			<div class="flex items-center justify-center">
				<Button class="bg-dark-brown-05 mt-4" on:click={openModal}>SUBMIT FOR QUOTATION</Button>
			</div>
		</div>
	</div>
</div>
{#if showModal}
	<SWUModal
		bind:isModalOpen={showModal}
		on:closeModal={closeModal}
		productTitle=""
		collection=""
		brand=""
		{activeTab}
	/>
{/if}
<!-- {#if $showAuthenticationModal}
	<AuthenticationModal
		credentialSoc={credential}
		on:close={closeAuthentication}
		on:close-success={closeAuthenticationSuccess}
	/>
{/if} -->
