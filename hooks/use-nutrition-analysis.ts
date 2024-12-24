"use client"
import { useMemo } from 'react'
import { useNaturalNutrition } from './use-nutrition'

export const useNutritionAnalysis = (foodLogs: any[] | undefined) => {
  // Create the query string from food logs
  const queryString = useMemo(() => {
    if (!foodLogs?.length) return '';
    return foodLogs.map(log => 
      `${log.amount} ${log.measurement_scale} ${log.food}`
    ).join(', ');
  }, [foodLogs]);

  // Use existing Nutritionix hook
  const { data: nutritionData, isLoading } = useNaturalNutrition(queryString);

  return useMemo(() => {
    if (!nutritionData?.foods?.length) {
      return {
        calories: 0,
        protein: { grams: 0, percentage: 0 },
        carbs: { grams: 0, percentage: 0 },
        fat: { grams: 0, percentage: 0 },
        goalProgress: 0
      }
    }

    // Calculate totals from Nutritionix data
    const totals = nutritionData.foods.reduce((acc, food) => ({
      calories: acc.calories + food.nf_calories,
      protein: acc.protein + food.nf_protein,
      carbs: acc.carbs + food.nf_total_carbohydrate,
      fat: acc.fat + food.nf_total_fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const totalMacros = totals.protein + totals.carbs + totals.fat;

    return {
      calories: totals.calories,
      protein: {
        grams: totals.protein,
        percentage: totalMacros ? (totals.protein / totalMacros) * 100 : 0
      },
      carbs: {
        grams: totals.carbs,
        percentage: totalMacros ? (totals.carbs / totalMacros) * 100 : 0
      },
      fat: {
        grams: totals.fat,
        percentage: totalMacros ? (totals.fat / totalMacros) * 100 : 0
      },
      goalProgress: (totals.calories / 2000) * 100
    }
  }, [nutritionData]);
} 