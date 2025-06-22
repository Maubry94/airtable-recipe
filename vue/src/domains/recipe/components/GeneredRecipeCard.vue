<script setup lang="ts">
import type { GeneratedRecipe } from "@/lib/api-client/types/duplojsTypesCodegen";
import { computed } from "vue";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	TheDialog,
} from "@/components/ui/dialog";
import TheIcon from "@/components/TheIcon.vue";
import { TheBadge } from "@/components/ui/badge";
import { TheButton } from "@/components/ui/button";

interface Props {
	isOpen: boolean;
	generatedRecipe: GeneratedRecipe | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	"update:isOpen": [value: boolean];
	retry: [];
	confirm: [];
}>();

const isModalOpen = computed({
	get: () => props.isOpen,
	set: (value: boolean) => void emit("update:isOpen", value),
});

function handleRetry() {
	emit("retry");
}

function handleConfirm() {
	emit("confirm");
}
</script>

<template>
	<TheDialog v-model:open="isModalOpen">
		<DialogContent class="max-w-4xl p-0 overflow-hidden">
			<div class="px-6 py-4 border-b border-border bg-gray-50">
				<DialogHeader class="space-y-0">
					<div class="flex gap-3 items-center">
						<div class="p-2 bg-muted rounded-full">
							<TheIcon name="chefHat" />
						</div>

						<div>
							<DialogTitle class="text-xl font-bold">
								🎉 Recette générée avec succès !
							</DialogTitle>

							<DialogDescription class="mt-1 text-sm text-muted-foreground">
								Voici votre création culinaire personnalisée
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>
			</div>

			<div class="max-h-[calc(90vh-180px)] pl-6 pr-2.5 overflow-y-auto">
				<div
					v-if="generatedRecipe?.recipe"
					class="space-y-6"
				>
					<div class="space-y-4">
						<div class="flex flex-col lg:flex-row gap-6">
							<div class="shrink-0">
								<img
									:src="generatedRecipe.recipe.image"
									alt="Image de la recette"
									class="w-full lg:w-64 h-48 object-cover rounded-xl shadow-md"
								>
							</div>

							<div class="flex-1 space-y-4">
								<div>
									<h3 class="mb-2 text-2xl font-bold">
										{{ generatedRecipe.recipe.name }}
									</h3>

									<div class="flex flex-wrap gap-3 text-sm">
										<div class="flex gap-1 items-center text-muted-foreground">
											<TheIcon
												name="users"
												size="xs"
											/>
											{{ generatedRecipe.recipe.personCount }} personnes
										</div>

										<div class="flex gap-1 items-center text-muted-foreground">
											<TheIcon
												name="clock"
												size="xs"
											/>
											~30 minutes
										</div>

										<TheBadge variant="outline">
											{{ generatedRecipe.recipe.dishType }}
										</TheBadge>
									</div>
								</div>
							</div>
						</div>

						<div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
							<div class="p-3 text-center bg-orange-50 rounded-lg">
								<div class="text-lg font-bold text-orange-600">
									{{ Math.round(generatedRecipe.recipe.totalCalories) }}
								</div>

								<div class="text-xs text-muted-foreground">
									kcal
								</div>
							</div>

							<div class="p-3 text-center bg-blue-50 rounded-lg">
								<div class="text-lg font-bold text-blue-600">
									{{ generatedRecipe.recipe.numberOfProteins }}g
								</div>

								<div class="text-xs text-muted-foreground">
									protéines
								</div>
							</div>

							<div class="p-3 text-center bg-green-50 rounded-lg">
								<div class="text-lg font-bold text-green-600">
									{{ generatedRecipe.recipe.numberOfCarbohydrates }}g
								</div>

								<div class="text-xs text-muted-foreground">
									glucides
								</div>
							</div>

							<div class="p-3 text-center bg-purple-50 rounded-lg">
								<div class="text-lg font-bold text-purple-600">
									{{ generatedRecipe.recipe.numberOfLipids }}g
								</div>

								<div class="text-xs text-muted-foreground">
									lipides
								</div>
							</div>
						</div>
					</div>

					<div class="bg-gray-50 rounded-xl p-4">
						<h4 class="mb-3 flex gap-2 items-center text-lg font-semibold">
							<TheIcon
								name="utensils"
								class="text-orange-600"
							/>
							Ingrédients
						</h4>

						<div class="grid gap-3 sm:grid-cols-2">
							<div
								v-for="(ingredient, index) in generatedRecipe.recipe.ingredients"
								:key="index"
								class="p-3 flex gap-3 items-center bg-white rounded-lg shadow-sm"
							>
								<img
									:src="ingredient.image"
									alt="Image ingrédient"
									class="size-12 object-cover rounded-lg"
								>

								<div class="flex-1">
									<div class="font-medium">
										{{ ingredient.name }}
									</div>

									<div class="text-sm text-muted-foreground">
										{{ ingredient.quantity }} {{ ingredient.measurementUnit }}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div
						v-if="generatedRecipe.recipe.instructions"
						class="p-4 bg-blue-50 rounded-xl"
					>
						<h4 class="mb-3 flex gap-2 items-center text-lg font-semibold">
							<TheIcon
								name="bookOpen"
								class="text-blue-600"
							/>
							Instructions de préparation
						</h4>

						<div class="max-w-none prose prose-sm">
							<p class="text-muted-foreground leading-relaxed whitespace-pre-line">
								{{ generatedRecipe.recipe.instructions }}
							</p>
						</div>
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<div
							v-if="generatedRecipe.recipe.vitamins"
							class="p-4 bg-green-50 rounded-xl"
						>
							<h4 class="mb-2 flex gap-2 items-center text-lg font-semibold">
								<TheIcon
									name="heart"
									class="text-green-600"
								/>
								Vitamines
							</h4>

							<p class="text-muted-foreground">
								{{ generatedRecipe.recipe.vitamins }}
							</p>
						</div>

						<div
							v-if="generatedRecipe.recipe.minerals"
							class="p-4 bg-amber-50 rounded-xl"
						>
							<h4 class="mb-2 flex gap-2 items-center text-lg font-semibold">
								<TheIcon
									name="gem"
									class="text-amber-600"
								/>
								Minéraux
							</h4>

							<p class="text-muted-foreground">
								{{ generatedRecipe.recipe.minerals }}
							</p>
						</div>
					</div>

					<div
						v-if="generatedRecipe.recipe.intolerances?.length > 0"
						class="p-4 bg-red-50 rounded-xl"
					>
						<h4 class="mb-3 flex gap-2 items-center text-lg font-semibold">
							<TheIcon
								name="alertTriangle"
								class="text-red-600"
							/>
							Allergènes et intolérances
						</h4>

						<div class="space-y-2">
							<div
								v-for="(intolerance, index) in generatedRecipe.recipe.intolerances"
								:key="index"
								class="p-3 flex gap-2 items-start bg-white rounded-lg"
							>
								<TheIcon
									name="alertCircle"
									class="text-red-500 shrink-0"
								/>

								<div>
									<div class="font-medium text-red-800">
										{{ intolerance.name }}
									</div>

									<div
										v-if="intolerance.description"
										class="mt-1 text-sm text-red-700"
									>
										{{ intolerance.description }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="px-6 py-4 bg-gray-50 border-t border-border">
				<DialogFooter>
					<TheButton
						variant="outline"
						@click="handleRetry"
						class="flex-1 sm:flex-none"
					>
						<TheIcon name="refreshCw" />
						Re-générer
					</TheButton>

					<TheButton
						@click="handleConfirm"
						class="flex-1 sm:flex-none"
					>
						<TheIcon name="check" />
						Confirmer la création
					</TheButton>
				</DialogFooter>
			</div>
		</DialogContent>
	</TheDialog>
</template>
