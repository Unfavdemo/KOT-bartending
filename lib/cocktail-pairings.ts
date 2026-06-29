export interface CocktailRecipe {
  name: string;
  ingredients: string[];
  steps: string[];
  garnish?: string;
  ratio: string;
}

type PairingMatrix = Record<string, Record<string, CocktailRecipe>>;

export const cocktailPairings: PairingMatrix = {
  Gin: {
    "lavender-honey": {
      name: "Lavender Bee's Knees",
      ratio: "2:1:0.75",
      ingredients: ["2 oz gin", "1 oz lavender honey syrup", "0.75 oz fresh lemon", "Ice"],
      steps: ["Shake all ingredients hard with ice", "Double strain into a chilled coupe", "Express lemon peel over top"],
      garnish: "Lemon peel",
    },
    "ginger-lime": {
      name: "Garden Gimlet",
      ratio: "2:0.75:0.5",
      ingredients: ["2 oz gin", "0.75 oz ginger lime syrup", "0.5 oz lime juice", "Ice"],
      steps: ["Shake with ice until frosty", "Strain into a rocks glass over fresh ice", "Top with a splash of soda if desired"],
      garnish: "Lime wheel",
    },
    "hibiscus-rose": {
      name: "Rosé Gin Fizz",
      ratio: "1.5:1:3",
      ingredients: ["1.5 oz gin", "1 oz hibiscus rose syrup", "3 oz prosecco", "Ice"],
      steps: ["Build gin and syrup in a wine glass over ice", "Top gently with prosecco", "Stir once to combine"],
      garnish: "Edible flower or orange peel",
    },
    "madagascar-vanilla": {
      name: "Vanilla Negroni Twist",
      ratio: "1:1:1",
      ingredients: ["1 oz gin", "1 oz sweet vermouth", "1 oz Campari", "0.25 oz vanilla syrup", "Ice"],
      steps: ["Stir all ingredients with ice", "Strain over a large cube", "Let sit 30 seconds before serving"],
      garnish: "Orange peel",
    },
  },
  Vodka: {
    "lavender-honey": {
      name: "Purple Haze Martini",
      ratio: "2:0.5:0.25",
      ingredients: ["2 oz vodka", "0.5 oz lavender honey syrup", "0.25 oz lemon", "Ice"],
      steps: ["Stir (don't shake) with ice for 20 seconds", "Strain into a chilled martini glass"],
      garnish: "Lavender sprig",
    },
    "ginger-lime": {
      name: "Moscow Mule Elite",
      ratio: "2:0.75:4",
      ingredients: ["2 oz vodka", "0.75 oz ginger lime syrup", "4 oz ginger beer", "Ice"],
      steps: ["Fill a copper mug with ice", "Add vodka and syrup", "Top with ginger beer and stir gently"],
      garnish: "Lime wedge + candied ginger",
    },
    "hibiscus-rose": {
      name: "Crimson Cosmo",
      ratio: "1.5:1:0.75:0.5",
      ingredients: ["1.5 oz vodka", "1 oz hibiscus rose syrup", "0.75 oz cranberry", "0.5 oz lime", "Ice"],
      steps: ["Shake vigorously with ice", "Strain into a martini glass"],
      garnish: "Flamed orange peel",
    },
    "madagascar-vanilla": {
      name: "Vanilla Espresso Martini",
      ratio: "1.5:0.5:1",
      ingredients: ["1.5 oz vodka", "0.5 oz vanilla syrup", "1 oz fresh espresso", "Ice"],
      steps: ["Shake hard with ice to create foam", "Double strain into a coupe"],
      garnish: "Coffee beans",
    },
  },
  Rum: {
    "lavender-honey": {
      name: "Tropical Lavender Daiquiri",
      ratio: "2:1:1",
      ingredients: ["2 oz white rum", "1 oz lavender honey syrup", "1 oz lime juice", "Ice"],
      steps: ["Shake with ice", "Strain into a chilled coupe"],
      garnish: "Lime wheel",
    },
    "ginger-lime": {
      name: "Spiced Island Mule",
      ratio: "2:0.75:4",
      ingredients: ["2 oz dark rum", "0.75 oz ginger lime syrup", "4 oz ginger beer", "Ice"],
      steps: ["Build in a highball over ice", "Stir gently", "Top with ginger beer"],
      garnish: "Mint sprig",
    },
    "hibiscus-rose": {
      name: "Hibiscus Hurricane",
      ratio: "2:1:1:0.5",
      ingredients: ["2 oz rum", "1 oz hibiscus rose syrup", "1 oz lime", "0.5 oz passionfruit", "Ice"],
      steps: ["Shake all ingredients", "Pour unstrained into a hurricane glass"],
      garnish: "Orange slice + cherry",
    },
    "madagascar-vanilla": {
      name: "Vanilla Old Cuban",
      ratio: "2:0.75:1",
      ingredients: ["2 oz aged rum", "0.75 oz vanilla syrup", "1 oz lime", "6 mint leaves", "Ice"],
      steps: ["Muddle mint gently with syrup and lime", "Add rum and shake", "Top with prosecco"],
      garnish: "Mint bouquet",
    },
  },
  Tequila: {
    "lavender-honey": {
      name: "Lavender Paloma",
      ratio: "2:0.75:4",
      ingredients: ["2 oz blanco tequila", "0.75 oz lavender honey syrup", "4 oz grapefruit soda", "Ice"],
      steps: ["Build over ice in a highball", "Stir once", "Rim glass with salt if desired"],
      garnish: "Grapefruit wedge",
    },
    "ginger-lime": {
      name: "Smoky Ginger Margarita",
      ratio: "2:1:0.75",
      ingredients: ["2 oz reposado tequila", "1 oz ginger lime syrup", "0.75 oz lime", "Ice"],
      steps: ["Shake with ice", "Strain over fresh ice in a rocks glass"],
      garnish: "Salt rim + lime",
    },
    "hibiscus-rose": {
      name: "Rosita Rosa",
      ratio: "1.5:1:0.75",
      ingredients: ["1.5 oz tequila", "1 oz hibiscus rose syrup", "0.75 oz lime", "Ice"],
      steps: ["Shake and strain into a coupe", "Serve immediately"],
      garnish: "Dried hibiscus flower",
    },
    "madagascar-vanilla": {
      name: "Vanilla Reposado Sour",
      ratio: "2:0.75:0.75",
      ingredients: ["2 oz reposado", "0.75 oz vanilla syrup", "0.75 oz lemon", "Ice"],
      steps: ["Shake hard", "Strain over ice", "Optional egg white for silkiness"],
      garnish: "Angostura dots",
    },
  },
  Whiskey: {
    "lavender-honey": {
      name: "Lavender Manhattan",
      ratio: "2:1:0.25",
      ingredients: ["2 oz rye whiskey", "1 oz sweet vermouth", "0.25 oz lavender honey syrup", "Ice"],
      steps: ["Stir with ice until dilute", "Strain into a coupe"],
      garnish: "Brandied cherry",
    },
    "ginger-lime": {
      name: "Whiskey Ginger Highball",
      ratio: "2:0.75:4",
      ingredients: ["2 oz whiskey", "0.75 oz ginger lime syrup", "4 oz soda water", "Ice"],
      steps: ["Build in a tall glass over ice", "Stir gently"],
      garnish: "Lime wheel",
    },
    "hibiscus-rose": {
      name: "Crimson Boulevardier",
      ratio: "1:1:1",
      ingredients: ["1 oz whiskey", "1 oz Campari", "1 oz sweet vermouth", "0.5 oz hibiscus syrup", "Ice"],
      steps: ["Stir all ingredients", "Strain over a large cube"],
      garnish: "Orange peel",
    },
    "madagascar-vanilla": {
      name: "Vanilla Maple Old Fashioned",
      ratio: "2:0.25:2dash",
      ingredients: ["2 oz bourbon", "0.25 oz vanilla syrup", "2 dashes bitters", "Ice"],
      steps: ["Stir in a mixing glass", "Strain over a large cube", "Express orange peel"],
      garnish: "Orange peel + cherry",
    },
  },
  Bourbon: {
    "lavender-honey": {
      name: "Southern Lavender Sour",
      ratio: "2:0.75:0.75",
      ingredients: ["2 oz bourbon", "0.75 oz lavender honey syrup", "0.75 oz lemon", "Ice"],
      steps: ["Shake with ice", "Strain into a rocks glass"],
      garnish: "Lemon wheel",
    },
    "ginger-lime": {
      name: "Kentucky Mule",
      ratio: "2:0.75:4",
      ingredients: ["2 oz bourbon", "0.75 oz ginger lime syrup", "4 oz ginger beer", "Ice"],
      steps: ["Build in a copper mug", "Stir gently"],
      garnish: "Lime wedge",
    },
    "hibiscus-rose": {
      name: "Bourbon Hibiscus Smash",
      ratio: "2:1:0.75",
      ingredients: ["2 oz bourbon", "1 oz hibiscus rose syrup", "0.75 oz lemon", "Mint", "Ice"],
      steps: ["Muddle mint lightly", "Shake all ingredients", "Strain over crushed ice"],
      garnish: "Mint sprig",
    },
    "madagascar-vanilla": {
      name: "Classic Vanilla Bourbon",
      ratio: "2:0.25:2dash",
      ingredients: ["2 oz bourbon", "0.25 oz vanilla syrup", "2 dashes aromatic bitters", "Ice"],
      steps: ["Stir until chilled", "Strain over a large cube"],
      garnish: "Orange peel",
    },
  },
  Prosecco: {
    "lavender-honey": {
      name: "Lavender Spritz",
      ratio: "1:0.5:3",
      ingredients: ["1 oz gin or vodka", "0.5 oz lavender honey syrup", "3 oz prosecco", "Ice"],
      steps: ["Build in a wine glass", "Top with prosecco", "Stir once"],
      garnish: "Lavender sprig",
    },
    "ginger-lime": {
      name: "Citrus Prosecco Fizz",
      ratio: "0.75:4",
      ingredients: ["0.75 oz ginger lime syrup", "4 oz prosecco", "Ice"],
      steps: ["Add syrup to flute", "Top with chilled prosecco"],
      garnish: "Lime twist",
    },
    "hibiscus-rose": {
      name: "Hibiscus Bellini",
      ratio: "1:3",
      ingredients: ["1 oz hibiscus rose syrup", "3 oz prosecco"],
      steps: ["Pour syrup into a flute", "Top slowly with prosecco"],
      garnish: "Rose petal",
    },
    "madagascar-vanilla": {
      name: "Vanilla Sparkler",
      ratio: "0.5:4",
      ingredients: ["0.5 oz vanilla syrup", "4 oz prosecco", "Ice"],
      steps: ["Build in a coupe over ice", "Top with prosecco"],
      garnish: "Vanilla bean slice",
    },
  },
};

export function getCocktailRecipe(
  spirit: string,
  syrupId: string,
): CocktailRecipe | null {
  return cocktailPairings[spirit]?.[syrupId] ?? null;
}
