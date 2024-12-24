import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateTotalNutrition = (foods: any[]) => {
  return foods.reduce(
    (total, food) => ({
      calories: total.calories + food.nf_calories,
      protein: total.protein + food.nf_protein,
      fat: total.fat + food.nf_total_fat,
      carbs: total.carbs + food.nf_total_carbohydrate,
      fiber: total.fiber + (food.nf_dietary_fiber || 0),
      sugar: total.sugar + (food.nf_sugars || 0),
      sodium: total.sodium + (food.nf_sodium || 0),
      cholesterol: total.cholesterol + (food.nf_cholesterol || 0),
    }),
    {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      cholesterol: 0,
    }
  );
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
type GroupedObjects<T> = {
  [key: string]: T[];
};

export function groupBy<T, K extends keyof T>(array: T[], key: K): GroupedObjects<T> {
  return array.reduce((result, currentItem) => {
    const groupKey = String(currentItem[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentItem);
    return result;
  }, {} as GroupedObjects<T>);
}

export const formatNutritionValue = (value: any): NutrientValue => {
  if (typeof value === 'number') {
    return {
      value,
      unit: 'g' // default unit
    };
  }
  
  if (typeof value === 'object' && value !== null) {
    return value;
  }

  return {
    value: 0,
    unit: 'g'
  };
};
