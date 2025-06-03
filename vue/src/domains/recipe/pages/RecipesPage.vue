<script setup lang="ts">
import { routerPageName } from "@/router/routerPageName";
import { mockRecipes } from "@/mocks/recipesData";
import { ref, computed } from "vue";
import TheIcon from "@/components/TheIcon.vue";
import { TheButton } from "@/components/ui/button";
import { TheInput } from "@/components/ui/input";
import { TheSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RecipeCard from "@/domains/recipe/components/RecipeCard.vue";

const { RECIPE_CREATE_PAGE } = routerPageName;
const searchQuery = ref("");
const selectedDishType = ref("all");
const selectedPersonCount = ref("all");

const dishTypes = ["all", "Entrée", "Plat principal", "Dessert", "Accompagnement"];
const personCounts = ["all", "1-2", "3-4", "5-6", "7+"];

const filteredRecipes = computed(() => mockRecipes.filter((recipe) => {
	const PERSONS_COUNT = {
		TWO: 2,
		THREE: 3,
		FOUR: 4,
		FIVE: 5,
		SIX: 6,
		SEVEN: 7,
	};

	const matchesSearch = recipe.fields.name.toLowerCase().includes(searchQuery.value.toLowerCase());
	const matchesDishType = selectedDishType.value === "all" || recipe.fields.dishType === selectedDishType.value;
	const matchesPersonCount = selectedPersonCount.value === "all"
            || (selectedPersonCount.value === "1-2" && recipe.fields.PersonCount <= PERSONS_COUNT.TWO)
            || (selectedPersonCount.value === "3-4"
                && recipe.fields.PersonCount >= PERSONS_COUNT.THREE
                && recipe.fields.PersonCount <= PERSONS_COUNT.FOUR)
            || (selectedPersonCount.value === "5-6"
                && recipe.fields.PersonCount >= PERSONS_COUNT.FIVE
                && recipe.fields.PersonCount <= PERSONS_COUNT.SIX)
            || (selectedPersonCount.value === "7+" && recipe.fields.PersonCount >= PERSONS_COUNT.SEVEN);

	return matchesSearch && matchesDishType && matchesPersonCount;
}));

function clearFilters() {
	searchQuery.value = "";
	selectedDishType.value = "all";
	selectedPersonCount.value = "all";
}
</script>

<template>
	<div class="min-h-screen-nh">
		<div class="container mx-auto px-4 py-8">
			<div class="mb-8">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 class="text-3xl font-bold">
							Toutes les recettes
						</h1>

						<p class="mt-1 text-muted-foreground">
							{{ filteredRecipes.length }} recette{{ filteredRecipes.length > 1 ? 's' : '' }} disponible{{ filteredRecipes.length > 1 ? 's' : '' }}
						</p>
					</div>

					<TheButton as-child>
						<RouterLink :to="{ name: RECIPE_CREATE_PAGE }">
							<TheIcon name="plus" />
							Créer une recette
						</RouterLink>
					</TheButton>
				</div>
			</div>

			<div class="mb-8 space-y-4">
				<div class="flex flex-col gap-4 lg:flex-row lg:items-center">
					<div class="relative flex-1">
						<TheIcon
							name="search"
							class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						/>

						<TheInput
							v-model="searchQuery"
							placeholder="Rechercher une recette..."
							class="pl-10"
						/>
					</div>

					<div class="flex gap-4">
						<TheSelect v-model="selectedDishType">
							<SelectTrigger class="w-44">
								<SelectValue placeholder="Type de plat" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="all">
									Tous les types
								</SelectItem>

								<SelectItem
									v-for="type in dishTypes.slice(1)"
									:key="type"
									:value="type"
								>
									{{ type }}
								</SelectItem>
							</SelectContent>
						</TheSelect>

						<TheSelect v-model="selectedPersonCount">
							<SelectTrigger class="w-44">
								<SelectValue placeholder="Nb personnes" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="all">
									Toutes portions
								</SelectItem>

								<SelectItem
									v-for="count in personCounts.slice(1)"
									:key="count"
									:value="count"
								>
									{{ count }} personnes
								</SelectItem>
							</SelectContent>
						</TheSelect>

						<TheButton
							variant="outline"
							@click="clearFilters"
						>
							<TheIcon name="filter" />
							Effacer
						</TheButton>
					</div>
				</div>
			</div>

			<div
				v-if="filteredRecipes.length > 0"
				class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
			>
				<RecipeCard
					v-for="recipe in filteredRecipes"
					:key="recipe.id"
					:recipe="recipe"
				/>
			</div>

			<div
				v-else
				class="text-center py-12"
			>
				<TheIcon
					name="chefHat"
					size="6xl"
					class="mx-auto mb-4 text-muted-foreground"
				/>

				<h3 class="text-lg font-medium mb-2">
					Aucune recette trouvée
				</h3>

				<p class="text-muted-foreground mb-6">
					Essayez de modifier vos critères de recherche ou créez une nouvelle recette.
				</p>

				<TheButton as-child>
					<RouterLink :to="{ name: RECIPE_CREATE_PAGE }">
						<TheIcon name="plus" />
						Créer ma première recette
					</RouterLink>
				</TheButton>
			</div>
		</div>
	</div>
</template>
