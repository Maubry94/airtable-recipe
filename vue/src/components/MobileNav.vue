<script setup lang="ts">
import { useRoute } from "vue-router";
import { routerPageName } from "@/router/routerPageName";
import { TheSheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { TheButton } from "@/components/ui/button";
import TheIcon from "@/components/TheIcon.vue";

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
	<TheSheet>
		<SheetTrigger as-child>
			<TheButton
				variant="outline"
				size="icon"
				class="md:hidden"
			>
				<TheIcon name="menu" />
			</TheButton>
		</SheetTrigger>

		<SheetContent
			side="top"
			class="w-full border-b border-gray-200 bg-white shadow-lg"
		>
			<div class="container mx-auto px-4 py-6">
				<SheetClose as-child>
					<RouterLink
						:to="{ name: HOME_PAGE }"
						class="flex items-center justify-between mb-6"
					>
						<div class="flex gap-2 items-center">
							<div class="rounded-full bg-muted p-2">
								<TheIcon name="chefHat" />
							</div>

							<span class="text-xl font-bold">
								ChefGPT
							</span>
						</div>
					</RouterLink>
				</SheetClose>

				<nav class="space-y-2 mb-6">
					<SheetClose
						v-for="item in navigation"
						:key="item.routeName"
						as-child
					>
						<RouterLink
							:to="{ name: item.routeName }"
							class="flex gap-3 items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 w-full"
							:class="{
								'text-accent-foreground bg-accent shadow-sm': isActive(item.routeName),
								'text-muted-foreground hover:text-primary hover:bg-accent/50': !isActive(item.routeName)
							}"
						>
							<TheIcon
								:name="item.icon"
								size="lg"
							/>
							{{ item.name }}
						</RouterLink>
					</SheetClose>
				</nav>

				<SheetClose as-child>
					<TheButton
						as-child
						class="w-full shadow-md"
						size="lg"
					>
						<RouterLink :to="{ name: RECIPE_CREATE_PAGE }">
							<TheIcon
								name="sparkles"
								size="lg"
							/>
							Nouvelle recette
						</RouterLink>
					</TheButton>
				</SheetClose>
			</div>
		</SheetContent>
	</TheSheet>
</template>
