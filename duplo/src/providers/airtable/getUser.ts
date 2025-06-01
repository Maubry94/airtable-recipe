import { ZodAccelerator, type ZodSpace, zod } from "@duplojs/core";

export const airtableAdminUserPayloadSchema = zod.object({
	records: zod.object({
		id: zod.string(),
		createdTime: zod.string(),
		fields: zod.object({
			id: zod.string(),
			email: zod.string().email(),
			password: zod.string(),
		}),
	}).array(),
});

export const airtableAdminUserPayloadBuildedSchema = ZodAccelerator.build(airtableAdminUserPayloadSchema);

export type AirtableAdminUserPayload = ZodSpace.infer<typeof airtableAdminUserPayloadSchema>;
