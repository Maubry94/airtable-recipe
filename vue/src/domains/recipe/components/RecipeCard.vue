<script setup lang="ts">
import { routerPageName } from "@/router/routerPageName";
import TheIcon from "@/components/TheIcon.vue";
import { TheCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TheBadge } from "@/components/ui/badge";

interface Recipe {
	id: string;
	fields: {
		name: string;
		dishType: string;
		PersonCount: number;
		Calories: number;
		Proteins: number;
		ingredientCount: number;
	};
}

defineProps<{
	recipe: Recipe;
}>();

const { RECIPE_DETAIL_PAGE } = routerPageName;
</script>

<template>
	<RouterLink
		:to="{ name: RECIPE_DETAIL_PAGE, params: { id: recipe.id } }"
		class="group"
	>
		<TheCard class="overflow-hidden transition-all pt-0 group-hover:shadow-lg hover:scale-[1.01]">
			<div class="aspect-video bg-muted p-6">
				<div class="flex h-full items-center justify-center">
					<TheIcon
						name="chefHat"
						size="4xl"
					/>
				</div>
			</div>

			<CardHeader class="pb-3">
				<CardTitle class="line-clamp-2 text-lg transition-colors">
					{{ recipe.fields.name }}
				</CardTitle>

				<CardDescription>
					{{ recipe.fields.dishType }}
				</CardDescription>
			</CardHeader>

			<CardContent class="pt-0">
				<div class="space-y-3">
					<div class="flex items-center justify-between text-sm text-muted-foreground">
						<div class="flex gap-1 items-center">
							<TheIcon
								name="users"
								size="xs"
							/>
							{{ recipe.fields.PersonCount }}
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
								{{ Math.round(recipe.fields.Calories) }}
							</div>

							<div class="text-muted-foreground">
								kcal
							</div>
						</div>

						<div class="text-center rounded bg-gray-50 p-2">
							<div class="font-semibold text-blue-600">
								{{ recipe.fields.Proteins }}g
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
							{{ recipe.fields.ingredientCount }} ingrédients
						</TheBadge>

						<TheBadge
							variant="outline"
							class="text-xs"
							:class="{
								'border-green-300 text-green-700': recipe.fields.Calories < 300,
								'border-orange-300 text-orange-700': recipe.fields.Calories >= 300 && recipe.fields.Calories < 500,
								'border-red-300 text-red-700': recipe.fields.Calories >= 500
							}"
						>
							{{ recipe.fields.Calories < 300 ? 'Léger' : recipe.fields.Calories < 500 ? 'Modéré' : 'Consistant' }}
						</TheBadge>
					</div>
				</div>
			</CardContent>
		</TheCard>
	</RouterLink>
</template>
