<script lang="ts" setup>
import { Toaster as TheSonner, type ToasterProps } from "vue-sonner";

const props = defineProps<ToasterProps>();
</script>

<template>
	<TheSonner
		class="toaster group"
		v-bind="props"
		:style="{
			'--normal-bg': 'var(--popover)',
			'--normal-text': 'var(--popover-foreground)',
			'--normal-border': 'var(--border)',

		}"
	/>
</template>
