<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { CloseLineSystem, UploadCloudLineSystem } from 'svelte-remix';
	import { Label, Textarea } from 'flowbite-svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import StarInput from '../StarInput/StarInput.svelte';
	import customerProfileStore from '$lib/stores/customerProfileStore';

	export let productId;

	let FilePickerElement: HTMLInputElement;
	let ImagePreview: HTMLImageElement;
	let reviewerName = '';

	let selectedImage: File | null = null;

	const handleFilePickerClick = () => {
		FilePickerElement.click();
	};

	const handleFilePickerChange = (e: Event) => {
		const file = (<HTMLInputElement>e?.target)?.files?.[0] ?? null;

		if (file && ImagePreview) {
			selectedImage = file;
			form.image = file;
			const reader = new FileReader();
			reader.onload = function () {
				if (reader.result) {
					ImagePreview.src = reader.result as string;
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const removeSelectedImage = () => {
		selectedImage = null;
		ImagePreview.src = '';
		FilePickerElement.value = '';
	};

	let form = {
		reviewNumber: 5,
		description: '',
		image: null,
		productId,
		name: reviewerName
	};

	const dispatch = createEventDispatcher();

	function getReviewerName() {
		const firstName = $customerProfileStore?.firstName ?? '';
		const lastName = $customerProfileStore?.lastName ?? '';
		return `${firstName} ${lastName}`;
	}

	onMount(() => {
		form.name = getReviewerName();
	});
</script>

<div class="fixed bg-[#24252B]/80 w-full top-0 h-full left-0 z-40 flex items-center justify-center">
	<div class="bg-white-1 w-full max-lg:h-full lg:w-5/12 xl:w-4/12 lg:pt-4 lg:px-7 lg:pb-7">
		<div class="max-lg:p-4 shadow-sm lg:shadow-none">
			<CloseLineSystem class="ml-auto cursor-pointer" on:click={() => dispatch('close-modal')} />
		</div>
		<div
			class="max-lg:px-4 max-lg:pt-5 max-lg:overflow-y-scroll max-lg:h-[100vh] max-lg:pb-[100px]"
		>
			<form action="?/review" method="POST" enctype="multipart/form-data">
				<div class="text-center lg:py-4">
					<Text type="subtitle-2" weight="semibold" color="black-9">Leave a review</Text>
				</div>
				<div class="pb-6">
					<Label>
						<Text type="body-2" weight="semibold" color="black-9">Rating</Text>
					</Label>
					<div class="pt-3">
						<StarInput bind:value={form.reviewNumber} starSize={22} />
						<input type="hidden" name="rate" bind:value={form.reviewNumber} />
						<input type="hidden" name="name" bind:value={form.name} />
						<input type="hidden" name="productId" bind:value={form.productId} />
					</div>
				</div>
				<div class="pb-6">
					<Label>
						<Text type="body-2" weight="semibold" color="black-9">
							Description about the product
						</Text>
					</Label>
					<div class="pt-3">
						<Textarea
							bind:value={form.description}
							name="description"
							placeholder="Leave your thoughts here"
							class="bg-white-1 rounded "
						/>
					</div>
				</div>

				<div class="pb-6">
					<Label>
						<Text type="body-2" weight="semibold" color="black-9">Product image</Text>
					</Label>
					<div class="pt-3">
						<div
							class="flex items-center justify-center h-full w-full border border-dashed relative p-3"
							class:hidden={!selectedImage}
						>
							<img
								class="h-[160px] w-[178px] object-contain"
								id="image-preview"
								bind:this={ImagePreview}
								alt="product review"
							/>
							<CloseLineSystem class="absolute right-3 top-3" on:click={removeSelectedImage} />
						</div>
						<div class:hidden={selectedImage}>
							<input
								accept="image/*"
								type="file"
								name="review-image"
								id=""
								class="hidden"
								bind:this={FilePickerElement}
								on:change={handleFilePickerChange}
							/>
							<Button variant="link" class="w-full p-0 h-36" onClick={handleFilePickerClick}>
								<div
									class="flex items-center justify-center h-full flex-col w-full border border-dashed"
								>
									<UploadCloudLineSystem size={24} />
									<Text type="body-2" class="pt-2">Upload photo</Text>
								</div>
							</Button>
						</div>
					</div>
				</div>
				<div class="fixed bottom-0 w-full left-0 max-lg:p-4 bg-white-1 lg:static">
					<Button type="submit" variant="primary" class="w-full">SUBMIT REVIEW</Button>
				</div>
			</form>
		</div>
	</div>
</div>
