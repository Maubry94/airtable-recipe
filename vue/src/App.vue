<script setup lang="ts">
import TheLoader from "./components/TheLoader.vue";
import TheSonner from "./components/ui/sonner/TheSonner.vue";
</script>

<template>
	<TheLoader />

	<RouterView />

	<TheSonner close-button />
</template>
