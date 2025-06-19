import { type CreateIngredientPayload, type IngredientAirtable } from "./types/ingredient";
import { type CreateIntolerancePayload, type IntoleranceAirtable } from "./types/intolerance";
import { type UpdateRecipePayload, type CreateRecipePayload, type RecipeAirtable, type RecipeListAirtable } from "./types/recipe";

interface AirtableUnprocessableEntityError {
	error: {
		type: string;
		message: string;
	};
}

/* eslint-disable @typescript-eslint/no-magic-numbers */
export type AirtableRecipeRoutes =
| {
	method: "GET";
	path: "/Recipe";
	query: {
		maxRecords?: number;
		fields?: string[];
		filterByFormula?: string;
		pageSize?: number;
		sort?: string[];
	};
	response:
			| {
				code: 200;
				information: undefined;
				body: RecipeListAirtable;
				ok: true;
			}
			| {
				code: 422;
				information: undefined;
				body: AirtableUnprocessableEntityError;
				ok: false;
			};
} | {
	method: "GET";
	path: "/Recipe/{recipeId}";
	params: {
		recipeId: string;
	};
	response:
			| {
				code: 200;
				information: undefined;
				body: RecipeAirtable;
				ok: true;
			}
			| {
				code: 404;
				information: undefined;
				body: undefined;
				ok: false;
			};
} | {
	method: "GET";
	path: "/Ingredient/{ingredientId}";
	params: {
		ingredientId: string;
	};
	response:
			| {
				code: 200;
				information: undefined;
				body: IngredientAirtable;
				ok: true;
			}
			| {
				code: 404;
				information: undefined;
				body: undefined;
				ok: false;
			};
} | {
	method: "GET";
	path: "/Intolerance/{intoleranceId}";
	params: {
		intoleranceId: string;
	};
	response:
			| {
				code: 200;
				information: undefined;
				body: IntoleranceAirtable;
				ok: true;
			}
			| {
				code: 404;
				information: undefined;
				body: undefined;
				ok: false;
			};
} | {
	method: "POST";
	path: "/Recipe";
	body: CreateRecipePayload;
	response:
			| {
				code: 200;
				information: undefined;
				body: RecipeAirtable;
				ok: true;
			} | {
				code: 422;
				information: undefined;
				body: AirtableUnprocessableEntityError;
				ok: false;
			};
} | {
	method: "POST";
	path: "/Intolerance";
	body: CreateIntolerancePayload;
	response:
			| {
				code: 200;
				information: undefined;
				body: RecipeAirtable;
				ok: true;
			} | {
				code: 422;
				information: undefined;
				body: AirtableUnprocessableEntityError;
				ok: false;
			};
} | {
	method: "POST";
	path: "/Ingredient";
	body: CreateIngredientPayload;
	response:
			| {
				code: 200;
				information: undefined;
				body: RecipeAirtable;
				ok: true;
			} | {
				code: 422;
				information: undefined;
				body: AirtableUnprocessableEntityError;
				ok: false;
			};
} | {
	method: "PATCH";
	path: "/Recipe";
	body: UpdateRecipePayload;
	response:
			| {
				code: 200;
				information: undefined;
				body: RecipeAirtable;
				ok: true;
			} | {
				code: 422;
				information: undefined;
				body: AirtableUnprocessableEntityError;
				ok: false;
			};
};

