import client from "./client";
import { NutritionResponse, NutritionError } from "@/types/nutrition";

// Helper function to get nutrition service URL
const getNutritionServiceURL = () => process.env.NEXT_PUBLIC_NUTRITION_V2_URL || 'http://localhost:5000';

export const calculateNutritionManual = async (recipe: string, servings: number, useNutritionix: boolean = false): Promise<NutritionResponse> => {
  try {
    if (!recipe.trim()) {
      throw new Error('Recipe input is required');
    }

    // If in normal mode (useNutritionix is true), directly use Nutritionix
    const endpoint = useNutritionix ? '/calculate/ingredients_manual' : '/calculate/ingredients_llm';
    
    const response = await client.post<NutritionResponse>(`${getNutritionServiceURL()}${endpoint}`, {
      recipe,
      servings
    });

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });

    // More specific error messages
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Could not connect to nutrition service. Is the server running?');
    }

    if (error.response?.status === 400) {
      throw new Error(`Invalid input: ${error.response.data?.details || 'Please check your ingredient format'}`);
    }

    if (error.response?.status === 500) {
      throw new Error('Server error: The nutrition service encountered an error processing your request');
    }

    throw new Error(
      error.response?.data?.details || 
      error.response?.data?.error || 
      error.message || 
      'Failed to calculate nutrition information'
    );
  }
};

export const calculateNutritionLLM = async (recipe: string, servings: number) => {
  const response = await client.post<NutritionResponse>(`${getNutritionServiceURL()}/calculate/ingredients_llm`, {
    recipe,
    servings
  });
  return response.data;
};

export const calculateRecipeNutrition = async (recipe: string, servings: number) => {
  const response = await client.post<NutritionResponse>(`${getNutritionServiceURL()}/calculate/recipe`, {
    recipe,
    servings
  });
  return response.data;
}; 