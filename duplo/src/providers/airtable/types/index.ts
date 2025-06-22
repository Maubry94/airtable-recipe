import { zod } from "@duplojs/core";

export const baseAirtableSchema = zod.object({
	id: zod.string(),
	createdTime: zod.string(),
});
