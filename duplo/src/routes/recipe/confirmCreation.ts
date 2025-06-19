import { BadRequestHttpResponse, CreatedHttpResponse, makeResponseContract, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { iWantRecipeTransactionExistById } from "../../checker/recipeTransaction";
import { AirtableAPI } from "../../providers/airtable/airtable";
import { match } from "ts-pattern";
import { jsonDatabase, recipeTransactionPath } from "../../providers/json-db";

useBuilder()
	.createRoute("POST", "/confirm-recipe-creation/{recipeTransactionId}")
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
		async({ pickup, dropper }) => {
			const recipeTransaction = pickup("recipeTransaction");
			const { recipe } = recipeTransaction;

			const airtableResponse = await AirtableAPI.createRecipe({
				name: recipe.name,
				image: recipe.image,
				personCount: recipe.personCount,
				dishType: recipe.dishType,
				totalCalories: recipe.totalCalories,
				numberOfProteins: recipe.numberOfProteins,
				numberOfCarbohydrates: recipe.numberOfCarbohydrates,
				numberOfLipids: recipe.numberOfLipids,
				vitamins: recipe.vitamins,
				minerals: recipe.minerals,
				instructions: recipe.instructions,
			});

			return match(airtableResponse)
				.with(
					{ code: 422 },
					() => new BadRequestHttpResponse("recipe.creation.failed"),
				)
				.with(
					{ code: 200 },
					({ body }) => dropper({ createdRecipeId: body.id }),
				)
				.exhaustive();
		},
		["createdRecipeId"],
		makeResponseContract(BadRequestHttpResponse, "recipe.creation.failed"),
	)
	.cut(
		async({ pickup, dropper }) => {
			const createdRecipeId = pickup("createdRecipeId");
			const recipeTransaction = pickup("recipeTransaction");
			const createdIngredientIds: string[] = [];
			const createdIntoleranceIds: string[] = [];

			recipeTransaction.recipe.ingredients.forEach(
				async(ingredient) => {
					const airtableResponse = await AirtableAPI.createIngredient({
						name: ingredient.name,
						quantity: ingredient.quantity,
						measurementUnit: ingredient.measurementUnit,
						image: ingredient.image,
						relatedRecipes: [createdRecipeId],
					});

					if (airtableResponse.code === OkHttpResponse.code) {
						createdIngredientIds.push(airtableResponse.body.id);
					}
				},
			);

			recipeTransaction.recipe.intolerances.forEach(
				async(intolerance) => {
					const airtableResponse = await AirtableAPI.createIntolerance({
						name: intolerance.name,
						description: intolerance.description,
						relatedRecipes: [createdRecipeId],
					});

					if (airtableResponse.code === OkHttpResponse.code) {
						createdIntoleranceIds.push(airtableResponse.body.id);
					}
				},
			);

			await AirtableAPI.updateRecipe({
				recipeId: createdRecipeId,
				fields: {
					ingredients: createdIngredientIds,
					intolerances: createdIntoleranceIds,
				},
			});

			await jsonDatabase.delete(`${recipeTransactionPath}/${recipeTransaction.id}`);

			return dropper(null);
		},
	)
	.handler(
		(pickup) => {
			const createdRecipeId = pickup("createdRecipeId");

			return new CreatedHttpResponse(
				"recipe.created",
				createdRecipeId,
			);
		},
		makeResponseContract(CreatedHttpResponse, "recipe.created", zod.string()),
	);
