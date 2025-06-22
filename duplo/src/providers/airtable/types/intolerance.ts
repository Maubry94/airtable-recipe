import { zod, type ZodSpace } from "@duplojs/core";
import { baseAirtableSchema } from ".";

export const intoleranceFieldsSchema = zod.object({
	name: zod.string(),
	description: zod.string().optional(),
	relatedRecipes: zod.string().array().optional(),
	relatedRecipeCount: zod.number().optional(),
	recipeSummary: zod.string().optional(),
	recipeImpact: zod.string().optional(),
	recipeSuggestions: zod.string().optional(),
});

export const intoleranceAirtableSchema = baseAirtableSchema
	.extend({
		fields: intoleranceFieldsSchema,
	});
export type IntoleranceAirtable = ZodSpace.infer<typeof intoleranceAirtableSchema>;

export const intolerancePayloadSchema = zod
	.object({
		records: zod
			.object({
				fields: intoleranceFieldsSchema
					.pick({
						name: true,
						description: true,
						relatedRecipes: true,
						recipeImpact: true,
						recipeSuggestions: true,
					}),
			})
			.array(),
	});
export type CreateIntolerancePayload = ZodSpace.infer<typeof intolerancePayloadSchema>;

export const intoleranceListAirtableSchema = zod.object({
	records: intoleranceAirtableSchema.array(),
});
export type IntoleranceListAirtable = ZodSpace.infer<typeof intoleranceListAirtableSchema>;
