
import { HttpClient } from "@duplojs/http-client";
import { envs } from "../../envs";
import { type AirtableRecipeRoutes } from "./airtable-routes";
import { type ZodSpace } from "@duplojs/core";
import { type UpdateRecipePayload, type CreateRecipePayload, type recipeFieldsSchema } from "./types/recipe";
import { type CreateIngredientPayload } from "./types/ingredient";
import { type CreateIntolerancePayload } from "./types/intolerance";

interface AirtableRecipeSort {
	field: keyof ZodSpace.infer<typeof recipeFieldsSchema>;
	direction: "asc" | "desc";
}

interface InputGetAirtableRecipeList {
	fields?: string[];
	filterByFormula?: string;
	sort?: AirtableRecipeSort[];
}

interface InputUpdateRecipe {
	recipeId: string;
	fields: Partial<UpdateRecipePayload["records"][number]["fields"]>;
}
export class AirtableAPI {
	private static httpClient: HttpClient<AirtableRecipeRoutes>;

	public static getRecipeList(params: InputGetAirtableRecipeList) {
		const { fields, filterByFormula, sort } = params;

		const query: Record<string, unknown> = {
			fields,
			filterByFormula,
		};

		if (sort) {
			sort.forEach((value, index) => {
				query[`sort[${index}][field]`] = value.field;
				query[`sort[${index}][direction]`] = value.direction;
			});
		}

		return this.httpClient.get(
			"/Recipe",
			{
				query,
			},
		)
			.iWantExpectedResponse();
	}

	public static findRecipeById(recipeId: string) {
		return this.httpClient.get(
			"/Recipe/{recipeId}",
			{
				params: {
					recipeId,
				},
			},
		);
	}

	public static findIngredientById(ingredientId: string) {
		return this.httpClient.get(
			"/Ingredient/{ingredientId}",
			{
				params: {
					ingredientId,
				},
			},
		)
			.iWantExpectedResponse();
	}

	public static findIntoleranceById(intoleranceId: string) {
		return this.httpClient.get(
			"/Intolerance/{intoleranceId}",
			{
				params: {
					intoleranceId,
				},
			},
		)
			.iWantExpectedResponse();
	}

	public static createIngredient(params: CreateIngredientPayload["records"][number]["fields"]) {
		return this.httpClient.post(
			"/Ingredient",
			{
				body: {
					records: [
						{
							fields: params,
						},
					],
				},
			},
		)
			.iWantExpectedResponse();
	}

	public static createIntolerance(params: CreateIntolerancePayload["records"][number]["fields"]) {
		return this.httpClient.post(
			"/Intolerance",
			{
				body: {
					records: [
						{
							fields: params,
						},
					],
				},
			},
		)
			.iWantExpectedResponse();
	}

	public static createRecipe(params: CreateRecipePayload["records"][number]["fields"]) {
		return this.httpClient.post(
			"/Recipe",
			{
				body: {
					records: [
						{
							fields: params,
						},
					],
				},
			},
		)
			.iWantExpectedResponse();
	}

	public static updateRecipe(input: InputUpdateRecipe) {
		return this.httpClient.patch(
			"/Recipe",
			{
				body: {
					records: [
						{
							id: input.recipeId,
							fields: input.fields,
						},
					],
				},
			},
		)
			.iWantExpectedResponse();
	}

	static {
		this.httpClient = new HttpClient<AirtableRecipeRoutes>({
			baseUrl: envs.AIRTABLE_BASE_URL,
		})
			.setDefaultRequestParams({
				headers: {
					get authorization() {
						return `Bearer ${envs.AIRTABLE_API_KEY}`;
					},
				},
			});
	}
}
