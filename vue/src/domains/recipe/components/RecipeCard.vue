<script setup lang="ts">
import { ref } from "vue";
import { routerPageName } from "@/router/routerPageName";
import TheIcon from "@/components/TheIcon.vue";
import { TheCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TheBadge } from "@/components/ui/badge";
import type { RecipeList } from "@/lib/api-client/types/duplojsTypesCodegen";

interface Props {
	recipe: RecipeList["records"][number];
}

const props = defineProps<Props>();

const { RECIPE_DETAIL_PAGE } = routerPageName;

const imageLoadError = ref(false);

function handleImageError() {
	imageLoadError.value = true;
}
</script>

<template>
	<RouterLink
		:to="{ name: RECIPE_DETAIL_PAGE, params: { id: recipe.id } }"
		class="group"
	>
		<TheCard class="overflow-hidden transition-all pt-0 group-hover:shadow-lg hover:scale-[1.01]">
			<div class="flex h-full items-center justify-center aspect-video bg-muted">
				<img
					v-if="recipe.fields.image && !imageLoadError"
					:src="recipe.fields.image"
					alt="Image de la recette"
					class="w-full h-full object-cover rounded-lg"
					@error="handleImageError"
				>

				<TheIcon
					v-else
					name="chefHat"
					size="4xl"
				/>
			</div>

			<CardHeader class="pb-3">
				<CardTitle class="line-clamp-2 text-lg transition-colors">
					{{ props.recipe.fields.name }}
				</CardTitle>

				<CardDescription>
					{{ props.recipe.fields.dishType }}
				</CardDescription>
			</CardHeader>

			<CardContent class="pt-0 flex-1">
				<div class="space-y-3 h-full flex flex-col justify-between">
					<div class="flex items-center justify-between text-sm text-muted-foreground">
						<div class="flex gap-1 items-center">
							<TheIcon
								name="users"
								size="xs"
							/>
							{{ props.recipe.fields.personCount }}
						</div>

						<div class="flex gap-1 items-center">
							<TheIcon
								name="clock"
								size="xs"
							/>
							~30min
						</div>
					</div>

					<div class="grid grid-cols-2 gap-2 text-xs">
						<div class="text-center rounded bg-gray-50 p-2">
							<div class="font-semibold text-orange-600">
								{{ Math.round(props.recipe.fields.totalCalories) }}
							</div>

							<div class="text-muted-foreground">
								kcal
							</div>
						</div>

						<div class="text-center rounded bg-gray-50 p-2">
							<div class="font-semibold text-blue-600">
								{{ props.recipe.fields.numberOfProteins }}g
							</div>

							<div class="text-muted-foreground">
								protéines
							</div>
						</div>
					</div>

					<div class="flex flex-wrap gap-1">
						<TheBadge
							variant="secondary"
							class="text-xs"
						>
							{{ props.recipe.fields.ingredientCount }} ingrédients
						</TheBadge>

						<TheBadge
							variant="outline"
							class="text-xs"
							:class="{
								'border-green-300 text-green-700': props.recipe.fields.totalCalories < 300,
								'border-orange-300 text-orange-700': props.recipe.fields.totalCalories >= 300 && props.recipe.fields.totalCalories < 500,
								'border-red-300 text-red-700': props.recipe.fields.totalCalories >= 500
							}"
						>
							{{ props.recipe.fields.totalCalories < 300 ? 'Léger' : props.recipe.fields.totalCalories < 500 ? 'Modéré' : 'Consistant' }}
						</TheBadge>
					</div>
				</div>
			</CardContent>
		</TheCard>
	</RouterLink>
</template>
