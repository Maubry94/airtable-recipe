const GENERATE_RECIPE_PROMPT = `Génère une recette de cuisine en respectant les contraintes suivantes :
Ingrédients imposés : {ingredients}
Nombre de personnes : {numberOfPersons}
Intolérances :  (aucun ingrédient ne doit contenir ou dériver de {intolerances})
Contraintes supplémentaires :
Le nombre de protéines, glucides et lipides doit être donné pour 100g de plat fini.
Le total calorique doit correspondre au plat entier pour {numberOfPersons} personnes.
Les quantités d’ingrédients doivent obligatoirement être en grammes.
Les instructions doivent être claires, rédigées sous forme d’étapes numérotées (1., 2. etc).
Toutes les URLs d’images doivent être fonctionnelles car je les utilises pour l'afficher en front de mon application.
La réponse doit être un JSON strictement conforme au schéma suivant :
{
  // Nom de la recette
  name: string;
  // URL de l'image du plat (doit être fonctionnelle)
  image: string;
  // Nombre de personnes pour lesquelles la recette est prévue
  personCount: number;
  // Type de plat ("starter" = entrée, "dish" = plat principal, "dessert" = dessert)
  dishType: "starter" | "dish" | "dessert";
  // Total des calories pour le plat entier
  totalCalories: number;{intolerances}
  // Quantité de protéines pour 100g de plat fini
  numberOfProteins: number;
  // Quantité de glucides pour 100g de plat fini
  numberOfCarbohydrates: number;
  // Quantité de lipides pour 100g de plat fini
  numberOfLipids: number;
  // Liste des vitamines présentes dans le plat
  vitamins?: string;
  // Liste des minéraux présents dans le plat
  minerals?: string;
  // Instructions de préparation, sous forme d'étapes numérotées
  instructions?: string;
  // Liste des ingrédients utilisés dans la recette
  ingredients: [
    {
      // Nom de l'ingrédient
      name: string;
      // Quantité de l'ingrédient (en grammes)
      quantity: number;
      // Unité de mesure (doit être "grams", "milliliters", "tablespoons", "teaspoons" ou "pieces")
      measurementUnit: "grams" | "milliliters" | "tablespoons" | "teaspoons" | "pieces";
      // URL de l'image de l'ingrédient (doit être fonctionnelle)
      image: string;
    }
  ];
  // Liste des intolérances prises en compte dans la recette
  intolerances: [
    {
      // Nom de l'intolérance
      name: string;
      // Description de l'intolérance
      description?: string;
    }
  ];
}
Si les ingrédients données en entrée sont bizarre ou ne peuvent pas créer de recette je veux que tu me renvoie 'null' pour que je puisse créer une erreur dans mon api et renvoyer l'erreur au client.
La structure du JSON doit être valide, complète, exacte et sans clé manquante.
Merci de ne rien ajouter en dehors du JSON.`;

const RETRY_GENERATE_RECIPE_PROMPT = `Génère une recette de cuisine en respectant les contraintes suivantes :
Ingrédients imposés : {ingredients}
Nombre de personnes : {numberOfPersons}
Intolérances :  (aucun ingrédient ne doit contenir ou dériver de {intolerances})
Contraintes supplémentaires :
Le nombre de protéines, glucides et lipides doit être donné pour 100g de plat fini.
Le total calorique doit correspondre au plat entier pour {numberOfPersons} personnes.
Les quantités d’ingrédients doivent obligatoirement être en grammes.
Les instructions doivent être claires, rédigées sous forme d’étapes numérotées (1., 2. etc).
Toutes les URLs d’images doivent être fonctionnelles car je les utilises pour l'afficher en front de mon application.
Je ne veux pas que tu génère la recette suivant : {previousRecipeName}
La réponse doit être un JSON strictement conforme au schéma suivant :
{
  // Nom de la recette
  name: string;
  // URL de l'image du plat (doit être fonctionnelle)
  image: string;
  // Nombre de personnes pour lesquelles la recette est prévue
  personCount: number;
  // Type de plat ("starter" = entrée, "dish" = plat principal, "dessert" = dessert)
  dishType: "starter" | "dish" | "dessert";
  // Total des calories pour le plat entier
  totalCalories: number;{intolerances}
  // Quantité de protéines pour 100g de plat fini
  numberOfProteins: number;
  // Quantité de glucides pour 100g de plat fini
  numberOfCarbohydrates: number;
  // Quantité de lipides pour 100g de plat fini
  numberOfLipids: number;
  // Liste des vitamines présentes dans le plat
  vitamins?: string;
  // Liste des minéraux présents dans le plat
  minerals?: string;
  // Instructions de préparation, sous forme d'étapes numérotées
  instructions?: string;
  // Liste des ingrédients utilisés dans la recette
  ingredients: [
    {
      // Nom de l'ingrédient
      name: string;
      // Quantité de l'ingrédient (en grammes)
      quantity: number;
      // Unité de mesure (doit être "grams", "milliliters", "tablespoons", "teaspoons" ou "pieces")
      measurementUnit: "grams" | "milliliters" | "tablespoons" | "teaspoons" | "pieces";
      // URL de l'image de l'ingrédient (doit être fonctionnelle)
      image: string;
    }
  ];
  // Liste des intolérances prises en compte dans la recette
  intolerances: [
    {
      // Nom de l'intolérance
      name: string;
      // Description de l'intolérance
      description?: string;
    }
  ];
}
Si les ingrédients données en entrée sont bizarre ou ne peuvent pas créer de recette je veux que tu me renvoie 'null' pour que je puisse créer une erreur dans mon api et renvoyer l'erreur au client.
La structure du JSON doit être valide, complète, exacte et sans clé manquante.
Merci de ne rien ajouter en dehors du JSON.`;

interface InputBuildRecipePrompt {
	ingredients: string[];
	numberOfPersons: number;
	intolerances: string[];
}

export function buildRecipeIAPrompt(params: InputBuildRecipePrompt) {
	return GENERATE_RECIPE_PROMPT
		.replace(/{ingredients}/g, params.ingredients.join(", "))
		.replace(/{numberOfPersons}/g, params.numberOfPersons.toString())
		.replace(/{intolerances}/g, params.intolerances.join(", "));
}

export function buildRetryRecipeIAPrompt(
	params: InputBuildRecipePrompt & { previousRecipeName: string },
) {
	return RETRY_GENERATE_RECIPE_PROMPT
		.replace(/{ingredients}/g, params.ingredients.join(", "))
		.replace(/{numberOfPersons}/g, params.numberOfPersons.toString())
		.replace(/{intolerances}/g, params.intolerances.join(", "))
		.replace(/{previousRecipeName}/g, params.previousRecipeName);
}

export const iaRoleContent = "Vous êtes un cuisinier qui doit générer une recette de cuisine, un plat, une entrée ou un dessert à partir des restrictions donné.";
