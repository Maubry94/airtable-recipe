import { createChecker, createPresetChecker, makeResponseContract, NotFoundHttpResponse } from "@duplojs/core";
import { match } from "ts-pattern";
import { AirtableAPI } from "../providers/airtable/airtable";

export const recipeExistCheck = createChecker("recipeExist")
	.handler(
		async(input: string, output) => {
			const airtableResponse = await AirtableAPI.findRecipeById(input);

			return match(airtableResponse)
				.with(
					{ code: 200 },
					({ body }) => output("recipe.exist", body),
				)
				.with(
					{ code: 404 },
					() => output("recipe.notfound", null),
				)
				.exhaustive();
		},
	);

export const iWantRecipeExistById = createPresetChecker(
	recipeExistCheck,
	{
		result: "recipe.exist",
		catch: () => new NotFoundHttpResponse("recipe.notfound"),
		indexing: "recipe",
	},
	makeResponseContract(NotFoundHttpResponse, "recipe.notfound"),
);
