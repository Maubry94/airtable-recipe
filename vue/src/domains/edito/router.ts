import type { RouteRecordRaw } from "vue-router";

export const routerPageNameEdito = Object.freeze({
	HOME_PAGE: "home",
	NOT_FOUND_PAGE: "not-found",
});

export default (): RouteRecordRaw[] => [
	{
		name: routerPageNameEdito.HOME_PAGE,
		path: "/",
		component: () => import("./pages/HomePage.vue"),
	},
];

export function notFound(): RouteRecordRaw {
	return {
		path: "/:notFoundPath(.*)*",
		component: () => import("@/layouts/BaseLayout.vue"),
		children: [
			{
				name: "not-found",
				path: "/:notFoundPath(.*)*",
				component: () => import("./pages/NotFound.vue"),
			},
		],
	};
}
