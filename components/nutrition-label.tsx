import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NutritionLabelProps {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// TODO: could make it more standard nutrition facts table, use v0 for this
export function NutritionLabel({ nutrition }: NutritionLabelProps) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-center">
          Nutrition Facts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-b-2 border-black pb-2 mb-2">
          <div className="flex justify-between">
            <span className="font-bold">Calories</span>
            <span>{Math.round(nutrition.calories)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Fat</span>
            <span>{nutrition.fat.toFixed(1)}g</span>
          </div>
          <div className="flex justify-between">
            <span>Total Carbohydrates</span>
            <span>{nutrition.carbs.toFixed(1)}g</span>
          </div>
          <div className="flex justify-between">
            <span>Protein</span>
            <span>{nutrition.protein.toFixed(1)}g</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
