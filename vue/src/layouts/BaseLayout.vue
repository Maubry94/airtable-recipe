<script lang="ts" setup>
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import TheSonner from "@/components/ui/sonner/TheSonner.vue";
</script>
<template>
	<TheHeader />

	<TheSonner />

	<main class="container mx-auto px-4 py-8">
		<RouterView />
	</main>

	<TheFooter />
</template>
