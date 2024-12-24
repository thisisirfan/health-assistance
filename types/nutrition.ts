export interface NutrientInfo {
  value: number;
  unit: 'g' | 'mg' | 'mcg' | 'kcal';
}

export type NutrientValue = NutrientInfo | number;

export interface NutritionInfo {
  'Energy; enerc': NutrientValue;
  'Total Fat; fatce': NutrientValue;
  'Saturated Fatty acids; fasat': NutrientValue;
  'Sodium (Na); na': NutrientValue;
  'Potassium (K); k': NutrientValue;
  'Carbohydrate; choavldf': NutrientValue;
  'Dietary Fiber; fibtg': NutrientValue;
  'Free Sugars; fsugar': NutrientValue;
  'Protein; protcnt': NutrientValue;
  'Vitamin A; vita': NutrientValue;
  'Ascorbic acids (C); vitc': NutrientValue;
  'Calcium (Ca); ca': NutrientValue;
  'Iron (Fe); fe': NutrientValue;
  'Vitamin B; vitb': NutrientValue;
  'Vitamin D; vitd': NutrientValue;
  'Zinc (Zn); zn': NutrientValue;
  'Thiamine (B1); thia': NutrientValue;
  'Riboflavin (B2); ribf': NutrientValue;
  'Niacin (B3); nia': NutrientValue;
  'Total B6; vitb6c': NutrientValue;
  'Folates (B9); folsum': NutrientValue;
}

export interface NutritionResponse {
  nutritional_info: NutritionInfo;
  servings: number;
}

export interface NutritionError {
  error: string;
  details?: string;
  traceback?: string;
} 