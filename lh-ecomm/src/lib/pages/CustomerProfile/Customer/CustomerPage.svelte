<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import EditProfile from '$lib/components/EditProfile/EditProfile.svelte';
	import { PencilLineDesign } from 'svelte-remix';

	export let customerData;

	let showEditModal = false;

	function openEditModal() {
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
	}
</script>

<div class="flex flex-col basis-3/5 gap-[30px] max-lg:p-4">
	<div class="flex justify-between">
		<Text type="subtitle-3" color="black-9" weight="semibold">Account Details</Text>
		<div>
			<button
				class="border-solid border-2 border-yellow-950 py-2 px-3 rounded flex font-semibold gap-2 justify-center items-center"
				on:click={openEditModal}
			>
				EDIT
				<PencilLineDesign class="text-black-9 w-[16px] h-[16px] sm:w-[24px] sm:h-[24px]" />
			</button>
			{#if showEditModal}
				<EditProfile customer={customerData} on:closeModal={closeEditModal} />
			{/if}
		</div>
	</div>

	<ul class="flex flex-col gap-3">
		<li class="flex gap-2 lg:gap-[50px]">
			<Text type="body-1" color="black-9" class="w-[100px]  lg:w-[150px]">First Name</Text>
			<Text type="body-1" color="black-9" weight="semibold">{customerData?.firstName}</Text>
		</li>
		<li class="flex gap-2 lg:gap-[50px]">
			<Text type="body-1" color="black-9" class="w-[100px]  lg:w-[150px]">Last Name</Text>
			<Text type="body-1" color="black-9" weight="semibold"
				>{customerData?.lastName ? customerData.lastName : '-'}</Text
			>
		</li>
		<li class="flex gap-2 lg:gap-[50px]">
			<Text type="body-1" color="black-9" class="w-[100px]  lg:w-[150px]">Email</Text>
			<Text type="body-1" color="black-9" weight="semibold">{customerData?.email}</Text>
		</li>
		<li class="flex gap-2 lg:gap-[50px]">
			<Text type="body-1" color="black-9" class="w-[100px]  lg:w-[150px]">Phone</Text>
			<Text type="body-1" color="black-9" weight="semibold"
				>{customerData?.phone ? customerData.phone : '-'}</Text
			>
		</li>
	</ul>
</div>
