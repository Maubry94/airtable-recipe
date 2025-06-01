import { makeResponseContract, OkHttpResponse, UnauthorizedHttpResponse, useBuilder, zod } from "@duplojs/core";
import { IWantUserExistByEmail } from "../checker/user";
import { AccessToken } from "../providers/token";
import { endpointAuthSchema } from "../schemas/auth";
import { BcryptProvider } from "../providers/bcrypt";

useBuilder()
	.createRoute("POST", "/authentication")
	.extract({
		body: zod.object({
			email: zod.string().email(),
			password: zod.string(),
		}),
	})
	.presetCheck(
		IWantUserExistByEmail,
		(pickup) => pickup("body").email,
	)
	.cut(
		async({ pickup, dropper }) => {
			const { body, user } = pickup(["body", "user"]);

			const isPasswordValid = await BcryptProvider.compare({
				clearPassword: body.password,
				hashedPassword: user.fields.password,
			});

			if (!isPasswordValid) {
				return new UnauthorizedHttpResponse("user.invalid.password");
			}

			return dropper(null);
		},
		[],
		makeResponseContract(UnauthorizedHttpResponse, "user.invalid.password"),
	)
	.handler(
		(pickup) => {
			const user = pickup("user");

			const token = AccessToken.generate({
				email: user.fields.email,
			});

			return new OkHttpResponse(
				"user.logged",
				token,
			);
		},
		makeResponseContract(OkHttpResponse, "user.logged", endpointAuthSchema),
	);
