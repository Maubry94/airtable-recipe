import { createRouter, createWebHistory } from "vue-router";
import edito, { notFound } from "@/domains/edito/router";
import recipe from "@/domains/recipe/router";
import admin, { routerPageNameAdmin } from "@/domains/admin/router";
import { useUserAdminInformation } from "@/domains/admin/composables/useUserAdminInformation";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			component: () => import("@/layouts/BaseLayout.vue"),
			children: [...edito(), ...recipe()],
		},
		{
			path: "/admin",
			component: () => import("@/layouts/AdminLayout.vue"),
			children: [...admin()],
		},
		notFound(),
	],
	scrollBehavior(_to, _from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return { top: 0 };
		}
	},
});

router.beforeEach((to, _from, next) => {
	const { isConnected } = useUserAdminInformation();
	const isAdminPage = to.fullPath.startsWith("/admin-panel");
	const isLoginPage = to.name === routerPageNameAdmin.ADMIN_LOGIN_PAGE;

	if (to.fullPath === "/admin-panel" && isConnected.value) {
		return void next({
			name: routerPageNameAdmin.ADMIN_RECIPES_PAGE,
		});
	}

	if (isAdminPage && !isConnected.value && !isLoginPage) {
		return void next({
			name: routerPageNameAdmin.ADMIN_LOGIN_PAGE,
		});
	}

	return void next();
});

export default router;
