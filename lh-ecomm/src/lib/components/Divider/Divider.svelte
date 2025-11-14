<script lang="ts">
	export let verticalMargin: string = 'my-3';
	export let borderHeight: string = 'border-t';
	export let borderColor: string = 'border-black-2';
	export let borderStyle: string = 'border-solid';
</script>

<div class="flex items-center {verticalMargin}">
	<div class="flex-grow {borderHeight} {borderColor} {borderStyle}" />
</div>
