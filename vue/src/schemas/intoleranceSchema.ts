import { z } from "zod";

export const intoleranceSchema = z.object({
	id: z.string(),
	createdTime: z.string(),
	fields: z.object({
		name: z.string(),
		description: z.string(),
		relatedRecipes: z.array(z.string()).optional(),
		relatedRecipeCount: z.number().optional(),
		recipeSummary: z.string().optional(),
		recipeImpact: z.object({
			state: z.string(),
			value: z.string(),
			isStale: z.boolean(),
		}).optional(),
		recipeSuggestions: z.object({
			state: z.string(),
			value: z.string(),
			isStale: z.boolean(),
		}).optional(),
	}),
});

export type Intolerance = z.infer<typeof intoleranceSchema>;
