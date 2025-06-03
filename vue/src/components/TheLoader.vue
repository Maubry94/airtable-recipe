<script setup lang="ts">
import { useLoader } from "@/composables/useLoader";
import TheIcon from "@/components/TheIcon.vue";

const { isLoading } = useLoader();
</script>

<template>
	<div
		v-if="isLoading"
		class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
	>
		<div class="flex flex-col items-center justify-center space-y-4 text-center">
			<div class="rounded-full bg-muted p-6 animate-pulse">
				<TheIcon
					name="chefHat"
					size="6xl"
					class="text-primary"
				/>
			</div>

			<div class="space-y-2">
				<div class="flex items-center justify-center space-x-2">
					<TheIcon
						name="loader"
						size="lg"
						class="animate-spin text-primary"
					/>

					<h2 class="text-xl font-semibold">
						Chargement en cours...
					</h2>
				</div>

				<p class="text-muted-foreground text-sm max-w-sm">
					Préparation de votre expérience culinaire
				</p>
			</div>
		</div>
	</div>
</template>
