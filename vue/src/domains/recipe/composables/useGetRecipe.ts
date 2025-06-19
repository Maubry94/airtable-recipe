import { useSonner } from "@/composables/useSonner";
import { duploClient } from "@/lib/api-client";
import type { Recipe } from "@/lib/api-client/types/duplojsTypesCodegen";
import { ref, type Ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const {
	sonnerWarning,
} = useSonner();

export function useGetRecipe(
	recipeId: Ref<string>,
) {
	const recipe = ref<Recipe | null>(null);

	function findRecipe() {
		return duploClient
			.get(
				"/recipe/{recipeId}",
				{
					params: {
						recipeId: recipeId.value,
					},
				},
			)
			.whenInformation(
				"recipe.found",
				({ body }) => {
					recipe.value = body;
				},
			)
			.whenInformation(
				"recipe.notfound",
				() => {
					sonnerWarning("La recette n'a pas été trouvée.");
					router.back();
				},
			)
			.whenRequestError(
				() => {
					recipe.value = null;
				},
			);
	}

	void findRecipe();

	return {
		recipe,
	};
}
