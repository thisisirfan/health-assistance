"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@uidotdev/usehooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import { NutritionLabel } from "@/components/nutrition-label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecipes } from "./useRecipes";
import {
  useNaturalNutrition,
  useRecipeNutrition,
} from "../../../hooks/use-nutrition";
import { Loader2 } from "lucide-react";
import { calculateTotalNutrition } from "@/lib/utils";
import { useCreateUserMeal, useDeleteUserMeal, useGetUserMeals, useUpdateUserMeal } from "@/hooks/use-meals";
import { useToast } from "@/components/ToastProvider";
import { ModeToggle, useFoodExplorerRecipes } from "./useRecipes";
import { calculateNutritionManual, calculateNutritionLLM, calculateRecipeNutrition } from "@/api/nutrition";
import { NutritionResponse, NutritionError } from "@/types/nutrition";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const courses = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function NutritionCalculatorPage() {
  const toast = useToast();
  const [ingredients, setIngredients] = useState<string>("");
  const [recipeSearch, setRecipeSearch] = useState<string>("");
  const [isAddToMealPlanOpen, setIsAddToMealPlanOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [isNutritionPopupOpen, setIsNutritionPopupOpen] = useState(false);
  const [userId, setUserId] = useState<number>(0);
  const { mutate: creatUserMeal } = useCreateUserMeal();
  const [isV2Mode, setIsV2Mode] = useState(false);
  const [query, setQuery] = useState("");
  const { data: recipes } = useFoodExplorerRecipes(query, isV2Mode);

  const debouncedRecipeSearch = useDebounce(recipeSearch, 300);

  const {
    data: searchResults,
    isLoading: isRecipeSearchLoading,
    refetch,
  } = useRecipes(debouncedRecipeSearch);

  const [naturalQuery, setNaturalQuery] = useState("");
  const [recipeQuery, setRecipeQuery] = useState("");

  // Nutrition queries
  const { data: ingredientNutrition, isLoading: isIngredientLoading } =
    useNaturalNutrition(naturalQuery);

  const { data: recipeNutrition, isLoading: isRecipeLoading } =
    useRecipeNutrition(recipeQuery);

  const [isV2Loading, setIsV2Loading] = useState(false);
  const [v2Error, setV2Error] = useState<string | null>(null);
  const [v2NutritionData, setV2NutritionData] = useState<NutritionResponse | null>(null);

  // Add this state for ingredient nutrition
  const [ingredientNutritionState, setIngredientNutritionState] = useState<any>(null);

  const validateIngredients = (input: string): boolean => {
    const trimmed = input.trim();
    if (!trimmed) {
      toast({
        title: "Error",
        description: "Please enter ingredients first",
        variant: "destructive",
      });
      return false;
    }

    // Check for minimum length and format
    if (trimmed.length < 3) {
      toast({
        title: "Error",
        description: "Please enter a valid ingredient description",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleIngredientCompute = async () => {
    if (!validateIngredients(ingredients)) {
      return;
    }

    if (isV2Mode) {
      setIsV2Loading(true);
      setV2Error(null);
      try {
        const formattedIngredients = ingredients
          .split(',')
          .map(i => i.trim())
          .filter(i => i)
          .join('\n');

        console.log('Sending ingredients:', formattedIngredients);
        
        const result = await calculateNutritionManual(formattedIngredients, 1, !isV2Mode);
        
        setV2NutritionData(result);
      } catch (error: any) {
        setV2Error(error.message);
        console.error('Error calculating nutrition:', error);
      } finally {
        setIsV2Loading(false);
      }
    } else {
      setNaturalQuery(ingredients);
      if (ingredientNutrition) {
        setIngredientNutritionState(ingredientNutrition);
      }
    }
  };

  useEffect(() => {
    const id = localStorage.getItem('token')
    setUserId(id as unknown as number)
  }, [])

  const handleRecipeSearch = () => {
    console.log("search clicked");
    // use debounce to hammer backend less here;
    // show better feedback to the user here via loading indicator of userecipe hook
    refetch();
  };

  const handleRecipeCompute = (recipe: any) => {
    setRecipeQuery(recipe.instructions);
    setIsNutritionPopupOpen(true);
  };

  const handleAddToMealPlan = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsAddToMealPlanOpen(true);
  };

  const handleConfirmAddToMealPlan = () => {
    if (selectedDay && selectedCourse && selectedRecipe) {
      const mealData = {
        user_id: userId,
        recipe_id: selectedRecipe.id,
        meal_time: selectedCourse,
        week_day: selectedDay,
      }
      creatUserMeal(mealData, {
        onSuccess: () => {
          toast({
            title: "Recipe Added",
            description: "The recipe has been added to your meal plan.",
          });
        }
      });
      setIsAddToMealPlanOpen(false);
      setSelectedDay("");
      setSelectedCourse("");
      setSelectedRecipe(null);
    }
  };

  useEffect(() => {
    if (!isV2Mode && ingredientNutrition) {
      setIngredientNutritionState(ingredientNutrition);
    } else if (isV2Mode) {
      setIngredientNutritionState(null);
      setNaturalQuery('');
    }
  }, [ingredientNutrition, isV2Mode]);

  const handleModeToggle = (checked: boolean) => {
    setIsV2Mode(checked);
    setV2NutritionData(null);
    setV2Error(null);
    setIngredientNutritionState(null);
    setNaturalQuery('');
    setIngredients('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ingredient" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingredient">
              <Icons.Calculator className="mr-2 h-4 w-4" />
              By Ingredient
            </TabsTrigger>
            <TabsTrigger value="recipe">
              <Icons.Utensils className="mr-2 h-4 w-4" />
              By Recipe
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ingredient" className="space-y-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter ingredients (e.g., '2 cups rice, 1 tbsp olive oil')"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  />
                  <Button
                    onClick={handleIngredientCompute}
                    disabled={isIngredientLoading || isV2Loading}
                  >
                    {(isIngredientLoading || isV2Loading) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Compute"
                    )}
                  </Button>
                </div>
                <div className="flex justify-center pt-2">
                  <ModeToggle 
                    isV2Mode={isV2Mode} 
                    onToggle={handleModeToggle} 
                  />
                </div>
              </div>
              {ingredientNutritionState && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-6">
                    <div className="p-4 border-2 border-primary rounded-lg">
                      <h4 className="font-bold text-xl mb-4">
                        Total Nutrition
                      </h4>
                      <NutritionLabel
                        nutrition={calculateTotalNutrition(
                          ingredientNutritionState.foods
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">
                        Individual Ingredients
                      </h4>
                      {ingredientNutritionState.foods.map((food: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h4 className="font-medium capitalize">
                            {food.food_name}
                          </h4>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div>Calories: {food.nf_calories}kcal</div>
                            <div>Protein: {food.nf_protein}g</div>
                            <div>Carbs: {food.nf_total_carbohydrate}g</div>
                            <div>Fat: {food.nf_total_fat}g</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="recipe" className="space-y-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search for a recipe"
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                  />
                  <Button
                    onClick={handleRecipeSearch}
                    disabled={isRecipeSearchLoading}
                  >
                    {isRecipeSearchLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {isRecipeSearchLoading ? (
                      <div className="col-span-full flex justify-center items-center min-h-[200px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      searchResults?.map((recipe, index) => (
                        <Card key={index} className="flex flex-col relative">
                          <CardContent className="p-4 flex-grow">
                            <h3 className="font-semibold mb-2">{recipe.recipe}</h3>
                          </CardContent>
                          <div className="p-4">
                            <Button
                              onClick={() => handleRecipeCompute(recipe)}
                              className="w-full"
                            >
                              Compute Nutrition
                            </Button>
                            <Button
                              onClick={() => handleAddToMealPlan(recipe)}
                              className="w-full mt-2"
                              variant="outline"
                            >
                              Add to Meal Plan
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isAddToMealPlanOpen} onOpenChange={setIsAddToMealPlanOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Add to Meal Plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center space-y-4">
              <Select onValueChange={setSelectedDay}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleConfirmAddToMealPlan}>
              Add to Meal Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isNutritionPopupOpen}
        onOpenChange={setIsNutritionPopupOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nutrition Information</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isRecipeLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              recipeNutrition && (
                <div className="p-4 border-2 border-primary rounded-lg">
                  <h4 className="font-bold text-xl mb-4">
                    Total Recipe Nutrition
                  </h4>
                  <NutritionLabel
                    nutrition={calculateTotalNutrition(recipeNutrition.foods)}
                  />
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      {v2Error && (
        <div className="mt-4 p-4 border-2 border-red-200 rounded-lg bg-red-50">
          <div className="flex items-start space-x-2">
            <Icons.AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Error calculating nutrition</h4>
              <p className="text-sm text-red-700">{v2Error}</p>
              <p className="text-xs text-red-600 mt-1">
                Please check your input and try again. If the problem persists, try using normal mode.
              </p>
            </div>
          </div>
        </div>
      )}

      {v2NutritionData && isV2Mode && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Detailed Nutrition Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Macronutrients Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-primary">Macronutrients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Energy; enerc', 'Protein; protcnt', 'Total Fat; fatce', 'Carbohydrate; choavldf'].map((key) => {
                    const value = v2NutritionData.nutritional_info[key];
                    if (!value) return null;
                    const displayValue = typeof value === 'object' ? value.value : value;
                    const displayUnit = typeof value === 'object' ? value.unit : 'g';
                    const label = key.split(';')[0];

                    return (
                      <div key={key} className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                        <div className="text-sm text-muted-foreground">{label}</div>
                        <div className="text-lg font-medium">
                          {typeof displayValue === 'number' ? displayValue.toFixed(1) : displayValue}
                          <span className="text-sm ml-1">{displayUnit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Vitamins Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-primary">Vitamins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    'Vitamin A; vita', 'Vitamin B; vitb', 'Vitamin D; vitd',
                    'Ascorbic acids (C); vitc', 'Thiamine (B1); thia', 'Riboflavin (B2); ribf',
                    'Niacin (B3); nia', 'Total B6; vitb6c', 'Folates (B9); folsum'
                  ].map((key) => {
                    const value = v2NutritionData.nutritional_info[key];
                    if (!value) return null;
                    const displayValue = typeof value === 'object' ? value.value : value;
                    const displayUnit = typeof value === 'object' ? value.unit : 'g';
                    const label = key.split(';')[0];

                    return (
                      <div key={key} className="flex flex-col p-2 bg-secondary/5 rounded-lg">
                        <div className="text-sm text-muted-foreground">{label}</div>
                        <div className="font-medium mt-1">
                          {typeof displayValue === 'number' ? displayValue.toFixed(2) : displayValue}
                          <span className="text-sm ml-1">{displayUnit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Minerals Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-primary">Minerals & Others</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    'Sodium (Na); na', 'Potassium (K); k', 'Calcium (Ca); ca',
                    'Iron (Fe); fe', 'Zinc (Zn); zn', 'Dietary Fiber; fibtg',
                    'Free Sugars; fsugar', 'Saturated Fatty acids; fasat'
                  ].map((key) => {
                    const value = v2NutritionData.nutritional_info[key];
                    if (!value) return null;
                    const displayValue = typeof value === 'object' ? value.value : value;
                    const displayUnit = typeof value === 'object' ? value.unit : 'g';
                    const label = key.split(';')[0];

                    return (
                      <div key={key} className="flex flex-col p-2 bg-secondary/5 rounded-lg">
                        <div className="text-sm text-muted-foreground">{label}</div>
                        <div className="font-medium mt-1">
                          {typeof displayValue === 'number' ? displayValue.toFixed(2) : displayValue}
                          <span className="text-sm ml-1">{displayUnit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </Card>
  );
}
