import { zod, type ZodSpace } from "@duplojs/core";
import { baseAirtableSchema } from ".";

export const dishTypeEnum = zod
	.enum([
		"starter",
		"dish",
		"dessert",
	]);

export const recipeFieldsSchema = zod
	.object({
		name: zod.string(),
		image: zod.string().url(),
		ingredients: zod.string().array().optional(),
		personCount: zod.number(),
		dishType: dishTypeEnum,
		intolerances: zod.string().array().optional(),
		totalCalories: zod.number(),
		numberOfProteins: zod.number(),
		numberOfCarbohydrates: zod.number(),
		numberOfLipids: zod.number(),
		vitamins: zod.string().optional(),
		minerals: zod.string().optional(),
		instructions: zod.string().optional(),
		createdAt: zod.string(),
		ingredientCount: zod.number().optional(),
		nutritionalDensity: zod.number(),
		nutritionalSummary: zod.string().optional(),
		improvementSuggestions: zod.string().optional(),
	});

const payloadRecipeFields = recipeFieldsSchema
	.pick({
		name: true,
		image: true,
		ingredients: true,
		personCount: true,
		dishType: true,
		intolerances: true,
		totalCalories: true,
		numberOfProteins: true,
		numberOfCarbohydrates: true,
		numberOfLipids: true,
		vitamins: true,
		minerals: true,
		instructions: true,
		nutritionalSummary: true,
		improvementSuggestions: true,
	});

export const createRecipePayloadSchema = zod
	.object({
		records: zod
			.object({
				fields: payloadRecipeFields,
			})
			.array(),
	});
export const updateRecipePayloadSchema = zod
	.object({
		records: zod
			.object({
				id: zod.string(),
				fields: payloadRecipeFields.partial(),
			})
			.array(),
	});
export type CreateRecipePayload = ZodSpace.infer<typeof createRecipePayloadSchema>;
export type UpdateRecipePayload = ZodSpace.infer<typeof updateRecipePayloadSchema>;

export const recipeAirtableSchema = baseAirtableSchema
	.extend({
		fields: recipeFieldsSchema,
	});
export type RecipeAirtable = ZodSpace.infer<typeof recipeAirtableSchema>;

export const recipeListAirtableSchema = zod
	.object({
		records: recipeAirtableSchema.array(),
	});
export type RecipeListAirtable = ZodSpace.infer<typeof recipeListAirtableSchema>;
