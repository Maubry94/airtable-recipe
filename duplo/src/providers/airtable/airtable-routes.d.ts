import { type AirtableAdminUserPayload } from "./getUser";

/* eslint-disable @typescript-eslint/no-magic-numbers */
export type AirtableRoutes =
| {
	method: "GET";
	path: "/Admin";
	query: {
		filterByFormula: string;
	};
	response:
			| {
				code: 200;
				information: undefined;
				body: AirtableAdminUserPayload;
				ok: true;
			};
};
