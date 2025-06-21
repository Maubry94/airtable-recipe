<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import TheIcon from "@/components/TheIcon.vue";
import { TheButton } from "@/components/ui/button";
import { TheCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TheBadge } from "@/components/ui/badge";
import { TheProgress } from "@/components/ui/progress";
import { TheAlert, AlertDescription } from "@/components/ui/alert";
import { useGetRecipe } from "../composables/useGetRecipe";
import { routerPageNameRecipe } from "../router";

const route = useRoute();
const router = useRouter();

const {
	RECIPE_PAGE,
} = routerPageNameRecipe;

const {
	recipe,
} = useGetRecipe(
	computed(() => String(route.params.id)),
);

const maxNutrition = {
	proteins: 50,
	carbohydrates: 100,
	lipids: 40,
} as const;

const HUNDRED = 100;
const nutritionProgress = computed(() => {
	if (!recipe.value) {
		return {
			proteins: 0,
			carbohydrates: 0,
			lipids: 0,
		};
	}

	return {
		proteins: Math.min(
			(recipe.value.fields.numberOfProteins / maxNutrition.proteins) * HUNDRED,
			HUNDRED,
		),
		carbohydrates: Math.min(
			(recipe.value.fields.numberOfCarbohydrates / maxNutrition.carbohydrates) * HUNDRED,
			HUNDRED,
		),
		lipids: Math.min(
			(recipe.value.fields.numberOfLipids / maxNutrition.lipids) * HUNDRED,
			HUNDRED,
		),
	};
});
</script>

<template>
	<section
		v-if="recipe"
		class="min-h-screen-nh"
	>
		<div class="mb-8">
			<TheButton
				variant="ghost"
				@click="router.push({
					name: RECIPE_PAGE
				})"
				class="mb-4"
			>
				<TheIcon name="arrowLeft" />
				Retour aux recettes
			</TheButton>

			<div class="grid gap-8 lg:grid-cols-3">
				<div class="lg:col-span-2">
					<div class="rounded-lg bg-muted p-8 mb-6 h-64">
						<div class="h-full w-full flex items-center justify-center overflow-hidden rounded-lg">
							<img
								v-if="recipe.fields.image"
								:src="recipe.fields.image"
								alt="Image de la recette"
								class="w-full h-full object-cover rounded-lg"
							>

							<TheIcon
								v-else
								name="chefHat"
								size="2xl"
							/>
						</div>
					</div>

					<h1 class="text-3xl font-bold mb-2">
						{{ recipe.fields.name }}
					</h1>

					<div class="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
						<div class="flex gap-1 items-center">
							<TheIcon
								name="users"
								size="xs"
							/>
							{{ recipe.fields.personCount }} personnes
						</div>

						<div class="flex gap-1 items-center">
							<TheIcon
								name="clock"
								size="xs"
							/>
							~30 minutes
						</div>

						<TheBadge variant="outline">
							{{ recipe.fields.dishType }}
						</TheBadge>
					</div>
				</div>

				<div>
					<TheCard>
						<CardHeader>
							<CardTitle>Analyse nutritionnelle</CardTitle>
						</CardHeader>

						<CardContent class="space-y-4">
							<div class="grid grid-cols-2 gap-4 text-center">
								<div class="rounded bg-orange-50 p-3">
									<div class="text-2xl font-bold text-orange-600">
										{{ Math.round(recipe.fields.totalCalories) }}
									</div>

									<div class="text-sm text-muted-foreground">
										kcal
									</div>
								</div>

								<div class="rounded bg-blue-50 p-3">
									<div class="text-2xl font-bold text-blue-600">
										{{ recipe.fields.nutritionalDensity }}
									</div>

									<div class="text-sm text-muted-foreground">
										densité
									</div>
								</div>
							</div>

							<div class="space-y-3">
								<div>
									<div class="flex justify-between text-sm mb-1">
										<span>Protéines</span>

										<span>{{ recipe.fields.numberOfProteins }}g</span>
									</div>

									<TheProgress
										v-model="nutritionProgress.proteins"
										class="h-2"
									/>
								</div>

								<div>
									<div class="flex justify-between text-sm mb-1">
										<span>Glucides</span>

										<span>{{ recipe.fields.numberOfCarbohydrates }}g</span>
									</div>

									<TheProgress
										v-model="nutritionProgress.carbohydrates"
										class="h-2"
									/>
								</div>

								<div>
									<div class="flex justify-between text-sm mb-1">
										<span>Lipides</span>

										<span>{{ recipe.fields.numberOfLipids }}g</span>
									</div>

									<TheProgress
										v-model="nutritionProgress.lipids"
										class="h-2"
									/>
								</div>
							</div>
						</CardContent>
					</TheCard>
				</div>
			</div>
		</div>

		<div class="grid gap-8 lg:grid-cols-3">
			<div class="lg:col-span-2 space-y-6">
				<TheCard>
					<CardHeader>
						<CardTitle>Ingrédients ({{ recipe.fields.ingredientCount }})</CardTitle>
					</CardHeader>

					<CardContent>
						<div class="grid gap-3 sm:grid-cols-2">
							<div
								v-for="ingredient in recipe.fields.ingredients"
								:key="ingredient.id"
								class="flex items-center justify-between rounded-lg border p-3"
							>
								<span class="font-medium">{{ ingredient.name }}</span>
							</div>
						</div>
					</CardContent>
				</TheCard>

				<TheCard>
					<CardHeader>
						<CardTitle>Instructions de préparation</CardTitle>
					</CardHeader>

					<CardContent>
						<p class="text-muted-foreground leading-relaxed">
							{{ recipe.fields.instructions }}
						</p>
					</CardContent>
				</TheCard>

				<TheCard v-if="recipe.fields.intolerances.length > 0">
					<CardHeader>
						<CardTitle class="flex gap-2 items-center">
							<TheIcon
								name="alertTriangle"
								size="xl"
								class="text-amber-600"
							/>
							Allergènes et intolérances
						</CardTitle>
					</CardHeader>

					<CardContent>
						<div class="space-y-3">
							<TheAlert
								v-for="intolerance in recipe.fields.intolerances"
								:key="intolerance.id"
								class="border-amber-200 bg-amber-50"
							>
								<AlertDescription>
									<div class="font-medium text-amber-800">
										{{ intolerance.name }}
									</div>

									<div class="text-sm text-amber-700 mt-1">
										{{ intolerance.description }}
									</div>
								</AlertDescription>
							</TheAlert>
						</div>
					</CardContent>
				</TheCard>
			</div>

			<div class="space-y-6">
				<TheCard>
					<CardHeader>
						<CardTitle class="flex gap-2 items-center">
							<TheIcon
								name="info"
								size="xl"
							/>
							Résumé nutritionnel
						</CardTitle>
					</CardHeader>

					<CardContent>
						<TheAlert>
							<AlertDescription>
								{{ recipe.fields.nutritionalSummary || "Aucun résumé nutritionnel." }}
							</AlertDescription>
						</TheAlert>

						<div class="mt-4 space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-muted-foreground">Vitamines :</span>

								<span class="font-medium">{{ recipe.fields.vitamins }}</span>
							</div>

							<div class="flex justify-between">
								<span class="text-muted-foreground">Minéraux :</span>

								<span class="font-medium">{{ recipe.fields.minerals }}</span>
							</div>
						</div>
					</CardContent>
				</TheCard>

				<TheCard>
					<CardHeader>
						<CardTitle class="flex gap-2 items-center">
							<TheIcon
								name="lightbulb"
								size="xl"
							/>
							Suggestions
						</CardTitle>
					</CardHeader>

					<CardContent>
						<TheAlert class="border-blue-200 bg-blue-50">
							<AlertDescription class="text-blue-700">
								{{ recipe.fields.improvementSuggestions || "Aucune suggestion d'amélioration." }}
							</AlertDescription>
						</TheAlert>
					</CardContent>
				</TheCard>

				<TheCard>
					<CardHeader>
						<CardTitle>Informations</CardTitle>
					</CardHeader>

					<CardContent class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class="text-muted-foreground">Créée le :</span>

							<span>{{ new Date(recipe.fields.createdAt).toLocaleDateString('fr-FR') }}</span>
						</div>

						<div class="flex justify-between">
							<span class="text-muted-foreground">Densité nutritionnelle :</span>

							<span class="font-medium">{{ recipe.fields.nutritionalDensity }}</span>
						</div>
					</CardContent>
				</TheCard>
			</div>
		</div>
	</section>

	<section
		v-else
		class="min-h-screen-nh flex items-center justify-center"
	>
		<div class="text-center">
			<TheIcon
				name="chefHat"
				size="6xl"
				class="text-muted-foreground mx-auto mb-4"
			/>

			<h2 class="text-2xl font-bold mb-2">
				Recette introuvable
			</h2>

			<p class="text-muted-foreground mb-6">
				La recette que vous cherchez n'existe pas.
			</p>

			<TheButton
				@click="router.back"
				variant="outline"
			>
				<TheIcon
					name="arrowLeft"
					size="lg"
				/>
				Retour
			</TheButton>
		</div>
	</section>
</template>
