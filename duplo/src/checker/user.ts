import { createChecker, createPresetChecker, makeResponseContract, NotFoundHttpResponse } from "@duplojs/core";
import { AirtableAPI } from "../providers/airtable/airtable";

const ZERO = 0;

export const userExistChecker = createChecker("userExist")
	.handler(
		async(input: string, output) => {
			const airtableResponse = await AirtableAPI.getAdminUserByEmail(input);

			if (airtableResponse.body.records.length > ZERO) {
				return output("user.found", airtableResponse.body.records[ZERO]);
			} else {
				return output("user.notfound", null);
			}
		},
	);

export const IWantUserExistByEmail = createPresetChecker(
	userExistChecker,
	{
		result: "user.found",
		catch: () => new NotFoundHttpResponse("user.notfound"),
		indexing: "user",
	},
	makeResponseContract(NotFoundHttpResponse, "user.notfound"),
);
