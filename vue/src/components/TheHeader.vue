<script setup lang="ts">
import { useRoute } from "vue-router";
import { routerPageName } from "@/router/routerPageName";
import TheIcon from "@/components/TheIcon.vue";
import { TheButton } from "@/components/ui/button";
import MobileNav from "./MobileNav.vue";

const route = useRoute();
const { HOME_PAGE, RECIPE_PAGE, RECIPE_CREATE_PAGE } = routerPageName;

const navigation = [
	{
		name: "Accueil",
		routeName: HOME_PAGE,
		icon: "home" as const,
	},
	{
		name: "Recettes",
		routeName: RECIPE_PAGE,
		icon: "utensils" as const,
	},
];

function isActive(routeName: string) {
	return route.name === routeName;
}
</script>

<template>
	<header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
		<div class="container mx-auto px-4">
			<div class="flex justify-between items-center h-16">
				<RouterLink
					class="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
					:to="{ name: HOME_PAGE }"
				>
					<div class="rounded-full bg-muted p-2">
						<TheIcon name="chefHat" />
					</div>

					<span class="text-xl font-bold">
						ChefGPT
					</span>
				</RouterLink>

				<nav class="hidden md:flex items-center space-x-1">
					<RouterLink
						v-for="item in navigation"
						:key="item.routeName"
						:to="{ name: item.routeName }"
						class="flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
						:class="{
							'text-accent-foreground bg-accent shadow-sm': isActive(item.routeName),
							'text-muted-foreground hover:text-primary hover:bg-accent/50': !isActive(item.routeName)
						}"
					>
						<TheIcon
							:name="item.icon"
							size="sm"
						/>
						{{ item.name }}
					</RouterLink>
				</nav>

				<div class="hidden md:block">
					<TheButton
						as-child
						class="shadow-md"
					>
						<RouterLink :to="{ name: RECIPE_CREATE_PAGE }">
							<TheIcon
								name="sparkles"
								size="sm"
							/>
							Nouvelle recette
						</RouterLink>
					</TheButton>
				</div>

				<MobileNav />
			</div>
		</div>
	</header>
</template>
