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
		async({ pickup, dropper }) => {
			const recipe = pickup("recipe");
			const computedIngredients: {
				id: string;
				name: string;
			}[] = [];
			const computedIntolerances: {
				id: string;
				name: string;
				description: string;
			}[] = [];

			for (const id of recipe.fields.ingredients ?? []) {
				const airtableResponse = await AirtableAPI.findIngredientById(id);

				if (airtableResponse.ok) {
					const { body } = airtableResponse;
					computedIngredients.push({
						id: body.id,
						name: body.fields.name,
					});
				}
			}

			for (const id of recipe.fields.intolerances ?? []) {
				const airtableResponse = await AirtableAPI.findIntoleranceById(id);

				if (airtableResponse.ok) {
					const { body } = airtableResponse;
					computedIntolerances.push({
						id: body.id,
						name: body.fields.name,
						description: body.fields.description ?? "",
					});
				}
			}

			return dropper({
				recipe: {
					...recipe,
					fields: {
						...recipe.fields,
						ingredients: computedIngredients,
						intolerances: computedIntolerances,
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
