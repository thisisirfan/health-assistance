import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from '@/components/icons'
import { useGetFoodLogs } from '@/hooks/use-food-logs'
import { useNutritionAnalysis } from '@/hooks/use-nutrition-analysis'
import { useUserData } from '@/hooks/use-auth'
import { useMemo } from 'react'
import { groupBy } from '@/lib/utils'

interface Flag {
  message: string
  severity: 'red' | 'yellow'
  icon: keyof typeof Icons
}

// Update the type definition
type HealthGoal = 'Stay Fit' | 'Lose Fat' | 'Increase Muscle Mass'

// Add BMI categories
const BMI_CATEGORIES = {
  UNDERWEIGHT: { min: 0, max: 18.5 },
  NORMAL: { min: 18.5, max: 25 },
  OVERWEIGHT: { min: 25, max: 30 },
  OBESE: { min: 30, max: Infinity }
} as const

// Update NUTRITION_TARGETS to include BMI-specific adjustments
const NUTRITION_TARGETS: Record<HealthGoal, {
  proteinPerKg: number
  carbsPercentage: { min: number; max: number }
  fatPercentage: { min: number; max: number }
  calorieAdjustment: number
  bmiAdjustments: {
    underweight: { calories: number, protein: number }
    overweight: { calories: number, protein: number }
    obese: { calories: number, protein: number }
  }
}> = {
  'Stay Fit': {
    proteinPerKg: 1.2,
    carbsPercentage: { min: 45, max: 65 },
    fatPercentage: { min: 20, max: 35 },
    calorieAdjustment: 0,
    bmiAdjustments: {
      underweight: { calories: 300, protein: 0.2 },
      overweight: { calories: -200, protein: 0.2 },
      obese: { calories: -500, protein: 0.3 }
    }
  },
  'Lose Fat': {
    proteinPerKg: 1.6,
    carbsPercentage: { min: 40, max: 50 },
    fatPercentage: { min: 20, max: 30 },
    calorieAdjustment: -500,
    bmiAdjustments: {
      underweight: { calories: 0, protein: 0 }, // Shouldn't be on this goal
      overweight: { calories: -300, protein: 0.3 },
      obese: { calories: -500, protein: 0.4 }
    }
  },
  'Increase Muscle Mass': {
    proteinPerKg: 2.0,
    carbsPercentage: { min: 50, max: 60 },
    fatPercentage: { min: 25, max: 35 },
    calorieAdjustment: 300,
    bmiAdjustments: {
      underweight: { calories: 500, protein: 0.3 },
      overweight: { calories: 100, protein: 0.4 },
      obese: { calories: -200, protein: 0.4 }
    }
  }
}

export function NutritionFlags({ userId }: { userId: number | undefined }) {
  const { data: foodData } = useGetFoodLogs(userId)
  const nutritionData = useNutritionAnalysis(foodData)
  const { data: userData } = useUserData(userId)

  const flags = useMemo(() => {
    if (!nutritionData || !userData) return []

    const flags: Flag[] = []
    const healthGoal = (userData.health_goal as HealthGoal) || 'Stay Fit'
    const targets = NUTRITION_TARGETS[healthGoal] || NUTRITION_TARGETS['Stay Fit']

    // Calculate base targets first
    const bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + (userData.gender === 'male' ? 5 : -161)
    const activityMultiplier = 1.4
    let dailyCalorieTarget = (bmr * activityMultiplier) + targets.calorieAdjustment
    let proteinTarget = userData.weight * targets.proteinPerKg

    // Calculate BMI
    const heightInMeters = userData.height / 100
    const bmi = userData.weight / (heightInMeters * heightInMeters)
    
    // Determine BMI category
    let bmiCategory: keyof typeof BMI_CATEGORIES | null = null
    if (bmi < BMI_CATEGORIES.UNDERWEIGHT.max) bmiCategory = 'UNDERWEIGHT'
    else if (bmi < BMI_CATEGORIES.NORMAL.max) bmiCategory = 'NORMAL'
    else if (bmi < BMI_CATEGORIES.OVERWEIGHT.max) bmiCategory = 'OVERWEIGHT'
    else bmiCategory = 'OBESE'

    // Adjust targets based on BMI
    if (bmiCategory !== 'NORMAL') {
      const bmiAdjustment = targets.bmiAdjustments[bmiCategory.toLowerCase() as keyof typeof targets.bmiAdjustments]
      dailyCalorieTarget += bmiAdjustment.calories
      proteinTarget *= (1 + bmiAdjustment.protein)
    }

    // Add BMI-specific flags
    if (bmiCategory === 'UNDERWEIGHT' && healthGoal === 'Lose Fat') {
      flags.push({
        message: "Your BMI indicates underweight - consider changing your goal to 'Increase Muscle Mass' or 'Stay Fit'",
        severity: 'red',
        icon: 'Scale'
      })
    }

    // Add BMI-specific nutrition recommendations
    if (bmiCategory === 'OVERWEIGHT' || bmiCategory === 'OBESE') {
      if (nutritionData.carbs.percentage > targets.carbsPercentage.max) {
        flags.push({
          message: "Consider reducing carbohydrate intake and focusing on protein-rich foods",
          severity: 'yellow',
          icon: 'Apple'
        })
      }
      if (nutritionData.protein.grams < proteinTarget) {
        flags.push({
          message: `Increase protein intake to preserve muscle mass while losing weight (target: ${proteinTarget.toFixed(0)}g)`,
          severity: 'yellow',
          icon: 'Beef'
        })
      }
    }

    if (bmiCategory === 'UNDERWEIGHT') {
      if (nutritionData.calories < dailyCalorieTarget) {
        flags.push({
          message: "Focus on increasing overall calorie intake with nutrient-dense foods",
          severity: 'yellow',
          icon: 'Utensils'
        })
      }
      if (nutritionData.protein.grams < proteinTarget) {
        flags.push({
          message: "Increase protein intake to support healthy weight gain",
          severity: 'yellow',
          icon: 'Beef'
        })
      }
    }

    // Calorie flags
    const caloriePercentage = (nutritionData.calories / dailyCalorieTarget) * 100
    if (caloriePercentage > 90 && caloriePercentage <= 110) {
      flags.push({
        message: `You're at ${caloriePercentage.toFixed(0)}% of your ${healthGoal === 'Lose Fat' ? 'reduced ' : ''}calorie target`,
        severity: 'yellow',
        icon: 'Activity'
      })
    }
    if (healthGoal === 'Lose Fat' && caloriePercentage > 100) {
      flags.push({
        message: `You've exceeded your calorie deficit target by ${(caloriePercentage - 100).toFixed(0)}%`,
        severity: 'red',
        icon: 'AlertTriangle'
      })
    }
    if (healthGoal === 'Increase Muscle Mass' && caloriePercentage < 90) {
      flags.push({
        message: "You're not meeting your calorie surplus target for muscle gain",
        severity: 'yellow',
        icon: 'Dumbbell'
      })
    }

    // Protein flags
    if (nutritionData.protein.grams < proteinTarget) {
      flags.push({
        message: `Protein intake is ${nutritionData.protein.grams.toFixed(0)}g (target: ${proteinTarget.toFixed(0)}g for ${healthGoal})`,
        severity: healthGoal === 'Increase Muscle Mass' ? 'red' : 'yellow',
        icon: 'Beef'
      })
    }

    // Fat flags
    if (nutritionData.fat.percentage < targets.fatPercentage.min) {
      flags.push({
        message: `Fat intake is too low at ${nutritionData.fat.percentage.toFixed(0)}% (target: ${targets.fatPercentage.min}-${targets.fatPercentage.max}%)`,
        severity: 'yellow',
        icon: 'AlertTriangle'
      })
    }
    if (nutritionData.fat.percentage > targets.fatPercentage.max) {
      flags.push({
        message: `Fat intake is high at ${nutritionData.fat.percentage.toFixed(0)}% (target: ${targets.fatPercentage.min}-${targets.fatPercentage.max}%)`,
        severity: 'red',
        icon: 'AlertTriangle'
      })
    }

    // Carb flags
    if (nutritionData.carbs.percentage < targets.carbsPercentage.min) {
      flags.push({
        message: `Carb intake is low at ${nutritionData.carbs.percentage.toFixed(0)}% (target: ${targets.carbsPercentage.min}-${targets.carbsPercentage.max}%)`,
        severity: healthGoal === 'Increase Muscle Mass' ? 'red' : 'yellow',
        icon: 'Apple'
      })
    }

    // Meal timing flag
    const lastMealTime = foodData[foodData.length - 1]?.timestamp
    if (lastMealTime && (Date.now() - new Date(lastMealTime).getTime()) > 4 * 60 * 60 * 1000) {
      flags.push({
        message: "Consider having a meal soon - it's been over 4 hours since your last one",
        severity: 'yellow',
        icon: 'Clock'
      })
    }

    // Meal distribution flags
    const mealGroups = groupBy(foodData || [], 'meal_time')
    if (!mealGroups['breakfast']) {
      flags.push({
        message: "You haven't logged breakfast - it's an important meal for metabolism",
        severity: 'yellow',
        icon: 'Utensils'
      })
    }

    // Protein distribution
    const totalProtein = nutritionData.protein.grams
    if (totalProtein > 0 && totalProtein / 4 > proteinTarget) {
      flags.push({
        message: "Try to spread your protein intake across meals for better absorption",
        severity: 'yellow',
        icon: 'Beef'
      })
    }

    // Activity and nutrition timing
    if (healthGoal === 'Increase Muscle Mass') {
      flags.push({
        message: "Remember to consume protein within 30 minutes of exercise",
        severity: 'yellow',
        icon: 'Dumbbell'
      })
    }

    // Weight management flags
    if (userData.bmi > 25 && healthGoal !== 'Lose Fat') {
      flags.push({
        message: "Consider adjusting your calorie intake for healthy weight management",
        severity: 'yellow',
        icon: 'Scale'
      })
    }

    // Meal size flags
    const largestMeal = Math.max(...Object.values(mealGroups).map(meals => 
      meals.reduce((acc, meal) => acc + (meal.calories || 0), 0)
    ))
    if (largestMeal > dailyCalorieTarget * 0.4) {
      flags.push({
        message: "Try to distribute calories more evenly throughout the day",
        severity: 'yellow',
        icon: 'Utensils'
      })
    }

    // Health goal alignment
    if (healthGoal === 'Lose Fat' && nutritionData.carbs.percentage > targets.carbsPercentage.max) {
      flags.push({
        message: "Consider reducing carb intake to support fat loss",
        severity: 'yellow',
        icon: 'Target'
      })
    }

    // Workout nutrition (if it's a workout day)
    if (healthGoal === 'Increase Muscle Mass') {
      flags.push({
        message: "Aim for complex carbs before workouts for sustained energy",
        severity: 'yellow',
        icon: 'Activity'
      })
    }

    // Overall balance
    const macroBalance = Math.abs(nutritionData.protein.percentage - nutritionData.carbs.percentage)
    if (macroBalance > 30) {
      flags.push({
        message: "Your macronutrient ratios are quite unbalanced",
        severity: 'yellow',
        icon: 'ActivitySquare'
      })
    }

    // Time-based recommendations
    const currentHour = new Date().getHours()
    if (currentHour > 19 && nutritionData.carbs.percentage > 50) {
      flags.push({
        message: "Consider limiting carbs in the evening for better sleep",
        severity: 'yellow',
        icon: 'Apple'
      })
    }

    // Progress tracking
    if (healthGoal === 'Lose Fat' && caloriePercentage < 70) {
      flags.push({
        message: "Very low calorie intake may slow metabolism - consider a smaller deficit",
        severity: 'red',
        icon: 'TrendingDown'
      })
    }

    return flags
  }, [nutritionData, userData, foodData])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Nutrition Flags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {flags.length > 0 ? (
            flags.map((flag, index) => {
              const Icon = Icons[flag.icon]
              return (
                <div 
                  key={index} 
                  className={`flex items-start p-2 rounded-md ${
                    flag.severity === 'red' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    flag.severity === 'red' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <p className="text-sm">{flag.message}</p>
                </div>
              )
            })
          ) : (
            <div className="flex items-start p-2 rounded-md bg-green-100 text-green-800">
              <Icons.Activity className="h-5 w-5 mr-2 flex-shrink-0 text-green-600" />
              <p className="text-sm">Great job! Your nutrition aligns with your {userData?.health_goal} goal.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

