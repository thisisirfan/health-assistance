// hooks/useNutrition.ts
"use client";

import { NUTRITIONIX_API_KEY, NUTRITIONIX_APP_ID, NUTRITIONIX_API_BASE } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


interface NutritionixConfig {
  headers: {
    "x-app-id": string;
    "x-app-key": string;
    "Content-Type": "application/json";
  };
}

const nutritionixConfig: NutritionixConfig = {
  headers: {
    "x-app-id": NUTRITIONIX_APP_ID,
    "x-app-key": NUTRITIONIX_API_KEY,
    "Content-Type": "application/json",
  },
};

interface NutritionResponse {
  foods: Array<{
    food_name: string;
    serving_qty: number;
    serving_unit: string;
    serving_weight_grams: number;
    nf_calories: number;
    nf_total_fat: number;
    nf_saturated_fat: number;
    nf_cholesterol: number;
    nf_sodium: number;
    nf_total_carbohydrate: number;
    nf_dietary_fiber: number;
    nf_sugars: number;
    nf_protein: number;
    nf_potassium: number;
    photo: {
      thumb: string;
      highres: string;
    };
  }>;
}

// Natural language query hook
export const useNaturalNutrition = (query: string) => {
  return useQuery<NutritionResponse>({
    queryKey: ["natural-nutrition", query],
    queryFn: async () => {
      const response = await axios.post(
        `${NUTRITIONIX_API_BASE}/natural/nutrients`,
        { query },
        nutritionixConfig
      );
      return response.data;
    },
    enabled: query !== "",
  });
};

// Individual ingredients hook
interface IngredientQuery {
  query: string;
  quantity: number;
  measureURI?: string;
}

export const useIngredientsNutrition = (ingredients: IngredientQuery[]) => {
  return useQuery<NutritionResponse>({
    queryKey: ["ingredients-nutrition", ingredients],
    queryFn: async () => {
      const response = await axios.post(
        `${NUTRITIONIX_API_BASE}/nutrients`,
        { ingredients },
        nutritionixConfig
      );
      return response.data;
    },
    enabled: ingredients.length > 0,
  });
};

// Recipe nutrition hook
export const useRecipeNutrition = (recipe: string) => {
  return useQuery<NutritionResponse>({
    queryKey: ["recipe-nutrition", recipe],
    queryFn: async () => {
      const response = await axios.post(
        `${NUTRITIONIX_API_BASE}/natural/nutrients`,
        { query: recipe },
        nutritionixConfig
      );
      return response.data;
    },
    enabled: recipe !== "",
  });
};
