<script setup lang="ts">
import { routerPageName } from "@/router/routerPageName";
import TheIcon from "@/components/TheIcon.vue";
import { TheButton } from "@/components/ui/button";

const { HOME_PAGE, RECIPE_PAGE, RECIPE_CREATE_PAGE } = routerPageName;
</script>

<template>
	<section class="min-h-screen-nh flex flex-col items-center justify-center">
		<div class="text-center max-w-md mx-auto px-4">
			<div class="mb-8 flex justify-center">
				<div class="rounded-full bg-muted p-6">
					<TheIcon
						name="chefHat"
						size="6xl"
						class="text-muted-foreground"
					/>
				</div>
			</div>

			<h1 class="mb-4 text-6xl font-bold text-muted-foreground">
				404
			</h1>

			<h2 class="mb-4 text-2xl font-bold">
				Page introuvable
			</h2>

			<p class="text-muted-foreground mb-8 text-lg">
				Oups ! Il semblerait que cette recette n'existe pas dans nos cuisines.
				Que diriez-vous de découvrir nos autres délices ?
			</p>

			<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
				<TheButton
					as-child
					size="lg"
				>
					<RouterLink :to="{ name: HOME_PAGE }">
						<TheIcon
							name="home"
							size="lg"
						/>
						Retour à l'accueil
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
							size="lg"
						/>
						Voir les recettes
					</RouterLink>
				</TheButton>
			</div>

			<div class="mt-8">
				<TheButton
					as-child
					variant="ghost"
					size="sm"
				>
					<RouterLink :to="{ name: RECIPE_CREATE_PAGE }">
						<TheIcon
							name="plus"
							size="sm"
						/>
						Ou créer une nouvelle recette
					</RouterLink>
				</TheButton>
			</div>
		</div>
	</section>
</template>
