import { type z } from "zod";
import { recipeAirtableSchema } from "../../airtable/types/recipe";
import { ingredientAirtableSchema } from "../../airtable/types/ingredient";
import { intoleranceAirtableSchema } from "../../airtable/types/intolerance";

export const recipeIngredientPromptSchema = ingredientAirtableSchema
	.shape
	.fields
	.pick({
		name: true,
		quantity: true,
		measurementUnit: true,
		image: true,
	});

export const recipeIntolerancePromptSchema = intoleranceAirtableSchema
	.shape
	.fields
	.pick({
		name: true,
		description: true,
	});

export const generatedRecipeSchema = recipeAirtableSchema
	.shape
	.fields
	.pick({
		name: true,
		image: true,
		personCount: true,
		dishType: true,
		totalCalories: true,
		numberOfProteins: true,
		numberOfCarbohydrates: true,
		numberOfLipids: true,
		vitamins: true,
		minerals: true,
		instructions: true,
		ingredients: true,
		intolerances: true,
	})
	.extend({
		ingredients: recipeIngredientPromptSchema.array(),
		intolerances: recipeIntolerancePromptSchema.array(),
	});

export const recipePromptSchema = generatedRecipeSchema.nullable();

export type RecipePrompt = z.infer<typeof recipePromptSchema>;
export type GeneratedRecipe = z.infer<typeof generatedRecipeSchema>;
