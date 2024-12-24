import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetUserMeals } from "@/hooks/use-meals"
import { groupBy } from "@/lib/utils"
import { Clock } from 'lucide-react'
import { useEffect, useMemo, useState } from "react"

// interface Meal {
//   name: string
//   type: 'veg' | 'non-veg' | 'egg'
//   time: string
// }

// interface MealPlan {
//   [key: string]: Meal[]
// }

// const mockMealPlan: MealPlan = {
//   'Breakfast': [{ name: 'Oatmeal with Berries', type: 'veg', time: '10 min' }],
//   'Lunch': [{ name: 'Grilled Chicken Salad', type: 'non-veg', time: '20 min' }],
//   'Snack': [{ name: 'Greek Yogurt with Nuts', type: 'veg', time: '5 min' }],
//   'Dinner': [{ name: 'Salmon with Roasted Vegetables', type: 'non-veg', time: '30 min' }],
// }

export function TodaysMealPlan() {
  const [userId, setUserId] = useState<number>()
  const [selectedDay, setSelectedDay] = useState('');
  const { data: userMeals } = useGetUserMeals(userId, selectedDay);

  useEffect(() => {
    const id = localStorage.getItem('token')
    setUserId(id ? (id as unknown as number) : undefined)

    const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' })
    setSelectedDay(currentDay)
  }, [])

  const meals = useMemo(() => groupBy(userMeals || [], "meal_time"), [userMeals]);

  const getTypeIcon = (type: 'veg' | 'non-veg' | 'egg') => {
    switch (type) {
      case 'veg':
        return <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-1" />
      case 'non-veg':
        return <span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-1" />
      case 'egg':
        return <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block mr-1" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Today's Meal Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(meals).map(([mealTime, mealItems]) => (
            <div key={mealTime}>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">{mealTime}</h3>
              <div className="space-y-4">
                {mealItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <span>
                        {getTypeIcon('veg')}
                      </span>
                      <span className="pl-2">{item.recipe.recipe}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>10min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  )
}

