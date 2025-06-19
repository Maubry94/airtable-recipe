import { BadRequestHttpResponse, makeResponseContract, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { buildRecipePrompt, iaRoleContent } from "../../providers/ia/prompt";
import { openaiClient } from "../../providers/ia";
import { recipePromptSchema } from "../../providers/ia/schemas/prompt";
import { match } from "ts-pattern";
import { createRecipeTransaction } from "../../providers/json-db";
import { generateRecipeRules } from "../../schema/generate";
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
				.default(generateRecipeRules.numberOfPersons.min),
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
				buildedPrompt: buildRecipePrompt({
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
					generatedRecipe,
				},
			);
		},
		makeResponseContract(OkHttpResponse, "recipe.generated", Recipe.generatedRecipe),
	);
