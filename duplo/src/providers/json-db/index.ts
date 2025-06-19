import { Config, JsonDB } from "node-json-db";
import { uuidv7 } from "uuidv7";
import { type RecipeTransaction } from "./schemas/recipeTransaction";

const jsonDatabaseConfig: Config = new Config(
	"json-db-duplo",
	true,
	false,
	"/",
	true,
);

export const jsonDatabase = new JsonDB(jsonDatabaseConfig);

export const recipeTransactionPath = "/recipeTransaction";

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
