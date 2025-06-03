<script lang="ts" setup>
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
</script>
<template>
	<TheHeader />

	<main class="container mx-auto px-4 py-8">
		<RouterView />
	</main>

	<TheFooter />
</template>
