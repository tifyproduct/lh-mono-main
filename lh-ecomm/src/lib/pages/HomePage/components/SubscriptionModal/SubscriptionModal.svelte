<script>
	import Button from '$lib/components/Button/Button.svelte';
	import { MailStarFillBusiness } from 'svelte-remix';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function onModalClosed() {
		dispatch('close');
	}
</script>

<!-- This example requires Tailwind CSS v2.0+ -->
<div
	class="fixed z-10 inset-0 overflow-y-auto"
	aria-labelledby="modal-title"
	role="dialog"
	aria-modal="true"
>
	<div
		class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
	>
		<!--
          Background overlay, show/hide based on modal state.

          Entering: "ease-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100"
            To: "opacity-0"
        -->
		<div
			class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
			aria-hidden="true"
		></div>

		<!-- This element is to trick the browser into centering the modal contents. -->
		<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
			>&#8203;</span
		>

		<!--
          Modal panel, show/hide based on modal state.

          Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        -->
		<div
			class="inline-block align-bottom bg-white-1 rounded px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
		>
			<div>
				<div class="mx-auto flex items-center justify-center">
					<MailStarFillBusiness size="36" color="#AD7957" />
				</div>
				<div class="mt-3 text-center sm:mt-5">
					<h3 class="sm:text-lg xl:text-xl leading-6 font-semibold text-black-10" id="modal-title">
						Welcome to Luxehouze community!
					</h3>
					<div class="mt-2">
						<p class="text-sm text-black-10 text-balance px-5 md:px-10">
							You will received weekly promotions through your email inbox
						</p>
					</div>
				</div>
			</div>
			<div class="mt-5 sm:mt-6 text-center">
				<Button class="min-w-60" variant="primary" onClick={onModalClosed}>Close</Button>
			</div>
		</div>
	</div>
</div>
