import { zod, ZodAccelerator } from "@duplojs/core";
import bcrypt from "bcrypt";

export class BcryptProvider {
	public static readonly bcryptCompareSchema = ZodAccelerator.build(
		zod.object({
			clearPassword: zod.string(),
			hashedPassword: zod.string(),
		}),
	);

	public static async compare(input: ReturnType<typeof BcryptProvider["bcryptCompareSchema"]["parse"]>) {
		return bcrypt.compare(input.clearPassword, input.hashedPassword);
	}
}
