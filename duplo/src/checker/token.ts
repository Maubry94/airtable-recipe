import { createChecker, createPresetChecker, makeResponseContract, UnauthorizedHttpResponse } from "@duplojs/core";
import { AccessToken } from "../providers/token";

export const accessTokenChecker = createChecker("accessToken")
	.handler(
		(input: string, output) => {
			const accessToken = AccessToken.check(input);

			if (accessToken) {
				return output("access.token.valid", accessToken);
			} else {
				return output("access.token.invalid", null);
			}
		},
	);

export const IWantAccessTokenIsValid = createPresetChecker(
	accessTokenChecker,
	{
		result: "access.token.valid",
		catch: () => new UnauthorizedHttpResponse("access.token.invalid"),
		indexing: "accessTokenContent",
	},
	makeResponseContract(UnauthorizedHttpResponse, "access.token.invalid"),
);
