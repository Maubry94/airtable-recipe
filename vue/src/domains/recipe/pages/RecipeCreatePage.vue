<script setup lang="ts">
import { ref, computed } from "vue";
import TheIcon from "@/components/TheIcon.vue";
import { TheButton } from "@/components/ui/button";
import { TheInput } from "@/components/ui/input";
import { TheTextarea } from "@/components/ui/textarea";
import { TheCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TheBadge } from "@/components/ui/badge";
import { TheSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TheLabel } from "@/components/ui/label";
import { TheCheckbox } from "@/components/ui/checkbox";
import { mockIngredients, mockIntolerances } from "@/mocks/recipesData";
import { useRouter } from "vue-router";
import { routerPageName } from "@/router/routerPageName";

const router = useRouter();
const { RECIPE_PAGE } = routerPageName;

const recipeName = ref("");
const DEFAUT_PERSON_COUNT = 4;
const personCount = ref(DEFAUT_PERSON_COUNT);
const dishType = ref("");
const selectedIngredients = ref<string[]>([]);
const selectedIntolerances = ref<string[]>([]);
const customInstructions = ref("");
const isGenerating = ref(false);

const ZERO = 0;
const isFormValid = computed(() => recipeName.value.trim() !== ""
        && personCount.value > ZERO
        && dishType.value !== ""
        && selectedIngredients.value.length > ZERO);

const selectedIngredientsData = computed(() => selectedIngredients.value
	.map((id) => mockIngredients.find((ingredient) => ingredient.id === id))
	.filter(Boolean));

// const selectedIntolerancesData = computed(() => selectedIntolerances.value
// .map((id) => mockIntolerances.find((intolerance) => intolerance.id === id))
// .filter(Boolean));

const dishTypes = ["Entrée", "Plat principal", "Dessert", "Accompagnement"];

function goBack() {
	router.back();
}

function addIngredient(ingredientId: string) {
	if (!selectedIngredients.value.includes(ingredientId)) {
		selectedIngredients.value.push(ingredientId);
	}
}

const NOT_FOUND = -1;
const SPLICE_INDEX = 1;
function removeIngredient(ingredientId: string) {
	const index = selectedIngredients.value.indexOf(ingredientId);
	if (index > NOT_FOUND) {
		selectedIngredients.value.splice(index, SPLICE_INDEX);
	}
}
function toggleIntolerance(intoleranceId: string) {
	const index = selectedIntolerances.value.indexOf(intoleranceId);
	if (index > NOT_FOUND) {
		selectedIntolerances.value.splice(index, SPLICE_INDEX);
	} else {
		selectedIntolerances.value.push(intoleranceId);
	}
}

const API_SIMULATION_DELAY = 2000;
async function generateRecipe() {
	if (!isFormValid.value) {
		return;
	}

	isGenerating.value = true;

	// Fake API call simulation
	await new Promise((resolve) => {
		setTimeout(resolve, API_SIMULATION_DELAY);
	});

	isGenerating.value = false;
	isGenerating.value = false;

	console.log("Recette générée avec succès !", {
		name: recipeName.value,
		personCount: personCount.value,
		dishType: dishType.value,
		selectedIngredients: selectedIngredientsData.value,
		selectedIntolerances: selectedIntolerances.value,
		customInstructions: customInstructions.value,
	});

	void router.push({ name: RECIPE_PAGE });
}

function resetForm() {
	recipeName.value = "";
	personCount.value = 4;
	dishType.value = "";
	selectedIngredients.value = [];
	selectedIntolerances.value = [];
	customInstructions.value = "";
}
</script>

<template>
	<div class="min-h-screen bg-gray-50">
		<div class="container mx-auto px-4 py-8">
			<div class="mb-8">
				<TheButton
					variant="ghost"
					@click="goBack"
					class="mb-4"
				>
					<TheIcon name="arrowLeft" />
					Retour
				</TheButton>

				<div class="text-center">
					<div class="mb-6 flex justify-center">
						<div class="rounded-full bg-muted p-4">
							<TheIcon
								name="sparkles"
								size="4xl"
							/>
						</div>
					</div>

					<h1 class="text-3xl font-bold mb-2">
						Créer une nouvelle recette
					</h1>

					<p class="text-muted-foreground max-w-2xl mx-auto">
						Renseignez vos préférences et laissez l'IA créer une recette personnalisée avec analyse nutritionnelle complète.
					</p>
				</div>
			</div>

			<div class="grid gap-8 lg:grid-cols-3">
				<div class="lg:col-span-2 space-y-6">
					<TheCard>
						<CardHeader>
							<CardTitle>Informations de base</CardTitle>

							<CardDescription>
								Donnez les détails principaux de votre recette
							</CardDescription>
						</CardHeader>

						<CardContent class="space-y-4">
							<div class="grid gap-4 sm:grid-cols-2">
								<div class="space-y-2">
									<TheLabel for="recipe-name">
										Nom de la recette
									</TheLabel>

									<TheInput
										id="recipe-name"
										v-model="recipeName"
										placeholder="Ex: Tarte au chocolat épicée"
									/>
								</div>

								<div class="space-y-2">
									<TheLabel for="dish-type">
										Type de plat
									</TheLabel>

									<TheSelect v-model="dishType">
										<SelectTrigger>
											<SelectValue placeholder="Choisir un type" />
										</SelectTrigger>

										<SelectContent>
											<SelectItem
												v-for="type in dishTypes"
												:key="type"
												:value="type"
											>
												{{ type }}
											</SelectItem>
										</SelectContent>
									</TheSelect>
								</div>
							</div>

							<div class="space-y-2">
								<TheLabel for="person-count">
									Nombre de personnes
								</TheLabel>

								<div class="flex items-center space-x-4">
									<TheButton
										variant="outline"
										size="sm"
										@click="personCount = Math.max(1, personCount - 1)"
									>
										-
									</TheButton>

									<div class="flex items-center space-x-2">
										<TheIcon name="users" />

										<span class="text-lg font-medium w-8 text-center">{{ personCount }}</span>
									</div>

									<TheButton
										variant="outline"
										size="sm"
										@click="personCount = Math.min(20, personCount + 1)"
									>
										+
									</TheButton>
								</div>
							</div>
						</CardContent>
					</TheCard>

					<TheCard>
						<CardHeader>
							<CardTitle>Ingrédients souhaités</CardTitle>

							<CardDescription>
								Choisissez les ingrédients que vous souhaitez utiliser
							</CardDescription>
						</CardHeader>

						<CardContent>
							<div
								class="mb-4"
							>
								<h4 class="text-sm font-medium mb-2">
									Ingrédients sélectionnés :
								</h4>

								<div class="flex flex-wrap gap-2">
									<TheBadge
										v-for="ingredient in selectedIngredientsData"
										:key="ingredient?.id"
										variant="secondary"
										class="cursor-pointer hover:bg-red-100 hover:text-red-700"
										@click="removeIngredient(ingredient?.id || '')"
									>
										{{ ingredient?.fields.name }}
										<TheIcon
											name="trash2"
											size="xs"
										/>
									</TheBadge>
								</div>
							</div>

							<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
								<div
									v-for="ingredient in mockIngredients"
									:key="ingredient.id"
									class="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-gray-50"
									:class="{
										'bg-orange-50 border-orange-200': selectedIngredients.includes(ingredient.id)
									}"
									@click="addIngredient(ingredient.id)"
								>
									<div>
										<div class="font-medium">
											{{ ingredient.fields.name }}
										</div>

										<div class="text-xs text-muted-foreground">
											{{ ingredient.fields.category }}
										</div>
									</div>

									<TheIcon
										v-if="selectedIngredients.includes(ingredient.id)"
										name="check"
										class="text-orange-600"
									/>
								</div>
							</div>
						</CardContent>
					</TheCard>

					<TheCard>
						<CardHeader>
							<CardTitle>Intolérances alimentaires</CardTitle>

							<CardDescription>
								Sélectionnez vos restrictions alimentaires (optionnel)
							</CardDescription>
						</CardHeader>

						<CardContent>
							<div class="space-y-3">
								<div
									v-for="intolerance in mockIntolerances"
									:key="intolerance.id"
									class="flex items-start space-x-3"
								>
									<TheCheckbox
										:id="intolerance.id"
										:checked="selectedIntolerances.includes(intolerance.id)"
										@update:checked="toggleIntolerance(intolerance.id)"
									/>

									<div class="flex-1">
										<TheLabel
											:for="intolerance.id"
											class="text-sm font-medium cursor-pointer"
										>
											{{ intolerance.fields.name }}
										</TheLabel>

										<p class="text-xs text-muted-foreground mt-1">
											{{ intolerance.fields.description }}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</TheCard>

					<TheCard>
						<CardHeader>
							<CardTitle>Instructions spéciales (optionnel)</CardTitle>

							<CardDescription>
								Ajoutez des instructions particulières pour votre recette
							</CardDescription>
						</CardHeader>

						<CardContent>
							<TheTextarea
								v-model="customInstructions"
								placeholder="Ex : Sans cuisson, recette rapide, utiliser un robot..."
								rows="3"
							/>
						</CardContent>
					</TheCard>
				</div>

				<div class="space-y-6">
					<TheCard>
						<CardHeader>
							<CardTitle>Résumé</CardTitle>
						</CardHeader>

						<CardContent class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">Nom :</span>

								<span class="text-sm font-medium">
									{{ recipeName || "Non défini" }}
								</span>
							</div>

							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">Type:</span>

								<span class="text-sm font-medium">
									{{ dishType || "Non défini" }}
								</span>
							</div>

							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">Personnes :</span>

								<span class="text-sm font-medium flex gap-1 items-center">
									<TheIcon
										name="users"
										size="xs"
									/>
									{{ personCount }}
								</span>
							</div>

							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">Ingrédients :</span>

								<span class="text-sm font-medium">
									{{ selectedIngredients.length }}
								</span>
							</div>

							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">Restrictions :</span>

								<span class="text-sm font-medium">
									{{ selectedIntolerances.length }}
								</span>
							</div>
						</CardContent>
					</TheCard>

					<div class="space-y-3">
						<TheButton
							@click="generateRecipe"
							:disabled="!isFormValid || isGenerating"
							class="w-full"
							size="lg"
						>
							<TheIcon
								v-if="isGenerating"
								name="loader"
								class="animate-spin"
							/>

							<TheIcon
								v-else
								name="sparkles"
							/>
							{{ isGenerating ? "Génération..." : "Générer la recette" }}
						</TheButton>

						<TheButton
							variant="outline"
							@click="resetForm"
							class="w-full"
						>
							Réinitialiser
						</TheButton>
					</div>

					<TheCard>
						<CardHeader>
							<CardTitle class="text-sm">
								Comment ça marche ?
							</CardTitle>
						</CardHeader>

						<CardContent class="text-xs text-muted-foreground space-y-2">
							<p>
								Notre IA analyse vos préférences pour créer une recette unique avec :
							</p>

							<ul class="list-disc list-inside space-y-1 ml-2">
								<li>Instructions détaillées</li>

								<li>Analyse nutritionnelle complète</li>

								<li>Suggestions d'amélioration</li>

								<li>Respect des intolérances</li>
							</ul>
						</CardContent>
					</TheCard>
				</div>
			</div>
		</div>
	</div>
</template>
