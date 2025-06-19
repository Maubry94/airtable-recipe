import { BadRequestHttpResponse, makeResponseContract, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { iWantRecipeTransactionExistById } from "../../checker/recipeTransaction";
import { buildRetryRecipePrompt, iaRoleContent } from "../../providers/ia/prompt";
import { openaiClient } from "../../providers/ia";
import { recipePromptSchema } from "../../providers/ia/schemas/prompt";
import { match } from "ts-pattern";
import { createRecipeTransaction, jsonDatabase, recipeTransactionPath } from "../../providers/json-db";
import { Recipe } from "../../schema/recipe";

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
				buildedPrompt: buildRetryRecipePrompt({
					...recipeTransaction.generationCriteria,
					previousRecipeName: recipeTransaction.recipe.name,
				}),
			});
		},
		["buildedPrompt"],
	)
	.cut(
		async({ pickup, dropper }) => {
			const buildedPrompt = pickup("buildedPrompt");

			const chatCompletion = await openaiClient.chat.completions.create({
				model: "google/gemini-2.0-flash-exp:free",
				messages: [
					{
						role: "system",
						content: iaRoleContent,
					},
					{
						role: "user",
						content: buildedPrompt,
					},
				],
			});

			const [{ message: { content } }] = chatCompletion.choices;
			const zodParse = recipePromptSchema.safeParse(content);

			return match(zodParse)
				.with(
					{ success: false },
					() => new BadRequestHttpResponse("parsing.failed"),
				)
				.with(
					{ success: true },
					({ data }) => dropper({
						generatedRecipe: data,
					}),
				)
				.exhaustive();
		},
		["generatedRecipe"],
		makeResponseContract(BadRequestHttpResponse, "parsing.failed"),
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

			await jsonDatabase.delete(`${recipeTransactionPath}/${lastRecipeTransaction.id}`);

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
				"recipe.retry.generated",
				{
					recipeTransactionId,
					generatedRecipe,
				},
			);
		},
		makeResponseContract(OkHttpResponse, "recipe.retry.generated", Recipe.generatedRecipe),
	);

