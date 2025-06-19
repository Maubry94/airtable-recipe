import { duploClient } from "@/lib/api-client";
import type { RecipeList } from "@/lib/api-client/types/duplojsTypesCodegen";
import { ref } from "vue";

export function useGetRecipesPage() {
	const recipes = ref<RecipeList | null>(null);

	function findRecipesFromNewestToOldest() {
		return duploClient
			.get(
				"/find-recipes-from-newest-to-oldest",
			)
			.whenInformation(
				"recipes.get",
				({ body }) => {
					recipes.value = body;
				},
			)
			.whenRequestError(
				() => {
					recipes.value = null;
				},
			);
	}

	void findRecipesFromNewestToOldest();

	return {
		recipes,
		findRecipesFromNewestToOldest,
	};
}
