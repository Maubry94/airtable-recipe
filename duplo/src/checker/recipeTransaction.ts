import { createChecker, createPresetChecker, makeResponseContract, NotFoundHttpResponse } from "@duplojs/core";
import { jsonDatabase, recipeTransactionPath } from "../providers/json-db";
import { type RecipeTransaction } from "../providers/json-db/schemas/recipeTransaction";

export const recipeTransactionExistCheck = createChecker("recipeTransactionExist")
	.handler(
		async(input: string, output) => {
			try {
				const recipeTransaction = await jsonDatabase.getObject<RecipeTransaction>(`${recipeTransactionPath}/${input}`);

				return output("recipeTransaction.exist", recipeTransaction);
			} catch {
				return output("recipeTransaction.notfound", null);
			}
		},
	);

export const iWantRecipeTransactionExistById = createPresetChecker(
	recipeTransactionExistCheck,
	{
		result: "recipeTransaction.exist",
		catch: () => new NotFoundHttpResponse("recipeTransaction.notfound"),
		indexing: "recipeTransaction",
	},
	makeResponseContract(NotFoundHttpResponse, "recipeTransaction.notfound"),
);
