import { z } from "zod";

export const recipeSchema = z.object({
	id: z.string(),
	createdTime: z.string(),
	fields: z.object({
		name: z.string(),
		ingredients: z.array(z.string()),
		PersonCount: z.number(),
		dishType: z.string(),
		intolerances: z.array(z.string()).optional(),
		Calories: z.number(),
		Proteins: z.number(),
		Carbohydrates: z.number(),
		Lipids: z.number(),
		Vitamins: z.string(),
		Minerals: z.string(),
		preparationInstructions: z.string(),
		createdAt: z.string(),
		ingredientCount: z.number(),
		nutritionalDensity: z.number(),
		nutritionalSummary: z.object({
			state: z.string(),
			value: z.string(),
			isStale: z.boolean(),
		}),
		improvementSuggestions: z.object({
			state: z.string(),
			value: z.string(),
			isStale: z.boolean(),
		}),
	}),
});

export type Recipe = z.infer<typeof recipeSchema>;
