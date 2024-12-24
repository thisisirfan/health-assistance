// my-app/hooks/useRecipes.ts
"use client";

import client from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface ErrorResponse {
  detail: ErrorDetail[];
}

interface Recipe {
  id: number;
  recipe: string;
  instructions: string;
  servings: number;
}

const fetchRecipes = async (query: string): Promise<Recipe[]> => {
  const response = await client.post<Recipe[]>("/recipes/search/", {
    question: query,
  });
  return response.data;
};

export const useRecipes = (query: string) => {
  return useQuery<Recipe[], ErrorResponse>({
    queryKey: ["recipes", query],
    queryFn: () => fetchRecipes(query),
    enabled: !!query,
    initialData: [],
  });
};

export const useFoodExplorerRecipes = (query: string, isV2Mode: boolean) => {
  return useQuery<Recipe[], ErrorResponse>({
    queryKey: ["fe-recipes", query, isV2Mode],
    queryFn: () => fetchRecipes(query),
    enabled: query !== "",
    initialData: isV2Mode ? [] : convertedRecipes,
  });
};

export function ModeToggle({ isV2Mode, onToggle }: { isV2Mode: boolean; onToggle: (checked: boolean) => void }) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch
        id="v2-mode"
        checked={isV2Mode}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="v2-mode">
        {isV2Mode ? "V2 Mode" : "Normal Mode"}
      </Label>
    </div>
  );
}

const mockRecipes = [
  {
    id: 1,
    name: "Grilled Chicken Salad",
    image: "/placeholder.svg?height=100&width=200",
    type: "non-veg",
    time: "30 min",
    servings: 2,
    ingredients: [
      "200g chicken breast",
      "100g mixed salad greens",
      "50g cherry tomatoes",
      "30g cucumber",
      "2 tbsp olive oil",
      "1 tbsp lemon juice",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Season the chicken breast with salt and pepper.",
      "Grill the chicken for 6-8 minutes on each side until cooked through.",
      "While the chicken is cooking, prepare the salad by mixing the greens, tomatoes, and cucumber.",
      "Slice the cooked chicken and place it on top of the salad.",
      "Drizzle with olive oil and lemon juice.",
      "Serve immediately.",
    ],
    nutrition: { calories: 350, protein: 30, carbs: 10, fat: 22 },
  },
  {
    id: 2,
    name: "Vegetable Stir Fry",
    image: "/placeholder.svg?height=100&width=200",
    type: "veg",
    time: "20 min",
    servings: 4,
    ingredients: [
      "200g mixed vegetables (bell peppers, broccoli, carrots)",
      "100g tofu",
      "2 tbsp soy sauce",
      "1 tbsp sesame oil",
      "2 cloves garlic, minced",
      "1 tsp ginger, grated",
      "2 tbsp vegetable oil",
    ],
    instructions: [
      "Cut the vegetables and tofu into bite-sized pieces.",
      "Heat vegetable oil in a wok or large frying pan over high heat.",
      "Add garlic and ginger, stir-fry for 30 seconds.",
      "Add the vegetables and tofu, stir-fry for 5-7 minutes until vegetables are crisp-tender.",
      "Add soy sauce and sesame oil, toss to combine.",
      "Serve hot with rice or noodles.",
    ],
    nutrition: { calories: 200, protein: 10, carbs: 15, fat: 13 },
  },
  {
    id: 3,
    name: "Salmon with Roasted Vegetables",
    image: "/placeholder.svg?height=100&width=200",
    type: "non-veg",
    time: "40 min",
    servings: 2,
    ingredients: [
      "2 salmon fillets",
      "200g mixed vegetables (zucchini, bell peppers, onions)",
      "2 tbsp olive oil",
      "1 lemon",
      "Salt and pepper to taste",
      "2 sprigs fresh dill",
    ],
    instructions: [
      "Preheat the oven to 200°C (400°F).",
      "Cut the vegetables into chunks and place them on a baking sheet.",
      "Drizzle vegetables with 1 tbsp olive oil, salt, and pepper. Toss to coat.",
      "Roast the vegetables for 20 minutes.",
      "Place the salmon fillets on top of the vegetables.",
      "Drizzle the salmon with remaining olive oil, squeeze half a lemon over it, and add dill sprigs.",
      "Roast for another 12-15 minutes until the salmon is cooked through.",
      "Serve with lemon wedges.",
    ],
    nutrition: { calories: 400, protein: 35, carbs: 15, fat: 25 },
  },
  {
    id: 4,
    name: "Quinoa Buddha Bowl",
    image: "/placeholder.svg?height=100&width=200",
    type: "veg",
    time: "25 min",
    servings: 1,
    ingredients: [
      "1/2 cup quinoa",
      "1 cup water",
      "1/2 cup chickpeas",
      "1/2 avocado",
      "1/4 cup cherry tomatoes",
      "1/4 cucumber",
      "2 tbsp hummus",
      "1 tbsp lemon juice",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Rinse quinoa and cook in water according to package instructions.",
      "While quinoa is cooking, prepare the vegetables: slice cucumber and cherry tomatoes, and cube avocado.",
      "Drain and rinse chickpeas.",
      "Once quinoa is cooked, let it cool slightly.",
      "Arrange quinoa, chickpeas, and vegetables in a bowl.",
      "Top with a dollop of hummus.",
      "Drizzle with lemon juice and season with salt and pepper.",
      "Serve immediately.",
    ],
    nutrition: { calories: 450, protein: 15, carbs: 60, fat: 20 },
  },
  {
    id: 5,
    name: "Egg Fried Rice",
    image: "/placeholder.svg?height=100&width=200",
    type: "egg",
    time: "15 min",
    servings: 2,
    ingredients: [
      "2 cups cooked rice",
      "3 eggs",
      "1/2 cup mixed vegetables (peas, carrots, corn)",
      "2 tbsp soy sauce",
      "2 tbsp vegetable oil",
      "2 green onions, chopped",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Beat the eggs in a small bowl.",
      "Heat 1 tbsp oil in a large frying pan or wok over medium heat.",
      "Pour in the beaten eggs and scramble until cooked. Remove from pan and set aside.",
      "In the same pan, heat the remaining oil.",
      "Add the mixed vegetables and stir-fry for 2-3 minutes.",
      "Add the cooked rice and stir-fry for another 2-3 minutes.",
      "Add the scrambled eggs back to the pan.",
      "Pour in the soy sauce and stir to combine everything.",
      "Season with salt and pepper to taste.",
      "Garnish with chopped green onions and serve hot.",
    ],
    nutrition: { calories: 350, protein: 12, carbs: 50, fat: 15 },
  },
];

const convertedRecipes: Recipe[] = mockRecipes.map((mock) => ({
  recipe: mock.name,
  ingredients: `Ingredients:\n${mock.ingredients.join("\n")}`,
  instructions: `Instructions:\n${mock.instructions.join("\n")}`,
  cuisine:
    mock.type === "veg"
      ? "Vegetarian"
      : mock.type === "non-veg"
        ? "Non-Vegetarian"
        : mock.type === "egg"
          ? "Eggetarian"
          : "Mixed",
  course: "Main Course",
  difficulty: mock.time.includes("15")
    ? "Easy"
    : mock.time.includes("20")
      ? "Easy"
      : mock.time.includes("30")
        ? "Medium"
        : "Hard",
  servings: mock.servings,
}));
