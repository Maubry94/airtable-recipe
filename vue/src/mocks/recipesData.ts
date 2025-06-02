import type { Ingredient } from "@/schemas/ingredientSchema";
import type { Intolerance } from "@/schemas/intoleranceSchema";
import type { Recipe } from "@/schemas/recipeSchema";

export const mockIngredients: Ingredient[] = [
	{
		id: "recbkEQD7YSpjMKbh",
		createdTime: "2025-05-26T12:50:08.000Z",
		fields: {
			name: "Chocolat noir",
			category: "Confiserie",
			nutritionalValue: 546,
			unit: "g",
			relatedRecipeCount: 15,
		},
	},
	{
		id: "recdqDHnuESBfd9dv",
		createdTime: "2025-05-26T12:50:08.000Z",
		fields: {
			name: "Piment rouge",
			category: "Épices",
			nutritionalValue: 40,
			unit: "g",
			relatedRecipeCount: 8,
		},
	},
	{
		id: "rec3example123",
		createdTime: "2025-05-26T12:50:08.000Z",
		fields: {
			name: "Farine de blé",
			category: "Céréales",
			nutritionalValue: 364,
			unit: "g",
			relatedRecipeCount: 42,
		},
	},
];

export const mockIntolerances: Intolerance[] = [
	{
		id: "rect6zAKgZx6b5Dwv",
		createdTime: "2025-05-26T12:50:08.000Z",
		fields: {
			name: "Gluten",
			description: "Protéine présente dans le blé, l'orge et le seigle",
			relatedRecipeCount: 12,
			recipeSummary: "Recettes sans gluten disponibles",
			recipeImpact: {
				state: "generated",
				value: "Utiliser des farines alternatives comme la farine de riz ou d'amande",
				isStale: false,
			},
			recipeSuggestions: {
				state: "generated",
				value: "Privilégier les recettes à base de légumes et de protéines",
				isStale: false,
			},
		},
	},
	{
		id: "rec7IRZ9gc0Z4XCDl",
		createdTime: "2025-05-26T12:50:08.000Z",
		fields: {
			name: "Noix",
			description: "Allergie aux noix, y compris les amandes, les noix de cajou et les noisettes",
			relatedRecipeCount: 1,
			recipeSummary: "Pizza à la Pomme et Brie",
			recipeImpact: {
				state: "generated",
				value: "Les recettes doivent éviter les noix et utiliser des graines ou des fruits secs comme alternatives",
				isStale: true,
			},
			recipeSuggestions: {
				state: "generated",
				value: "Incorporer des graines de tournesol ou de citrouille dans les pâtisseries",
				isStale: true,
			},
		},
	},
];

export const mockRecipes: Recipe[] = [
	{
		id: "recCGxP6Q4985MFKY",
		createdTime: "2025-05-26T12:50:08.000Z",
		fields: {
			name: "Tarte au Chocolat et Piment",
			ingredients: ["recbkEQD7YSpjMKbh", "recdqDHnuESBfd9dv"],
			PersonCount: 6,
			dishType: "Dessert",
			intolerances: ["rect6zAKgZx6b5Dwv"],
			Calories: 450.5,
			Proteins: 6.2,
			Carbohydrates: 58.3,
			Lipids: 22.1,
			Vitamins: "Vitamine A, Vitamine E",
			Minerals: "Fer, Magnésium",
			preparationInstructions:
				"Préchauffez le four à 180°C. Mélangez le chocolat fondu avec le piment. "
				+ "Versez le mélange sur la pâte. Enfournez pendant 25 minutes.",
			createdAt: "2025-05-26",
			ingredientCount: 2,
			nutritionalDensity: 537.1,
			nutritionalSummary: {
				state: "generated",
				value: "Riche en glucides, attention aux calories!",
				isStale: true,
			},
			improvementSuggestions: {
				state: "generated",
				value: "Ajoutez des fruits rouges pour plus de fraîcheur.",
				isStale: true,
			},
		},
	},
	{
		id: "rec2example456",
		createdTime: "2025-05-25T10:30:00.000Z",
		fields: {
			name: "Salade César Protéinée",
			ingredients: ["rec3example123"],
			PersonCount: 4,
			dishType: "Entrée",
			Calories: 320.8,
			Proteins: 28.5,
			Carbohydrates: 12.7,
			Lipids: 18.9,
			Vitamins: "Vitamine K, Vitamine C",
			Minerals: "Calcium, Phosphore",
			preparationInstructions:
				"Lavez la salade. Préparez la sauce césar. Ajoutez les croûtons et le parmesan. "
				+ "Mélangez délicatement.",
			createdAt: "2025-05-25",
			ingredientCount: 6,
			nutritionalDensity: 360.9,
			nutritionalSummary: {
				state: "generated",
				value: "Équilibrée en protéines et pauvre en glucides",
				isStale: false,
			},
			improvementSuggestions: {
				state: "generated",
				value: "Ajoutez des graines de tournesol pour plus de croquant",
				isStale: false,
			},
		},
	},
];
