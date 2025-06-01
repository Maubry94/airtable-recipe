import type { RouteRecordRaw } from "vue-router";

export const routerPageNameRecipe = Object.freeze({
	RECIPE_PAGE: "Recipes",
});

export default (): RouteRecordRaw[] => [
	{
		name: routerPageNameRecipe.RECIPE_PAGE,
		path: "/recipes",
		component: () => import("./pages/RecipesPage.vue"),
	},
];
