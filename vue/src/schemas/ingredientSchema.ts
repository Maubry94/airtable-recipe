import { z } from "zod";

export const ingredientSchema = z.object({
	id: z.string(),
	createdTime: z.string(),
	fields: z.object({
		name: z.string(),
		category: z.string(),
		nutritionalValue: z.number(),
		unit: z.string(),
		relatedRecipes: z.array(z.string()).optional(),
		relatedRecipeCount: z.number().optional(),
	}),
});

export type Ingredient = z.infer<typeof ingredientSchema>;
