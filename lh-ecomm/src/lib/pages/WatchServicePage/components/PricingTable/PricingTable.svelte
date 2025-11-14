<script>
	import LuxehouzeLogo from '$lib/assets/static/watch-service/svg/Logo.svg';
	import Check from '$lib/assets/static/watch-service/svg/checkbox-circle-fill.svg';
	import Stripe from '$lib/assets/static/watch-service/svg/indeterminate-circle-fill.svg';
	import Cross from '$lib/assets/static/watch-service/svg/close-circle-fill.svg';
	import Text from '$lib/components/Text/Text.svelte';
</script>

<div class="text-center pt-12 mb-12">
	<Text type="subtitle-1" color="black-9" weight="semibold">Why Our Service Stands Out</Text>
</div>

<div class="overflow-x-auto md:flex gap-8 pb-8 hidden">
	<div class="text-sm bg-white rounded-lg p-6 flex flex-col items-center min-w-[250px]">
		<p class="text-[#FFFFFF]">.</p>
		<p
			class="text-[#FFFFFF] text-center text-s font-light mt-2 border-b-2 border-[#E8E4E1] pb-4 w-full"
		>
			.
		</p>
		<div class="flex flex-col gap-2 text-left w-full">
			<div
				class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6 overflow-hidden whitespace-nowrap"
			>
				<Text type="body-1" weight="semibold">Quick Turnaround Time</Text>
			</div>
			<div
				class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6 overflow-hidden whitespace-nowrap"
			>
				<Text type="body-1" weight="semibold">High-quality work</Text>
			</div>
			<div
				class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6 overflow-hidden whitespace-nowrap"
			>
				<Text type="body-1" weight="semibold">Trained experts</Text>
			</div>
			<div class="flex items-center gap-2 pb-6 pt-6 overflow-hidden whitespace-nowrap">
				<Text type="body-1" weight="semibold">Warranty</Text>
			</div>
		</div>
	</div>

	<div
		class="text-sm bg-[#F1EFED] border border-[#7F6E5F] rounded-lg p-6 flex flex-col items-center"
	>
		<img src={LuxehouzeLogo} alt="Logo" />
		<p
			class="text-[#858895] text-center text-s font-light mt-2 border-b-2 border-[#E8E4E1] pb-4 w-full"
		>
			<i>$$</i>
		</p>
		<div class="flex flex-col gap-2 text-left">
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-gray-600">Yes. 5 - 6 Weeks</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-gray-600">Yes. Using advanced equipment.</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-gray-600">Yes. Swiss brand-trained professionals.</p>
			</div>
			<div class="flex items-center gap-2 pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-gray-600">Yes. 1-Year Luxecare Warranty</p>
			</div>
		</div>
	</div>

	<div class="text-sm bg-white rounded-lg p-6 flex flex-col items-center">
		<h1 class="text-gray-900 text-sm font-semibold">Official Service Centre</h1>
		<p
			class="text-[#858895] text-center text-s font-light mt-2 border-b-2 border-[#E8E4E1] pb-4 w-full"
		>
			<i>$$$</i>
		</p>
		<div class="flex flex-col gap-2 text-left">
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Cross} alt="Close" />
				<p class="text-[#858895]">No. Could take 2 - 6 Months</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-[#858895]">Yes. Using in-house equipment</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-[#858895]">Yes. In-house trained professionals.</p>
			</div>
			<div class="flex items-center gap-2 mt-6">
				<img src={Stripe} alt="Indeterminate" />
				<p class="text-[#858895]">Unsure. Depends on manufacturers</p>
			</div>
		</div>
	</div>

	<div class="text-sm bg-white rounded-lg p-6 flex flex-col items-center">
		<h1 class="text-gray-900 text-sm font-semibold">Local Service Centre</h1>
		<p
			class="text-[#858895] text-center text-s font-light mt-2 border-b-2 border-[#E8E4E1] pb-4 w-full"
		>
			<i>$</i>
		</p>
		<div class="flex flex-col gap-2 text-left">
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Cross} alt="Close" />
				<p class="text-[#858895]">No. Could take 2 - 3 Months</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Cross} alt="Close" />
				<p class="text-[#858895]">No. Poor. Still using basic equipments</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Cross} alt="Close" />
				<p class="text-[#858895]">No. Often not formally trained staff</p>
			</div>
			<div class="flex items-center gap-2 mt-6">
				<img src={Stripe} alt="Indeterminate" />
				<p class="text-[#858895]">Unsure. Depends on manufacturers</p>
			</div>
		</div>
	</div>
</div>

<div class="overflow-x-auto flex gap-8 pb-8 md:hidden">
	<div class="text-sm bg-white rounded-lg p-6 flex flex-col items-center min-w-[250px]">
		<p class="text-[#FFFFFF]">.</p>
		<p
			class="text-[#FFFFFF] text-center text-s font-light mt-2 border-b-2 border-[#E8E4E1] pb-4 w-full"
		>
			.
		</p>
		<div class="flex flex-col gap-2 text-left w-full">
			<div
				class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6 overflow-hidden whitespace-nowrap"
			>
				<Text type="body-1" weight="semibold">Quick Turnaround Time</Text>
			</div>
			<div
				class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6 overflow-hidden whitespace-nowrap"
			>
				<Text type="body-1" weight="semibold">High-quality work</Text>
			</div>
			<div
				class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6 overflow-hidden whitespace-nowrap"
			>
				<Text type="body-1" weight="semibold">Trained experts</Text>
			</div>
			<div class="flex items-center gap-2 pb-6 pt-6 overflow-hidden whitespace-nowrap">
				<Text type="body-1" weight="semibold">Warranty</Text>
			</div>
		</div>
	</div>

	<div
		class="text-sm bg-[#F1EFED] border border-[#7F6E5F] rounded-lg p-6 flex flex-col items-center"
	>
		<img src={LuxehouzeLogo} alt="Logo" />
		<p
			class="text-[#858895] text-center text-s font-light mt-2 border-b-2 border-[#E8E4E1] pb-4 w-full"
		>
			<i>$$</i>
		</p>
		<div class="flex flex-col gap-2 text-left w-64">
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-gray-600">Yes. 5 - 6 Weeks</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-gray-600">Yes. Using advanced equipment.</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-gray-600">Yes. Swiss brand-trained professionals.</p>
			</div>
			<div class="flex items-center gap-2 pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-gray-600">Yes. 1-Year Luxecare Warranty</p>
			</div>
		</div>
	</div>

	<div class="text-sm bg-white rounded-lg p-6 flex flex-col items-center">
		<h1 class="text-gray-900 text-sm font-semibold">Official Service Centre</h1>
		<p
			class="text-[#858895] text-center text-s font-light mt-2 border-b-2 border-[#E8E4E1] pb-4 w-full"
		>
			<i>$$$</i>
		</p>
		<div class="flex flex-col gap-2 text-left min-w-64">
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Cross} alt="Close" />
				<p class="text-[#858895]">No. Could take 2 - 6 Months</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-[#858895]">Yes. Using in-house equipment</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Check} alt="Check" />
				<p class="text-[#858895]">Yes. In-house trained professionals.</p>
			</div>
			<div class="flex items-center gap-2 mt-6">
				<img src={Stripe} alt="Indeterminate" />
				<p class="text-[#858895]">Unsure. Depends on manufacturers</p>
			</div>
		</div>
	</div>

	<div class="text-sm bg-white rounded-lg p-6 flex flex-col items-center">
		<h1 class="text-gray-900 text-sm font-semibold">Local Service Centre</h1>
		<p
			class="text-[#858895] text-center text-s font-light mt-2 border-b-2 border-[#E8E4E1] pb-4 w-full"
		>
			<i>$</i>
		</p>
		<div class="flex flex-col gap-2 text-left min-w-72">
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Cross} alt="Close" />
				<p class="text-[#858895]">No. Could take 2 - 3 Months</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Cross} alt="Close" />
				<p class="text-[#858895]">No. Typically using basic equipments</p>
			</div>
			<div class="flex items-center gap-2 border-b-2 border-[#E8E4E1] pb-6 pt-6">
				<img src={Cross} alt="Close" />
				<p class="text-[#858895]">No. Often not formally<br /> trained staff</p>
			</div>
			<div class="flex items-center gap-2 mt-6">
				<img src={Stripe} alt="Indeterminate" />
				<p class="text-[#858895]">Unsure. Depends on manufacturers</p>
			</div>
		</div>
	</div>
</div>
