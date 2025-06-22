import { Config, JsonDB } from "node-json-db";

const jsonDatabaseConfig: Config = new Config(
	"json-db-duplo",
	true,
	false,
	"/",
	true,
);

export const jsonDatabase = new JsonDB(jsonDatabaseConfig);

export const recipeTransactionPath = "/recipeTransaction";
