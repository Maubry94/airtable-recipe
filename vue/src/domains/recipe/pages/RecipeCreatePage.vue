<script setup lang="ts">
import { ref } from "vue";
import { useSonner } from "@/composables/useSonner";
import TheIcon from "@/components/TheIcon.vue";
import { TheButton } from "@/components/ui/button";
import {
	TheCard,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { TheLabel } from "@/components/ui/label";
import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field";
import { useRouter } from "vue-router";
import { routerPageName } from "@/router/routerPageName";
import {
	TagsInput,
	TagsInputInput,
	TagsInputItem,
	TagsInputItemDelete,
	TagsInputItemText,
} from "@/components/ui/tags-input";
import { duploClient } from "@/lib/api-client";
import type { GeneratedRecipe } from "@/lib/api-client/types/duplojsTypesCodegen";
import { uselastRecipeTransactionIdLocalStorage } from "../composables/useLastRecipeTransactionId";
import GeneredRecipeCard from "../components/GeneredRecipeCard.vue";

const router = useRouter();
const { RECIPE_DETAIL_PAGE } = routerPageName;
const {
	sonnerWarning,
	sonnerMessage,
} = useSonner();

const {
	setRecipeTransactionId,
	lastRecipeTransactionId,
} = uselastRecipeTransactionIdLocalStorage();

const DEFAUT_PERSON_COUNT = 4;
const personCount = ref(DEFAUT_PERSON_COUNT);
const isModelOpen = ref(false);

const inputIngredients = ref<string[]>([]);
const inputIntolerances = ref<string[]>([]);
const generatedRecipe = ref<GeneratedRecipe | null>(null);

const MIN_ITEMS = 1;

function resetForm() {
	personCount.value = 4;
	inputIngredients.value = [];
	inputIntolerances.value = [];
}

async function generateRecipe() {
	if (inputIngredients.value.length < MIN_ITEMS) {
		return;
	}

	await duploClient.post(
		"/generate-recipe",
		{
			body: {
				numberOfPersons: personCount.value,
				ingredients: inputIngredients.value,
				intolerances: inputIntolerances.value,
			},
		},
	)
		.whenInformation(
			"recipe.invalid",
			() => {
				resetForm();
				sonnerWarning("Les informations fournies sont invalides. Veuillez vérifier vos entrées.");
			},
		)
		.whenInformation(
			"recipe.generated",
			({ body }) => {
				generatedRecipe.value = body;
				isModelOpen.value = true;
				setRecipeTransactionId(body.recipeTransactionId);
				sonnerMessage("Recette générée avec succès !");
			},
		);
}

async function retryGenerateRecipe() {
	if (!lastRecipeTransactionId.value) {
		return;
	}

	await duploClient.post(
		"/recipe/retry-generate/{recipeTransactionId}",
		{
			params: {
				recipeTransactionId: lastRecipeTransactionId.value,
			},
		},
	)
		.whenInformation(
			"recipe.invalid",
			() => {
				resetForm();
				sonnerWarning("Les informations fournies sont invalides. Veuillez vérifier vos entrées.");
			},
		)
		.whenInformation(
			"recipeTransaction.notfound",
			() => {
				sonnerWarning("Vous n'avez pas généré de recette dernièrement.");
			},
		)
		.whenInformation(
			"recipe.retryGenerated",
			({ body }) => {
				generatedRecipe.value = body;
				isModelOpen.value = true;
				setRecipeTransactionId(body.recipeTransactionId);
				sonnerMessage("Recette re-générée avec succès !");
			},
		);
}

async function confirmRecipeCreation() {
	if (!lastRecipeTransactionId.value) {
		return;
	}

	await duploClient.post(
		"/confirm-recipe-creation/{recipeTransactionId}",
		{
			params: {
				recipeTransactionId: lastRecipeTransactionId.value,
			},
		},
	)
		.whenInformation(
			"recipeTransaction.notfound",
			() => {
				sonnerWarning("Vous n'avez pas généré de recette dernièrement.");
			},
		)
		.whenInformation(
			"recipe.creation.failed",
			() => {
				sonnerWarning("La création de la recette a échoué. Veuillez réessayer.");
			},
		)
		.whenInformation(
			"recipe.created",
			({ body }) => {
				sonnerMessage("Recette créée avec succès !");

				void router.push({
					name: RECIPE_DETAIL_PAGE,
					params: { id: body },
				});
			},
		);
}
</script>

<template>
	<section class="min-h-screen-nh">
		<div class="mb-8">
			<TheButton
				variant="ghost"
				@click="router.back"
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

		<div class="grid gap-8 lg:grid-cols-3 lg:items-start">
			<div class="lg:col-span-2 space-y-6">
				<TheCard>
					<CardHeader>
						<CardTitle>Informations de base</CardTitle>

						<CardDescription>
							Donnez les détails principaux de votre recette
						</CardDescription>
					</CardHeader>

					<CardContent class="space-y-4">
						<div class="space-y-2">
							<NumberField
								id="person-count"
								:default-value="DEFAUT_PERSON_COUNT"
								:min="1"
								:max="20"
								v-model="personCount"
							>
								<TheLabel for="person-count">
									Nombre de personnes
								</TheLabel>

								<NumberFieldContent class="w-fit">
									<NumberFieldDecrement />

									<NumberFieldInput class="text-center" />

									<NumberFieldIncrement />
								</NumberFieldContent>
							</NumberField>
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
							<div>
								<TagsInput v-model="inputIngredients">
									<TagsInputItem
										v-for="item in inputIngredients"
										:key="item"
										:value="item"
									>
										<TagsInputItemText />

										<TagsInputItemDelete />
									</TagsInputItem>

									<TagsInputInput placeholder="Chocolat, fraise..." />
								</TagsInput>
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
							<TagsInput v-model="inputIntolerances">
								<TagsInputItem
									v-for="item in inputIntolerances"
									:key="item"
									:value="item"
								>
									<TagsInputItemText />

									<TagsInputItemDelete />
								</TagsInputItem>

								<TagsInputInput placeholder="Noisettes, cacahuètes..." />
							</TagsInput>
						</div>
					</CardContent>
				</TheCard>
			</div>

			<div class="lg:sticky lg:top-22 space-y-6">
				<TheCard>
					<CardHeader>
						<CardTitle>Résumé</CardTitle>
					</CardHeader>

					<CardContent class="space-y-3">
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
								{{ inputIngredients.length }}
							</span>
						</div>

						<div class="flex items-center justify-between">
							<span class="text-sm text-muted-foreground">Restrictions :</span>

							<span class="text-sm font-medium">
								{{ inputIntolerances.length }}
							</span>
						</div>
					</CardContent>
				</TheCard>

				<div class="space-y-3">
					<TheButton
						@click="generateRecipe"
						:disabled="inputIngredients.length < MIN_ITEMS"
						class="w-full"
						size="lg"
					>
						<TheIcon
							name="sparkles"
						/>
						Générer la recette
					</TheButton>

					<TheButton
						variant="outline"
						@click="resetForm"
						class="w-full"
					>
						Réinitialiser
					</TheButton>

					<GeneredRecipeCard
						v-model:is-open="isModelOpen"
						:generated-recipe="generatedRecipe"
						@retry="retryGenerateRecipe"
						@confirm="confirmRecipeCreation"
					/>
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
	</section>
</template>
