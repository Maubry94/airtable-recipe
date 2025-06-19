import { zod } from "@duplojs/core";
import { recipePromptSchema } from "../providers/ia/schemas/prompt";

export const generateRecipeRules = {
	numberOfPersons: {
		min: 1,
	},
};

export const endpointGenerateRecipe = zod.object({
	recipeTransactionId: zod.string(),
	generatedRecipe: recipePromptSchema,
});
