import { uuidv7 } from "uuidv7";
import { type RecipeTransaction } from "./schemas/recipeTransaction";
import { jsonDatabase, recipeTransactionPath } from ".";

export async function createRecipeTransaction(params: Omit<RecipeTransaction, "id">) {
	const recipeTransactionId = uuidv7();

	const recipeTransaction: RecipeTransaction = {
		id: recipeTransactionId,
		...params,
	};

	await jsonDatabase.push(
		`${recipeTransactionPath}/${recipeTransactionId}`,
		recipeTransaction,
		true,
	);

	return recipeTransactionId;
}

export async function deleteRecipeTransaction(recipeTransactionId: string) {
	await jsonDatabase.delete(
		`${recipeTransactionPath}/${recipeTransactionId}`,
	);
}
