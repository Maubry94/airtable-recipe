
import { BadRequestHttpResponse, makeResponseContract, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { iWantRecipeTransactionExistById } from "../../checker/recipeTransaction";
import { buildRetryRecipeIAPrompt } from "../../providers/ia/prompt";
import { Recipe } from "../../schema/recipe";
import { createRecipeTransaction, deleteRecipeTransaction } from "../../providers/json-db/recipeTransaction";
import { createRecipeCompletion } from "../../providers/ia/completion";

useBuilder()
	.createRoute("POST", "/recipe/retry-generate/{recipeTransactionId}")
	.extract({
		params: {
			recipeTransactionId: zod.string(),
		},
	})
	.presetCheck(
		iWantRecipeTransactionExistById,
		(pickup) => pickup("recipeTransactionId"),
	)
	.cut(
		({ pickup, dropper }) => {
			const recipeTransaction = pickup("recipeTransaction");

			return dropper({
				retryBuildedPrompt: buildRetryRecipeIAPrompt({
					...recipeTransaction.generationCriteria,
					previousRecipeName: recipeTransaction.recipe.name,
				}),
			});
		},
		["retryBuildedPrompt"],
	)
	.cut(
		async({ pickup, dropper }) => {
			const retryBuildedPrompt = pickup("retryBuildedPrompt");

			return dropper({
				generatedRecipe: await createRecipeCompletion(retryBuildedPrompt),
			});
		},
		["generatedRecipe"],
	)
	.cut(
		async({ pickup, dropper }) => {
			const { generatedRecipe } = pickup(["generatedRecipe"]);
			const lastRecipeTransaction = pickup("recipeTransaction");

			if (!generatedRecipe) {
				return new BadRequestHttpResponse("recipe.invalid");
			}

			const recipeTransactionId = await createRecipeTransaction({
				recipe: generatedRecipe,
				generationCriteria: {
					...lastRecipeTransaction.generationCriteria,
				},
			});

			await deleteRecipeTransaction(lastRecipeTransaction.id);

			return dropper({ recipeTransactionId });
		},
		["recipeTransactionId"],
		makeResponseContract(BadRequestHttpResponse, "recipe.invalid"),
	)
	.handler(
		(pickup) => {
			const recipeTransactionId = pickup("recipeTransactionId");
			const generatedRecipe = pickup("generatedRecipe");

			return new OkHttpResponse(
				"recipe.retryGenerated",
				{
					recipeTransactionId,
					recipe: generatedRecipe,
				},
			);
		},
		makeResponseContract(
			OkHttpResponse,
			"recipe.retryGenerated",
			Recipe.generatedRecipe,
		),
	);

