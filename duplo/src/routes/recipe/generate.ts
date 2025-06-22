
import { BadRequestHttpResponse, makeResponseContract, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { buildRecipeIAPrompt } from "../../providers/ia/prompt";
import { createRecipeTransaction } from "../../providers/json-db/recipeTransaction";
import { createRecipeCompletion } from "../../providers/ia/completion";
import { Recipe } from "../../schema/recipe";

useBuilder()
	.createRoute("POST", "/generate-recipe")
	.extract({
		body: {
			ingredients: zod.string().array(),
			intolerances: zod.string().array()
				.optional()
				.default([]),
			numberOfPersons: zod.coerce.number()
				.optional()
				.default(Recipe.generatedRecipeRules.numberOfPersons.min),
		},
	})
	.cut(
		({ pickup, dropper }) => {
			const {
				ingredients,
				intolerances,
				numberOfPersons,
			} = pickup(["ingredients", "intolerances", "numberOfPersons"]);

			return dropper({
				buildedPrompt: buildRecipeIAPrompt({
					ingredients,
					intolerances,
					numberOfPersons,
				}),
			});
		},
		["buildedPrompt"],
	)
	.cut(
		async({ pickup, dropper }) => {
			const buildedPrompt = pickup("buildedPrompt");

			return dropper({
				generatedRecipe: await createRecipeCompletion(buildedPrompt),
			});
		},
		["generatedRecipe"],
	)
	.cut(
		async({ pickup, dropper }) => {
			const {
				generatedRecipe,
				ingredients,
				intolerances,
				numberOfPersons,
			} = pickup(["generatedRecipe", "ingredients", "intolerances", "numberOfPersons"]);

			if (!generatedRecipe) {
				return new BadRequestHttpResponse("recipe.invalid");
			}

			const recipeTransactionId = await createRecipeTransaction({
				recipe: generatedRecipe,
				generationCriteria: {
					ingredients,
					intolerances,
					numberOfPersons,
				},
			});

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
				"recipe.generated",
				{
					recipeTransactionId,
					recipe: generatedRecipe,
				},
			);
		},
		makeResponseContract(
			OkHttpResponse,
			"recipe.generated",
			Recipe.generatedRecipe,
		),
	);
