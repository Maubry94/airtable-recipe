<script setup lang="ts">
import { type SelectRootEmits, type SelectRootProps, SelectRoot, useForwardPropsEmits } from "reka-ui";

const props = defineProps<SelectRootProps>();
const emits = defineEmits<SelectRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
	<SelectRoot
		data-slot="select"
		v-bind="forwarded"
	>
		<slot />
	</SelectRoot>
</template>
