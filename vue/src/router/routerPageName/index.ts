import { routerPageNameAdmin } from "@/domains/admin/router";
import { routerPageNameEdito } from "@/domains/edito/router";
import { routerPageNameRecipe } from "@/domains/recipe/router";

export const routerPageName = Object.freeze({
	...routerPageNameAdmin,
	...routerPageNameEdito,
	...routerPageNameRecipe,
});
