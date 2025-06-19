import { zod, type ZodSpace } from "@duplojs/core";
import { baseAirtableSchema } from "./airtable";
import { dishTypeEnum } from "./recipe";

export const ingredientMeasurementUnitEnum = zod.enum([
	"grams",
	"milliliters",
	"tablespoons",
	"teaspoons",
	"pieces",
]);

export const ingredientFieldsSchema = zod.object({
	name: zod.string(),
	quantity: zod.number(),
	measurementUnit: ingredientMeasurementUnitEnum,
	image: zod.string().url(),
	relatedRecipes: zod.string().array().optional(),
	relatedRecipesCount: zod.number().optional(),
	commonDishType: dishTypeEnum,
	nutritionalAnalysis: zod.string().optional(),
	recipeSuggestions: zod.string().optional(),
});

export const createIngredientPayloadSchema = zod.object({
	records: zod.object({
		fields: ingredientFieldsSchema.pick({
			name: true,
			quantity: true,
			measurementUnit: true,
			image: true,
			relatedRecipes: true,
			nutritionalAnalysis: true,
			recipeSuggestions: true,
		}),
	}).array(),
});

export type CreateIngredientPayload = ZodSpace.infer<typeof createIngredientPayloadSchema>;

export const ingredientAirtableSchema = baseAirtableSchema.extend({
	fields: ingredientFieldsSchema,
});
export type IngredientAirtable = ZodSpace.infer<typeof ingredientAirtableSchema>;

export const ingredientListAirtableSchema = zod.object({
	records: ingredientAirtableSchema.array(),
});
export type IngredientListAirtable = ZodSpace.infer<typeof ingredientListAirtableSchema>;
