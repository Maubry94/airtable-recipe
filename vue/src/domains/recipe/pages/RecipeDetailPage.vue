<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import TheIcon from "@/components/TheIcon.vue";
import { TheButton } from "@/components/ui/button";
import { TheCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TheBadge } from "@/components/ui/badge";
import { TheProgress } from "@/components/ui/progress";
import { TheAlert, AlertDescription } from "@/components/ui/alert";
import { mockRecipes, mockIngredients, mockIntolerances } from "@/mocks/recipesData";

const route = useRoute();
const router = useRouter();

const recipe = computed(() => mockRecipes.find((rcp) => rcp.id === route.params.id));

const recipeIngredients = computed(() => {
	if (!recipe.value) {
		return [];
	}
	return recipe.value.fields.ingredients
		.map((ingredientId) => mockIngredients.find((igd) => igd.id === ingredientId))
		.filter(Boolean);
});

const recipeIntolerances = computed(() => {
	if (!recipe.value?.fields.intolerances) {
		return [];
	}
	return recipe.value.fields.intolerances
		.map((intoleranceId) => mockIntolerances.find((itl) => itl.id === intoleranceId))
		.filter(Boolean);
});

function goBack() {
	router.back();
}

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
		proteins: Math.min((recipe.value.fields.Proteins / maxNutrition.proteins) * HUNDRED, HUNDRED),
		carbohydrates: Math.min((recipe.value.fields.Carbohydrates / maxNutrition.carbohydrates) * HUNDRED, HUNDRED),
		lipids: Math.min((recipe.value.fields.Lipids / maxNutrition.lipids) * HUNDRED, HUNDRED),
	};
});
</script>

<template>
	<div
		v-if="recipe"
		class="min-h-screen bg-gray-50"
	>
		<div class="container mx-auto px-4 py-8">
			<div class="mb-8">
				<TheButton
					variant="ghost"
					@click="goBack"
					class="mb-4"
				>
					<TheIcon name="arrowLeft" />
					Retour aux recettes
				</TheButton>

				<div class="grid gap-8 lg:grid-cols-3">
					<div class="lg:col-span-2">
						<div class="rounded-lg bg-muted p-8 mb-6">
							<div class="flex h-32 items-center justify-center">
								<TheIcon
									name="chefHat"
									size="7xl"
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
								{{ recipe.fields.PersonCount }} personnes
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
											{{ Math.round(recipe.fields.Calories) }}
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

											<span>{{ recipe.fields.Proteins }}g</span>
										</div>

										<TheProgress
											v-model="nutritionProgress.proteins"
											class="h-2"
										/>
									</div>

									<div>
										<div class="flex justify-between text-sm mb-1">
											<span>Glucides</span>

											<span>{{ recipe.fields.Carbohydrates }}g</span>
										</div>

										<TheProgress
											v-model="nutritionProgress.carbohydrates"
											class="h-2"
										/>
									</div>

									<div>
										<div class="flex justify-between text-sm mb-1">
											<span>Lipides</span>

											<span>{{ recipe.fields.Lipids }}g</span>
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
									v-for="ingredient in recipeIngredients"
									:key="ingredient?.id"
									class="flex items-center justify-between rounded-lg border p-3"
								>
									<span class="font-medium">{{ ingredient?.fields.name }}</span>

									<TheBadge variant="secondary">
										{{ ingredient?.fields.category }}
									</TheBadge>
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
								{{ recipe.fields.preparationInstructions }}
							</p>
						</CardContent>
					</TheCard>

					<TheCard v-if="recipeIntolerances.length > 0">
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
									v-for="intolerance in recipeIntolerances"
									:key="intolerance?.id"
									class="border-amber-200 bg-amber-50"
								>
									<AlertDescription>
										<div class="font-medium text-amber-800">
											{{ intolerance?.fields.name }}
										</div>

										<div class="text-sm text-amber-700 mt-1">
											{{ intolerance?.fields.description }}
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
									{{ recipe.fields.nutritionalSummary.value }}
								</AlertDescription>
							</TheAlert>

							<div class="mt-4 space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Vitamines :</span>

									<span class="font-medium">{{ recipe.fields.Vitamins }}</span>
								</div>

								<div class="flex justify-between">
									<span class="text-muted-foreground">Minéraux :</span>

									<span class="font-medium">{{ recipe.fields.Minerals }}</span>
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
									{{ recipe.fields.improvementSuggestions.value }}
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
		</div>
	</div>

	<div
		v-else
		class="min-h-screen bg-gray-50 flex items-center justify-center"
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
				@click="goBack"
				variant="outline"
			>
				<TheIcon
					name="arrowLeft"
					size="lg"
				/>
				Retour
			</TheButton>
		</div>
	</div>
</template>
