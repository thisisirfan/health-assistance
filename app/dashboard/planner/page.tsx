"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { NutritionLabel } from "@/components/nutrition-label";
import { useRecipeNutrition } from "@/hooks/use-nutrition";
import { Loader2 } from "lucide-react";
import { useDeleteUserMeal, useGetUserMeals } from "@/hooks/use-meals";
import { groupBy } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";

interface Meal {
  id: number;
  name: string;
  type: "veg" | "non-veg" | "egg";
  time: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MealPlannerPage() {
  const toast = useToast();
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isNutritionDialogOpen, setIsNutritionDialogOpen] = useState(false);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const { data: userMeals, refetch: getUserMeals } = useGetUserMeals(userId, selectedDay);
  const { mutate: deleteUserMeal } = useDeleteUserMeal();


  useEffect(() => {
    const id = localStorage.getItem('token')
    setUserId(id ? (id as unknown as number) : undefined)
  }, []);

  const meals = useMemo(() => groupBy(userMeals || [], "meal_time"), [userMeals]);

  // Add state
  const [recipeQuery, setRecipeQuery] = useState("");
  const { data: recipeNutrition, isLoading: isRecipeLoading } =
    useRecipeNutrition(recipeQuery);

  // // Update compute handler
  const handleComputeNutrition = (meal: any) => {
    setRecipeQuery(meal.instructions);
    setIsNutritionDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteUserMeal(id, {
      onSuccess: () => {
        getUserMeals();
      },
    });

    toast({
      title: "Meal Deleted",
      description: "The meal has been removed from your plan.",
    })
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Vegetarian":
        return (
          <span className="h-3 w-3 rounded-full bg-green-500 inline-block mr-1"></span>
        );
      default:
        return (
          <span className="h-3 w-3 rounded-full bg-red-500 inline-block mr-1" />
        );
    }
  };

  // const calculateTotalNutrition = (meals: Meal[]) => {
  //   return meals.reduce(
  //     (total, meal) => ({
  //       calories: total.calories + meal.nutrition.calories,
  //       protein: total.protein + meal.nutrition.protein,
  //       carbs: total.carbs + meal.nutrition.carbs,
  //       fat: total.fat + meal.nutrition.fat,
  //     }),
  //     { calories: 0, protein: 0, carbs: 0, fat: 0 }
  //   );
  // };

  // const calculateTotalTime = (meals: Meal[]) => {
  //   return meals.reduce((total, meal) => {
  //     const [time, unit] = meal.time.split(" ");
  //     return total + parseInt(time);
  //   }, 0);
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {daysOfWeek.map((day) => (
            <Button
              key={day}
              variant={selectedDay === day ? "default" : "outline"}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </Button>
          ))}
        </div>
        <div className="space-y-4">
          {Object.keys(meals).map((mealTime, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{mealTime}</span>
                  {/* <div className="text-sm font-normal flex items-center space-x-2">
                    <Icons.Clock className="h-4 w-4" />
                    <span>10 min</span>
                  </div> */}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meals[mealTime].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.recipe.diet)}
                      <span>{item.recipe.recipe}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Icons.MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleComputeNutrition(item.recipe)}>
                          <Icons.Calculator className="mr-2 h-4 w-4" />
                          <span>Compute Nutrition</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                          <Icons.Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Icons.Plus className="h-4 w-4 mr-2" />
                  Add {mealTime}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Add to Meal Plan
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-center justify-center">
              <Icons.Utensils className="h-16 w-16 text-primary" />
            </div>
            <p className="text-center text-muted-foreground">
              Enhance your meal plan by adding delicious recipes from our
              extensive collection.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                asChild
                className="flex-1 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 rounded-full"
              >
                <Link href="/dashboard/explorer" className="w-full">
                  <Icons.Search className="mr-2 h-4 w-4" />
                  Food Explorer
                </Link>
              </Button>
              <Button
                asChild
                className="flex-1 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 rounded-full"
              >
                <Link href="/dashboard/calculator" className="w-full">
                  <Icons.Calculator className="mr-2 h-4 w-4" />
                  Nutrition Calculator
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isNutritionDialogOpen}
        onOpenChange={setIsNutritionDialogOpen}
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
                    nutrition={{
                      calories: recipeNutrition.foods[0].nf_calories,
                      protein: recipeNutrition.foods[0].nf_protein,
                      carbs: recipeNutrition.foods[0].nf_total_carbohydrate,
                      fat: recipeNutrition.foods[0].nf_total_fat,
                    }}
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
