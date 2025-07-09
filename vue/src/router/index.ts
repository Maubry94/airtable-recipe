import { createRouter, createWebHistory } from "vue-router";
import edito, { notFound } from "@/domains/edito/router";
import recipe from "@/domains/recipe/router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			component: () => import("@/layouts/BaseLayout.vue"),
			children: [
				...edito(),
				...recipe(),
			],
		},
		notFound(),
	],
	scrollBehavior(_to, _from, _savedPosition) {
		return { top: 0 };
	},
});

export default router;
