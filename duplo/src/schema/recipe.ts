import { baseAirtableSchema } from "../providers/airtable/types";
import { dishTypeEnum, recipeListAirtableSchema } from "../providers/airtable/types/recipe";
import { recipePromptSchema } from "../providers/ia/schemas/prompt";

export namespace Recipe {
	export const index = baseAirtableSchema.extend({
		fields: zod.object({
			name: zod.string(),
			image: zod.string().url(),
			ingredients: zod
				.object({
					id: zod.string(),
					name: zod.string(),
				})
				.array(),
			personCount: zod.number(),
			dishType: dishTypeEnum,
			intolerances: zod
				.object({
					id: zod.string(),
					name: zod.string(),
					description: zod.string(),
				})
				.array(),
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
		}),
	});

	export const recipeList = recipeListAirtableSchema;

	export const generatedRecipe = zod.object({
		recipeTransactionId: zod.string(),
		recipe: recipePromptSchema,
	});

	export const generatedRecipeRules = {
		numberOfPersons: {
			min: 1,
		},
	};
}
