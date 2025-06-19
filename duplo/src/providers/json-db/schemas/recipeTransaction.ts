import { zod, type ZodSpace } from "@duplojs/core";
import { generatedRecipeSchema } from "../../ia/schemas/prompt";

export const recipeTransactionSchema = zod.object({
	id: zod.string().uuid(),
	recipe: generatedRecipeSchema,
	generationCriteria: zod.object({
		ingredients: zod.string().array(),
		intolerances: zod.string().array(),
		numberOfPersons: zod.coerce.number(),
	}),
});

export type RecipeTransaction = ZodSpace.infer<typeof recipeTransactionSchema>;
