<script setup lang="ts">
import { routerPageName } from "@/router/routerPageName";
import TheIcon from "@/components/TheIcon.vue";

const { HOME_PAGE, RECIPE_PAGE, RECIPE_CREATE_PAGE } = routerPageName;

const quickLinks = [
	{
		name: "Accueil",
		routeName: HOME_PAGE,
	},
	{
		name: "Toutes les recettes",
		routeName: RECIPE_PAGE,
	},
	{
		name: "Créer une recette",
		routeName: RECIPE_CREATE_PAGE,
	},
];

const features = [
	"Génération IA de recettes",
	"Analyse nutritionnelle",
	"Gestion des allergènes",
	"Suggestions personnalisées",
];

function getCurrentYear() {
	return new Date().getFullYear();
}
</script>

<template>
	<footer class="bg-gray-900 text-white">
		<div class="container mx-auto px-4 py-12">
			<div class="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
				<div class="lg:col-span-1">
					<div class="flex items-center mb-4">
						<div class="rounded-full bg-muted p-2 mr-3">
							<TheIcon
								name="chefHat"
								class="text-primary"
							/>
						</div>

						<span class="text-xl font-bold text-white">
							ChefGPT
						</span>
					</div>

					<p class="text-muted-foreground text-sm leading-relaxed mb-6">
						L'assistant culinaire intelligent qui transforme vos ingrédients en délicieuses recettes
						avec analyse nutritionnelle complète.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-semibold mb-4 text-white">
						Navigation
					</h3>

					<ul class="space-y-3">
						<li
							v-for="link in quickLinks"
							:key="link.routeName"
						>
							<RouterLink
								:to="{ name: link.routeName }"
								class="text-muted-foreground hover:text-white transition-colors duration-200 text-sm"
							>
								{{ link.name }}
							</RouterLink>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold mb-4 text-white">
						Fonctionnalités
					</h3>

					<ul class="space-y-3">
						<li
							v-for="feature in features"
							:key="feature"
							class="text-muted-foreground text-sm flex gap-2 items-center"
						>
							<TheIcon
								name="check"
								size="xs"
								class="text-green-400 flex-shrink-0"
							/>
							{{ feature }}
						</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="border-t border-gray-800">
			<div class="container mx-auto px-4 py-6">
				<div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
					<div class="text-sm text-muted-foreground">
						© {{ getCurrentYear() }} ChefGPT. Projet étudiant ESGI - Tous droits réservés.
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>
