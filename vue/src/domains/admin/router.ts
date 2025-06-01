import type { RouteRecordRaw } from "vue-router";

export const routerPageNameAdmin = Object.freeze({
	ADMIN_LOGIN_PAGE: "admin-panel-login",
	ADMIN_RECIPES_PAGE: "admin-panel-projects",
});

export default (): RouteRecordRaw[] => [

	{
		name: routerPageNameAdmin.ADMIN_LOGIN_PAGE,
		path: "/admin-panel/login",
		component: () => import("./pages/AdminLoginPage.vue"),
	},
	{
		name: routerPageNameAdmin.ADMIN_RECIPES_PAGE,
		path: "/admin-panel/recipes",
		component: () => import("./pages/AdminRecipesPage.vue"),
	},

];
