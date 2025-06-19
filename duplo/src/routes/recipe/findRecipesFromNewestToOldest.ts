import { makeResponseContract, OkHttpResponse, UnprocessableEntityHttpResponse, useBuilder } from "@duplojs/core";
import { AirtableAPI } from "../../providers/airtable/airtable";
import { match } from "ts-pattern";
import { Recipe } from "../../schema/recipe";

useBuilder()
	.createRoute("GET", "/find-recipes-from-newest-to-oldest")
	.handler(
		async() => {
			const airtableResponse = await AirtableAPI.getRecipeList({
				sort: [
					{
						field: "createdAt",
						direction: "desc",
					},
				],
			});

			return match(airtableResponse)
				.with(
					{ code: 422 },
					() => new UnprocessableEntityHttpResponse("recipes.get.failed"),
				)
				.with(
					{ code: 200 },
					({ body }) => new OkHttpResponse(
						"recipes.get",
						body,
					),
				)
				.exhaustive();
		},
		[
			...makeResponseContract(UnprocessableEntityHttpResponse, "recipes.get.failed"),
			...makeResponseContract(OkHttpResponse, "recipes.get", Recipe.recipeList),
		],
	);
