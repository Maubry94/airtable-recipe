<script setup lang="ts">
import { useLoader } from "@/composables/useLoader";

const { isLoading } = useLoader();
</script>

<template>
	<div
		v-if="isLoading"
	>
		<p>
			Chargement en cours...
		</p>
	</div>
</template>
