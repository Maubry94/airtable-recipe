import type { RouteRecordRaw } from "vue-router";

export const routerPageNameRecipe = Object.freeze({
	RECIPE_PAGE: "recipes",
	RECIPE_DETAIL_PAGE: "recipe-detail",
	RECIPE_CREATE_PAGE: "recipe-create",
});

export default (): RouteRecordRaw[] => [
	{
		name: routerPageNameRecipe.RECIPE_PAGE,
		path: "/recipes",
		component: () => import("./pages/RecipesPage.vue"),
	},
	{
		name: routerPageNameRecipe.RECIPE_DETAIL_PAGE,
		path: "/recipes/:id",
		component: () => import("./pages/RecipeDetailPage.vue"),
	},
	{
		name: routerPageNameRecipe.RECIPE_CREATE_PAGE,
		path: "/recipes/create",
		component: () => import("./pages/RecipeCreatePage.vue"),
	},
];
