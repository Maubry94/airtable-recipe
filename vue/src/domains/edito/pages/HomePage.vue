<script setup lang="ts">
import { routerPageName } from "@/router/routerPageName";
import TheIcon from "@/components/TheIcon.vue";
import { TheButton } from "@/components/ui/button";

const { RECIPE_PAGE, RECIPE_CREATE_PAGE } = routerPageName;
</script>

<template>
	<section class="min-h-screen-nh flex flex-col items-center justify-center">
		<div class="text-center">
			<div class="mb-6 flex justify-center">
				<div class="rounded-full bg-muted p-4">
					<TheIcon
						name="chefHat"
						size="6xl"
					/>
				</div>
			</div>

			<h1 class="mb-4 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
				ChefGPT
			</h1>

			<p class="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
				Créez des recettes personnalisées avec analyse nutritionnelle complète.
				L'intelligence artificielle au service de votre cuisine.
			</p>
		</div>

		<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
			<TheButton
				as-child
				size="lg"
			>
				<RouterLink :to="{ name: RECIPE_CREATE_PAGE }">
					<TheIcon
						name="plus"
						size="xl"
					/>
					Créer une recette
				</RouterLink>
			</TheButton>

			<TheButton
				as-child
				variant="outline"
				size="lg"
			>
				<RouterLink :to="{ name: RECIPE_PAGE }">
					<TheIcon
						name="utensils"
						size="xl"
					/>
					Parcourir les recettes
				</routerlink>
			</TheButton>
		</div>
	</section>
</template>
