import { duplojsEslintBase, duplojsEslintTest } from "@duplojs/eslint";

export default [
	{
		...duplojsEslintTest,
		files: ["**/*.test.{ts,js}"],
	},
	{
		...duplojsEslintBase,
		files: ["**/*.{ts,js}"],
		ignores: ["**/*.test.{ts,js}"],
	},
];
