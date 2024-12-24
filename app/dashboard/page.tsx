'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from '@/components/icons'
import { TodaysMealPlan } from '@/components/todays-meal-plan'
import { NutritionFlags } from '@/components/nutrition-flags'
import { useUserData } from '@/hooks/use-auth'
import { Recommendations } from '@/components/recommendations'
import { useGetFoodLogs } from '@/hooks/use-food-logs'
import { useNutritionAnalysis } from '@/hooks/use-nutrition-analysis'

// Mock user data (in a real app, this would come from a database or API)
const userData = {
  height: 0, // cm
  weight: 0, // kg
}

export default function DashboardPage() {
  const [bmi, setBmi] = useState(0)
  const [bmiCategory, setBmiCategory] = useState('')
  const [bmiColor, setBmiColor] = useState('')
  const [userId, setUserId] = useState<number>()
  const { data: userData } = useUserData(userId)
  const { data: foodData } = useGetFoodLogs(userId)
  const nutritionData = useNutritionAnalysis(foodData)

  useEffect(() => {
    const id = localStorage.getItem('token')
    setUserId(id as unknown as number)
  }, [])

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      window.location.href = '/login'
    }
    if (!userData) return

    // Calculate BMI
    const heightInMeters = userData.height / 100
    const calculatedBmi = userData.weight / (heightInMeters * heightInMeters)
    setBmi(parseFloat(calculatedBmi.toFixed(1)))

    // Determine BMI category and color
    if (calculatedBmi < 18.5) {
      setBmiCategory('Underweight')
      setBmiColor('text-blue-500')
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      setBmiCategory('Normal weight')
      setBmiColor('text-green-500')
    } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
      setBmiCategory('Overweight')
      setBmiColor('text-yellow-500')
    } else {
      setBmiCategory('Obese')
      setBmiColor('text-red-500')
    }
  }, [userData])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Calories Today
            </CardTitle>
            <Icons.Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionData.calories.toFixed(0)} kcal</div>
            <p className="text-xs text-muted-foreground">
              {((nutritionData.calories / 2000) * 100).toFixed(1)}% of daily goal
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Protein Intake
            </CardTitle>
            <Icons.Beef className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionData.protein.grams.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground">
              {nutritionData.protein.percentage.toFixed(1)}% of total macros
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Carbs Intake
            </CardTitle>
            <Icons.Apple className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionData.carbs.grams.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground">
              {nutritionData.carbs.percentage.toFixed(1)}% of total macros
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fat Intake
            </CardTitle>
            <Icons.Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionData.fat.grams.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground">
              {nutritionData.fat.percentage.toFixed(1)}% of total macros
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">BMI (Body Mass Index)</CardTitle>
          <Icons.ActivitySquare className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-4xl font-bold">{bmi}</div>
            <div className={`text-2xl font-semibold ${bmiColor}`}>{bmiCategory}</div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500"
                style={{ width: `${(bmi / 40) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>16</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>
          {userData && <CardDescription className="mt-4 text-center">
            BMI is calculated based on your height ({userData.height} cm) and weight ({userData.weight} kg).
            It's a general indicator and doesn't account for factors like muscle mass, age, or gender.
          </CardDescription>}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <TodaysMealPlan />
        <NutritionFlags userId={userId} />
        <div className="md:col-span-2">
          <Recommendations />
        </div>
      </div>
    </div>
  )
}

