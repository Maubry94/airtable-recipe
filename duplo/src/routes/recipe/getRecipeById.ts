import { makeResponseContract, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { iWantRecipeExistById } from "../../checker/recipe";
import { Recipe } from "../../schema/recipe";
import { AirtableAPI } from "../../providers/airtable/airtable";

useBuilder()
	.createRoute("GET", "/recipe/{recipeId}")
	.extract({
		params: {
			recipeId: zod.string(),
		},
	})
	.presetCheck(
		iWantRecipeExistById,
		(pickup) => pickup("recipeId"),
	)
	.cut(
		({ pickup, dropper }) => {
			const recipe = pickup("recipe");
			const ingredients: {
				id: string;
				name: string;
			}[] = [];
			const intolerances: {
				id: string;
				name: string;
				description: string;
			}[] = [];

			recipe.fields.ingredients?.forEach(
				async(ingredientId) => {
					const airtableResponse = await AirtableAPI.findIngredientById(ingredientId);

					if (airtableResponse.code === OkHttpResponse.code) {
						const { body } = airtableResponse;
						ingredients.push({
							id: body.id,
							name: body.fields.name,
						});
					}
				},
			);

			recipe.fields.intolerances?.forEach(
				async(intoleranceId) => {
					const airtableResponse = await AirtableAPI.findIntoleranceById(intoleranceId);

					if (airtableResponse.code === OkHttpResponse.code) {
						const { body } = airtableResponse;
						intolerances.push({
							id: body.id,
							name: body.fields.name,
							description: body.fields.description ?? "",
						});
					}
				},
			);

			return dropper({
				recipe: {
					...recipe,
					fields: {
						...recipe.fields,
						ingredients: ingredients,
						intolerances: intolerances,
					},
				},
			});
		},
		["recipe"],
	)
	.handler(
		(pickup) => {
			const recipe = pickup("recipe");

			return new OkHttpResponse(
				"recipe.found",
				recipe,
			);
		},
		makeResponseContract(OkHttpResponse, "recipe.found", Recipe.index),
	);
