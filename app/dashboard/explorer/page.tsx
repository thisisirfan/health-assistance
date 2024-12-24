"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Clock, Users, Loader2 } from "lucide-react";
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
import { NutritionLabel } from "@/components/nutrition-label";
import { useFoodExplorerRecipes, useRecipes } from "../calculator/useRecipes";
import { useRecipeNutrition } from "@/hooks/use-nutrition";
import { calculateTotalNutrition } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@uidotdev/usehooks";
import SpeechToText from "@/components/speech-to-text";
import { useCreateUserMeal } from "@/hooks/use-meals";
import { useToast } from "@/components/ToastProvider";

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

export default function FoodExplorerPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  // const [searchResults, setSearchResults] = useState(mockRecipes);
  const [isAddToMealPlanOpen, setIsAddToMealPlanOpen] = useState(false);
  const [isShowRecipeOpen, setIsShowRecipeOpen] = useState(false);
  const [isComputeNutritionOpen, setIsComputeNutritionOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const debouncedRecipeSearch = useDebounce(searchQuery, 300);
  const { mutate: creatUserMeal } = useCreateUserMeal();

  const {
    data: searchResults,
    isLoading: isRecipeSearchLoading,
    refetch,
  } = useRecipes(debouncedRecipeSearch);

  const handleSearch = () => {
    refetch();
  };

  useEffect(() => {
    const id = localStorage.getItem('token')
    setUserId(id as unknown as number)
  }, [])

  const handleAddToMealPlan = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsAddToMealPlanOpen(true);
  };

  const handleShowRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsShowRecipeOpen(true);
  };

  // Add nutrition query states
  const [recipeQuery, setRecipeQuery] = useState("");
  const { data: recipeNutrition, isLoading: isRecipeLoading } =
    useRecipeNutrition(recipeQuery);

  const handleComputeNutrition = (recipe: any) => {
    setRecipeQuery(recipe.ingredients);
    setIsComputeNutritionOpen(true);
  };

  const handleConfirmAddToMealPlan = () => {
    if (selectedDay && selectedCourse && selectedRecipe) {
      // Here you would typically update your meal plan state or send data to an API
      const mealData = {
        user_id: userId,
        recipe_id: selectedRecipe.id,
        meal_time: selectedCourse,
        week_day: selectedDay,
      }
      creatUserMeal(mealData, {
        onSuccess: () => {
          toast({
            title: "Created Meal",
            description: "Your meal has been created successfully.",
          });
        },
      });
      setIsAddToMealPlanOpen(false);
      setSelectedDay("");
      setSelectedCourse("");
      setSelectedRecipe(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "veg":
        return (
          <span className="h-3 w-3 rounded-full bg-green-500 inline-block mr-1" />
        );
      case "non-veg":
        return (
          <span className="h-3 w-3 rounded-full bg-red-500 inline-block mr-1" />
        );
      case "egg":
        return (
          <span className="h-3 w-3 rounded-full bg-yellow-500 inline-block mr-1" />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          <Input
            placeholder="Search for a recipe or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <div>
            <SpeechToText setInputValue={setSearchQuery} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isRecipeSearchLoading ? (
            <div className="col-span-full flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !searchResults?.length ? (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[200px] text-center">
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No results found
              </p>
              <p className="text-sm text-muted-foreground">
                Try exploring with different ingredients or cuisine types
              </p>
            </div>
          ) : (
            searchResults?.map((recipe) => (
              <Card key={recipe.id} className="flex flex-col relative">
                <CardContent className="p-4 flex-grow">
                  <h3 className="font-semibold mb-2">{recipe.recipe}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span>
                      {getTypeIcon(recipe.type)}
                      {recipe.type ?? "non-veg"}
                    </span>
                    <span>
                      <Clock className="inline h-4 w-4 mr-1" />
                      {recipe.time ?? "30 min"}
                    </span>
                    <span>
                      <Users className="inline h-4 w-4 mr-1" />
                      {recipe.servings}
                    </span>
                  </div>
                </CardContent>
                <div className="space-y-2 p-4">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleShowRecipe(recipe)}
                  >
                    Show Recipe
                  </Button>
                  <Button
                    size="sm"
                    className="w-full"
                    variant="outline"
                    onClick={() => handleComputeNutrition(recipe)}
                  >
                    Compute Nutrition
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddToMealPlan(recipe)}
                    className="w-full"
                    variant="secondary"
                  >
                    Add to Meal Plan
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      <Dialog open={isAddToMealPlanOpen} onOpenChange={setIsAddToMealPlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Meal Plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Select onValueChange={setSelectedDay}>
                <SelectTrigger className="w-[180px]">
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
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Select onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[180px]">
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
          <DialogFooter>
            <Button onClick={handleConfirmAddToMealPlan}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShowRecipeOpen} onOpenChange={setIsShowRecipeOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedRecipe?.recipe}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {getTypeIcon(selectedRecipe?.type ?? "non-veg")}
                {selectedRecipe?.type ?? "non-veg"}
              </span>
              <span>
                <Clock className="inline h-4 w-4 mr-1" />
                {selectedRecipe?.time ?? "30 min"}
              </span>
              <span>
                <Users className="inline h-4 w-4 mr-1" />
                {selectedRecipe?.servings} servings
              </span>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h4 className="text-lg font-semibold tracking-tight mb-4">
                  Ingredients
                </h4>
                <ScrollArea className="h-[300px] p-4">
                  <ul className="space-y-2">
                    {selectedRecipe?.ingredients
                      .trim()
                      ?.split("\n")
                      .splice(1)
                      .map((ingredient: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-primary">•</span>
                          <span>{ingredient.trim()}</span>
                        </li>
                      ))}
                  </ul>
                </ScrollArea>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h4 className="text-lg font-semibold tracking-tight mb-4">
                  Instructions
                </h4>
                <ScrollArea className="h-[400px] p-4">
                  <ol className="space-y-3">
                    {selectedRecipe?.instructions
                      .trim()
                      ?.split("\n")
                      .splice(1)
                      .map((instruction: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <span className="font-medium text-primary">
                            {(index + 1).toString().padStart(2, "0")}
                          </span>
                          <span>{instruction.trim()}</span>
                        </li>
                      ))}
                  </ol>
                </ScrollArea>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isComputeNutritionOpen}
        onOpenChange={setIsComputeNutritionOpen}
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
    </Card>
  );
}
