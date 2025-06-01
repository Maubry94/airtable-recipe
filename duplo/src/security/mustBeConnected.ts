import { IgnoreByTypeCodegenDescription } from "@duplojs/types-codegen";
import { createProcess, ForbiddenHttpResponse, useBuilder, zod } from "@duplojs/core";
import { IWantAccessTokenIsValid } from "../checker/token";
import { IWantUserExistByEmail } from "../checker/user";

export const mustBeConnectedProcess = createProcess(
	"mustBeConnected",
	undefined,
	new IgnoreByTypeCodegenDescription(),
)
	.extract(
		{
			headers: {
				authorization: zod.string(),
			},
		},
		() => new ForbiddenHttpResponse("authorization.missing"),
	)
	.presetCheck(
		IWantAccessTokenIsValid,
		(pickup) => pickup("authorization"),
	)
	.presetCheck(
		IWantUserExistByEmail,
		(pickup) => pickup("accessTokenContent").email,
	)
	.exportation(["user"]);

export function useMustBeConnectedBuilder() {
	return useBuilder()
		.preflight(
			mustBeConnectedProcess,
			{
				pickup: ["user"],
			},
		);
}
